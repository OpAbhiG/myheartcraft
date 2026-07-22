import React, { useState } from 'react';
import { ArrowRight, Sparkles, Heart, Gift, MessageSquare, ChevronDown, ChevronUp, Mail, ShieldCheck, FileText, Info, X } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

interface LandingScreenProps {
  onNavigateToExplore: () => void;
  onNavigateToWizard: (templateId: string) => void;
  onNavigateToDashboard: () => void;
}

export default function LandingScreen({
  onNavigateToExplore,
  onNavigateToWizard,
  onNavigateToDashboard
}: LandingScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'about' | 'privacy' | 'terms' | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I ask my crush to be my girlfriend or boyfriend without getting rejected?",
      a: "Crafting a digital surprise keepsake is a thoughtful, low-pressure way to express your feelings. You can build a romantic timeline with your favorite photos, background piano music, and a sweet message sealed in a virtual parchment envelope. It allows them to feel your sincerity in a beautiful, private moment."
    },
    {
      q: "How does the surprise photo puzzle work?",
      a: "When your recipient opens your shared gift link, your memory photo is split into interactive puzzle tiles. They tap adjacent tiles to solve the memory puzzle and unlock your heartfelt letter and background music ambiance."
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
      q: "Is Wishora free to create and share?",
      a: "Yes! Wishora is 100% free to design, customize, and share unlimited digital gift surprises for your loved ones."
    }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden relative flex flex-col min-h-screen" id="landing-page">
      
      {/* Ambient background particles */}
      <ParticleBackground type="gold_dust" />

      {/* Top Fixed Header Bar */}
      <header className="bg-background/95 backdrop-blur-md border-b border-primary/20 sticky top-0 flex justify-between items-center px-4 md:px-16 w-full z-50 h-20 transition-all duration-300" id="topAppBar">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 border border-primary flex items-center justify-center text-primary bg-background">
            <Heart className="w-4 h-4 fill-current text-primary" />
          </div>
          <span className="font-display-lg text-xl md:text-2xl font-black tracking-tighter uppercase italic text-primary">Wishora</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold opacity-80">
          <button onClick={onNavigateToExplore} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Experiences</button>
          <button onClick={onNavigateToDashboard} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Creator Studio</button>
          <a href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">How It Works</a>
          <a href="#faq-section" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">FAQ</a>
          <button onClick={() => setActiveModal('about')} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">About Us</button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            id="landing-header-btn-studio"
            onClick={onNavigateToDashboard}
            className="hidden sm:flex border border-primary/80 text-primary px-4 py-2 rounded-none font-label-caps text-[10px] tracking-widest hover:bg-primary hover:text-background transition-all"
          >
            Studio
          </button>
          <button
            id="landing-header-btn-create"
            onClick={onNavigateToExplore}
            className="btn-primary py-2 px-5 text-[10px]"
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-none font-label-caps text-[9px] tracking-[0.25em] uppercase mb-6">
              <Sparkles className="w-3 h-3 text-primary" />
              Gifting re-imagined as form
            </span>
            
            <h1 className="font-display-lg text-4xl md:text-8xl text-primary mb-6 font-light tracking-[-0.04em] leading-[0.85] drop-shadow-sm">
              Stillness <br/> <span className="italic font-normal">as</span> Sentiment
            </h1>
            <p className="font-body-lg text-primary/85 mb-8 text-base md:text-xl max-w-xl">
              Turn memories, emotions, and unspoken words into beautiful digital experiences designed to be treasured forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-150">
              <button
                id="landing-hero-btn-primary"
                onClick={onNavigateToExplore}
                className="btn-primary text-background bg-primary hover:bg-background hover:text-primary font-label-caps text-xs px-8 py-4 rounded-none tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 border border-primary"
              >
                Create Something Special
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="landing-hero-btn-secondary"
                onClick={onNavigateToDashboard}
                className="border border-primary text-primary hover:bg-primary hover:text-background font-label-caps text-xs px-8 py-4 rounded-none tracking-[0.2em] uppercase transition-all flex items-center justify-center"
              >
                Go To Studio
              </button>
            </div>
          </div>
        </section>

        {/* Featured Experiences Section */}
        <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-primary/20 pb-4">
            <div>
              <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] text-on-surface-variant font-bold">Curated Catalog</span>
              <h2 className="font-display-lg text-3xl md:text-4xl text-on-background font-light mt-1">Featured Experiences</h2>
            </div>
            <button onClick={onNavigateToExplore} className="font-label-caps text-[10px] text-primary hover:opacity-75 transition-all font-bold uppercase tracking-[0.2em]">
              View All Catalog →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Virtual Birthday Bash */}
            <div
              onClick={() => onNavigateToWizard('birthday')}
              className="group relative rounded-none overflow-hidden aspect-[4/5] cursor-pointer border border-primary/20 hover:border-primary transition-all duration-500 bg-[#E8E6E3]"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-[0.9]"
                alt="Birthday bash card"
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-background mb-2 opacity-80 uppercase tracking-widest font-bold">Festive / Interactive</span>
                <h3 className="font-display-lg text-2xl text-background mb-4 font-light">Virtual Birthday Bash</h3>
                <div className="border border-background text-background bg-transparent self-start px-4 py-1.5 rounded-none font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Begin Craft
                </div>
              </div>
            </div>

            {/* Anniversary Special */}
            <div
              onClick={() => onNavigateToWizard('anniversary')}
              className="group relative rounded-none overflow-hidden aspect-[4/5] cursor-pointer border border-primary/20 hover:border-primary transition-all duration-500 bg-[#E8E6E3]"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-[0.9]"
                alt="Anniversary keepsake"
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-background mb-2 opacity-80 uppercase tracking-widest font-bold">Romantic / Elegant</span>
                <h3 className="font-display-lg text-2xl text-background mb-4 font-light">Anniversary Special</h3>
                <div className="border border-background text-background bg-transparent self-start px-4 py-1.5 rounded-none font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Begin Craft
                </div>
              </div>
            </div>

            {/* Perfect Proposal */}
            <div
              onClick={() => onNavigateToWizard('proposal')}
              className="group relative rounded-none overflow-hidden aspect-[4/5] cursor-pointer border border-primary/20 hover:border-primary transition-all duration-500 bg-[#E8E6E3]"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-[0.9]"
                alt="Proposal sequence"
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-background mb-2 opacity-80 uppercase tracking-widest font-bold">Cinematic / Emotional</span>
                <h3 className="font-display-lg text-2xl text-background mb-4 font-light">Perfect Proposal</h3>
                <div className="border border-background text-background bg-transparent self-start px-4 py-1.5 rounded-none font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Begin Craft
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 md:px-16 max-w-7xl mx-auto border-t border-primary/10 bg-surface-container/50">
          <div className="text-center mb-16">
            <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] text-primary font-bold">Simple 3-Step Surprise</span>
            <h2 className="font-display-lg text-3xl md:text-5xl text-on-background font-light mt-2">How It Works</h2>
            <p className="text-xs text-on-surface-variant mt-2 max-w-lg mx-auto">Create, customize, and deliver an unforgettable digital gift keepsake in under 2 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-card p-8 border border-primary/25 relative flex flex-col justify-between group hover:border-primary transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-3xl font-light text-primary/40 group-hover:text-primary transition-colors">01</span>
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center text-primary bg-background">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-display-lg text-xl text-on-background mb-3 font-normal">Pick & Customize</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                  Select a template (Virtual Birthday Bash, Proposal, Anniversary, or Love Letter). Write your heartfelt message, upload memory photos, and pick a synthesized music track.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-primary/10">
                <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Step 1 — Craft</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 border border-primary/25 relative flex flex-col justify-between group hover:border-primary transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-3xl font-light text-primary/40 group-hover:text-primary transition-colors">02</span>
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center text-primary bg-background">
                    <Gift className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-display-lg text-xl text-on-background mb-3 font-normal">Copy & Share Link</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                  Click "Copy Link" to generate a self-contained portable URL payload (?g=...). Send it directly to your recipient via WhatsApp, iMessage, SMS, or Email.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-primary/10">
                <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Step 2 — Share</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 border border-primary/25 relative flex flex-col justify-between group hover:border-primary transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-3xl font-light text-primary/40 group-hover:text-primary transition-colors">03</span>
                  <div className="w-10 h-10 border border-primary/30 flex items-center justify-center text-primary bg-background">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-display-lg text-xl text-on-background mb-3 font-normal">Unlock & Receive Reply</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                  Your recipient opens the link, breaks the wax seal or solves the memory puzzle, experiences your surprise, and can write a sweet thank-you reply back to your Studio!
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-primary/10">
                <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Step 3 — Cherish</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button onClick={onNavigateToExplore} className="btn-primary py-3 px-8 text-xs font-label-caps uppercase tracking-widest font-bold">
              Start Building Now →
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="py-20 px-6 md:px-16 max-w-4xl mx-auto border-t border-primary/10">
          <div className="text-center mb-12">
            <span className="font-label-caps text-[9px] uppercase tracking-[0.25em] text-primary font-bold">Questions & Answers</span>
            <h2 className="font-display-lg text-3xl md:text-5xl text-on-background font-light mt-2">Frequently Asked Questions</h2>
            <p className="text-xs text-on-surface-variant mt-2">Everything you need to know about creating, customizing, and sharing digital gift surprises.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-primary/20 bg-surface-container rounded-none transition-all">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-surface-container-high transition-colors focus:outline-none"
                  >
                    <span className="font-display-lg text-base md:text-lg text-on-background font-normal">{faq.q}</span>
                    <div className="w-6 h-6 border border-primary/30 flex items-center justify-center text-primary bg-background shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-on-surface-variant font-body-lg leading-relaxed border-t border-primary/10 mt-2 bg-background">
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
      <footer className="bg-surface-container border-t border-primary/20 text-on-surface py-14 px-6 md:px-16 w-full relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-7 h-7 border border-primary flex items-center justify-center text-primary bg-background">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-display-lg font-black text-lg tracking-wider uppercase italic text-primary">Wishora</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Archival digital keepsakes designed to convert feelings, letters, and memory timelines into timeless interactive experiences.
            </p>
          </div>

          {/* EXPERIENCES Col */}
          <div>
            <h4 className="font-label-caps text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-4">EXPERIENCES</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><button onClick={() => onNavigateToWizard('thank_you')} className="hover:text-primary transition-colors">Sorry Card</button></li>
              <li><button onClick={() => onNavigateToWizard('birthday')} className="hover:text-primary transition-colors">Virtual Birthday Bash</button></li>
              <li><button onClick={() => onNavigateToWizard('proposal')} className="hover:text-primary transition-colors">Perfect Proposal</button></li>
              <li><button onClick={() => onNavigateToWizard('puzzle')} className="hover:text-primary transition-colors">Surprise Photo Puzzle</button></li>
              <li><button onClick={() => onNavigateToWizard('thank_you')} className="hover:text-primary transition-colors">Mother's Day</button></li>
              <li><button onClick={() => onNavigateToWizard('anniversary')} className="hover:text-primary transition-colors">Anniversary Special</button></li>
              <li><button onClick={() => onNavigateToWizard('thank_you')} className="hover:text-primary transition-colors">Love Letter</button></li>
            </ul>
          </div>

          {/* ABOUT US Col */}
          <div>
            <h4 className="font-label-caps text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-4">ABOUT US</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><button onClick={() => setActiveModal('about')} className="hover:text-primary transition-colors">Know about us</button></li>
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => setActiveModal('terms')} className="hover:text-primary transition-colors">Terms & Conditions of Use</button></li>
            </ul>
          </div>

          {/* CONTACT US Col */}
          <div>
            <h4 className="font-label-caps text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-4">CONTACT US</h4>
            <div className="space-y-3 text-xs text-on-surface-variant">
              <p className="leading-relaxed">
                For any complaints or concerns, please reach out to us at:
              </p>
              <a href="mailto:gholapabhishek9@gmail.com" className="font-mono text-primary font-bold block hover:underline flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                gholapabhishek9@gmail.com
              </a>
              <p className="text-[11px] text-on-surface-variant/80 italic pt-2 border-t border-primary/10">
                For redressal of grievances, please refer to our <button onClick={() => setActiveModal('privacy')} className="underline text-primary font-bold">Privacy Policy</button>.
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.15em] font-mono text-on-surface-variant/70">
          <div>© 2026 Wishora. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Designed for timeless emotional connection.</div>
        </div>
      </footer>

      {/* LEGAL & ABOUT MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
          <div className="bg-background border border-primary p-6 md:p-10 w-full max-w-2xl relative shadow-2xl max-h-[85vh] overflow-y-auto">
            
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
                  <h3 className="font-display-lg text-2xl font-light text-on-background">Know About Us — Wishora</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                  Wishora was born from a simple belief: in a world dominated by instant messages and temporary social posts, true emotion deserves a permanent, beautiful form.
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed font-body-lg">
                  Our platform empowers creators to craft archival digital keepsakes—combining handwritten letter typography, custom memory scrapbooks, interactive photo puzzles, and synthesized audio ambiances into unforgettable experiences.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-display-lg text-2xl font-light text-on-background">Privacy Policy & Grievance Redressal</h3>
                </div>
                <div className="text-xs text-on-surface-variant leading-relaxed space-y-3 font-body-lg">
                  <p><strong>1. Information Collection & Storage:</strong> Wishora prioritizes user privacy. Creations built on our platform are stored on the creator's local device and rendered through unique encoded URL payloads.</p>
                  <p><strong>2. Recipient Replies:</strong> Thank you messages and replies submitted by recipients are encrypted and stored solely for the creator and recipient of that card.</p>
                  <p><strong>3. Grievance Redressal Officer:</strong> In compliance with applicable digital privacy standards, for any complaints, content concerns, or grievance redressal, please write directly to <strong>gholapabhishek9@gmail.com</strong>.</p>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-display-lg text-2xl font-light text-on-background">Terms & Conditions of Use</h3>
                </div>
                <div className="text-xs text-on-surface-variant leading-relaxed space-y-3 font-body-lg">
                  <p><strong>1. Acceptance of Terms:</strong> By creating or viewing experiences on Wishora, you agree to comply with these terms of use.</p>
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
      animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      opacity: 0;
      transform: translateY(12px);
    }
    .delay-75 { animation-delay: 150ms; }
    .delay-150 { animation-delay: 300ms; }
    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);
