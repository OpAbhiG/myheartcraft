import React, { useState } from 'react';
import { Search, Heart, Clock, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { EXPERIENCE_TEMPLATES, ExperienceTemplate } from '../types';

interface ExploreScreenProps {
  onNavigateToWizard: (templateId: string) => void;
  onNavigateToHome: () => void;
  onNavigateToDashboard: () => void;
}

export default function ExploreScreen({
  onNavigateToWizard,
  onNavigateToHome,
  onNavigateToDashboard
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
      
      {/* TopAppBar */}
      <header className="bg-background border-b border-primary/20 sticky top-0 flex justify-between items-center px-6 md:px-16 w-full z-50 h-20 transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateToHome}>
          <div className="w-9 h-9 border border-primary flex items-center justify-center text-primary bg-background">
            <Heart className="w-4 h-4 fill-current text-primary" />
          </div>
          <span className="font-display-lg text-2xl font-black tracking-tighter uppercase italic text-primary">MyHeartCraft</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-bold opacity-75">
          <button onClick={onNavigateToHome} className="text-on-surface-variant hover:text-primary transition-colors">Home</button>
          <button className="text-primary font-bold border-b border-primary pb-1">Explore</button>
          <button onClick={onNavigateToDashboard} className="text-on-surface-variant hover:text-primary transition-colors">Studio</button>
        </nav>
        
        <button onClick={onNavigateToDashboard} className="btn-primary">
          Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-16 px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10 pb-24">
        {/* Back Button */}
        <button
          onClick={onNavigateToHome}
          className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant hover:text-primary transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </button>

        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#999] mb-4">Curated Catalog</p>
          <h1 className="font-display-lg text-4xl md:text-6xl text-on-background mb-4 font-light tracking-tight">
            Discover the Perfect <span className="italic">Experience</span>
          </h1>
          <p className="font-body-lg text-on-surface-variant text-base md:text-lg max-w-xl mx-auto">
            Browse our curated collection of digital gifts and interactive moments, designed to translate raw feeling into silent form.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-16 space-y-8 animate-fade-in delay-75">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto glass-card rounded-none p-1.5 flex items-center bg-background border border-primary">
            <Search className="text-on-surface-variant/75 ml-3 w-4 h-4 shrink-0" />
            <input
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-on-surface font-sans text-sm px-3 placeholder-on-surface-variant/40"
              placeholder="Search experiences (e.g., Anniversary, Puzzle...)"
              type="text"
            />
            <button className="btn-primary py-1.5 px-4 text-[9px] uppercase tracking-wider">
              Find
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2" id="category-pills">
            {categories.map(category => (
              <button
                id={`pill-${category}`}
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-none border text-[9px] font-bold font-label-caps uppercase tracking-[0.15em] transition-all duration-250 ${
                  selectedCategory === category
                    ? 'border-primary bg-primary text-background'
                    : 'border-primary/20 text-on-surface-variant hover:bg-primary/5 hover:text-on-surface'
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
              className="glass-card rounded-none overflow-hidden group cursor-pointer border border-primary/20 hover:border-primary bg-background transition-all duration-300"
            >
              <div className="h-52 relative overflow-hidden bg-primary-container">
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${template.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-background border border-primary px-3 py-1 rounded-none text-[8px] font-bold font-label-caps text-primary uppercase tracking-widest">
                  {template.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display-lg text-xl font-light text-on-background mb-2 group-hover:text-primary transition-colors">
                  {template.title}
                </h3>
                <p className="font-body-lg text-on-surface-variant text-xs mb-6 line-clamp-2 min-h-[38px]">
                  {template.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                  <span className="text-[9px] font-bold font-label-caps text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {template.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold font-label-caps text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
                    Create This
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Surprise Blank Card */}
          <div
            id="template-card-custom"
            onClick={() => onNavigateToWizard('birthday')}
            className="glass-card rounded-none overflow-hidden group cursor-pointer border border-dashed border-primary/40 flex flex-col justify-center items-center text-center p-8 bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 min-h-[350px]"
          >
            <div className="w-12 h-12 border border-primary flex items-center justify-center mb-6 text-primary bg-background transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display-lg text-xl font-light text-on-background mb-2">Custom Surprise</h3>
            <p className="font-body-lg text-on-surface-variant text-xs mb-8 max-w-xs leading-relaxed">
              Build your own completely custom experience from scratch using our premium layout engines.
            </p>
            <button className="btn-primary py-2 px-5 font-label-caps text-[9px] tracking-widest uppercase font-bold">
              Start Blank
            </button>
          </div>
        </div>

        {/* Empty Search State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center p-12 max-w-md mx-auto glass-card rounded-none border border-primary mt-12 animate-fade-in" id="empty-state">
            <AlertCircle className="w-10 h-10 mx-auto text-primary mb-4 animate-pulse" />
            <h3 className="font-display-lg text-xl font-light mb-2">No matches found</h3>
            <p className="font-body-lg text-on-surface-variant text-xs mb-6">
              Try exploring other terms or select from the emotional filters above.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn-primary text-[9px] py-2 px-5 font-bold tracking-widest uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
