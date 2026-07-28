import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Heart, MailOpen, Cake, ChevronRight } from 'lucide-react';

interface InteractiveExperienceProps {
  type: 'puzzle' | 'envelope' | 'popup' | 'cake';
  imageUrl: string;
  recipientName: string;
  onComplete: () => void;
}

export default function InteractiveExperiences({
  type,
  imageUrl,
  recipientName,
  onComplete
}: InteractiveExperienceProps) {
  
  return (
    <div className="w-full max-w-xl mx-auto my-6" id={`interactive-${type}`}>
      {type === 'puzzle' && (
        <PuzzleGame imageUrl={imageUrl} onComplete={onComplete} />
      )}
      {type === 'envelope' && (
        <EnvelopeOpening recipientName={recipientName} onComplete={onComplete} />
      )}
      {type === 'popup' && (
        <PopupCard recipientName={recipientName} imageUrl={imageUrl} onComplete={onComplete} />
      )}
      {type === 'cake' && (
        <BirthdayCake recipientName={recipientName} onComplete={onComplete} />
      )}
    </div>
  );
}

// 1. PUZZLE GAME (3x3 Polaroid Tile Swap)
function PuzzleGame({ imageUrl, onComplete }: { imageUrl: string; onComplete: () => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const original = Array.from({ length: 9 }, (_, i) => i);
    let shuffled = [...original];
    let isSame = true;
    while (isSame) {
      shuffled.sort(() => Math.random() - 0.5);
      isSame = shuffled.every((val, i) => val === i);
    }
    setTiles(shuffled);
  }, [imageUrl]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      const newTiles = [...tiles];
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[index];
      newTiles[index] = temp;
      setTiles(newTiles);
      setSelectedIdx(null);

      const solved = newTiles.every((val, i) => val === i);
      if (solved) {
        setIsSolved(true);
        setTimeout(onComplete, 2000);
      }
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 text-center animate-fade-in border border-primary/10 shadow-2xl bg-white/80 backdrop-blur-md" id="puzzle-panel">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container/80 text-secondary rounded-full font-label-caps text-xs">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-tertiary-fixed-dim" />
          Interactive Memory Puzzle
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">Swap the polaroid tiles to restore the memory & unlock your surprise!</h3>
      </div>

      <div className="grid grid-cols-3 gap-2.5 aspect-square max-w-sm mx-auto bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 p-2.5 shadow-inner" id="puzzle-grid">
        {tiles.map((tileVal, idx) => {
          const row = Math.floor(tileVal / 3);
          const col = tileVal % 3;
          
          return (
            <button
              id={`puzzle-tile-${idx}`}
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition-all duration-300 group focus:outline-none bg-white p-1 shadow-sm ${
                selectedIdx === idx 
                  ? 'ring-4 ring-primary border-primary scale-[0.93] z-20 rotate-[-2deg] shadow-lg' 
                  : 'border-gray-200 hover:border-primary/40 hover:scale-[1.02] hover:rotate-[1deg] hover:shadow-md'
              }`}
            >
              {/* Polaroid-style inner image frame */}
              <div className="w-full h-full relative rounded overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${col * 50}% ${row * 50}%`
                  }}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {isSolved && (
        <div className="mt-6 text-primary font-bold text-sm flex items-center justify-center gap-1.5 animate-bounce">
          <Gift className="w-5 h-5 text-tertiary-fixed-dim animate-pulse" />
          Puzzle Solved! Unfolding your letter...
        </div>
      )}
    </div>
  );
}

// 2. ENVELOPE OPENING (3D Interactive Envelope)
function EnvelopeOpening({ recipientName, onComplete }: { recipientName: string; onComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBroken, setIsBroken] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsBroken(true);
    setTimeout(() => {
      setIsOpen(true);
      setTimeout(onComplete, 2200);
    }, 650);
  };

  return (
    <div className="glass-card rounded-3xl p-8 text-center animate-fade-in relative overflow-hidden flex flex-col items-center bg-white/85 backdrop-blur-md" id="envelope-panel">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-secondary-container/80 text-secondary rounded-full font-label-caps text-xs">
          <MailOpen className="w-3.5 h-3.5 animate-bounce text-primary" />
          Sealed Letter
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">A personalized letter waiting for you, {recipientName}</h3>
      </div>

      {/* 3D Envelope Container */}
      <div className="relative w-80 h-52 my-8 perspective-1000 cursor-pointer group" onClick={handleOpen} id="envelope-interactive">
        <div className={`relative w-full h-full transform-style-3d transition-all duration-1000 ${
          isOpen ? 'translate-y-8 scale-105' : 'group-hover:scale-[1.03]'
        }`}>
          
          {/* Envelope Back Plate */}
          <div className="absolute inset-0 bg-[#8c3554] rounded-xl shadow-inner z-0 border border-[#70243e]" />
          
          {/* Letter inside the envelope */}
          <div className={`absolute left-4 right-4 top-2 bottom-2 bg-[#FAF9F5] rounded border border-amber-900/10 shadow-lg p-5 flex flex-col justify-between transition-all duration-1000 z-10 ${
            isOpen ? 'animate-envelope-paper-rise' : 'translate-y-1 scale-95 opacity-60'
          }`}>
            <div className="flex justify-between items-center border-b border-primary/10 pb-2">
              <span className="font-serif text-[10px] text-primary/80 italic font-bold">Personal Letter</span>
              <Heart className="w-3 h-3 fill-current text-primary" />
            </div>
            <div className="space-y-2 flex-grow mt-3">
              <div className="h-2 w-full bg-on-surface-variant/10 rounded" />
              <div className="h-2 w-11/12 bg-on-surface-variant/10 rounded" />
              <div className="h-2 w-10/12 bg-on-surface-variant/10 rounded" />
              <div className="h-2 w-full bg-on-surface-variant/10 rounded" />
            </div>
            <div className="h-3 w-16 bg-secondary/15 rounded self-end" />
          </div>

          {/* Bottom Flap */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#9c3d5e] rounded-b-xl z-20 clip-bottom-flap border-t border-[#b85478]/30 shadow-2xl" />

          {/* Left Flap */}
          <div className="absolute left-0 bottom-0 top-0 w-44 bg-[#963b5b] rounded-l-xl z-20 clip-left-flap" />

          {/* Right Flap */}
          <div className="absolute right-0 bottom-0 top-0 w-44 bg-[#963b5b] rounded-r-xl z-20 clip-right-flap" />

          {/* Top Flap */}
          <div 
            className={`absolute top-0 left-0 right-0 h-28 bg-[#802f4d] rounded-t-xl z-35 origin-top transition-transform duration-1000 transform-style-3d clip-top-flap shadow-md ${
              isOpen ? '[transform:rotateX(180deg)_translateY(-2px)] z-5' : ''
            }`}
          />

          {/* Wax Seal Overlay (breaks and fades) */}
          <div className={`absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-700 flex items-center justify-center ${
            isBroken ? 'scale-125 opacity-0 pointer-events-none' : 'group-hover:scale-110'
          }`}>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#b48833] via-[#dfa97b] to-[#f4d08b] shadow-xl border border-[#9a7022] flex items-center justify-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-[#9e7626] border border-[#f5d593]/30 flex items-center justify-center">
                  <Heart className="w-6 h-6 fill-current text-white animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[8px] bg-primary text-white py-0.5 px-2 rounded-full whitespace-nowrap tracking-wider">
                FOR YOU
              </div>
            </div>
          </div>

        </div>
      </div>

      <button
        id="btn-open-letter"
        onClick={handleOpen}
        disabled={isBroken}
        className="btn-primary py-3 px-8 rounded-full shadow-lg font-label-caps uppercase text-xs tracking-wider flex items-center gap-2"
      >
        <MailOpen className="w-4 h-4" />
        Break the Seal
      </button>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .clip-top-flap {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        .clip-bottom-flap {
          clip-path: polygon(0 100%, 100% 100%, 50% 0);
        }
        .clip-left-flap {
          clip-path: polygon(0 0, 100% 50%, 0 100%);
        }
        .clip-right-flap {
          clip-path: polygon(100% 0, 100% 100%, 0 50%);
        }
        @keyframes envelope-paper-rise {
          0% { transform: translateY(0px) scale(0.95); opacity: 0.6; z-index: 10; }
          40% { transform: translateY(-70px) scale(0.98); opacity: 1; z-index: 10; }
          60% { transform: translateY(-70px) scale(1); opacity: 1; z-index: 30; }
          100% { transform: translateY(-130px) scale(1.1) rotate(1deg); opacity: 1; z-index: 30; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        }
        .animate-envelope-paper-rise {
          animation: envelope-paper-rise 2.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }
      `}</style>
    </div>
  );
}

// 3. POP-UP CARD (Perspective Cover Flip)
function PopupCard({ recipientName, imageUrl, onComplete }: { recipientName: string; imageUrl: string; onComplete: () => void }) {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggle = () => {
    if (isOpened) return;
    setIsOpened(true);
    setTimeout(onComplete, 2000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 text-center animate-fade-in relative bg-white/85 backdrop-blur-md" id="popup-card-panel">
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffe088]/20 text-[#735c00] rounded-full font-label-caps text-xs">
          <Heart className="w-3.5 h-3.5 fill-current text-primary animate-pulse" />
          3D Pop-up Keepsake
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">Open the premium keepsake card</h3>
      </div>

      <div className="w-full max-w-sm mx-auto h-72 bg-surface-container rounded-2xl flex items-center justify-center p-4 border border-outline-variant/30 overflow-hidden relative perspective-1000" id="card-stage">
        {!isOpened ? (
          // Outer Cover with rotation perspective
          <button
            id="popup-card-cover"
            onClick={handleToggle}
            className="w-48 h-60 bg-gradient-to-tr from-primary via-[#782c45] to-[#8d3c59] rounded-2xl shadow-2xl relative border-2 border-white/20 hover:scale-[1.03] transition-transform duration-300 flex flex-col items-center justify-center text-white cursor-pointer origin-left"
          >
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl-md" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br-md" />
            <Heart className="w-12 h-12 fill-current mb-4 text-[#dfa97b] animate-bounce" />
            <span className="font-headline-md text-lg px-2 font-light">To {recipientName}</span>
            <span className="font-label-caps text-[9px] mt-2 opacity-80 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded">TAP TO OPEN</span>
          </button>
        ) : (
          // Inside 3D fold-out
          <div className="w-full h-full flex flex-col justify-between p-4 animate-card-unfold relative">
            <div className="absolute inset-0 bg-cover bg-center opacity-[0.04] rounded-2xl" style={{ backgroundImage: `url(${imageUrl})` }} />
            
            <div className="flex-1 flex items-center justify-center relative">
              {/* Floating Polaroid Frame */}
              <div className="w-40 h-40 bg-[#fbf9f5] p-2 pb-6 rounded-xl shadow-2xl border border-white/80 rotate-[-3deg] animate-popup-frame z-10 relative">
                <img src={imageUrl} alt="Keepsake" className="w-full h-[85%] object-cover rounded" />
                <div className="absolute -bottom-2.5 -right-2.5 bg-primary text-white p-1.5 rounded-full shadow-lg">
                  <Heart className="w-4 h-4 fill-current text-white" />
                </div>
              </div>

              {/* Decor elements */}
              <div className="absolute -left-6 top-8 text-primary animate-popup-deco-1 text-lg">❤️</div>
              <div className="absolute -right-6 top-4 text-[#dfa97b] animate-popup-deco-2 text-xl">✨</div>
              <div className="absolute left-10 -top-4 text-secondary animate-popup-deco-3 text-lg">🌸</div>
            </div>

            <div className="text-primary font-bold text-xs animate-pulse z-10 bg-primary/5 py-1 px-4 rounded-full inline-block mx-auto">
              Unfolding your keepsake...
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes card-unfold {
          0% { transform: scale(0.9) rotateY(15deg); opacity: 0; }
          100% { transform: scale(1) rotateY(0); opacity: 1; }
        }
        @keyframes popup-frame {
          0% { transform: translateY(60px) rotate(15deg) scale(0.5); opacity: 0; }
          100% { transform: translateY(0) rotate(-3deg) scale(1); opacity: 1; }
        }
        @keyframes popup-deco-1 {
          0% { transform: translate(10px, 40px) scale(0); opacity: 0; }
          100% { transform: translate(0, 0) scale(1.3); opacity: 1; }
        }
        @keyframes popup-deco-2 {
          0% { transform: translate(-10px, 40px) scale(0); opacity: 0; }
          100% { transform: translate(0, 0) scale(1.5); opacity: 1; }
        }
        @keyframes popup-deco-3 {
          0% { transform: translate(0, 50px) scale(0); opacity: 0; }
          100% { transform: translate(0, 0) scale(1.1); opacity: 1; }
        }
        .animate-card-unfold { animation: card-unfold 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
        .animate-popup-frame { animation: popup-frame 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) 0.3s forwards; opacity: 0; }
        .animate-popup-deco-1 { animation: popup-deco-1 1.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0.5s infinite alternate; opacity: 0; }
        .animate-popup-deco-2 { animation: popup-deco-2 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) 0.6s infinite alternate; opacity: 0; }
        .animate-popup-deco-3 { animation: popup-deco-3 1.5s cubic-bezier(0.25, 0.8, 0.25, 1) 0.4s infinite alternate; opacity: 0; }
      `}</style>
    </div>
  );
}

// 4. BIRTHDAY CAKE (Interactive Candle Blowing & Confetti Burst)
function BirthdayCake({ recipientName, onComplete }: { recipientName: string; onComplete: () => void }) {
  const [candles, setCandles] = useState<boolean[]>([true, true, true]); // 3 lit candles
  const [isDone, setIsDone] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; scale: number; delay: number }[]>([]);

  const handleBlowCandle = (index: number) => {
    if (isDone) return;
    
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);

    if (newCandles.every(c => !c)) {
      setIsDone(true);
      // Spawn local confetti particles
      const confColors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#eab308', '#3b82f6', '#10b981'];
      const particles = Array.from({ length: 65 }).map((_, i) => ({
        id: i,
        x: Math.random() * 240 - 120, // Spread width
        y: Math.random() * -180 - 60, // Rise height
        color: confColors[Math.floor(Math.random() * confColors.length)],
        scale: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 0.6
      }));
      setConfetti(particles);
      setTimeout(onComplete, 2500);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 text-center animate-fade-in bg-white/85 backdrop-blur-md relative overflow-hidden" id="cake-panel">
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e29898]/20 text-primary rounded-full font-label-caps text-xs">
          <Cake className="w-3.5 h-3.5 animate-bounce" />
          Birthday Celebration
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">Make a wish, {recipientName}! Blow out the candles.</h3>
        <p className="text-xs text-on-surface-variant font-body-md mt-1">Click on each candle flame to extinguish it.</p>
      </div>

      <div className="h-64 flex flex-col justify-end items-center relative py-6" id="cake-container">
        
        {/* Confetti Explosion Layer */}
        {isDone && confetti.map((c) => (
          <div
            key={c.id}
            className="absolute w-2 h-4 rounded-sm animate-confetti-particle pointer-events-none"
            style={{
              backgroundColor: c.color,
              left: `calc(50% + ${c.x}px)`,
              top: `50%`,
              transform: `scale(${c.scale})`,
              '--target-x': `${c.x * 1.5}px`,
              '--target-y': `${c.y}px`,
              animationDelay: `${c.delay}s`,
              zIndex: 30
            } as React.CSSProperties}
          />
        ))}

        {/* Candles row */}
        <div className="flex gap-8 mb-[-8px] z-10">
          {candles.map((isLit, idx) => (
            <div key={idx} className="relative w-3.5 h-14 bg-gradient-to-t from-primary via-[#e29898] to-[#dfa97b] rounded-full flex flex-col items-center shadow-md">
              {/* Wick */}
              <div className="w-0.5 h-2 bg-gray-600 absolute -top-2" />
              
              {/* Flame */}
              {isLit ? (
                <button
                  id={`cake-candle-flame-${idx}`}
                  onClick={() => handleBlowCandle(idx)}
                  className="absolute -top-7 w-6 h-8 cursor-pointer hover:scale-125 focus:outline-none transition-all flex items-center justify-center"
                >
                  {/* Flickering flame vector */}
                  <svg className="w-full h-full animate-flame-flicker filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fef08a" />
                      </linearGradient>
                    </defs>
                    <path d="M50 15 C65 50, 75 75, 50 115 C25 75, 35 50, 50 15 Z" fill="url(#flameGrad)" />
                  </svg>
                </button>
              ) : (
                // Smoke trail
                <div className="absolute -top-7 w-1 h-6 bg-gray-400/40 rounded-full animate-smoke-rise" />
              )}
            </div>
          ))}
        </div>

        {/* Cake body */}
        <div className="w-52 h-24 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-3xl shadow-xl relative flex flex-col justify-between p-3 border-b-4 border-pink-400/30">
          {/* Icing Swirls */}
          <div className="flex justify-around absolute -top-2.5 left-2 right-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-[#FAF9F5] border-b-2 border-pink-200 shadow-sm" />
            ))}
          </div>
          <div className="w-full h-2 bg-amber-900/10 rounded-full mt-1.5" />
          <div className="text-center font-display text-xs text-primary font-bold tracking-wider">
            HAPPY BIRTHDAY
          </div>
          <div className="w-full h-1 bg-white/40 rounded-full" />
        </div>

        {/* Cake Stand */}
        <div className="w-60 h-4 bg-surface-container-high rounded-full shadow-lg border border-outline-variant/30 relative z-0">
          <div className="w-20 h-4 bg-gray-300/40 absolute top-full left-1/2 -translate-x-1/2 rounded-b" />
        </div>
      </div>

      {isDone && (
        <div className="mt-6 text-primary font-bold text-sm flex items-center justify-center gap-1.5 animate-bounce">
          🎉 Wish granted! Unlocking your surprise letter...
        </div>
      )}

      <style>{`
        @keyframes flame-flicker {
          0% { transform: scale(1) rotate(-1.5deg); }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(0.95) rotate(-2deg); }
        }
        @keyframes smoke-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0.8; }
          100% { transform: translateY(-40px) scaleX(0.1); opacity: 0; }
        }
        @keyframes confetti-particle {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.5); opacity: 1; }
          100% { transform: translate(var(--target-x), var(--target-y)) rotate(720deg) scale(1); opacity: 0; }
        }
        .animate-flame-flicker {
          animation: flame-flicker 0.4s ease-in-out infinite alternate;
          transform-origin: bottom center;
        }
        .animate-smoke-rise { animation: smoke-rise 1.2s ease-out forwards; }
        .animate-confetti-particle {
          animation: confetti-particle 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
