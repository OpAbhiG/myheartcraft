import React, { useState } from 'react';
import { Lock, Mail, Unlock, Play, X, Calendar, MessageSquare, ImageIcon, Volume2, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { OpenWhenProject, OpenWhenMessage } from './types';

interface RecipientOpenViewProps {
  project: OpenWhenProject;
  onClose: () => void;
  onUpdateProject: (updated: OpenWhenProject) => void;
  onLaunchKeepsake?: (creationId: string) => void; // Launches linked Card, Scrapbook, or Magazine
}

export default function RecipientOpenView({
  project,
  onClose,
  onUpdateProject,
  onLaunchKeepsake
}: RecipientOpenViewProps) {
  const [started, setStarted] = useState(false);
  const [activeMessage, setActiveMessage] = useState<OpenWhenMessage | null>(null);
  
  // Animation states
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState<OpenWhenMessage | null>(null);
  const [sealBroken, setSealBroken] = useState(false);

  // Styling maps based on project.style
  const getThemeClasses = () => {
    switch (project.style) {
      case 'minimal-editorial':
        return {
          bg: 'bg-background text-on-background font-sans',
          card: 'bg-white border border-primary/20 rounded-2xl shadow-xl',
          title: 'font-display text-primary font-bold tracking-tight',
          button: 'btn-primary',
          envelope: 'bg-white border border-primary/10 rounded-2xl text-on-background shadow-md',
          sealColor: 'bg-primary text-white rounded-full'
        };
      case 'dark-cinematic':
        return {
          bg: 'bg-[#0f0b0d] text-white font-sans',
          card: 'bg-[#1a1215] border border-amber-500/20 rounded-2xl shadow-2xl',
          title: 'font-display text-amber-400 font-bold tracking-tight',
          button: 'bg-amber-500 text-[#0f0b0d] hover:bg-amber-400 rounded-xl font-bold uppercase tracking-wider text-xs px-6 py-3',
          envelope: 'bg-[#1b1417] border border-amber-500/10 text-white rounded-2xl shadow-lg',
          sealColor: 'bg-amber-500 text-black rounded-full'
        };
      case 'playful-fun':
        return {
          bg: 'bg-sky-50 text-sky-950 font-sans',
          card: 'bg-white border-2 border-sky-400 rounded-3xl shadow-lg',
          title: 'font-display font-extrabold text-sky-500 tracking-tight',
          button: 'bg-sky-400 text-white hover:bg-sky-500 rounded-full font-bold uppercase tracking-widest text-[10px] px-6 py-3 shadow-md',
          envelope: 'bg-orange-50 border-2 border-orange-200 text-sky-950 rounded-2xl shadow-md hover:border-orange-300',
          sealColor: 'bg-orange-400 text-white rounded-full'
        };
      case 'personal-handwritten':
        return {
          bg: 'bg-[#FAF9F6] text-[#2c3e50] font-sans',
          card: 'bg-white border border-[#d2b48c] shadow-lg rounded-2xl',
          title: 'font-serif text-[#8b4513] italic font-bold',
          button: 'border border-[#8b4513] text-[#8b4513] hover:bg-[#8b4513]/5 rounded-xl font-serif text-sm px-6 py-3',
          envelope: 'bg-[#FAF6EE] border border-[#e6dfd3] text-[#4a3c31] rounded-2xl shadow-sm',
          sealColor: 'bg-red-800 text-white rounded-full'
        };
      case 'soft-emotional':
      default:
        return {
          bg: 'bg-rose-50/40 text-rose-950 font-sans',
          card: 'bg-white border border-rose-200/40 rounded-2xl shadow-xl',
          title: 'font-serif text-rose-800 font-medium italic tracking-wide',
          button: 'bg-rose-700 text-white hover:bg-rose-800 rounded-xl font-semibold px-6 py-3 text-xs uppercase tracking-wider shadow-md',
          envelope: 'bg-rose-50/30 border border-rose-100 text-rose-950 rounded-2xl shadow-sm',
          sealColor: 'bg-rose-600 text-white rounded-full'
        };
    }
  };

  const theme = getThemeClasses();

  const handleOpenEnvelope = (msg: OpenWhenMessage) => {
    if (msg.unlockMode === 'date' && msg.unlockDate) {
      const lockDate = new Date(msg.unlockDate);
      const today = new Date();
      if (today < lockDate) {
        alert(`This envelope is date-locked. It cannot be opened before: ${new Date(msg.unlockDate).toLocaleDateString()}`);
        return;
      }
    }

    if (msg.unlockMode === 'manual' && msg.status === 'SEALED') {
      alert("This envelope is manual-locked by the sender. They have not unlocked this for you yet.");
      return;
    }

    if (msg.status === 'OPENED') {
      setActiveMessage(msg);
    } else {
      setSelectedEnvelope(msg);
      setSealBroken(false);
      setIsOpeningAnimation(true);
    }
  };

  const handleBreakSeal = () => {
    if (sealBroken) return;
    setSealBroken(true);
    
    // Play synthesized crack audio cue
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch {}

    // Advance to revealed view
    setTimeout(() => {
      handleFinishAnimation();
    }, 1800);
  };

  const handleFinishAnimation = () => {
    if (!selectedEnvelope) return;
    
    const updatedMessages = project.messages.map(m => {
      if (m.id === selectedEnvelope.id) {
        return { ...m, status: 'OPENED' as const, openedAt: new Date().toISOString() };
      }
      return m;
    });

    const updatedProject = { ...project, messages: updatedMessages };
    onUpdateProject(updatedProject);
    setActiveMessage({ ...selectedEnvelope, status: 'OPENED', openedAt: new Date().toISOString() });
    setIsOpeningAnimation(false);
    setSelectedEnvelope(null);
  };

  const getEnvelopeIcon = (msg: OpenWhenMessage) => {
    if (msg.unlockMode === 'date' && msg.status === 'SEALED') {
      const lockDate = new Date(msg.unlockDate || '');
      const today = new Date();
      if (today < lockDate) return <Lock className="w-4.5 h-4.5 text-red-500 animate-pulse" />;
    }
    if (msg.unlockMode === 'manual' && msg.status === 'SEALED') {
      return <Lock className="w-4.5 h-4.5 text-gray-400" />;
    }
    if (msg.status === 'OPENED') return <Unlock className="w-4.5 h-4.5 text-green-600" />;
    return <Mail className="w-4.5 h-4.5 text-primary" />;
  };

  return (
    <div className={`min-h-screen ${theme.bg} select-none antialiased flex flex-col relative`} id="recipient-open-view">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10 opacity-[0.05]" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10 opacity-[0.05]" />

      {/* Top navbar */}
      <header className="h-20 border-b border-primary/10 px-6 flex justify-between items-center bg-white/70 backdrop-blur-md shrink-0 z-30">
        <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest font-mono hover:text-primary flex items-center gap-1.5 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </button>
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#999] font-bold">{project.title}</span>
      </header>

      {!started ? (
        /* Welcome Cover Page */
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className={`w-full max-w-lg p-10 md:p-14 text-center ${theme.card} animate-scale-in`}>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/60 block mb-4 font-bold">OPEN WHEN...</span>
            <h1 className={`text-4xl md:text-5xl mb-6 font-bold leading-tight ${theme.title}`}>{project.title}</h1>
            <p className="text-sm font-semibold italic text-on-surface-variant mb-6">From {project.creatorName}</p>
            
            {project.introduction && (
              <p className="text-xs text-on-surface-variant leading-relaxed mb-10 max-w-md mx-auto whitespace-pre-line border-t border-b border-primary/10 py-5">
                {project.introduction}
              </p>
            )}

            <button
              onClick={() => setStarted(true)}
              className={`w-full py-4 rounded-xl cursor-pointer font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all ${theme.button}`}
            >
              Reveal Envelopes
            </button>
          </div>
        </div>
      ) : (
        /* Envelope selection grid */
        <div className="flex-grow p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8 animate-fade-in relative z-10">
          <div className="text-center space-y-2">
            <h2 className={`text-3xl font-bold tracking-tight uppercase ${theme.title}`}>{project.recipientName}'s Envelopes</h2>
            <p className="text-xs text-on-surface-variant/80 font-body-lg">Tap on a sealed envelope when the moment arrives.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {project.messages.map((msg, idx) => {
              const isLocked = msg.unlockMode === 'date' && new Date(msg.unlockDate || '') > new Date() && msg.status === 'SEALED';
              
              return (
                <button
                  key={msg.id}
                  onClick={() => handleOpenEnvelope(msg)}
                  className={`p-6 text-left transition-all duration-300 relative flex flex-col justify-between min-h-[170px] cursor-pointer hover:-translate-y-1.5 hover:shadow-lg ${theme.envelope}`}
                >
                  {/* Status header */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">Envelope {idx + 1}</span>
                    {getEnvelopeIcon(msg)}
                  </div>

                  {/* Envelope label */}
                  <div className="pr-8">
                    <h3 className="text-sm font-bold text-on-background tracking-tight uppercase leading-snug">{msg.promptTitle}</h3>
                    {msg.status === 'OPENED' && (
                      <span className="text-[9px] text-green-700 font-mono font-bold block mt-1.5">✓ Opened</span>
                    )}
                    {isLocked && (
                      <span className="text-[9px] text-red-600 font-mono block mt-1.5 flex items-center gap-1 font-bold">
                        <Lock className="w-2.5 h-2.5" /> Locked until {new Date(msg.unlockDate || '').toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Envelope wax seal dot */}
                  <div className="absolute right-6 bottom-5 flex items-center justify-center">
                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs shadow-md ${theme.sealColor}`}>
                      {idx + 1}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Interactive Envelope Unlocking 3D Overlay --- */}
      {isOpeningAnimation && selectedEnvelope && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-6">
          <div className="w-full max-w-sm text-center space-y-8 animate-scale-in">
            
            <h3 className="text-white text-base font-serif italic mb-2">"Open when... {selectedEnvelope.promptTitle}"</h3>

            {/* The Sealed 3D Envelope Card Container */}
            <div className="w-full bg-[#E5DDCB] border border-[#C5BBA6] shadow-2xl relative rounded-2xl overflow-hidden flex flex-col justify-between p-6 h-60 aspect-[1.5/1]">
              <div className="absolute inset-0 bg-[#E8E1CE] opacity-80" />

              {/* Envelope Top Flap (rotating open) */}
              <div 
                className="absolute top-0 left-0 w-full h-[52%] bg-[#D7CEB5] border-b border-[#C3B89E] origin-top transition-transform duration-[1000ms] ease-in-out z-20 shadow-sm rounded-t-xl"
                style={{
                  transform: sealBroken ? 'rotateX(135deg)' : 'rotateX(0deg)',
                  perspective: '800px'
                }}
              />

              {/* Text underneath flap */}
              <div className="relative z-10 text-center mt-12 px-4">
                <span className="text-[8px] tracking-[0.25em] font-mono text-gray-500 uppercase block mb-1">LETTER OF GRATITUDE</span>
                <p className="text-[10px] text-gray-400 font-mono">From {project.creatorName}</p>
              </div>

              {/* Split Wax Seal (breaks apart) */}
              <div className="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex gap-0.5">
                <button
                  onClick={handleBreakSeal}
                  className={`w-9 h-14 bg-red-800 hover:bg-red-700 active:scale-95 border-r border-red-950/20 rounded-l-full shadow-lg flex items-center justify-end pr-1.5 text-white font-bold transition-all duration-[800ms] cursor-pointer ${
                    sealBroken ? '-translate-x-10 rotate-[-25deg] opacity-0 scale-90' : ''
                  }`}
                  title="Break Seal"
                >
                  <span className="text-[7px] tracking-tighter uppercase font-mono">OP</span>
                </button>

                <button
                  onClick={handleBreakSeal}
                  className={`w-9 h-14 bg-red-800 hover:bg-red-700 active:scale-95 border-l border-red-950/20 rounded-r-full shadow-lg flex items-center justify-start pl-1.5 text-white font-bold transition-all duration-[800ms] cursor-pointer ${
                    sealBroken ? 'translate-x-10 rotate-[25deg] opacity-0 scale-90' : ''
                  }`}
                  title="Break Seal"
                >
                  <span className="text-[7px] tracking-tighter uppercase font-mono">EN</span>
                </button>
              </div>

              <div className="relative z-10 flex justify-between items-center text-gray-500 text-[8.5px] font-mono border-t border-black/5 pt-2">
                <span>MEMORA KEEPSAKE</span>
                <span>SEALED</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-mono">Click the red wax seal to crack it & open the letter.</p>
            
            <button
              onClick={() => {
                setIsOpeningAnimation(false);
                setSelectedEnvelope(null);
              }}
              className="text-xs text-gray-500 hover:text-white uppercase tracking-wider font-mono cursor-pointer border border-white/10 py-1.5 px-4 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- Opened Envelope Message Viewer Modal --- */}
      {activeMessage && (
        <div className="fixed inset-0 bg-[#200b13]/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#FAF9F6] text-black w-full max-w-2xl min-h-[500px] p-6 md:p-10 shadow-2xl rounded-3xl relative flex flex-col justify-between animate-scale-in">
            
            {/* Close */}
            <button
              onClick={() => setActiveMessage(null)}
              className="absolute top-4 right-4 p-2 hover:bg-[#eee] rounded-full text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Head */}
            <div className="space-y-4">
              <div className="border-b border-[#e2d5c3] pb-4 flex justify-between items-end">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-rose-800 font-bold block mb-1">Open When moment arrived</span>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-rose-950 uppercase italic leading-tight">
                    {activeMessage.promptTitle}
                  </h3>
                </div>
              </div>

              {/* Photos attachment list */}
              {activeMessage.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                  {activeMessage.photos.map((ph, idx) => (
                    <div key={idx} className="bg-white p-2.5 border border-gray-200 shadow-sm aspect-square flex flex-col justify-between rounded-xl">
                      <div className="h-[80%] overflow-hidden bg-gray-50 rounded-lg">
                        <img src={ph.url} alt="Attached" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[8.5px] text-[#777] truncate block text-center font-mono mt-1.5 italic">"{ph.caption || 'Memory'}"</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Letter Text body */}
              <div className="font-serif text-sm leading-relaxed text-[#2c3e50] whitespace-pre-wrap max-h-72 overflow-y-auto pr-2 my-6 pl-4 border-l-2 border-primary/20">
                {activeMessage.textContent}
              </div>

              {/* Voice Memo if present */}
              {activeMessage.voiceUrl && (
                <div className="bg-rose-50/50 border border-rose-100 p-4 flex items-center gap-3 max-w-md my-4 rounded-2xl">
                  <Volume2 className="w-5 h-5 text-rose-800" />
                  <audio src={activeMessage.voiceUrl} controls className="h-8 w-full shrink-0" />
                </div>
              )}
            </div>

            {/* Surprise Link / Keepsake Launch */}
            <div className="mt-8 border-t border-[#e2d5c3] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              {activeMessage.surpriseContent ? (
                <div>
                  {activeMessage.surpriseContent.type === 'memora-project' && onLaunchKeepsake ? (
                    <button
                      onClick={() => onLaunchKeepsake(activeMessage.surpriseContent!.value)}
                      className="px-5 py-2.5 bg-rose-800 text-white font-mono text-[9px] uppercase tracking-widest font-bold hover:bg-rose-900 flex items-center gap-2 rounded-xl shadow-md"
                    >
                      🎁 Open Surprise Keepsake
                    </button>
                  ) : activeMessage.surpriseContent.type === 'coupon' ? (
                    <div className="bg-amber-50 border border-amber-200 px-5 py-2 text-center text-xs font-mono rounded-xl shadow-inner">
                      SURPRISE CODE: <strong className="text-amber-900">{activeMessage.surpriseContent.value}</strong>
                    </div>
                  ) : (
                    <a
                      href={activeMessage.surpriseContent.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-gray-800 text-white font-mono text-[9px] uppercase tracking-widest font-bold hover:bg-gray-900 rounded-xl shadow-md"
                    >
                      {activeMessage.surpriseContent.label || 'Visit Surprise Link'}
                    </a>
                  )}
                </div>
              ) : <div />}

              <button
                onClick={() => setActiveMessage(null)}
                className="px-5 py-2 border border-gray-300 hover:bg-[#eee] text-xs font-semibold uppercase tracking-wider font-mono text-black rounded-xl cursor-pointer"
              >
                Close Message
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
