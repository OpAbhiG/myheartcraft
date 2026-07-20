import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Volume2, VolumeX, Gift, Send, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Creation } from '../types';
import ParticleBackground from './ParticleBackground';
import InteractiveExperiences from './InteractiveExperiences';
import ambientMusic from '../utils/audio';

interface RecipientFlowProps {
  creation: Creation;
  onExit: () => void;
  onUpdateCreation?: (updatedCreation: Creation) => void;
}

export default function RecipientFlow({
  creation,
  onExit,
  onUpdateCreation
}: RecipientFlowProps) {
  const [phase, setPhase] = useState<'loading' | 'intro' | 'play'>('loading');
  const [isLocked, setIsLocked] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  
  // Reply box state
  const [replyText, setReplyText] = useState('');
  const [replySender, setReplySender] = useState(creation.recipientName);
  const [replySubmitted, setReplySubmitted] = useState(false);

  // Phase A to B Auto Transition after 2.5 seconds
  useEffect(() => {
    if (phase === 'loading') {
      const timer = setTimeout(() => {
        setPhase('intro');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleStartSurprise = () => {
    setPhase('play');
    // Trigger audio pad start
    if (creation.musicTrack !== 'none') {
      ambientMusic.start(creation.musicTrack);
      setAudioPlaying(true);
    }
  };

  const handleToggleAudio = () => {
    if (audioPlaying) {
      ambientMusic.stop();
      setAudioPlaying(false);
    } else {
      ambientMusic.start(creation.musicTrack);
      setAudioPlaying(true);
    }
  };

  const handleLockSolved = () => {
    setIsLocked(false);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replySender.trim()) return;

    const newReply = {
      sender: replySender,
      text: replyText,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedCreation: Creation = {
      ...creation,
      replies: [...(creation.replies || []), newReply]
    };

    if (onUpdateCreation) {
      onUpdateCreation(updatedCreation);
    }
    setReplySubmitted(true);
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      ambientMusic.stop();
    };
  }, []);

  // Theme palettes matching creation options
  const colorThemes: { [key: string]: { bg: string; text: string; cardBg: string; buttonBg: string; border: string } } = {
    rose_gold: {
      bg: 'bg-background',
      text: 'text-[#8a4d4e]',
      cardBg: 'bg-background border-primary/20',
      buttonBg: 'bg-primary text-background',
      border: 'border-primary/20'
    },
    amethyst: {
      bg: 'bg-background',
      text: 'text-[#66568a]',
      cardBg: 'bg-background border-primary/20',
      buttonBg: 'bg-primary text-background',
      border: 'border-primary/20'
    },
    golden_twilight: {
      bg: 'bg-background',
      text: 'text-[#735c00]',
      cardBg: 'bg-background border-primary/20',
      buttonBg: 'bg-primary text-background',
      border: 'border-primary/20'
    },
    emerald: {
      bg: 'bg-background',
      text: 'text-[#047857]',
      cardBg: 'bg-background border-primary/20',
      buttonBg: 'bg-primary text-background',
      border: 'border-primary/20'
    }
  };

  const activeTheme = colorThemes[creation.themeColor] || colorThemes.rose_gold;

  return (
    <div className={`min-h-screen ${activeTheme.bg} flex flex-col justify-center items-center overflow-x-hidden p-6 relative antialiased font-sans`} id="recipient-flow">
      
      {/* Audio volume control widget */}
      {phase === 'play' && creation.musicTrack !== 'none' && (
        <button
          id="btn-recipient-audio-toggle"
          onClick={handleToggleAudio}
          className="fixed top-6 right-6 z-50 p-3 rounded-none bg-background shadow-none border border-primary/20 text-primary hover:bg-primary/5 transition-all"
          title={audioPlaying ? 'Mute Music' : 'Play Music'}
        >
          {audioPlaying ? (
            <Volume2 className="w-4 h-4 text-primary animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-on-surface-variant" />
          )}
        </button>
      )}

      {/* Primary exit preview button for creators */}
      <button
        id="btn-recipient-exit-preview"
        onClick={onExit}
        className="fixed top-6 left-6 z-50 py-2.5 px-5 rounded-none bg-background shadow-none border border-primary/20 text-[9px] font-bold font-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all"
      >
        Exit Keepsake
      </button>

      {/* Particle Atmosphere overlay */}
      {phase === 'play' && (
        <ParticleBackground type={creation.particles} />
      )}

      {/* PHASE A: LOADING KEEPSAKE SCREEN */}
      {phase === 'loading' && (
        <div className="text-center space-y-6 animate-pulse z-10" id="phase-loading">
          <div className="w-14 h-14 border border-primary flex items-center justify-center mx-auto bg-background">
            <Heart className="w-6 h-6 text-primary fill-current" />
          </div>
          <div>
            <h1 className="font-display-lg text-2xl uppercase tracking-tight font-light text-on-background">Crafting something special...</h1>
            <p className="font-body-lg text-on-surface-variant text-xs mt-1">Please wait while your digital surprise loads.</p>
          </div>
        </div>
      )}

      {/* PHASE B: INTRO SURPRISE INVITATION SCREEN */}
      {phase === 'intro' && (
        <div className="text-center max-w-lg mx-auto space-y-8 z-10 p-8 md:p-12 border border-primary bg-background shadow-none animate-fade-in" id="phase-intro">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary/5 text-primary border border-primary/20 font-label-caps text-[9px] tracking-[0.15em] uppercase mb-4 font-bold">
              <Sparkles className="w-3 h-3 text-primary" />
              Surprise Delivery
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl font-light tracking-tight text-on-background leading-tight">
              Hey {creation.recipientName}...
            </h1>
            <p className="font-display-lg text-lg text-on-surface-variant mt-4 font-light italic">
              {creation.creatorName} created something special for you.
            </p>
          </div>

          <div className="h-[1px] bg-primary/20 w-1/4 mx-auto" />

          <p className="font-body-lg text-on-surface-variant text-xs leading-relaxed max-w-md mx-auto">
            A custom interactive digital keepsake, personalized memory scrapbook, and a sweet heartfelt letter are waiting inside.
          </p>

          <button
            id="btn-open-keepsake-surprise"
            onClick={handleStartSurprise}
            className="btn-primary py-3.5 px-10 rounded-none font-label-caps tracking-widest font-bold text-[10px] uppercase transition-all w-full flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            Open Your Surprise
          </button>
        </div>
      )}

      {/* PHASE C: EXPERIENCE PLAYBACK ACTIVE */}
      {phase === 'play' && (
        <div className="w-full max-w-2xl mx-auto z-10 flex flex-col justify-center items-center py-12" id="phase-play">
          
          {/* LOCK STATE: INTERACTIVE GAME REQUIRED */}
          {isLocked ? (
            <div className="w-full animate-fade-in" id="keepsake-locked">
              <InteractiveExperiences
                type={creation.interactiveElement}
                imageUrl={creation.images?.[0]?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'}
                recipientName={creation.recipientName}
                onComplete={handleLockSolved}
              />
            </div>
          ) : (
            // UNLOCKED STATE: THE KEEPSAKE REVEAL
            <div className="w-full space-y-12 animate-fade-in" id="keepsake-unlocked">
              
              {/* Unlocked Announcement Callout */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 border border-green-700 flex items-center justify-center mx-auto text-green-700 bg-background">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="font-display-lg text-2xl uppercase tracking-wider font-light text-on-background">Unlocked!</h2>
                <p className="text-[9px] text-on-surface-variant uppercase font-label-caps tracking-[0.18em] font-bold">Unfolding your customized memories timeline</p>
              </div>

              {/* 1. MEMORY VAULT IMAGES TIMELINE */}
              {(creation.images?.length || 0) > 0 && (
                <div className="p-6 md:p-8 border border-primary bg-background shadow-none relative" id="recipient-images-timeline">
                  
                  <div className="text-center mb-6">
                    <span className="font-label-caps text-[9px] text-primary tracking-[0.15em] uppercase font-bold">Keepsake Scrapbook</span>
                    <h3 className="font-display-lg text-xl text-on-background uppercase tracking-wider font-light mt-1">Our Beautiful Moments</h3>
                  </div>

                  {/* Polaroid Frame */}
                  <div className="relative aspect-[4/3] w-full bg-background p-4 pb-12 border border-primary/20 rounded-none shadow-none" id="polaroid-view">
                    <img
                      src={creation.images?.[activePhotoIdx]?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'}
                      alt="Keepsake memories"
                      className="w-full h-full object-cover rounded-none grayscale"
                    />
                    <div className="absolute bottom-3 inset-x-4 text-center">
                      <p className="font-handwritten text-primary font-bold text-sm md:text-base tracking-wide italic">
                        "{creation.images?.[activePhotoIdx]?.caption || 'A special moment together'}"
                      </p>
                    </div>
                  </div>

                  {/* Carousel navigation dots */}
                  {(creation.images?.length || 0) > 1 && (
                    <div className="flex items-center justify-between mt-8" id="polaroid-navigation">
                      <button
                        id="btn-polaroid-prev"
                        onClick={() => setActivePhotoIdx((activePhotoIdx - 1 + creation.images.length) % creation.images.length)}
                        className="p-2 rounded-none border border-primary/20 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex gap-1.5">
                        {creation.images?.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 rounded-none transition-all ${
                              activePhotoIdx === i ? 'bg-primary w-4' : 'bg-primary/20 w-1.5'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        id="btn-polaroid-next"
                        onClick={() => setActivePhotoIdx((activePhotoIdx + 1) % creation.images.length)}
                        className="p-2 rounded-none border border-primary/20 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* 2. THE HEARTFELT PERSONAL DIGITAL LETTER */}
              <div className="p-8 md:p-14 border border-primary bg-background shadow-none space-y-6 relative" id="recipient-letter">
                <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-primary/20" />
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-primary/20" />

                <div className="text-center">
                  <Heart className="w-6 h-6 fill-current text-primary mx-auto mb-4" />
                  <h3 className="font-display-lg text-2xl md:text-3xl text-on-background font-light tracking-tight leading-tight uppercase">
                    {creation.messageTitle}
                  </h3>
                </div>

                <div className="h-[1px] bg-primary/20 w-1/4 mx-auto my-4" />

                <p className="font-body-lg text-on-surface-variant text-xs leading-relaxed text-left whitespace-pre-wrap pl-4 md:pl-6 border-l-2 border-primary/30">
                  {creation.messageBody}
                </p>

                <div className="text-right pt-4">
                  <p className="font-handwritten text-base text-primary italic font-bold">
                    With all my love,
                  </p>
                  <p className="font-display-lg text-lg text-on-background uppercase font-bold mt-1 pr-1">
                    {creation.creatorName}
                  </p>
                </div>
              </div>

              {/* 3. RECIPIENT SWEET REPLY SUBMISSION FORM */}
              <div className="p-6 md:p-8 border border-primary bg-background shadow-none relative" id="recipient-reply-form">
                
                {replySubmitted ? (
                  <div className="text-center py-6 space-y-3" id="reply-success">
                    <div className="w-10 h-10 border border-green-700 flex items-center justify-center mx-auto text-green-700 bg-background">
                      <Send className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-on-background">Reply Sent to {creation.creatorName}!</h4>
                    <p className="text-[11px] text-on-surface-variant">Your heartfelt reply has been written to the creation's dashboard successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReply} className="space-y-4">
                    <div className="text-center mb-4">
                      <MessageCircle className="w-5 h-5 text-primary mx-auto mb-1" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-on-background">Send a sweet reply back</h4>
                      <p className="text-[10px] text-on-surface-variant">Let them know how much this beautiful creation meant to you.</p>
                    </div>

                    <div className="flex flex-col group">
                      <label className="text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Your Name</label>
                      <input
                        id="reply-sender-name"
                        type="text"
                        value={replySender}
                        onChange={(e) => setReplySender(e.target.value)}
                        className="w-full bg-transparent border-b border-primary/20 py-1.5 text-xs focus:outline-none focus:border-primary font-sans"
                        required
                      />
                    </div>

                    <div className="flex flex-col group">
                      <label className="text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Heartfelt Reply Message</label>
                      <textarea
                        id="reply-message-body"
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Say something sweet..."
                        className="w-full bg-transparent border border-primary/20 rounded-none p-3 focus:outline-none focus:border-primary text-xs leading-relaxed font-body-lg"
                        required
                      />
                    </div>

                    <button
                      id="btn-submit-reply"
                      type="submit"
                      className="btn-primary py-2.5 px-6 rounded-none font-label-caps text-[9px] tracking-widest uppercase font-bold w-full flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Reply
                    </button>
                  </form>
                )}

              </div>

            </div>
          )}

        </div>
      )}

      {/* Embedded Handwritten Custom Typography in Document */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
        .font-handwritten {
          font-family: 'Caveat', cursive, sans-serif;
        }
      `}</style>

    </div>
  );
}
