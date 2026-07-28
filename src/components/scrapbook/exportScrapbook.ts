import jsPDF from 'jspdf';
import { ScrapbookTemplate, UserPhotoAssignment, PhotoCrop } from './types';

/**
 * Dedicated High-Resolution Export Engine for Scrapbook Studio
 * Renders artwork at A4 2480 × 3508 px (300 DPI) without any Editor UI, controls, or placeholders.
 */
export async function exportScrapbookPage(
  template: ScrapbookTemplate,
  slotAssignments: Record<string, UserPhotoAssignment>,
  textValues: Record<string, string>,
  format: 'png' | 'jpg' | 'pdf' = 'png',
  projectName: string = 'Birthday_Scrapbook_Page'
): Promise<void> {
  // Target A4 Canvas Resolution at 300 DPI
  const TARGET_WIDTH = 2480;
  const TARGET_HEIGHT = 3508;
  const scale = TARGET_WIDTH / template.canvas.width; // Scaling factor from 1200px to 2480px (2.0667)

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Draw Cream / Warm Ivory Paper Background
  ctx.fillStyle = template.canvas.backgroundColor || '#fbf9f2';
  ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  // Faint paper grain / texture lines
  ctx.fillStyle = 'rgba(215, 204, 188, 0.15)';
  for (let i = 0; i < TARGET_HEIGHT; i += 8) {
    ctx.fillRect(0, i, TARGET_WIDTH, 1.5);
  }

  // 2. Draw Decorative Cards & Notes (Pink Memories Note, Kraft Card, Info Card)
  for (const dec of template.decorations) {
    ctx.save();
    const decX = dec.x * scale;
    const decY = dec.y * scale;
    const decW = dec.width * scale;
    const decH = dec.height * scale;

    ctx.translate(decX + decW / 2, decY + decH / 2);
    ctx.rotate(((dec.rotation || 0) * Math.PI) / 180);
    ctx.translate(-decW / 2, -decH / 2);

    if (dec.type === 'torn-note') {
      // Pink Memories Note Card
      ctx.fillStyle = '#ffe4e6';
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.roundRect(0, 0, decW, decH, 12 * scale);
      ctx.fill();
      ctx.stroke();

      // Heading: "Memories ♥"
      ctx.fillStyle = '#9f1239';
      ctx.font = `bold ${24 * scale}px "Caveat", "Dancing Script", cursive, sans-serif`;
      ctx.fillText(dec.textContent || 'Memories ♥', 20 * scale, 45 * scale);

      // Ruled Notebook Lines
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 1.5 * scale;
      for (let yLine = 75 * scale; yLine < decH - 20 * scale; yLine += 30 * scale) {
        ctx.beginPath();
        ctx.moveTo(15 * scale, yLine);
        ctx.lineTo(decW - 15 * scale, yLine);
        ctx.stroke();
      }
    } else if (dec.type === 'kraft-note') {
      // Kraft Paper Note Card
      ctx.fillStyle = '#e7d5c0';
      ctx.strokeStyle = '#d4be9b';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.roundRect(0, 0, decW, decH, 8 * scale);
      ctx.fill();
      ctx.stroke();

      // Text: "Good times + Crazy friends = Amazing memories"
      ctx.fillStyle = '#4a3b32';
      ctx.font = `bold ${16 * scale}px "Caveat", "Dancing Script", cursive, sans-serif`;
      ctx.textAlign = 'center';
      const lines = (dec.textContent || 'Good times\n+\nCrazy friends\n=\nAmazing memories').split('\n');
      lines.forEach((line, idx) => {
        ctx.fillText(line, decW / 2, 40 * scale + idx * 28 * scale);
      });
      ctx.textAlign = 'left';
    } else if (dec.type === 'paper-texture') {
      // Birthday Info Torn Card
      ctx.fillStyle = '#fff1f2';
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.roundRect(0, 0, decW, decH, 16 * scale);
      ctx.fill();
      ctx.stroke();
    } else if (dec.type === 'cupcake') {
      // Cupcake Sticker 🧁
      ctx.font = `${60 * scale}px sans-serif`;
      ctx.fillText('🧁', 10 * scale, decH - 10 * scale);
    } else if (dec.type === 'flower') {
      // Dried Flowers 🌸🌾
      ctx.font = `${50 * scale}px sans-serif`;
      ctx.fillText('🌸', 10 * scale, decH / 2);
      ctx.fillText('🌾', 25 * scale, decH);
    } else if (dec.type === 'doodle') {
      ctx.font = `${30 * scale}px sans-serif`;
      ctx.fillText('⭐', decW / 4, decH / 2);
    }

    ctx.restore();
  }

  // Helper to load image async
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = url;
    });
  };

  // 3. Draw Photo Slots & User Photos
  for (const slot of template.photoSlots) {
    ctx.save();
    const slotX = slot.x * scale;
    const slotY = slot.y * scale;
    const slotW = slot.width * scale;
    const slotH = slot.height * scale;

    ctx.translate(slotX + slotW / 2, slotY + slotH / 2);
    ctx.rotate(((slot.rotation || 0) * Math.PI) / 180);
    ctx.translate(-slotW / 2, -slotH / 2);

    // Frame Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 25 * scale;
    ctx.shadowOffsetY = 12 * scale;

    // Frame Border
    if (slot.shape === 'polaroid') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, slotW, slotH);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(0, 0, slotW, slotH);
    } else if (slot.shape === 'torn-paper') {
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(0, 0, slotW, slotH);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3 * scale;
      ctx.setLineDash([8 * scale, 6 * scale]);
      ctx.strokeRect(0, 0, slotW, slotH);
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = '#fffdfa';
      ctx.fillRect(0, 0, slotW, slotH);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(0, 0, slotW, slotH);
    }

    ctx.shadowColor = 'transparent';

    // Photo Container Dimensions
    const pad = slot.shape === 'polaroid' ? 14 * scale : 12 * scale;
    const padBottom = slot.shape === 'polaroid' ? 45 * scale : pad;
    const innerX = pad;
    const innerY = pad;
    const innerW = slotW - pad * 2;
    const innerH = slotH - pad - padBottom;

    const assignment = slotAssignments[slot.id];
    if (assignment && assignment.url) {
      try {
        const img = await loadImage(assignment.url);
        ctx.save();
        ctx.beginPath();
        ctx.rect(innerX, innerY, innerW, innerH);
        ctx.clip();

        // Draw Image using Cover Scaling
        const crop: PhotoCrop = assignment.crop || { x: 0, y: 0, scale: 1 };
        const imgRatio = img.width / img.height;
        const frameRatio = innerW / innerH;

        let renderW = innerW;
        let renderH = innerH;

        if (imgRatio > frameRatio) {
          renderW = innerH * imgRatio;
        } else {
          renderH = innerW / imgRatio;
        }

        renderW *= crop.scale || 1;
        renderH *= crop.scale || 1;

        const posX = innerX + (innerW - renderW) / 2 + ((crop.x || 0) / 100) * innerW;
        const posY = innerY + (innerH - renderH) / 2 + ((crop.y || 0) / 100) * innerH;

        ctx.drawImage(img, posX, posY, renderW, renderH);
        ctx.restore();
      } catch (err) {
        // Fallback photo background if image fail to load
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(innerX, innerY, innerW, innerH);
      }
    } else {
      // Empty slot renders clean paper background (NO "ADD PHOTO" badge in exported final output!)
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(innerX, innerY, innerW, innerH);
    }

    // Polaroid Caption
    if (slot.shape === 'polaroid' && slot.captionPlaceholder) {
      ctx.fillStyle = '#334155';
      ctx.font = `bold ${14 * scale}px "Caveat", cursive, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(slot.captionPlaceholder, slotW / 2, slotH - 14 * scale);
      ctx.textAlign = 'left';
    }

    // Washi Tape & Paper Clip Overlays on Top
    if (slot.tapeDecoration === 'top-center' || slot.tapeDecoration === 'top-left' || slot.tapeDecoration === 'top-right' || slot.tapeDecoration === 'corners') {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.85)'; // Washi tape color
      ctx.fillRect(slotW / 2 - 40 * scale, -10 * scale, 80 * scale, 22 * scale);
    } else if (slot.tapeDecoration === 'paper-clip') {
      // Metallic Paper Clip
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.roundRect(slotW - 50 * scale, -15 * scale, 18 * scale, 45 * scale, 8 * scale);
      ctx.stroke();
    }

    ctx.restore();
  }

  // 4. Draw Text Elements (Real Editable Typography)
  for (const el of template.textElements) {
    ctx.save();
    const elX = el.x * scale;
    const elY = el.y * scale;
    const elW = el.width * scale;
    const textVal = textValues[el.id] || el.defaultText;

    ctx.fillStyle = el.color || '#3a2e2b';
    ctx.font = `bold ${el.fontSize * scale}px ${
      el.fontFamily === 'handwritten' ? '"Caveat", cursive, sans-serif' :
      el.fontFamily === 'cursive' ? '"Dancing Script", cursive, serif' : '"Inter", sans-serif'
    }`;
    ctx.textAlign = (el.align as CanvasTextAlign) || 'left';

    const lines = textVal.split('\n');
    lines.forEach((line, idx) => {
      ctx.fillText(line, elX, elY + idx * el.fontSize * scale * 1.25);
    });

    ctx.restore();
  }

  // 5. Generate File Export Output
  const filename = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_A4`;

  if (format === 'pdf') {
    // Generate A4 Printable PDF at 300 DPI
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297); // 210 x 297 mm A4 dimensions
    pdf.save(`${filename}.pdf`);
  } else if (format === 'jpg') {
    // Download High-Res JPG
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
  } else {
    // Download High-Res PNG
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
}
