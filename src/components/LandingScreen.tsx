import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Heart, Gift, MessageSquare, ChevronDown, ChevronUp, Mail, ShieldCheck, FileText, Info, X } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { submitSiteReviewToCloud } from '../utils/cloudSync';
import { sanitizeText } from '../utils/security';

interface LandingScreenProps {
  onNavigateToExplore: () => void;
  onNavigateToWizard: (templateId: string) => void;
  onNavigateToDashboard: () => void;
  onNavigateToScrapbook?: () => void;
}

export default function LandingScreen({
  onNavigateToExplore,
  onNavigateToWizard,
  onNavigateToDashboard,
  onNavigateToScrapbook
}: LandingScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'about' | 'privacy' | 'terms' | null>(null);

  // Landing Feedback State
  const [landingFeedbackSender, setLandingFeedbackSender] = useState('');
  const [landingFeedbackText, setLandingFeedbackText] = useState('');
  const [landingFeedbackSubmitted, setLandingFeedbackSubmitted] = useState(false);

  const handleLandingSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landingFeedbackText.trim() || !landingFeedbackSender.trim()) return;

    submitSiteReviewToCloud({
      sender: sanitizeText(landingFeedbackSender),
      text: sanitizeText(landingFeedbackText)
    }).then(() => {
      setLandingFeedbackText('');
      setLandingFeedbackSender('');
      setLandingFeedbackSubmitted(true);
    });
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I ask my crush to be my partner without rejection?",
      a: "Crafting a digital surprise keepsake is a thoughtful, warm, and low-pressure way to express your feelings. You can build a romantic timeline with your favorite photos, background piano music, and a sweet message sealed in a virtual parchment envelope. It allows them to feel your sincerity in a beautiful, private moment."
    },
    {
      q: "How does the surprise photo puzzle work?",
      a: "When your recipient opens your shared gift link, your memory photo is split into interactive puzzle tiles. They tap tiles to solve the memory puzzle and unlock your heartfelt letter and background music ambiance."
    },
    {
      q: "How does a virtual birthday bash work?",
      a: "Your recipient receives a festive surprise complete with glowing birthday candles, celebratory confetti particle dust, and real-time instrumental birthday music. Tapping the candles lets them blow them out!"
    },
    {
      q: "How do I send a heartfelt wax-sealed letter card?",
      a: "Inside the Creation Wizard, enter your letter title and heartfelt message body. Your recipient receives a vintage parchment envelope with an animated wax seal that breaks open when tapped."
    },
    {
      q: "Is my card private and safe for only my recipient?",
      a: "Yes! Cards are stored on your device and encoded into unique portable gift links (?g=...). Only someone with your exact link can open and view your surprise card."
    },
    {
      q: "Can my recipient send a reply back to me?",
      a: "Yes! After unlocking and reading your letter, your recipient can write a sweet thank-you reply. Their reply is saved to your card dashboard so you can cherish their response."
    },
    {
      q: "How does background music and floating ambiance work?",
      a: "We synthesize real-time ambient web audio loops (such as Romantic Piano, Birthday Instrumental, or Acoustic Guitar) alongside floating star, confetti, or heart particle effects."
    },
    {
      q: "Is Memora free to create and share?",
      a: "Yes! Memora is 100% free to design, customize, and share unlimited digital gift surprises for your loved ones."
    }
  ];

  return (
    <div className="bg-background text-on-background font-body-lg antialiased overflow-x-hidden relative flex flex-col min-h-screen" id="landing-page">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10" />

      {/* Ambient background particles */}
      <ParticleBackground type="gold_dust" />

      {/* Top Fixed Header Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-primary/10 sticky top-0 flex justify-between items-center px-6 md:px-16 w-full z-50 h-20 transition-all duration-300" id="topAppBar">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/10">
            <Heart className="w-4.5 h-4.5 fill-current text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display text-2xl font-black tracking-tighter uppercase italic text-primary leading-none">Memora</span>
            <span className="hidden sm:inline text-[7.5px] text-on-surface-variant tracking-widest uppercase font-bold mt-1">Create moments. Keep memories.</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
          <button className="text-primary font-bold border-b border-primary pb-1 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <a href="#how-it-works" className="hover:text-primary transition-colors cursor-pointer">How It Works</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            id="landing-header-btn-studio"
            onClick={onNavigateToDashboard}
            className="hidden sm:flex border border-primary/20 text-primary px-4 py-2 rounded-xl font-label-caps text-[10px] tracking-widest hover:bg-primary/5 transition-all cursor-pointer"
          >
            Studio
          </button>
          <button
            id="landing-header-btn-create"
            onClick={onNavigateToExplore}
            className="btn-primary py-2.5 px-6 text-[10px] shadow-md"
          >
            Create Gift
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden py-16 md:py-0 border-b border-primary/10 bg-surface-container-low">
          <div className="absolute inset-0 z-0">
            <img
              alt="Cinematic background with floating polaroids"
              className="w-full h-full object-cover opacity-60 grayscale contrast-[1.1]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYNw4gggVTI7wvFMV9kzkHGKW6ABe0a8Mt6wGL0UyemTULr9ml-q9fN5rpzj75axnqFYdV8UsI9_yr9kl7zKq8ktGmGX0wdEN9OrjMPgQ6M2WWtm5_yJNKu8jKzVE13GT2zBcZwfAFk6s05f8Sy6Mf8R1CTEVBlkKadsG0QYcX2IB2bX5HzAKykETV1uyPCvMrYTvo97WOjMQQEt-q2IsIou8GupRari7P2vbNTe1AdYXu8AolSVfHNQ"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
          </div>

          <div className="relative z-10 text-center px-6 md:px-16 max-w-4xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-primary/10 text-primary border border-primary/10 rounded-full font-label-caps text-[9px] tracking-[0.25em] uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              Create moments. Keep memories.
            </span>
            
            <h1 className="font-display-lg text-5xl md:text-8xl text-primary mb-6 font-light tracking-[-0.03em] leading-[0.9] drop-shadow-sm">
              Sentiment <br/> <span className="italic font-serif font-normal">made</span> Beautiful
            </h1>
            <p className="font-body-lg text-on-surface-variant/90 mb-10 text-base md:text-xl max-w-xl leading-relaxed">
              Turn memories, emotions, and unspoken words into gorgeous interactive keepsakes designed to be treasured forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-150">
              <button
                id="landing-hero-btn-primary"
                onClick={onNavigateToExplore}
                className="btn-primary text-white font-label-caps text-xs px-8 py-4 rounded-xl tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.03] active:scale-[0.98]"
              >
                Create Something Special
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="landing-hero-btn-secondary"
                onClick={onNavigateToDashboard}
                className="border border-primary/20 bg-white/70 text-primary hover:bg-primary hover:text-white font-label-caps text-xs px-8 py-4 rounded-xl tracking-[0.2em] uppercase transition-all flex items-center justify-center cursor-pointer shadow-sm hover:scale-[1.03] active:scale-[0.98]"
              >
                Go To Studio
              </button>
            </div>
          </div>
        </section>

        {/* Featured Experiences Section */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-primary/10 pb-5 reveal">
            <div>
              <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] text-secondary font-bold">Curated Keepsakes</span>
              <h2 className="font-display text-3xl md:text-4xl text-on-background font-bold mt-1">Featured Experiences</h2>
            </div>
            <button onClick={onNavigateToExplore} className="font-label-caps text-[10px] text-primary hover:opacity-75 transition-all font-bold uppercase tracking-[0.2em] cursor-pointer">
              View Catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Virtual Birthday Bash */}
            <div
              onClick={() => onNavigateToWizard('birthday')}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer border border-primary/10 hover:border-primary/30 transition-all duration-500 bg-white shadow-lg hover:shadow-2xl reveal reveal-delay-1"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.75] group-hover:brightness-[0.85]"
                alt="Birthday bash card"
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#200b13]/90 via-[#200b13]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-white/80 mb-2 uppercase tracking-widest font-bold">Festive / Interactive</span>
                <h3 className="font-display text-2xl text-white mb-4 font-bold">Virtual Birthday Bash</h3>
                <div className="border border-white/30 text-white bg-white/10 backdrop-blur-sm self-start px-4 py-2 rounded-xl font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 shadow-md">
                  Begin Craft
                </div>
              </div>
            </div>

            {/* Anniversary Special */}
            <div
              onClick={() => onNavigateToWizard('anniversary')}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer border border-primary/10 hover:border-primary/30 transition-all duration-500 bg-white shadow-lg hover:shadow-2xl reveal reveal-delay-2"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.75] group-hover:brightness-[0.85]"
                alt="Anniversary keepsake"
                src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#200b13]/90 via-[#200b13]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-white/80 mb-2 uppercase tracking-widest font-bold">Romantic / Elegant</span>
                <h3 className="font-display text-2xl text-white mb-4 font-bold">Anniversary Special</h3>
                <div className="border border-white/30 text-white bg-white/10 backdrop-blur-sm self-start px-4 py-2 rounded-xl font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 shadow-md">
                  Begin Craft
                </div>
              </div>
            </div>

            {/* Perfect Proposal */}
            <div
              onClick={() => onNavigateToWizard('proposal')}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer border border-primary/10 hover:border-primary/30 transition-all duration-500 bg-white shadow-lg hover:shadow-2xl reveal reveal-delay-3"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.75] group-hover:brightness-[0.85]"
                alt="Proposal sequence"
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#200b13]/90 via-[#200b13]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-white/80 mb-2 uppercase tracking-widest font-bold">Cinematic / Emotional</span>
                <h3 className="font-display text-2xl text-white mb-4 font-bold">Perfect Proposal</h3>
                <div className="border border-white/30 text-white bg-white/10 backdrop-blur-sm self-start px-4 py-2 rounded-xl font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 shadow-md">
                  Begin Craft
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 md:px-16 bg-white/40 border-t border-b border-primary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal">
              <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] text-primary font-bold">Simple 3-Step Process</span>
              <h2 className="font-display text-3xl md:text-5xl text-on-background font-bold mt-2">How It Works</h2>
              <p className="text-xs text-on-surface-variant mt-2 max-w-lg mx-auto leading-relaxed">Create, customize, and deliver a personalized digital keepsake surprise in under two minutes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="glass-card p-8 border border-primary/10 relative flex flex-col justify-between group hover:scale-[1.01] transition-all duration-300 bg-white/80 reveal reveal-delay-1">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-3xl font-light text-primary/30 group-hover:text-primary transition-colors">01</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-on-background mb-3 font-bold">Design & Personalize</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                    Select a template (Birthday Bash, Proposal, Anniversary, or sealed Wax envelope). Input messages, upload photo memories, and pair with ambient audio tracks.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-primary/5">
                  <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Step 1 — Craft</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-card p-8 border border-primary/10 relative flex flex-col justify-between group hover:scale-[1.01] transition-all duration-300 bg-white/80 reveal reveal-delay-2">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-3xl font-light text-primary/30 group-hover:text-primary transition-colors">02</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <Gift className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-on-background mb-3 font-bold">Generate Sharing Link</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                    Click "Copy Link" to generate a secure portable gift URL. Share it with your recipient instantly via WhatsApp, Messenger, SMS, or Email.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-primary/5">
                  <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Step 2 — Share</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-card p-8 border border-primary/10 relative flex flex-col justify-between group hover:scale-[1.01] transition-all duration-300 bg-white/80 reveal reveal-delay-3">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-3xl font-light text-primary/30 group-hover:text-primary transition-colors">03</span>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-on-background mb-3 font-bold">Unveil & Get Reply</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                    Your recipient cracks the puzzle or breaks the seal, listens to the track, and responds with a heartfelt thank-you reply that is sent straight back to your studio dashboard!
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-primary/5">
                  <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Step 3 — Cherish</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 reveal">
              <button onClick={onNavigateToExplore} className="btn-primary py-3 px-8 text-xs font-label-caps uppercase tracking-widest font-bold shadow-md">
                Start Building Now →
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="py-24 px-6 md:px-16 max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] text-primary font-bold">Questions & Answers</span>
            <h2 className="font-display text-3xl md:text-5xl text-on-background font-bold mt-2">Frequently Asked Questions</h2>
            <p className="text-xs text-on-surface-variant mt-2">Everything you need to know about creating, customizing, and sharing digital gift surprises.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-primary/10 bg-white/60 backdrop-blur-sm rounded-2xl transition-all shadow-sm">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-primary/5 transition-colors focus:outline-none cursor-pointer rounded-2xl"
                  >
                    <span className="font-display text-base md:text-lg text-on-background font-bold">{faq.q}</span>
                    <div className="w-7 h-7 rounded-lg border border-primary/10 flex items-center justify-center text-primary bg-background shrink-0 shadow-sm">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-on-surface-variant font-body-lg leading-relaxed border-t border-primary/5 mt-2 bg-transparent animate-scale-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-primary/10 text-on-surface py-16 px-6 md:px-16 w-full relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-current text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-wider uppercase italic text-primary leading-none">Memora</span>
                <span className="text-[7.5px] text-primary/75 tracking-wider uppercase font-bold mt-1">Create moments. Keep memories.</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Archival digital keepsakes designed to convert feelings, letters, and memory timelines into timeless interactive experiences.
            </p>
          </div>

          {/* EXPERIENCES Col */}
          <div>
            <h4 className="font-label-caps text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-4">EXPERIENCES</h4>
            <ul className="space-y-2.5 text-xs text-on-surface-variant text-left">
              <li><button onClick={() => onNavigateToWizard('birthday')} className="hover:text-primary transition-colors cursor-pointer">Greeting Cards</button></li>
              {onNavigateToScrapbook && <li><button onClick={onNavigateToScrapbook} className="hover:text-primary font-bold text-primary transition-colors cursor-pointer">Scrapbook Studio</button></li>}
              <li><button onClick={() => onNavigateToWizard('proposal')} className="hover:text-primary transition-colors cursor-pointer">Perfect Proposal</button></li>
              <li><button onClick={() => onNavigateToWizard('puzzle')} className="hover:text-primary transition-colors cursor-pointer">Photo Puzzle Card</button></li>
            </ul>
          </div>

          {/* ABOUT US Col */}
          <div>
            <h4 className="font-label-caps text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-4">ABOUT US</h4>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li><button onClick={() => setActiveModal('about')} className="hover:text-primary transition-colors cursor-pointer">Know about us</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={() => setActiveModal('terms')} className="hover:text-primary transition-colors cursor-pointer">Terms & Conditions</button></li>
            </ul>
          </div>

          {/* CONTACT US Col */}
          <div className="space-y-4">
            <h4 className="font-label-caps text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-2">CONTACT US</h4>
            <div className="space-y-2.5 text-xs text-on-surface-variant">
              <p className="leading-relaxed">For complaints, concerns, or feedback:</p>
              <a href="mailto:gholapabhishek9@gmail.com" className="font-mono text-primary font-bold block hover:underline flex items-center gap-1.5 mb-4">
                <Mail className="w-3.5 h-3.5" />
                gholapabhishek9@gmail.com
              </a>
            </div>

            {/* Compact Footer Feedback Form */}
            <div className="border-t border-primary/10 pt-4 mt-2">
              <h5 className="font-label-caps text-[9px] uppercase tracking-wider font-bold text-on-background mb-2">Share Feedback / Review</h5>
              {landingFeedbackSubmitted ? (
                <div className="py-2 px-3 bg-primary/5 border border-primary/10 rounded-xl text-center">
                  <p className="text-[10px] text-green-700 italic">✓ Review sent privately to Admin!</p>
                </div>
              ) : (
                <form onSubmit={handleLandingSubmitFeedback} className="space-y-2">
                  <input
                    type="text"
                    value={landingFeedbackSender}
                    onChange={(e) => setLandingFeedbackSender(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b border-primary/20 py-1.5 text-[11px] focus:outline-none focus:border-primary text-on-background font-sans"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={landingFeedbackText}
                      onChange={(e) => setLandingFeedbackText(e.target.value)}
                      placeholder="Review (Max 200 chars)"
                      maxLength={200}
                      className="flex-grow bg-transparent border-b border-primary/20 py-1.5 text-[11px] focus:outline-none focus:border-primary text-on-background font-sans"
                      required
                    />
                    <button
                      type="submit"
                      className="btn-primary py-1 px-3 text-[9px] uppercase tracking-widest font-bold font-sans shadow-sm"
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.15em] font-mono text-on-surface-variant/70">
          <div>© 2026 Memora. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Designed for timeless emotional connection.</div>
        </div>
      </footer>

      {/* LEGAL & ABOUT MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#200b13]/60 backdrop-blur-md animate-fade-in animate-scale-in">
          <div className="bg-background border border-primary/10 p-6 md:p-10 w-full max-w-2xl rounded-3xl relative shadow-2xl max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Info className="w-5 h-5" />
                  <h3 className="font-display-lg text-2xl font-bold text-on-background">Know About Us — Memora</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                  Memora was born from a simple belief: in a world dominated by instant messages and temporary social posts, true emotion deserves a permanent, beautiful form.
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                  Our platform empowers creators to craft archival digital keepsakes—combining handwritten letter typography, interactive photo puzzles, and synthesized audio ambiances into unforgettable experiences.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-display-lg text-2xl font-bold text-on-background">Privacy Policy & Grievance Redressal</h3>
                </div>
                <div className="text-xs text-on-surface-variant leading-relaxed space-y-3 font-body-lg">
                  <p><strong>1. Information Collection & Storage:</strong> Memora prioritizes user privacy. Creations built on our platform are stored on the creator's local device and rendered through unique encoded URL payloads.</p>
                  <p><strong>2. Recipient Replies:</strong> Thank you messages and replies submitted by recipients are encrypted and stored solely for the creator and recipient of that card.</p>
                  <p><strong>3. Grievance Redressal Officer:</strong> In compliance with applicable digital privacy standards, for any complaints, content concerns, or grievance redressal, please write directly to <strong>gholapabhishek9@gmail.com</strong>.</p>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-display-lg text-2xl font-bold text-on-background">Terms & Conditions of Use</h3>
                </div>
                <div className="text-xs text-on-surface-variant leading-relaxed space-y-3 font-body-lg">
                  <p><strong>1. Acceptance of Terms:</strong> By creating or viewing experiences on Memora, you agree to comply with these terms of use.</p>
                  <p><strong>2. User Conduct:</strong> Users agree not to create, upload, or transmit any unlawful, offensive, or harassing content through digital keepsakes.</p>
                  <p><strong>3. Intellectual Property:</strong> Users retain ownership of their personal photographs and handwritten messages created on the platform.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export const LandingAnims = () => (
  <style>{`
    .animate-fade-in {
      animation: fadeInUp 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
      opacity: 0;
      transform: translateY(12px);
    }
    .delay-75 { animation-delay: 150ms; }
    .delay-150 { animation-delay: 300ms; }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.85s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.85s cubic-bezier(0.215, 0.61, 0.355, 1);
      will-change: transform, opacity;
    }
    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-delay-1 { transition-delay: 80ms; }
    .reveal-delay-2 { transition-delay: 160ms; }
    .reveal-delay-3 { transition-delay: 240ms; }
  `}</style>
);
