import React, { useState } from 'react';
import { Sparkles, Heart, Share2, ArrowLeft, Download } from 'lucide-react';
import { ScrapbookProject } from './types';
import { INITIAL_SCRAPBOOK_TEMPLATES } from './templates';
import { exportScrapbookPage } from './exportScrapbook';

interface ScrapbookPublicViewProps {
  project: ScrapbookProject;
  onExit: () => void;
}

export default function ScrapbookPublicView({
  project,
  onExit
}: ScrapbookPublicViewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const template = INITIAL_SCRAPBOOK_TEMPLATES.find(t => t.id === project.templateId) || INITIAL_SCRAPBOOK_TEMPLATES[0];

  const photoMap = new Map(project.photos?.map(p => [p.slotId, p]));

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Shareable link copied to clipboard!');
  };

  const handleDownloadPage = async (format: 'png' | 'jpg' | 'pdf' = 'png') => {
    try {
      setIsExporting(true);
      const slotAssignmentsObj: Record<string, any> = {};
      project.photos?.forEach(p => {
        slotAssignmentsObj[p.slotId] = p;
      });
      await exportScrapbookPage(
        template,
        slotAssignmentsObj,
        project.texts || {},
        format,
        project.title || template.name
      );
      setIsExporting(false);
    } catch (e) {
      console.error('Export error:', e);
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-on-background flex flex-col items-center justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-primary/10">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-xs font-bold font-label-caps uppercase text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Memora Studio
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadPage('png')}
            disabled={isExporting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl text-xs font-label-caps font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Download PNG'}
          </button>
          <button
            onClick={() => handleDownloadPage('pdf')}
            disabled={isExporting}
            className="bg-rose-600 hover:bg-rose-500 text-white py-2 px-4 rounded-xl text-xs font-label-caps font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Printable PDF
          </button>
          <button
            onClick={handleShareLink}
            className="btn-primary py-2 px-4 rounded-xl text-xs font-label-caps font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>
      </header>

      {/* Main Shared Scrapbook Box */}
      <main className="my-8 flex flex-col items-center">
        <div className="text-center mb-6 space-y-1">
          <span className="text-[10px] font-bold font-label-caps uppercase tracking-widest text-primary flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Shared Scrapbook Keepsake
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-on-background">{project.title || template.name}</h1>
          {project.creatorName && (
            <p className="text-xs text-on-surface-variant font-medium">Created with love by {project.creatorName}</p>
          )}
        </div>

        {/* Canvas Display Frame */}
        <div
          className="relative shadow-2xl overflow-hidden rounded-3xl bg-white border border-gray-200"
          style={{
            width: `${template.canvas.width * 0.55}px`,
            height: `${template.canvas.height * 0.55}px`,
            backgroundColor: template.canvas.backgroundColor || '#fbf9f2'
          }}
        >
          {/* Background Texture Layer */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80')` }} />

          {/* Decorations Layer (Notes, Kraft Cards, Flowers, Cupcake Stickers) */}
          {template.decorations.map(dec => {
            const scaleVal = 0.55;
            return (
              <div
                key={dec.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${dec.x * scaleVal}px`,
                  top: `${dec.y * scaleVal}px`,
                  width: `${dec.width * scaleVal}px`,
                  height: `${dec.height * scaleVal}px`,
                  transform: `rotate(${dec.rotation || 0}deg)`
                }}
              >
                {dec.type === 'torn-note' && (
                  <div className="w-full h-full bg-rose-100/90 border border-rose-200 p-4 shadow-md rounded-lg flex flex-col font-handwritten relative overflow-hidden">
                    <div className="text-rose-800 font-bold text-lg mb-1">{dec.textContent || 'Memories ♥'}</div>
                    <div className="w-full border-b border-rose-200 border-dashed mb-2" />
                  </div>
                )}

                {dec.type === 'kraft-note' && (
                  <div className="w-full h-full bg-[#e7d5c0] border border-[#d4be9b] p-3 shadow-md rounded-md flex items-center justify-center text-center font-handwritten text-xs font-bold text-[#4a3b32] whitespace-pre-line leading-snug">
                    {dec.textContent}
                  </div>
                )}

                {dec.type === 'paper-texture' && (
                  <div className="w-full h-full bg-[#fff1f2] border border-rose-200/60 p-4 shadow-sm rounded-xl" />
                )}

                {dec.type === 'cupcake' && (
                  <div className="w-full h-full flex items-center justify-center text-4xl drop-shadow-md">
                    🧁
                  </div>
                )}

                {dec.type === 'flower' && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-2xl text-amber-700/80 drop-shadow-sm">
                    🌸 🌾
                  </div>
                )}

                {dec.type === 'tape' && (
                  <div className="w-full h-full bg-amber-200/80 border border-amber-300/50 shadow-sm opacity-90 backdrop-blur-[1px]" />
                )}

                {dec.type === 'doodle' && (
                  <div className="w-full h-full flex items-center justify-center text-rose-500 font-bold text-2xl drop-shadow-sm">
                    ⭐
                  </div>
                )}
              </div>
            );
          })}

          {/* Photo Slots Layer */}
          {template.photoSlots.map(slot => {
            const photoAssigned = photoMap.get(slot.id);
            const scaleVal = 0.55;
            const imgUrl = photoAssigned?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';
            const crop = photoAssigned?.crop || { x: 0, y: 0, scale: 1 };

            return (
              <div
                key={slot.id}
                className={`absolute ${
                  slot.shape === 'polaroid' ? 'bg-white p-3 pb-8 shadow-[0_15px_30px_rgba(0,0,0,0.18)] border border-slate-200/80 rounded-sm' :
                  slot.shape === 'torn-paper' ? 'bg-[#fdfbf7] p-2.5 shadow-[0_12px_25px_rgba(0,0,0,0.16)] border-2 border-dashed border-amber-800/30 rounded-md' :
                  slot.shape === 'paper' ? 'bg-[#fffdfa] p-3 shadow-[0_12px_25px_rgba(0,0,0,0.16)] border border-amber-900/20 rounded-md' :
                  'rounded-2xl overflow-hidden border-4 border-white shadow-[0_12px_25px_rgba(0,0,0,0.18)]'
                }`}
                style={{
                  left: `${slot.x * scaleVal}px`,
                  top: `${slot.y * scaleVal}px`,
                  width: `${slot.width * scaleVal}px`,
                  height: `${slot.height * scaleVal}px`,
                  transform: `rotate(${slot.rotation || 0}deg)`
                }}
              >
                {/* Washi Tape & Paper Clip Overlays */}
                {(slot.tapeDecoration === 'top-left' || slot.tapeDecoration === 'corners') && (
                  <div className="absolute -top-3 -left-3 w-16 h-5 bg-amber-200/80 border border-amber-300/50 shadow-sm transform -rotate-12 z-20 pointer-events-none opacity-90 backdrop-blur-[1px]" />
                )}
                {(slot.tapeDecoration === 'top-right' || slot.tapeDecoration === 'corners') && (
                  <div className="absolute -top-3 -right-3 w-16 h-5 bg-rose-200/80 border border-rose-300/50 shadow-sm transform rotate-12 z-20 pointer-events-none opacity-90 backdrop-blur-[1px]" />
                )}
                {slot.tapeDecoration === 'top-center' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-emerald-200/80 border border-emerald-300/50 shadow-sm z-20 pointer-events-none opacity-90 backdrop-blur-[1px]" />
                )}
                {slot.tapeDecoration === 'paper-clip' && (
                  <div className="absolute -top-4 right-6 w-4 h-10 border-2 border-slate-400 bg-slate-200/60 rounded-full z-20 pointer-events-none shadow-md transform rotate-6" />
                )}

                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={imgUrl}
                    alt="scrapbook memory"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${crop.scale || 1}) translate(${crop.x || 0}%, ${crop.y || 0}%)`
                    }}
                  />
                </div>

                {slot.shape === 'polaroid' && (
                  <div className="mt-2 text-center text-[10px] font-handwritten text-slate-700 font-bold truncate px-1">
                    {slot.captionPlaceholder || 'Beautiful Memory'}
                  </div>
                )}
              </div>
            );
          })}

          {/* Text Elements Layer */}
          {template.textElements.map(el => {
            const scaleVal = 0.55;
            const textVal = project.texts?.[el.id] || el.defaultText;

            return (
              <div
                key={el.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${el.x * scaleVal}px`,
                  top: `${el.y * scaleVal}px`,
                  width: `${el.width * scaleVal}px`,
                  textAlign: el.align || 'left'
                }}
              >
                <span
                  className={`inline-block whitespace-pre-line text-slate-800 ${
                    el.fontFamily === 'handwritten' ? 'font-handwritten font-bold' :
                    el.fontFamily === 'cursive' ? 'font-cursive font-bold' : 'font-display font-bold'
                  }`}
                  style={{
                    fontSize: `${el.fontSize * scaleVal}px`,
                    color: el.color || '#3a2e2b'
                  }}
                >
                  {textVal}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl py-4 border-t border-primary/10 text-center text-xs text-on-surface-variant font-medium">
        Made with ❤️ using Memora Studio
      </footer>
    </div>
  );
}
