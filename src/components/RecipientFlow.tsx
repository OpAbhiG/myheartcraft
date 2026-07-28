import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Volume2, VolumeX, Gift, Send, MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Creation } from '../types';
import ParticleBackground from './ParticleBackground';
import InteractiveExperiences from './InteractiveExperiences';
import ambientMusic from '../utils/audio';
import { sanitizeText } from '../utils/security';

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

  // Private admin feedback state
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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
      sender: sanitizeText(replySender),
      text: sanitizeText(replyText),
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

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const newFeedback = {
      text: sanitizeText(feedbackText),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedCreation: Creation = {
      ...creation,
      feedback: [...(creation.feedback || []), newFeedback]
    };

    if (onUpdateCreation) {
      onUpdateCreation(updatedCreation);
    }
    setFeedbackText('');
    setFeedbackSubmitted(true);
  };

  useEffect(() => {
    return () => {
      ambientMusic.stop();
    };
  }, []);

  // Theme styles supporting the new luxurious color system
  const colorThemes: { [key: string]: { bg: string; text: string; accent: string; highlight: string } } = {
    rose_gold: {
      bg: 'from-[#fff8f8] to-[#fff1f3]',
      text: 'text-[#8d3c59]',
      accent: 'border-[#ebdce1]',
      highlight: '#8d3c59'
    },
    amethyst: {
      bg: 'from-[#f9f7fc] to-[#f3effa]',
      text: 'text-[#66568a]',
      accent: 'border-[#e8e2f4]',
      highlight: '#66568a'
    },
    golden_twilight: {
      bg: 'from-[#fffbf5] to-[#fff7e6]',
      text: 'text-[#856404]',
      accent: 'border-[#fbf2d5]',
      highlight: '#735c00'
    },
    emerald: {
      bg: 'from-[#f4fbf7] to-[#e6f7ee]',
      text: 'text-[#065f46]',
      accent: 'border-[#d1fae5]',
      highlight: '#047857'
    }
  };

  const activeTheme = colorThemes[creation.themeColor] || colorThemes.rose_gold;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${activeTheme.bg} flex flex-col justify-center items-center overflow-x-hidden p-6 relative antialiased font-sans`} id="recipient-flow">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10 opacity-[0.04]" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10 opacity-[0.04]" />

      {/* Audio volume control widget */}
      {phase === 'play' && creation.musicTrack !== 'none' && (
        <button
          id="btn-recipient-audio-toggle"
          onClick={handleToggleAudio}
          className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white shadow-md border border-primary/10 text-primary hover:bg-primary/5 transition-all cursor-pointer"
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
        className="fixed top-6 left-6 z-50 py-2.5 px-5 rounded-xl bg-white shadow-md border border-primary/10 text-[9px] font-bold font-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all cursor-pointer"
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
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl border border-primary/10 flex items-center justify-center mx-auto text-primary">
            <Heart className="w-6 h-6 text-primary fill-current" />
          </div>
          <div>
            <h1 className="font-display-lg text-2xl uppercase tracking-widest font-light text-on-background">Crafting something special...</h1>
            <p className="font-body-lg text-on-surface-variant text-xs mt-2">Preparing your personal digital keepsake.</p>
          </div>
        </div>
      )}

      {/* PHASE B: INTRO SURPRISE INVITATION SCREEN */}
      {phase === 'intro' && (
        <div className="text-center max-w-lg mx-auto space-y-8 z-10 p-10 md:p-14 border border-primary/10 bg-white rounded-3xl shadow-2xl animate-scale-in" id="phase-intro">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/10 rounded-full font-label-caps text-[9px] tracking-[0.15em] uppercase mb-4 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              Surprise Delivery
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl font-bold tracking-tight text-on-background leading-tight">
              Hey {creation.recipientName}...
            </h1>
            <p className="font-display text-lg text-on-surface-variant mt-4 font-light italic">
              {creation.creatorName} created something special for you.
            </p>
          </div>

          <div className="h-[1px] bg-primary/10 w-1/4 mx-auto" />

          <p className="font-body-lg text-on-surface-variant text-xs leading-relaxed max-w-md mx-auto">
            A custom interactive digital keepsake, personalized memory scrapbook, and a sweet heartfelt letter are waiting inside.
          </p>

          <button
            id="btn-open-keepsake-surprise"
            onClick={handleStartSurprise}
            className="btn-primary py-3.5 px-10 rounded-xl font-label-caps tracking-widest font-bold text-[10px] uppercase transition-all w-full flex items-center justify-center gap-2 shadow-lg"
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
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-green-500/20 flex items-center justify-center mx-auto text-green-600">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-on-background">Surprise Unlocked!</h2>
                <p className="text-[9.5px] text-on-surface-variant uppercase font-label-caps tracking-[0.2em] font-bold">Unfolding your customized memories timeline</p>
              </div>

              {/* 1. MEMORY VAULT IMAGES TIMELINE */}
              {(creation.images?.length || 0) > 0 && (
                <div className="p-8 md:p-10 border border-primary/10 bg-white rounded-3xl shadow-xl relative" id="recipient-images-timeline">
                  
                  <div className="text-center mb-8">
                    <span className="font-label-caps text-[9px] text-primary tracking-[0.15em] uppercase font-bold">Keepsake Scrapbook</span>
                    <h3 className="font-display text-2xl text-on-background tracking-tight font-bold mt-1">Our Beautiful Moments</h3>
                  </div>

                  {/* Polaroid Frame Container */}
                  <div className="relative aspect-[4/3] w-full max-w-lg mx-auto bg-[#fbfbf9] p-4 pb-14 border border-gray-200/60 rounded-2xl shadow-2xl transform rotate-[-1deg]" id="polaroid-view">
                    <img
                      src={creation.images?.[activePhotoIdx]?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'}
                      alt="Keepsake memories"
                      className="w-full h-full object-cover rounded-lg border border-gray-100 shadow-inner"
                    />
                    <div className="absolute bottom-4 inset-x-4 text-center">
                      <p className="font-handwritten text-primary font-bold text-lg md:text-xl tracking-wide">
                        "{creation.images?.[activePhotoIdx]?.caption || 'A special moment together'}"
                      </p>
                    </div>
                  </div>

                  {/* Carousel navigation dots */}
                  {(creation.images?.length || 0) > 1 && (
                    <div className="flex items-center justify-between mt-10 max-w-lg mx-auto" id="polaroid-navigation">
                      <button
                        id="btn-polaroid-prev"
                        onClick={() => setActivePhotoIdx((activePhotoIdx - 1 + creation.images.length) % creation.images.length)}
                        className="p-2.5 rounded-xl border border-primary/10 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex gap-2">
                        {creation.images?.map((_, i) => (
                          <span
                            key={i}
                            className={`h-2 rounded-full transition-all ${
                              activePhotoIdx === i ? 'bg-primary w-5' : 'bg-primary/20 w-2'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        id="btn-polaroid-next"
                        onClick={() => setActivePhotoIdx((activePhotoIdx + 1) % creation.images.length)}
                        className="p-2.5 rounded-xl border border-primary/10 text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* 2. THE HEARTFELT PERSONAL DIGITAL LETTER */}
              <div className="p-8 md:p-14 border border-primary/10 bg-white rounded-3xl shadow-xl space-y-6 relative overflow-hidden" id="recipient-letter">
                {/* Vintage overlay texture */}
                <div className="absolute inset-0 bg-[#FAF9F5] opacity-30 pointer-events-none" />
                
                <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-primary/20 rounded-tl-lg" />
                <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />

                <div className="text-center relative z-10">
                  <Heart className="w-8 h-8 fill-current text-primary mx-auto mb-4 animate-pulse" />
                  <h3 className="font-display text-2xl md:text-3xl text-on-background font-bold tracking-tight uppercase">
                    {creation.messageTitle}
                  </h3>
                </div>

                <div className="h-[1px] bg-primary/10 w-1/4 mx-auto my-4 relative z-10" />

                <p className="font-body-lg text-on-surface-variant text-sm leading-relaxed text-left whitespace-pre-wrap pl-5 md:pl-7 border-l-3 border-primary/30 relative z-10 italic">
                  {creation.messageBody}
                </p>

                <div className="text-right pt-6 relative z-10">
                  <p className="font-handwritten text-xl text-primary font-bold">
                    With all my love,
                  </p>
                  <p className="font-display text-lg text-on-background font-bold mt-1 pr-1 tracking-wider">
                    {creation.creatorName}
                  </p>
                </div>
              </div>

              {/* 3. RECIPIENT SWEET REPLY SUBMISSION FORM */}
              <div className="p-8 border border-primary/10 bg-white rounded-3xl shadow-xl relative" id="recipient-reply-form">
                
                {replySubmitted ? (
                  <div className="text-center py-8 space-y-4" id="reply-success">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto text-green-700">
                      <Check className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-on-background">Reply Sent to {creation.creatorName}!</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">Your heartfelt response has been written directly to the studio dashboard logs.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReply} className="space-y-5">
                    <div className="text-center mb-4">
                      <MessageCircle className="w-6 h-6 text-primary mx-auto mb-1.5 animate-bounce" />
                      <h4 className="font-display text-lg font-bold text-on-background">Send a sweet reply back</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Let them know how much this beautiful keepsake meant to you.</p>
                    </div>

                    <div className="flex flex-col group">
                      <label className="text-[9px] font-bold uppercase text-on-surface-variant tracking-widest mb-1.5 pl-1">Your Name</label>
                      <input
                        id="reply-sender-name"
                        type="text"
                        value={replySender}
                        onChange={(e) => setReplySender(e.target.value)}
                        className="w-full bg-primary/5 border border-primary/10 rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-primary font-sans"
                        required
                      />
                    </div>

                    <div className="flex flex-col group">
                      <label className="text-[9px] font-bold uppercase text-on-surface-variant tracking-widest mb-1.5 pl-1">Heartfelt Reply Message</label>
                      <textarea
                        id="reply-message-body"
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Say something sweet..."
                        className="w-full bg-primary/5 border border-primary/10 rounded-xl p-4 focus:outline-none focus:border-primary text-xs leading-relaxed font-body-lg"
                        required
                      />
                    </div>

                    <button
                      id="btn-submit-reply"
                      type="submit"
                      className="btn-primary py-3 px-6 rounded-xl font-label-caps text-[9px] tracking-widest uppercase font-bold w-full flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Reply
                    </button>
                  </form>
                )}

                {/* Private Feedback to Admin */}
                <div className="border-t border-primary/10 pt-6 mt-6 text-left">
                  {feedbackSubmitted ? (
                    <div className="text-center py-4 bg-primary/5 border border-primary/10 rounded-xl animate-fade-in" id="feedback-success">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Review Sent Privately to Admin!</p>
                      <p className="text-[9px] text-on-surface-variant mt-1">Thank you for sharing your experience with us.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="space-y-3">
                      <div>
                        <h5 className="font-bold text-[10px] uppercase tracking-wider text-on-background">Share Platform Review</h5>
                        <p className="text-[9px] text-on-surface-variant mt-0.5">Write a simple, short review. This is sent privately to the administrators.</p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          id="feedback-input-text"
                          type="text"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="What did you think of Memora? (Max 200 chars)"
                          maxLength={200}
                          className="flex-grow bg-primary/5 border border-primary/10 rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-primary font-sans text-on-background"
                          required
                        />
                        <button
                          id="btn-submit-feedback"
                          type="submit"
                          className="btn-primary py-2 px-4 text-[9px] font-bold tracking-widest uppercase font-sans shadow-sm"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Embedded Handwritten Typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
        .font-handwritten {
          font-family: 'Caveat', cursive, sans-serif;
        }
      `}</style>
    </div>
  );
}
