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

  // Styling maps based on project.style
  const getThemeClasses = () => {
    switch (project.style) {
      case 'minimal-editorial':
        return {
          bg: 'bg-white text-black font-sans',
          card: 'bg-white border border-black rounded-none shadow-none',
          title: 'font-sans font-light uppercase tracking-widest text-black',
          button: 'border border-black text-black hover:bg-black hover:text-white rounded-none',
          envelope: 'bg-gray-50 border border-black/40 text-black',
          sealColor: 'bg-black text-white'
        };
      case 'dark-cinematic':
        return {
          bg: 'bg-[#0a0a0a] text-white font-sans',
          card: 'bg-[#121212] border border-amber-500/30 rounded-none shadow-2xl',
          title: 'font-sans text-amber-500 font-bold uppercase tracking-widest',
          button: 'border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-none',
          envelope: 'bg-[#151515] border border-amber-500/20 text-[#ddd]',
          sealColor: 'bg-amber-500 text-black'
        };
      case 'playful-fun':
        return {
          bg: 'bg-sky-50 text-sky-950 font-sans',
          card: 'bg-white border-2 border-sky-400 rounded-2xl shadow-lg',
          title: 'font-display font-extrabold text-sky-500 tracking-tight',
          button: 'bg-sky-400 text-white hover:bg-sky-500 rounded-full font-bold',
          envelope: 'bg-orange-50 border-2 border-orange-200 text-sky-950 rounded-xl',
          sealColor: 'bg-orange-400 text-white rounded-full'
        };
      case 'personal-handwritten':
        return {
          bg: 'bg-[#FAF9F6] text-[#2c3e50] font-sans',
          card: 'bg-white border border-[#d2b48c] shadow-md rounded-sm',
          title: 'font-serif text-[#8b4513] italic font-bold',
          button: 'border border-[#8b4513] text-[#8b4513] hover:bg-[#8b4513]/5 rounded-none font-serif',
          envelope: 'bg-[#FAF6EE] border border-[#e6dfd3] text-[#4a3c31]',
          sealColor: 'bg-red-800 text-white rounded-full'
        };
      case 'soft-emotional':
      default:
        return {
          bg: 'bg-rose-50/50 text-rose-950 font-sans',
          card: 'bg-white border border-rose-200/50 rounded-none shadow-xl',
          title: 'font-serif text-rose-800 font-medium italic tracking-wide',
          button: 'bg-rose-700 text-white hover:bg-rose-800 rounded-none',
          envelope: 'bg-rose-50/40 border border-rose-100 text-rose-950',
          sealColor: 'bg-rose-600 text-white rounded-full'
        };
    }
  };

  const theme = getThemeClasses();

  const handleOpenEnvelope = (msg: OpenWhenMessage) => {
    // Check locks
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

    // Play opening animation or skip straight to revealed view if already opened
    if (msg.status === 'OPENED') {
      setActiveMessage(msg);
    } else {
      setSelectedEnvelope(msg);
      setIsOpeningAnimation(true);
    }
  };

  const handleFinishAnimation = () => {
    if (!selectedEnvelope) return;
    
    // Mark as opened
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
      if (today < lockDate) return <Lock className="w-5 h-5 text-red-500" />;
    }
    if (msg.unlockMode === 'manual' && msg.status === 'SEALED') {
      return <Lock className="w-5 h-5 text-gray-500" />;
    }
    if (msg.status === 'OPENED') return <Unlock className="w-5 h-5 text-green-600" />;
    return <Mail className="w-5 h-5 text-primary" />;
  };

  return (
    <div className={`min-h-screen ${theme.bg} select-none antialiased flex flex-col relative`} id="recipient-open-view">
      
      {/* Top navbar */}
      <header className="h-16 border-b border-primary/10 px-6 flex justify-between items-center bg-background/40 backdrop-blur shrink-0 z-30">
        <button onClick={onClose} className="text-xs uppercase tracking-wider font-mono hover:underline flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#999]">{project.title}</span>
      </header>

      {!started ? (
        /* Welcome Cover Page */
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className={`w-full max-w-lg p-8 md:p-12 text-center ${theme.card} animate-scale-in`}>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-[#999] block mb-4">OPEN WHEN...</span>
            <h1 className={`text-3xl md:text-5xl mb-6 font-bold ${theme.title}`}>{project.title}</h1>
            <p className="text-sm font-semibold italic text-on-surface-variant/80 mb-6">From {project.creatorName}</p>
            
            {project.introduction && (
              <p className="text-xs text-on-surface-variant/90 leading-relaxed mb-10 max-w-md mx-auto whitespace-pre-line border-t border-b border-primary/5 py-4">
                {project.introduction}
              </p>
            )}

            <button
              onClick={() => setStarted(true)}
              className={`w-full py-3.5 font-mono text-[10px] uppercase tracking-widest font-bold ${theme.button}`}
            >
              Reveal Envelopes
            </button>
          </div>
        </div>
      ) : (
        /* Envelope selection grid */
        <div className="flex-grow p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-1">
            <h2 className={`text-2xl font-bold uppercase ${theme.title}`}>{project.recipientName}'s Keepsake Envelopes</h2>
            <p className="text-xs text-on-surface-variant/75">Tap a sealed envelope when the moment described on the label arrives.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.messages.map((msg, idx) => {
              const isLocked = msg.unlockMode === 'date' && new Date(msg.unlockDate || '') > new Date() && msg.status === 'SEALED';
              
              return (
                <button
                  key={msg.id}
                  onClick={() => handleOpenEnvelope(msg)}
                  className={`p-6 text-left transition-all relative flex flex-col justify-between min-h-[160px] cursor-pointer hover:-translate-y-1 ${theme.envelope}`}
                >
                  {/* Status header */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500">Envelope {idx + 1}</span>
                    {getEnvelopeIcon(msg)}
                  </div>

                  {/* Envelope label */}
                  <div>
                    <h3 className="text-sm font-bold text-[#222] tracking-tight uppercase leading-snug">{msg.promptTitle}</h3>
                    {msg.status === 'OPENED' && (
                      <span className="text-[9px] text-green-700 font-mono block mt-1">Opened</span>
                    )}
                    {isLocked && (
                      <span className="text-[9px] text-red-600 font-mono block mt-1 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locks until {new Date(msg.unlockDate || '').toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Envelope wax seal dot */}
                  <div className="absolute right-6 bottom-5 flex items-center justify-center">
                    <div className={`w-6 h-6 flex items-center justify-center font-bold text-[8px] ${theme.sealColor}`}>
                      {idx + 1}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Tear Wax Seal Animation Overlay --- */}
      {isOpeningAnimation && selectedEnvelope && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-sm text-center space-y-6">
            
            {/* The Sealed Envelope Card */}
            <div className="bg-[#FAF9F6] border-t-8 border-red-800 p-8 rounded shadow-2xl aspect-[4/3] flex flex-col justify-between text-black relative animate-scale-in">
              <span className="font-mono text-[8px] uppercase tracking-widest text-[#999]">SEALED LETTER</span>
              <div>
                <h3 className="font-serif italic text-lg text-gray-800 font-bold">"Open when... {selectedEnvelope.promptTitle}"</h3>
                <p className="text-[10px] text-gray-500 mt-2 font-mono">From {project.creatorName}</p>
              </div>

              {/* The Wax Seal wax stamp dot */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleFinishAnimation}
                  className="w-14 h-14 bg-red-800 hover:bg-red-700 active:scale-95 text-white font-bold rounded-full shadow-lg flex flex-col items-center justify-center cursor-pointer transition-all border-4 border-red-950/20"
                >
                  <span className="text-[8px] tracking-wider uppercase">BREAK</span>
                  <span className="text-[8px] tracking-wider uppercase">SEAL</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#888] font-mono">Tap the wax seal stamp above to open this message.</p>
            <button
              onClick={() => {
                setIsOpeningAnimation(false);
                setSelectedEnvelope(null);
              }}
              className="text-xs text-[#aaa] hover:text-white uppercase tracking-wider font-mono"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- Opened Envelope Message Viewer Modal --- */}
      {activeMessage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#FAF9F6] text-black w-full max-w-2xl min-h-[500px] p-6 md:p-10 shadow-2xl relative flex flex-col justify-between animate-scale-in">
            
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
                    <div key={idx} className="bg-white p-2 border border-gray-200 shadow-sm aspect-square flex flex-col justify-between">
                      <div className="h-[80%] overflow-hidden bg-gray-50">
                        <img src={ph.url} alt="Attached" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[8px] text-[#777] truncate block text-center font-mono mt-1">{ph.caption}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Letter Text body */}
              <div className="font-serif text-sm leading-relaxed text-[#2c3e50] whitespace-pre-wrap max-h-72 overflow-y-auto pr-2 my-6">
                {activeMessage.textContent}
              </div>

              {/* Voice Memo if present */}
              {activeMessage.voiceUrl && (
                <div className="bg-rose-50/50 border border-rose-100 p-4 flex items-center gap-3 max-w-md my-4">
                  <Volume2 className="w-5 h-5 text-rose-800" />
                  <audio src={activeMessage.voiceUrl} controls className="h-7 w-full shrink-0" />
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
                      className="px-5 py-2.5 bg-rose-800 text-white font-mono text-[9px] uppercase tracking-widest font-bold hover:bg-rose-900 flex items-center gap-2"
                    >
                      🎁 Open Surprise Keepsake
                    </button>
                  ) : activeMessage.surpriseContent.type === 'coupon' ? (
                    <div className="bg-amber-50 border border-amber-200 px-4 py-2 text-center text-xs font-mono">
                      SURPRISE CODE: <strong className="text-amber-900">{activeMessage.surpriseContent.value}</strong>
                    </div>
                  ) : (
                    <a
                      href={activeMessage.surpriseContent.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-gray-800 text-white font-mono text-[9px] uppercase tracking-widest font-bold hover:bg-gray-900"
                    >
                      {activeMessage.surpriseContent.label || 'Visit Surprise Link'}
                    </a>
                  )}
                </div>
              ) : <div />}

              <button
                onClick={() => setActiveMessage(null)}
                className="px-5 py-2 border border-gray-300 hover:bg-[#eee] text-xs font-semibold uppercase tracking-wider font-mono text-black"
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
