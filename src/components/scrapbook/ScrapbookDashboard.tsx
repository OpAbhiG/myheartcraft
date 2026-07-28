import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Plus, Heart, ArrowRight, Layers, Layout, ArrowLeft } from 'lucide-react';
import { ScrapbookTemplate, ScrapbookCategory, ScrapbookProject } from './types';
import { INITIAL_SCRAPBOOK_TEMPLATES } from './templates';
import ScrapbookPreviewModal from './ScrapbookPreviewModal';
import ScrapbookQuickPersonalizeModal from './ScrapbookQuickPersonalizeModal';

interface ScrapbookDashboardProps {
  userProjects: ScrapbookProject[];
  onSelectTemplate: (template: ScrapbookTemplate, initialData?: any) => void;
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onNavigateToCards: () => void;
}

const CATEGORIES: ScrapbookCategory[] = [
  'All',
  'Love',
  'Birthday',
  'Travel',
  'Family',
  'Friendship',
  'Baby',
  'Wedding',
  'Anniversary',
  'Couple',
  'Memories',
  'Minimal',
  'Vintage',
  'Cute',
  'Aesthetic'
];

export default function ScrapbookDashboard({
  userProjects,
  onSelectTemplate,
  onOpenProject,
  onDeleteProject,
  onDuplicateProject,
  onNavigateToCards
}: ScrapbookDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<ScrapbookCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<ScrapbookTemplate | null>(null);
  const [personalizeTemplate, setPersonalizeTemplate] = useState<ScrapbookTemplate | null>(null);

  const filteredTemplates = INITIAL_SCRAPBOOK_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePersonalizeComplete = (data: any) => {
    if (personalizeTemplate) {
      onSelectTemplate(personalizeTemplate, data);
      setPersonalizeTemplate(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-on-background pb-20">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCards}
              className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Memora Studio
            </button>
            <div className="h-4 w-[1px] bg-gray-200" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-lg text-on-background">Scrapbook Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const first = INITIAL_SCRAPBOOK_TEMPLATES[0];
                setPersonalizeTemplate(first);
              }}
              className="btn-primary py-2 px-4 rounded-xl font-label-caps text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Scrapbook
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Banner Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase font-label-caps tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted Ready-Made Templates
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-on-background mb-3">
          Create Your Scrapbook
        </h1>
        <p className="font-body-lg text-on-surface-variant text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Turn your favorite photos into beautiful handmade-style memories. Select a template, drag your photos into place, and customize your text in seconds.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scrapbook templates (e.g. Love, Birthday, Travel)..."
            className="w-full bg-white border border-primary/20 rounded-2xl py-3 pl-11 pr-4 text-xs shadow-md focus:outline-none focus:border-primary text-on-background transition-all"
          />
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                  : 'bg-white text-on-surface-variant hover:bg-primary/5 hover:text-primary border border-gray-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* User Saved Projects Showcase Section */}
      {userProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-on-background flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" /> My Saved Scrapbooks ({userProjects.length})
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Delete all your saved scrapbook projects? This action cannot be undone.')) {
                    userProjects.forEach(p => onDeleteProject(p.id));
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold font-label-caps uppercase tracking-wider cursor-pointer"
              >
                Clear All Scrapbooks
              </button>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userProjects.map(proj => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => onOpenProject(proj.id)}
                    className="h-44 rounded-xl bg-slate-100 overflow-hidden relative mb-3 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80')` }} />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[9px] font-mono">
                      {proj.photos?.length || 0} Photos
                    </div>
                  </div>
                  <h3
                    onClick={() => onOpenProject(proj.id)}
                    className="font-display font-bold text-sm text-on-background group-hover:text-primary transition-colors cursor-pointer"
                  >
                    {proj.title || proj.templateName}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-1 mb-4">Edited {new Date(proj.updatedAt).toLocaleDateString()}</p>
                </div>

                {/* Project Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => onOpenProject(proj.id)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-wider font-label-caps flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 shadow-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDuplicateProject(proj.id)}
                    className="py-1.5 px-3 rounded-xl border border-gray-200 text-slate-700 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider font-label-caps cursor-pointer"
                    title="Duplicate Project"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${proj.title || proj.templateName}"?`)) {
                        onDeleteProject(proj.id);
                      }
                    }}
                    className="py-1.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase tracking-wider font-label-caps cursor-pointer"
                    title="Delete Project"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Template Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-on-background flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" /> Ready-Made Scrapbook Designs
          </h2>
          <span className="text-xs text-on-surface-variant font-medium">Showing {filteredTemplates.length} designs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-3xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Visual Preview Frame */}
                <div
                  onClick={() => setPreviewTemplate(template)}
                  className="h-64 relative overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-primary/10 px-3 py-1 rounded-xl text-[9px] font-bold font-label-caps text-primary uppercase tracking-widest shadow-sm">
                    {template.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold">
                    {template.photoSlots.length} Photo Slots
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3
                    onClick={() => setPreviewTemplate(template)}
                    className="font-display text-lg font-bold text-on-background mb-1 group-hover:text-primary transition-colors cursor-pointer"
                  >
                    {template.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setPersonalizeTemplate(template)}
                  className="w-full btn-primary py-3 rounded-2xl font-label-caps tracking-widest font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Use Template <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preview Modal */}
      <ScrapbookPreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={(t) => {
          setPreviewTemplate(null);
          setPersonalizeTemplate(t);
        }}
      />

      {/* Quick Personalize Easy Mode Modal */}
      <ScrapbookQuickPersonalizeModal
        template={personalizeTemplate}
        onClose={() => setPersonalizeTemplate(null)}
        onStartCreation={handlePersonalizeComplete}
      />
    </div>
  );
}
