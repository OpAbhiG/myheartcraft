import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  type: 'hearts' | 'gold_dust' | 'confetti' | 'stars' | 'none';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  rotation?: number;
  rotationSpeed?: number;
  wiggle?: number;
  wiggleSpeed?: number;
}

export default function ParticleBackground({ type }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Create particles based on type
    const createParticle = (init: boolean = false): Particle => {
      const w = canvas.width;
      const h = canvas.height;
      const size = type === 'hearts' ? Math.random() * 8 + 6
                 : type === 'gold_dust' ? Math.random() * 3 + 1
                 : type === 'confetti' ? Math.random() * 6 + 4
                 : Math.random() * 4 + 2; // stars

      const x = Math.random() * w;
      // If initializing, spread across screen. If spawning later, spawn at screen boundary
      const y = init ? Math.random() * h : (type === 'confetti' ? -10 : h + 10);

      const speedY = type === 'confetti' ? Math.random() * 1.5 + 1
                   : type === 'hearts' ? -(Math.random() * 0.8 + 0.3)
                   : -(Math.random() * 0.4 + 0.1); // gold_dust, stars (slow upward drift)

      const speedX = (Math.random() - 0.5) * (type === 'confetti' ? 1.5 : 0.4);

      let color = '';
      if (type === 'hearts') {
        const tints = ['rgba(138, 77, 78, ', 'rgba(226, 152, 152, ', 'rgba(102, 86, 138, ', 'rgba(209, 189, 248, '];
        color = tints[Math.floor(Math.random() * tints.length)];
      } else if (type === 'gold_dust') {
        color = 'rgba(233, 195, 73, '; // tertiary-fixed-dim
      } else if (type === 'confetti') {
        const colors = [
          'rgba(233, 195, 73, ', // Gold
          'rgba(138, 77, 78, ',  // Burgundy/pink
          'rgba(102, 86, 138, ', // Purple
          'rgba(209, 189, 248, ', // Light violet
          'rgba(115, 92, 0, '     // Warm amber
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
      } else { // stars
        color = 'rgba(255, 255, 255, ';
      }

      return {
        x,
        y,
        size,
        speedY,
        speedX,
        opacity: Math.random() * 0.5 + 0.2,
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        wiggle: Math.random() * 100,
        wiggleSpeed: Math.random() * 0.01 + 0.005
      };
    };

    // Initial load
    const count = type === 'gold_dust' ? 45 : type === 'stars' ? 30 : type === 'hearts' ? 20 : 25;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        ctx.save();
        p.wiggle! += p.wiggleSpeed!;

        // Update positions
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wiggle!) * 0.3;

        // Reset/Respawn conditions
        const isOffscreen = type === 'confetti' ? p.y > canvas.height + 10 : p.y < -10;
        if (isOffscreen || p.x < -10 || p.x > canvas.width + 10) {
          particles[index] = createParticle(false);
          return;
        }

        // Apply styles and draw shape
        ctx.globalAlpha = p.opacity;

        if (type === 'hearts') {
          ctx.fillStyle = `${p.color}${p.opacity})`;
          // Draw simple vector heart
          ctx.translate(p.x, p.y);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
          ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
          ctx.fill();
        } else if (type === 'gold_dust' || type === 'stars') {
          // Draw glowing soft circle or four-point star
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          gradient.addColorStop(0, `${p.color}${p.opacity})`);
          gradient.addColorStop(1, `${p.color}0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'confetti') {
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation!);
          p.rotation! += p.rotationSpeed!;
          ctx.fillRect(-p.size / 2, -p.size, p.size, p.size / 2);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <canvas
      id="particles-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
