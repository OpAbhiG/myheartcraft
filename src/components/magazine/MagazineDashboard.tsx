import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Plus, Eye, Link2, Edit3, Trash2, Search, Share2, FolderOpen, RefreshCw, CheckCircle } from 'lucide-react';
import { MagazineProject } from './types';

interface MagazineDashboardProps {
  projects: MagazineProject[];
  onCreateNew: () => void;
  onEditProject: (projectId: string) => void;
  onPreviewProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onNavigateToCards: () => void;
  onNavigateToScrapbook: () => void;
}

export default function MagazineDashboard({
  projects,
  onCreateNew,
  onEditProject,
  onPreviewProject,
  onDeleteProject,
  onNavigateToCards,
  onNavigateToScrapbook
}: MagazineDashboardProps) {
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'LIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = projects.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.basicInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.recipientName && p.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyLink = (p: MagazineProject) => {
    const origin = window.location.origin + window.location.pathname;
    const shareUrl = `${origin}?mId=${p.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(p.id);
    alert('Copied public sharing link to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStyleLabel = (style: string) => {
    return style.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getCategoryLabel = (cat: string) => {
    return cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col lg:flex-row antialiased relative" id="magazine-dashboard">
      
      {/* Sidebar - Desktop */}
      <nav className="hidden lg:flex flex-col h-screen p-8 bg-surface-container w-64 fixed left-0 top-0 z-40 border-r border-primary/25">
        <div className="mb-12">
          <div className="font-display-lg text-2xl text-primary font-bold tracking-tight uppercase italic">Memora</div>
          <div className="font-label-caps text-[9px] text-on-surface-variant mt-1.5 uppercase tracking-[0.25em] opacity-75">Magazine Studio</div>
        </div>

        <ul className="flex-1 space-y-3">
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-primary font-bold border border-primary bg-background rounded-none text-left">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="font-sans text-xs uppercase tracking-wider font-bold">Magazine Studio</span>
            </button>
          </li>
          <li>
            <button onClick={onNavigateToScrapbook} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant border border-transparent hover:border-primary/20 hover:bg-background rounded-none text-left transition-all">
              <BookOpen className="w-4 h-4 text-on-surface-variant/75" />
              <span className="font-sans text-xs uppercase tracking-wider">Scrapbook Studio</span>
            </button>
          </li>
          <li>
            <button onClick={onNavigateToCards} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant border border-transparent hover:border-primary/20 hover:bg-background rounded-none text-left transition-all">
              <FolderOpen className="w-4 h-4 text-on-surface-variant/75" />
              <span className="font-sans text-xs uppercase tracking-wider font-bold">Greeting Cards</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto">
          <button
            onClick={onCreateNew}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Magazine
          </button>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-grow w-full lg:ml-64 p-6 md:p-12 pb-24 md:pb-12 min-h-screen">
        {/* Header */}
        <div className="mb-12 animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#999] mb-3">AI editorial publishing</p>
            <h1 className="font-display-lg text-4xl md:text-6xl text-on-background mb-3 font-light tracking-tight">Magazine Studio</h1>
            <p className="font-body-lg text-on-surface-variant text-sm max-w-xl">
              Upload your photos, share your story details, and let Memora automatically generate a professionally designed editorial magazine.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="btn-primary py-3 px-6 text-xs flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Create New Magazine
          </button>
        </div>

        {/* Quick Nav Bar Mobile */}
        <div className="lg:hidden flex gap-3 mb-8 overflow-x-auto pb-2 border-b border-primary/10">
          <button onClick={onCreateNew} className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-primary bg-primary text-background">New Magazine</button>
          <button onClick={onNavigateToScrapbook} className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-primary/20 text-on-surface">Scrapbook Studio</button>
          <button onClick={onNavigateToCards} className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-primary/20 text-on-surface">Greeting Cards</button>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 border-b border-primary/10 pb-6">
          <div className="flex border border-primary p-0.5 bg-background self-start md:self-auto">
            {(['ALL', 'DRAFT', 'LIVE'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 font-mono text-[9px] uppercase tracking-widest transition-all ${
                  filter === tab ? 'bg-primary text-background font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab === 'ALL' ? 'All Magazines' : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-xs flex items-center glass-card p-1 border border-primary bg-background">
            <Search className="text-on-surface-variant ml-2.5 w-4 h-4" />
            <input
              type="text"
              placeholder="Search magazines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-sans text-xs px-2.5 py-1.5 placeholder-on-surface-variant/40"
            />
          </div>
        </div>

        {/* Magazines Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-primary/20">
            <FolderOpen className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-display-lg text-xl text-primary font-normal mb-1">No magazines found</h3>
            <p className="text-xs text-on-surface-variant mb-6">Create a new magazine to tell your story in a premium format.</p>
            <button onClick={onCreateNew} className="btn-primary py-2 px-4 text-[10px]">
              Start First Magazine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map(p => {
              // Cover photo
              const coverPhoto = p.photos.find(ph => ph.isCover)?.url || p.photos[0]?.url;

              return (
                <div key={p.id} className="glass-card flex flex-col border border-primary h-[390px] overflow-hidden group">
                  <div className="h-44 bg-surface-container-high border-b border-primary/20 relative overflow-hidden flex items-center justify-center">
                    {coverPhoto ? (
                      <img
                        src={coverPhoto}
                        alt={p.basicInfo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-radial from-orange-50 to-amber-100">
                        <span className="font-display text-lg font-semibold italic text-primary/45">{p.basicInfo.title}</span>
                        <span className="text-[9px] uppercase tracking-wider text-primary/30 mt-2 font-mono">{getCategoryLabel(p.category)}</span>
                      </div>
                    )}
                    <span className={`absolute top-4 right-4 font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 font-bold ${
                      p.status === 'LIVE' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {p.status}
                    </span>
                    <span className="absolute bottom-3 left-4 font-mono text-[8px] uppercase tracking-wider bg-black/60 text-white px-2 py-0.5">
                      {p.size} Size
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#999]">
                          {getStyleLabel(p.style)}
                        </span>
                        <span className="text-[9.5px] font-sans text-on-surface-variant">
                          {p.views || 0} views
                        </span>
                      </div>
                      <h3 className="font-display text-xl text-primary font-bold line-clamp-1 mb-1">{p.basicInfo.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        Created by {p.creatorName} {p.recipientName ? `for ${p.recipientName}` : ''}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <div className="flex justify-between items-center text-[10px] text-on-surface-variant/75 font-mono mb-3">
                        <span>Pages: {p.pages.length}</span>
                        <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-4 border border-primary divide-x divide-primary bg-background">
                        <button
                          onClick={() => onEditProject(p.id)}
                          title="Edit Magazine"
                          className="py-2.5 flex justify-center items-center hover:bg-primary hover:text-background transition-colors text-primary"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPreviewProject(p.id)}
                          title="Preview Magazine"
                          className="py-2.5 flex justify-center items-center hover:bg-primary hover:text-background transition-colors text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCopyLink(p)}
                          title="Share Link"
                          className="py-2.5 flex justify-center items-center hover:bg-primary hover:text-background transition-colors text-primary"
                        >
                          {copiedId === p.id ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onDeleteProject(p.id)}
                          title="Delete Magazine"
                          className="py-2.5 flex justify-center items-center hover:bg-red-500 hover:text-white transition-colors text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
