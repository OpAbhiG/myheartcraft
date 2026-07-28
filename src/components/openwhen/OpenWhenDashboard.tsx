import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Plus, Eye, Share2, Trash2, Search, Check, FolderOpen, Edit3 } from 'lucide-react';
import { OpenWhenProject } from './types';
import { OCCASION_LABELS } from './prompts';

interface OpenWhenDashboardProps {
  projects: OpenWhenProject[];
  onCreateNew: () => void;
  onEditProject: (projectId: string) => void;
  onPreviewProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onNavigateToCards: () => void;
  onNavigateToScrapbook: () => void;
  onNavigateToMagazine: () => void;
}

export default function OpenWhenDashboard({
  projects,
  onCreateNew,
  onEditProject,
  onPreviewProject,
  onDeleteProject,
  onDuplicateProject,
  onNavigateToCards,
  onNavigateToScrapbook,
  onNavigateToMagazine
}: OpenWhenDashboardProps) {
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'LIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = projects.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.occasion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyLink = (p: OpenWhenProject) => {
    const origin = window.location.origin + window.location.pathname;
    const shareUrl = `${origin}?oId=${p.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(p.id);
    alert('Copied private sharing link to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getOpenedCount = (p: OpenWhenProject) => {
    return p.messages.filter(m => m.status === 'OPENED').length;
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col lg:flex-row antialiased relative" id="open-when-dashboard">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10 opacity-[0.03]" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10 opacity-[0.03]" />

      {/* Sidebar - Desktop */}
      <nav className="hidden lg:flex flex-col h-screen p-8 bg-white/70 backdrop-blur-md w-64 fixed left-0 top-0 z-40 border-r border-primary/10">
        <div className="mb-12">
          <div className="font-display text-2xl text-primary font-bold tracking-tight uppercase italic">Memora</div>
          <div className="font-label-caps text-[9px] text-on-surface-variant mt-1.5 uppercase tracking-[0.25em] opacity-75 font-bold">Open When Studio</div>
        </div>

        <ul className="flex-1 space-y-2">
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-primary font-bold bg-primary/5 rounded-xl text-left border border-primary/10">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="font-sans text-xs uppercase tracking-wider font-bold">Open When Collections</span>
            </button>
          </li>
          <li>
            <button onClick={onNavigateToScrapbook} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl text-left transition-all cursor-pointer">
              <BookOpen className="w-4 h-4 text-on-surface-variant/75" />
              <span className="font-sans text-xs uppercase tracking-wider font-bold">Scrapbook Studio</span>
            </button>
          </li>
          <li>
            <button onClick={onNavigateToMagazine} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl text-left transition-all cursor-pointer">
              <BookOpen className="w-4 h-4 text-on-surface-variant/75" />
              <span className="font-sans text-xs uppercase tracking-wider font-bold">Magazine Maker</span>
            </button>
          </li>
          <li>
            <button onClick={onNavigateToCards} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl text-left transition-all cursor-pointer">
              <FolderOpen className="w-4 h-4 text-on-surface-variant/75" />
              <span className="font-sans text-xs uppercase tracking-wider font-bold">Greeting Cards</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto">
          <button
            onClick={onCreateNew}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-grow w-full lg:ml-64 p-6 md:p-12 pb-24 md:pb-12 min-h-screen relative z-10">
        {/* Header */}
        <div className="mb-12 animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary mb-3">Sealed Emotional Gifts</p>
            <h1 className="font-display-lg text-4xl md:text-6xl text-on-background mb-3 font-light tracking-tight">Open When...</h1>
            <p className="font-body-lg text-on-surface-variant text-sm max-w-xl leading-relaxed">
              Write collections of envelopes for your loved ones to open only when specific future moments arrive. One gift, many moments.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="btn-primary py-3 px-6 text-xs flex items-center gap-2 shrink-0 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Collection
          </button>
        </div>

        {/* Quick Nav Bar Mobile */}
        <div className="lg:hidden flex gap-3 mb-8 overflow-x-auto pb-2 border-b border-primary/10">
          <button onClick={onCreateNew} className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-primary bg-primary text-white rounded-xl">New Collection</button>
          <button onClick={onNavigateToScrapbook} className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-primary/10 text-on-surface bg-white rounded-xl">Scrapbook Studio</button>
          <button onClick={onNavigateToMagazine} className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-primary/10 text-on-surface bg-white rounded-xl">Magazine Maker</button>
          <button onClick={onNavigateToCards} className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-primary/10 text-on-surface bg-white rounded-xl">Greeting Cards</button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 border-b border-primary/10 pb-6">
          <div className="flex bg-white border border-primary/10 p-1 rounded-xl shadow-sm self-start md:self-auto">
            {(['ALL', 'DRAFT', 'LIVE'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-lg font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer ${
                  filter === tab ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab === 'ALL' ? 'All Collections' : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-xs flex items-center bg-white border border-primary/10 p-1 rounded-xl shadow-sm">
            <Search className="text-on-surface-variant/70 ml-2.5 w-4 h-4" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-sans text-xs px-2.5 py-1.5 placeholder-on-surface-variant/40"
            />
          </div>
        </div>

        {/* List Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-primary/20 rounded-3xl bg-white/50">
            <FolderOpen className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-primary font-bold mb-1">No collections found</h3>
            <p className="text-xs text-on-surface-variant mb-6">Create a new sealed envelope series to share with someone special.</p>
            <button onClick={onCreateNew} className="btn-primary py-2 px-4 text-[10px] shadow-md">
              Start First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map(p => (
              <div key={p.id} className="bg-white/70 backdrop-blur-md rounded-3xl flex flex-col border border-primary/10 h-[390px] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Visual Cover preview box */}
                <div className="h-44 bg-primary/5 border-b border-primary/10 relative flex items-center justify-center p-6 text-center bg-gradient-to-br from-rose-50 to-amber-50 rounded-t-3xl">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-primary/65">OPEN WHEN...</span>
                    <h3 className="font-display text-xl text-primary font-bold">{p.title}</h3>
                    <p className="text-[10px] text-on-surface-variant italic font-semibold">For {p.recipientName}</p>
                    <span className="text-[8px] uppercase tracking-widest text-secondary block font-mono font-bold">Occasion: {OCCASION_LABELS[p.occasion] || p.occasion}</span>
                  </div>
                  
                  <span className={`absolute top-4 right-4 font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-sm ${
                    p.status === 'LIVE' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {p.status}
                  </span>
                  
                  <span className="absolute bottom-3 left-4 font-mono text-[8.5px] uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded-lg">
                    Style: {p.style.replace('-', ' ')}
                  </span>
                </div>

                {/* Details body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant/75 font-mono mb-2">
                      <span>Total Envelopes: {p.messages.length}</span>
                      <span>{p.views || 0} views</span>
                    </div>
                    <div className="text-xs text-on-surface-variant leading-relaxed">
                      <strong>Opened by recipient:</strong> {getOpenedCount(p)} of {p.messages.length} messages read.
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary/10">
                    {/* Action buttons */}
                    <div className="grid grid-cols-4 border border-primary/10 rounded-xl overflow-hidden divide-x divide-primary/10 bg-primary/5 shadow-inner">
                      <button
                        onClick={() => onEditProject(p.id)}
                        title="Edit Collection"
                        className="py-2.5 flex justify-center items-center hover:bg-primary hover:text-white transition-colors text-primary cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onPreviewProject(p.id)}
                        title="Interactive Preview"
                        className="py-2.5 flex justify-center items-center hover:bg-primary hover:text-white transition-colors text-primary cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopyLink(p)}
                        title="Share Link"
                        className="py-2.5 flex justify-center items-center hover:bg-primary hover:text-white transition-colors text-primary cursor-pointer"
                      >
                        {copiedId === p.id ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeleteProject(p.id)}
                        title="Delete Collection"
                        className="py-2.5 flex justify-center items-center hover:bg-red-500 hover:text-white transition-colors text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
