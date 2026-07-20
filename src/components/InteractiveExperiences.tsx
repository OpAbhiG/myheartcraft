import React, { useState, useEffect } from 'react';
import { Sparkles, Gift, Heart, MailOpen, Cake } from 'lucide-react';

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

// 1. PUZZLE GAME (3x3 Tile Swap)
function PuzzleGame({ imageUrl, onComplete }: { imageUrl: string; onComplete: () => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    // Generate indices 0 to 8
    const original = Array.from({ length: 9 }, (_, i) => i);
    // Shuffle
    let shuffled = [...original];
    let isSame = true;
    while (isSame) {
      shuffled.sort(() => Math.random() - 0.5);
      // Ensure it is not solved instantly and is actually solvable (swapping random tiles is always solvable in swap puzzle)
      isSame = shuffled.every((val, i) => val === i);
    }
    setTiles(shuffled);
  }, [imageUrl]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      // Swap tiles
      const newTiles = [...tiles];
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[index];
      newTiles[index] = temp;
      setTiles(newTiles);
      setSelectedIdx(null);

      // Check if solved
      const solved = newTiles.every((val, i) => val === i);
      if (solved) {
        setIsSolved(true);
        setTimeout(onComplete, 1500);
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 text-center animate-fade-in" id="puzzle-panel">
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container/50 text-secondary rounded-full font-label-caps text-xs">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-tertiary-container" />
          Interactive Puzzle
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">Swap the tiles to solve the puzzle & reveal your surprise!</h3>
      </div>

      <div className="grid grid-cols-3 gap-1 aspect-square max-w-sm mx-auto bg-surface-container rounded-lg overflow-hidden border border-outline-variant/30 p-1" id="puzzle-grid">
        {tiles.map((tileVal, idx) => {
          // Calculate grid slice positions
          const row = Math.floor(tileVal / 3);
          const col = tileVal % 3;
          
          return (
            <button
              id={`puzzle-tile-${idx}`}
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`relative aspect-square overflow-hidden border transition-all duration-300 group focus:outline-none ${
                selectedIdx === idx ? 'ring-4 ring-primary border-primary scale-[0.97]' : 'border-white/10 hover:border-primary/50'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: '300% 300%',
                  backgroundPosition: `${col * 50}% ${row * 50}%`
                }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              {/* Optional tile number indicator helper */}
              <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/40 text-white text-[10px] flex items-center justify-center font-mono select-none">
                {idx + 1}
              </div>
            </button>
          );
        })}
      </div>

      {isSolved && (
        <div className="mt-4 text-primary font-semibold flex items-center justify-center gap-1.5 animate-bounce">
          <Gift className="w-5 h-5 text-tertiary-container" />
          Solved! Loading your keepsake...
        </div>
      )}
    </div>
  );
}

// 2. ENVELOPE OPENING
function EnvelopeOpening({ recipientName, onComplete }: { recipientName: string; onComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onComplete, 1600);
  };

  return (
    <div className="glass-card rounded-2xl p-8 text-center animate-fade-in relative overflow-hidden flex flex-col items-center" id="envelope-panel">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container/50 text-secondary rounded-full font-label-caps text-xs">
          <MailOpen className="w-3.5 h-3.5 animate-bounce text-primary" />
          Sealed Letter
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">A personalized letter waiting for you, {recipientName}</h3>
      </div>

      {/* Sealed Envelope Container */}
      <div className="relative w-72 h-44 my-6 cursor-pointer group" onClick={handleOpen} id="envelope-interactive">
        <div className={`absolute inset-0 bg-gradient-to-br from-[#e29898] to-[#8a4d4e] rounded-lg shadow-xl transition-all duration-700 ${
          isOpen ? 'transform rotate-x-180 opacity-0 scale-95' : 'group-hover:scale-105'
        }`}>
          {/* Envelope Back & Flap Representation */}
          <div className="absolute top-0 left-0 w-full h-0 border-t-[80px] border-t-white/10 border-x-[144px] border-x-transparent z-10" />
          <div className="absolute bottom-0 left-0 w-full h-0 border-b-[100px] border-b-white/20 border-x-[144px] border-x-transparent z-10" />
          
          {/* Wax Seal */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-14 h-14 rounded-full bg-[#735c00] flex items-center justify-center text-tertiary-fixed border-2 border-tertiary-fixed-dim shadow-lg animate-pulse">
              <Heart className="w-6 h-6 fill-current text-white" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/60 tracking-wider">
            FOR: {recipientName.toUpperCase()}
          </div>
        </div>

        {/* Floating Paper when opened */}
        {isOpen && (
          <div className="absolute inset-0 bg-[#fbf9f5] rounded border border-outline-variant/40 shadow-2xl p-4 flex flex-col justify-between animate-envelope-paper">
            <div className="h-2 w-12 bg-primary/20 rounded mb-1" />
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-on-surface-variant/20 rounded" />
              <div className="h-1.5 w-5/6 bg-on-surface-variant/20 rounded" />
              <div className="h-1.5 w-4/5 bg-on-surface-variant/20 rounded" />
            </div>
            <div className="h-2 w-8 bg-secondary/20 rounded self-end" />
          </div>
        )}
      </div>

      <button
        id="btn-open-letter"
        onClick={handleOpen}
        disabled={isOpen}
        className="btn-primary py-3 px-8 rounded-full shadow-lg font-label-caps uppercase text-sm tracking-wider flex items-center gap-2"
      >
        <MailOpen className="w-4 h-4" />
        Break the Seal
      </button>

      <style>{`
        @keyframes envelope-paper {
          0% { transform: translateY(40px) scale(0.7); opacity: 0; }
          100% { transform: translateY(-60px) scale(1.1); opacity: 1; }
        }
        .animate-envelope-paper {
          animation: envelope-paper 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}

// 3. POP-UP CARD
function PopupCard({ recipientName, imageUrl, onComplete }: { recipientName: string; imageUrl: string; onComplete: () => void }) {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggle = () => {
    setIsOpened(true);
    setTimeout(onComplete, 1800);
  };

  return (
    <div className="glass-card rounded-2xl p-6 text-center animate-fade-in relative" id="popup-card-panel">
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffe088]/20 text-[#735c00] rounded-full font-label-caps text-xs">
          <Heart className="w-3.5 h-3.5 fill-current text-primary animate-pulse" />
          3D Pop-up Card
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">Open the premium keepsake card</h3>
      </div>

      <div className="w-full max-w-sm mx-auto h-64 bg-surface-container rounded-xl flex items-center justify-center p-4 border border-outline-variant/30 overflow-hidden relative" id="card-stage">
        {!isOpened ? (
          // Outer Cover
          <button
            id="popup-card-cover"
            onClick={handleToggle}
            className="w-48 h-56 bg-gradient-to-tr from-primary to-[#e29898] rounded-xl shadow-2xl relative border-2 border-white/20 hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-white"
          >
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40" />
            <Heart className="w-12 h-12 fill-current mb-4 text-[#ffe088] animate-bounce" />
            <span className="font-headline-md text-lg px-2">To {recipientName}</span>
            <span className="font-label-caps text-[10px] mt-2 opacity-80 uppercase tracking-widest">TAP TO OPEN</span>
          </button>
        ) : (
          // Unfolded Inside with Popups
          <div className="w-full h-full flex flex-col justify-between p-4 animate-card-unfold relative">
            <div className="absolute inset-0 bg-cover bg-center opacity-10 rounded-xl" style={{ backgroundImage: `url(${imageUrl})` }} />
            
            {/* Pop-up elements floating upward */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Central Frame */}
              <div className="w-36 h-36 bg-[#fbf9f5] p-1.5 rounded-lg shadow-2xl border border-white/40 rotate-[-4deg] animate-popup-frame z-10 relative">
                <img src={imageUrl} alt="Keepsake" className="w-full h-full object-cover rounded" />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-full shadow">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Surrounding floating decorations */}
              <div className="absolute -left-6 top-8 text-primary animate-popup-deco-1">❤️</div>
              <div className="absolute -right-6 top-4 text-[#735c00] animate-popup-deco-2">✨</div>
              <div className="absolute left-10 -top-4 text-secondary animate-popup-deco-3">🌸</div>
            </div>

            <div className="text-primary font-bold text-sm animate-pulse z-10">
              Unfolding your keepsake...
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes card-unfold {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes popup-frame {
          0% { transform: translateY(60px) rotate(15deg) scale(0.5); opacity: 0; }
          100% { transform: translateY(0) rotate(-4deg) scale(1); opacity: 1; }
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
        .animate-card-unfold { animation: card-unfold 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-popup-frame { animation: popup-frame 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; opacity: 0; }
        .animate-popup-deco-1 { animation: popup-deco-1 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s infinite alternate; opacity: 0; }
        .animate-popup-deco-2 { animation: popup-deco-2 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.6s infinite alternate; opacity: 0; }
        .animate-popup-deco-3 { animation: popup-deco-3 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s infinite alternate; opacity: 0; }
      `}</style>
    </div>
  );
}

// 4. BIRTHDAY CAKE
function BirthdayCake({ recipientName, onComplete }: { recipientName: string; onComplete: () => void }) {
  const [candles, setCandles] = useState<boolean[]>([true, true, true]); // 3 lit candles
  const [isDone, setIsDone] = useState(false);

  const handleBlowCandle = (index: number) => {
    if (isDone) return;
    
    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);

    // If all blown
    if (newCandles.every(c => !c)) {
      setIsDone(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 text-center animate-fade-in" id="cake-panel">
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e29898]/20 text-primary rounded-full font-label-caps text-xs">
          <Cake className="w-3.5 h-3.5 animate-bounce" />
          Birthday Celebration
        </span>
        <h3 className="font-headline-md text-xl text-on-background mt-2">Make a wish, {recipientName}! Blow out the candles.</h3>
        <p className="text-xs text-on-surface-variant">Tap on each candle flame to blow it out.</p>
      </div>

      <div className="h-64 flex flex-col justify-end items-center relative py-6" id="cake-container">
        {/* Candles row */}
        <div className="flex gap-8 mb-[-8px] z-10">
          {candles.map((isLit, idx) => (
            <div key={idx} className="relative w-3.5 h-14 bg-gradient-to-t from-primary via-[#e29898] to-secondary-fixed-dim rounded-full flex flex-col items-center">
              {/* Flame */}
              {isLit ? (
                <button
                  id={`cake-candle-flame-${idx}`}
                  onClick={() => handleBlowCandle(idx)}
                  className="absolute -top-7 w-5 h-7 bg-gradient-to-t from-red-500 via-yellow-400 to-amber-200 rounded-full animate-flame-flicker cursor-pointer hover:scale-125 focus:outline-none"
                  style={{ transformOrigin: 'bottom center' }}
                />
              ) : (
                // Smoke trail
                <div className="absolute -top-6 w-1 h-5 bg-gray-400/30 rounded-full animate-smoke-rise" />
              )}
            </div>
          ))}
        </div>

        {/* Cake body */}
        <div className="w-48 h-20 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-2xl shadow-xl relative flex flex-col justify-between p-3 border-b-4 border-pink-400/30">
          {/* Icing Swirls */}
          <div className="flex justify-around absolute -top-2.5 left-2 right-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-[#fbf9f5] border-b-2 border-pink-200" />
            ))}
          </div>
          {/* Chocolate drip representation */}
          <div className="w-full h-2 bg-amber-900/10 rounded-full mt-1" />
          <div className="text-center font-headline-md text-xs text-primary tracking-wide">
            HAPPY BIRTHDAY
          </div>
          <div className="w-full h-1 bg-white/30 rounded" />
        </div>

        {/* Cake Stand */}
        <div className="w-56 h-3 bg-surface-container-high rounded-full shadow-md border border-outline-variant/30" />
      </div>

      {isDone && (
        <div className="mt-4 text-primary font-semibold flex items-center justify-center gap-1.5 animate-bounce">
          🎉 Wish granted! Unlocking your surprise letter...
        </div>
      )}

      <style>{`
        @keyframes flame-flicker {
          0% { transform: scale(1) rotate(-1deg); }
          50% { transform: scale(1.15) rotate(2deg); }
          100% { transform: scale(1) rotate(-2deg); }
        }
        @keyframes smoke-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0.7; }
          100% { transform: translateY(-30px) scaleX(0.2); opacity: 0; }
        }
        .animate-flame-flicker { animation: flame-flicker 0.4s ease-in-out infinite alternate; }
        .animate-smoke-rise { animation: smoke-rise 1s ease-out forwards; }
      `}</style>
    </div>
  );
}
