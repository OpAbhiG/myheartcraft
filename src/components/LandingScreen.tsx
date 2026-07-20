import React from 'react';
import { ArrowRight, Sparkles, Heart, Gift, MessageSquare } from 'lucide-react';
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
  
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden relative flex flex-col min-h-screen" id="landing-page">
      
      {/* Ambient background particles for hero atmosphere */}
      <ParticleBackground type="gold_dust" />

      {/* TopAppBar */}
      <header className="bg-background border-b border-primary/20 sticky top-0 flex justify-between items-center px-6 md:px-16 w-full z-50 h-20 transition-all duration-300" id="topAppBar">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-9 h-9 border border-primary flex items-center justify-center text-primary bg-background">
            <Heart className="w-4 h-4 fill-current text-primary" />
          </div>
          <span className="font-display-lg text-2xl font-black tracking-tighter uppercase italic text-primary">MyHeartCraft</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold opacity-75">
          <button onClick={onNavigateToExplore} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Experiences</button>
          <button onClick={onNavigateToDashboard} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Creator Studio</button>
          <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Manifesto</a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            id="landing-header-btn-studio"
            onClick={onNavigateToDashboard}
            className="hidden md:flex border border-primary/80 text-primary px-5 py-2 rounded-none font-label-caps text-[10px] tracking-widest hover:bg-primary hover:text-background transition-all"
          >
            Dashboard
          </button>
          <button
            id="landing-header-btn-create"
            onClick={onNavigateToExplore}
            className="btn-primary"
          >
            Create
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden py-16 md:py-0 border-b border-primary/10 bg-surface-container-low">
          <div className="absolute inset-0 z-0">
            <img
              alt="Cinematic background with floating polaroids"
              className="w-full h-full object-cover opacity-70 grayscale contrast-[1.1]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYNw4gggVTI7wvFMV9kzkHGKW6ABe0a8Mt6wGL0UyemTULr9ml-q9fN5rpzj75axnqFYdV8UsI9_yr9kl7zKq8ktGmGX0wdEN9OrjMPgQ6M2WWtm5_yJNKu8jKzVE13GT2zBcZwfAFk6s05f8Sy6Mf8R1CTEVBlkKadsG0QYcX2IB2bX5HzAKykETV1uyPCvMrYTvo97WOjMQQEt-q2IsIou8GupRari7P2vbNTe1AdYXu8AolSVfHNQ"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
          </div>

          <div className="relative z-10 text-center px-6 md:px-16 max-w-4xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-none font-label-caps text-[9px] tracking-[0.25em] uppercase mb-8">
              <Sparkles className="w-3 h-3 text-primary" />
              Gifting re-imagined as form
            </span>
            
            <h1 className="font-display-lg text-4xl md:text-8xl text-primary mb-6 font-light tracking-[-0.04em] leading-[0.85] drop-shadow-sm">
              Stillness <br/> <span className="italic font-normal">as</span> Sentiment
            </h1>
            <p className="font-body-lg text-primary/85 mb-10 text-base md:text-xl max-w-xl">
              Turn memories, emotions, and unspoken words into beautiful, archival digital experiences designed to be treasured forever.
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

        {/* Experience Categories Selection */}
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#999] mb-4">The Collection</p>
            <h2 className="font-display-lg text-3xl md:text-5xl text-primary mb-6 font-light tracking-tight">Choose How You Want them to Feel</h2>
            <p className="text-on-surface-variant font-body-md text-base">Select a curated emotional landscape designed for life's most meaningful milestones.</p>
            <div className="h-[1px] w-12 bg-primary mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12" id="category-cards">
            {/* Birthday Card */}
            <div
              id="landing-card-birthday"
              onClick={() => onNavigateToWizard('birthday')}
              className="group relative rounded-none overflow-hidden aspect-[4/5] cursor-pointer border border-primary/20 hover:border-primary transition-all duration-500 bg-[#E8E6E3]"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-[0.9]"
                alt="Digital birthday card"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-Wr1yq0EOfRrjg4A-J89friLd3Z5jXs1vvu-3z1Esw4-yYaY2BpQ15Fflqfw1NwGOGYEh7ea12DzeeH1eDvm4Ir8lsWpAMjS7rygzRf9P7HW6CAyHmUf28A4xtTTjySR93-Owb6DSqEnWlQoNCyZgqOb61wDkgaJ6jbdP4Cc0oPOQFn0ivx50sL6KlXzw6pVQzIIh1oJtQLveuOcOGQF9rrr0F07r7aeUGUYElp4HXYJvC5sUQNy-ig"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-background mb-2 opacity-80 uppercase tracking-widest font-bold">Celebration / Warm</span>
                <h3 className="font-display-lg text-2xl text-background mb-4 font-light">Birthday Card</h3>
                <div className="border border-background text-background bg-transparent self-start px-4 py-1.5 rounded-none font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Begin Craft
                </div>
              </div>
            </div>

            {/* Anniversary Special */}
            <div
              id="landing-card-anniversary"
              onClick={() => onNavigateToWizard('anniversary')}
              className="group relative rounded-none overflow-hidden aspect-[4/5] cursor-pointer border border-primary/20 hover:border-primary transition-all duration-500 bg-[#E8E6E3]"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-[0.9]"
                alt="Anniversary keepsake"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATsaQXfMAL1yDdmppTa7zwI1ttjFqNy0IbuWTzi_k8tRi4gYDkkqez403sDHDANY-aPWpc1c-gRdR-9_LFGieLTP43aeyv9fwHmjPPRODX2eHcGvQ9NzR3iBVzq2psiFvvaPbdhBNvBk-4-AaMXnE9Qnp-fsnv_qKQHhWPuLiXWqb9B_DPVFsAcUSGJTSLAxJj0ievDvT0tjf7GDzZCA81ClHxJ3QczgxcWgWdXGEeapP356SjEAI2Sg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-background mb-2 opacity-80 uppercase tracking-widest font-bold">Romantic / Elegant</span>
                <h3 className="font-display-lg text-2xl text-background mb-4 font-light">Anniversary Scrapbook</h3>
                <div className="border border-background text-background bg-transparent self-start px-4 py-1.5 rounded-none font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Begin Craft
                </div>
              </div>
            </div>

            {/* The Perfect Proposal */}
            <div
              id="landing-card-proposal"
              onClick={() => onNavigateToWizard('proposal')}
              className="group relative rounded-none overflow-hidden aspect-[4/5] cursor-pointer border border-primary/20 hover:border-primary transition-all duration-500 bg-[#E8E6E3]"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-[0.9]"
                alt="Proposal sequence"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4Q5RseBiyneYnUPcGwiClJi4xVMJPPhRT9h4tOVGgvf2bhur22Etl1ZHDM0MVUKpuz9LilAwwIIRmpzZKIjLoFup4gff3KtzB2xJMxnOTbrg7ZtTyp2ESRCj6Na_0rvYkOhUDeoHzz_jf9tqzyH2luMHNQ_Js422LfYla4g5py-E_f3f6lj6Pj6UrbdDdau4uvjtqCQRk9sylp_xCvUcx_6c5nYu-UAQ3DALwQrwNjfH78Jk5As5L4Q"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                <span className="font-label-caps text-[9px] text-background mb-2 opacity-80 uppercase tracking-widest font-bold">Cinematic / Emotional</span>
                <h3 className="font-display-lg text-2xl text-background mb-4 font-light">The Proposal</h3>
                <div className="border border-background text-background bg-transparent self-start px-4 py-1.5 rounded-none font-label-caps text-[9px] uppercase tracking-wider transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Begin Craft
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-primary/20 flex flex-col md:flex-row justify-between items-center py-10 px-6 md:px-16 w-full text-on-surface relative z-10 mt-auto">
        <div className="flex items-center gap-2 mb-4 md:mb-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-6 h-6 border border-primary flex items-center justify-center text-primary bg-background">
            <Heart className="w-3 h-3 fill-current" />
          </div>
          <span className="font-display-lg font-black text-sm tracking-wider uppercase italic">MyHeartCraft</span>
        </div>
        
        <nav className="flex gap-10 mb-4 md:mb-0 text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
          <button onClick={onNavigateToDashboard} className="hover:text-primary transition-colors">Studio</button>
          <button onClick={onNavigateToExplore} className="hover:text-primary transition-colors">Explore</button>
          <a href="#" className="hover:text-primary transition-colors">Manifesto</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </nav>
        
        <div className="text-[9px] uppercase tracking-[0.15em] font-mono opacity-50">
          Edition 012 / Vol. II • © 2026 MyHeartCraft
        </div>
      </footer>
    </div>
  );
}
// simple helper anim styles in css file
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
