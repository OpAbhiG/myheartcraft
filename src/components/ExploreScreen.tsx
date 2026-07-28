import React, { useState } from 'react';
import { Search, Heart, Clock, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { EXPERIENCE_TEMPLATES } from '../types';

interface ExploreScreenProps {
  onNavigateToWizard: (templateId: string) => void;
  onNavigateToHome: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToScrapbookWizard?: () => void;
  onNavigateToMagazineWizard?: () => void;
  onNavigateToOpenWhenWizard?: () => void;
}

export default function ExploreScreen({
  onNavigateToWizard,
  onNavigateToHome,
  onNavigateToDashboard,
  onNavigateToScrapbookWizard,
  onNavigateToMagazineWizard,
  onNavigateToOpenWhenWizard
}: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Romantic', 'Birthday', 'Appreciation', 'Interactive'];

  // Filter templates
  const filteredTemplates = EXPERIENCE_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative overflow-x-hidden" id="explore-container">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10 opacity-[0.04]" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10 opacity-[0.04]" />

      {/* TopAppBar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-primary/10 sticky top-0 flex justify-between items-center px-6 md:px-16 w-full z-50 h-20 transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateToHome}>
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/10">
            <Heart className="w-4.5 h-4.5 fill-current text-white" />
          </div>
          <span className="font-display text-2xl font-black tracking-tighter uppercase italic text-primary">Memora</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
          <button onClick={onNavigateToHome} className="hover:text-primary transition-colors cursor-pointer">Home</button>
          <button className="text-primary font-bold border-b border-primary pb-1 cursor-pointer">Explore</button>
        </nav>
        
        <button onClick={onNavigateToDashboard} className="btn-primary py-2 px-5 text-[10px] shadow-md">
          Studio
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-16 px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10 pb-24">
        {/* Back Button */}
        <button
          onClick={onNavigateToHome}
          className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant hover:text-primary transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </button>

        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary mb-4">Curated Catalog</p>
          <h1 className="font-display-lg text-4xl md:text-6xl text-on-background mb-4 font-light tracking-tight">
            Discover the Perfect <span className="italic font-serif font-normal">Experience</span>
          </h1>
          <p className="font-body-lg text-on-surface-variant text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Browse our curated collection of digital gifts and interactive moments, designed to translate raw feeling into gorgeous forms.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-16 space-y-8 animate-fade-in delay-75">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto glass-card rounded-2xl p-1.5 flex items-center bg-white border border-primary/10 shadow-lg">
            <Search className="text-on-surface-variant/70 ml-3.5 w-4 h-4 shrink-0" />
            <input
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-on-surface font-sans text-sm px-3 placeholder-on-surface-variant/40"
              placeholder="Search experiences (e.g., Anniversary, Puzzle...)"
              type="text"
            />
            <button className="btn-primary py-2 px-5 text-[9px] uppercase tracking-wider shadow-sm">
              Find
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2.5" id="category-pills">
            {categories.map(category => (
              <button
                id={`pill-${category}`}
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-1.5 rounded-full border text-[9px] font-bold font-label-caps uppercase tracking-[0.15em] transition-all duration-200 shadow-sm cursor-pointer ${
                  selectedCategory === category
                    ? 'border-primary bg-primary text-white'
                    : 'border-primary/10 bg-white/70 text-on-surface-variant hover:bg-primary/5 hover:text-on-surface'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in delay-150" id="explore-grid">
          {filteredTemplates.map((template) => (
            <div
              id={`template-card-${template.id}`}
              key={template.id}
              onClick={() => onNavigateToWizard(template.id)}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-primary/10 hover:border-primary/20 bg-white/70 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-52 relative overflow-hidden bg-primary/5 rounded-t-3xl">
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${template.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 border border-primary/10 px-3 py-1 rounded-xl text-[8px] font-bold font-label-caps text-primary uppercase tracking-widest shadow-sm">
                  {template.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors">
                  {template.title}
                </h3>
                <p className="font-body-lg text-on-surface-variant text-xs mb-6 line-clamp-2 min-h-[38px]">
                  {template.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                  <span className="text-[9px] font-bold font-label-caps text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    {template.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold font-label-caps text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
                    Create This
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Surprise Blank Card */}
          <div
            id="template-card-custom"
            onClick={() => onNavigateToWizard('birthday')}
            className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-primary/10 hover:border-primary/20 bg-white/70 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="h-52 relative overflow-hidden bg-primary/5 rounded-t-3xl">
              <div
                className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              <div className="absolute top-4 left-4 bg-white/90 border border-primary/10 px-3 py-1 rounded-xl text-[8px] font-bold font-label-caps text-primary uppercase tracking-widest shadow-sm">
                Creative
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-display text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                Custom Surprise <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
              </h3>
              <p className="font-body-lg text-on-surface-variant text-xs mb-6 line-clamp-2 min-h-[38px]">
                Build your own completely custom surprise greeting card experience from scratch using our premium layout tools.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                <span className="text-[9px] font-bold font-label-caps text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  Blank Canvas
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold font-label-caps text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
                  Start Blank
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* AI Editorial Magazine Card */}
          {onNavigateToMagazineWizard && (
            <div
              onClick={onNavigateToMagazineWizard}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-primary/10 hover:border-primary/20 bg-white/70 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-52 relative overflow-hidden bg-primary/5 rounded-t-3xl">
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 border border-primary/10 px-3 py-1 rounded-xl text-[8px] font-bold font-label-caps text-primary uppercase tracking-widest shadow-sm">
                  Magazine Maker
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  AI Magazine Maker <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                </h3>
                <p className="font-body-lg text-on-surface-variant text-xs mb-6 line-clamp-2 min-h-[38px]">
                  Convert 5-40 photos and stories into a professionally laid out publication. Generates articles, captions, and headlines.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                  <span className="text-[9px] font-bold font-label-caps text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Auto-Layout
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold font-label-caps text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
                    Generate
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Story Scrapbook Card */}
          {onNavigateToScrapbookWizard && (
            <div
              onClick={onNavigateToScrapbookWizard}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-primary/10 hover:border-primary/20 bg-white/70 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-52 relative overflow-hidden bg-primary/5 rounded-t-3xl">
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 border border-primary/10 px-3 py-1 rounded-xl text-[8px] font-bold font-label-caps text-primary uppercase tracking-widest shadow-sm">
                  Scrapbook Studio
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  Scrapbook Studio <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                </h3>
                <p className="font-body-lg text-on-surface-variant text-xs mb-6 line-clamp-2 min-h-[38px]">
                  Create a handmade visual keepsake with stickers, handwritten memories, washi tapes, paper cuts, and polaroid frame borders.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                  <span className="text-[9px] font-bold font-label-caps text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Freeform Collage
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold font-label-caps text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
                    Create
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Open When Card */}
          {onNavigateToOpenWhenWizard && (
            <div
              onClick={onNavigateToOpenWhenWizard}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-primary/10 hover:border-primary/20 bg-white/70 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-52 relative overflow-hidden bg-primary/5 rounded-t-3xl">
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=600&q=80')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 border border-primary/10 px-3 py-1 rounded-xl text-[8px] font-bold font-label-caps text-primary uppercase tracking-widest shadow-sm">
                  Open When Envelopes
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  "Open When..." Series <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                </h3>
                <p className="font-body-lg text-on-surface-variant text-xs mb-6 line-clamp-2 min-h-[38px]">
                  Compile a series of sealed digital envelopes with messages, photos, voice notes, and keepsake gifts that open in future moments.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                  <span className="text-[9px] font-bold font-label-caps text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Moment Locks
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold font-label-caps text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
                    Assemble
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty Search State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center p-12 max-w-md mx-auto glass-card rounded-2xl border border-primary/10 mt-12 animate-fade-in bg-white/60 shadow-lg" id="empty-state">
            <AlertCircle className="w-10 h-10 mx-auto text-primary mb-4 animate-pulse" />
            <h3 className="font-display text-xl font-bold mb-2">No matches found</h3>
            <p className="font-body-lg text-on-surface-variant text-xs mb-6">
              Try exploring other terms or select from the emotional filters above.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn-primary text-[9px] py-2.5 px-6 font-bold tracking-widest uppercase shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
