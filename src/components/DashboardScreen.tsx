import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Settings as SettingsIcon, Plus, Eye, Link2, Edit3, Trash2, Calendar, User, Info, MessageSquare, Music, Sparkles, Heart, X, Copy, Check, Search, Globe, RefreshCw } from 'lucide-react';
import { Creation, INITIAL_CREATIONS, TEMPLATE_EXPERIENCES } from '../types';
import { generateShareableUrl } from '../utils/share';
import { fetchGlobalCreationsFromCloud } from '../utils/cloudSync';
import AdminSettingsModal from './AdminSettingsModal';

interface DashboardScreenProps {
  creations: Creation[];
  allGlobalCreations?: Creation[];
  onNavigateToExplore: () => void;
  onNavigateToWizard: (templateId?: string, editCreationId?: string) => void;
  onPreviewCreation: (creationId: string) => void;
  onDeleteCreation: (creationId: string) => void;
  onUpdateCreations?: (updated: Creation[]) => void;
  onUpdateGlobalCreations?: (updated: Creation[]) => void;
}

export default function DashboardScreen({
  creations,
  allGlobalCreations,
  onNavigateToExplore,
  onNavigateToWizard,
  onPreviewCreation,
  onDeleteCreation,
  onUpdateCreations,
  onUpdateGlobalCreations
}: DashboardScreenProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [setSelectedDetailCreation, setSelectedDetailCreationState] = useState<Creation | null>(null);
  const [copiedDetailLink, setCopiedDetailLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalExperiences = creations.length;
  const activeLinks = creations.filter(c => c.status === 'LIVE').length;
  const totalViews = creations.reduce((sum, c) => sum + (c.views || 0), 0);
  const uniqueCreatorsCount = new Set(creations.map(c => c.creatorName || 'Anonymous')).size;

  const filteredCreations = creations.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.recipientName && c.recipientName.toLowerCase().includes(q)) ||
      (c.creatorName && c.creatorName.toLowerCase().includes(q)) ||
      (c.messageTitle && c.messageTitle.toLowerCase().includes(q)) ||
      (c.templateId && c.templateId.toLowerCase().includes(q))
    );
  });

  const handleSyncGlobalCards = async () => {
    setIsSyncing(true);
    try {
      const cloudCards = await fetchGlobalCreationsFromCloud();
      if (cloudCards && cloudCards.length > 0 && onUpdateGlobalCreations) {
        onUpdateGlobalCreations(cloudCards);
      }
    } catch (e) {
      console.warn('Sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyLink = (creationOrId: Creation | string) => {
    const creation = typeof creationOrId === 'string' ? creations.find(c => c.id === creationOrId) : creationOrId;
    if (creation) {
      const shareableUrl = generateShareableUrl(creation);
      navigator.clipboard.writeText(shareableUrl);
      setCopiedDetailLink(true);
      alert('Copied shareable surprise link to clipboard!');
      setTimeout(() => setCopiedDetailLink(false), 3000);
    } else if (typeof creationOrId === 'string') {
      const origin = window.location.origin + window.location.pathname;
      const shareableUrl = `${origin}?giftId=${creationOrId}`;
      navigator.clipboard.writeText(shareableUrl);
      alert('Copied shareable link to clipboard!');
    }
  };

  const handleImportCreations = (imported: Creation[]) => {
    if (onUpdateGlobalCreations) {
      onUpdateGlobalCreations(imported);
    } else if (onUpdateCreations) {
      onUpdateCreations(imported);
    }
  };

  const handleResetCreations = () => {
    if (onUpdateGlobalCreations) {
      onUpdateGlobalCreations(INITIAL_CREATIONS);
    } else if (onUpdateCreations) {
      onUpdateCreations(INITIAL_CREATIONS);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col lg:flex-row antialiased relative" id="dashboard-container">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10" />

      {/* Sidebar - Desktop */}
      <nav className="hidden lg:flex flex-col h-screen p-8 bg-white/70 backdrop-blur-md w-64 fixed left-0 top-0 z-40 border-r border-primary/10">
        <div className="mb-12">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Heart className="w-4.5 h-4.5 fill-current text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-tight uppercase italic text-primary leading-none">Memora</span>
              <span className="text-[7px] text-[#999] tracking-widest uppercase font-bold mt-1">Creator Studio</span>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-2">
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-primary rounded-xl text-left shadow-md shadow-primary/10">
              <LayoutDashboard className="w-4 h-4 text-white" />
              <span className="font-sans text-xs uppercase tracking-wider font-semibold">Greeting Cards</span>
            </button>
          </li>

          <li>
            <button onClick={onNavigateToExplore} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl text-left transition-all">
              <BookOpen className="w-4 h-4" />
              <span className="font-sans text-xs uppercase tracking-wider font-semibold">Explore Templates</span>
            </button>
          </li>
          <li>
            <button
              id="sidebar-btn-settings"
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl text-left transition-all"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="font-sans text-xs uppercase tracking-wider font-semibold">Studio Settings</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto">
          <button
            id="sidebar-btn-new"
            onClick={onNavigateToExplore}
            className="w-full btn-primary flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Experience
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-64 p-6 md:p-12 pb-24 md:pb-12 min-h-screen relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary mb-3">Workspace Overview</p>
            <h1 className="font-display-lg text-4xl md:text-5xl text-on-background mb-3 font-light tracking-tight">Creator Studio</h1>
            <p className="font-body-lg text-on-surface-variant text-sm">Welcome back. Manage your digital keepsakes and view responses from your loved ones.</p>
          </div>
          
          <button
            onClick={handleSyncGlobalCards}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 border border-primary/20 bg-white/70 hover:bg-white hover:border-primary/40 px-4 py-2 text-xs font-mono rounded-xl shadow-sm text-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Cloud Records'}
          </button>
        </div>

        {/* Top Stats Bento Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in delay-75">
          {/* Stat 1 */}
          <div className="glass-card p-6 flex flex-col justify-between h-32 border border-primary/10 shadow-lg relative overflow-hidden group hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Total Created</div>
                <div className="font-display text-3xl font-bold text-on-background mt-0.5">{totalExperiences}</div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
              <Heart className="w-24 h-24 text-primary" />
            </div>
          </div>
          
          {/* Stat 2 */}
          <div className="glass-card p-6 flex flex-col justify-between h-32 border border-primary/10 shadow-lg relative overflow-hidden group hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Active Live Links</div>
                <div className="font-display text-3xl font-bold text-on-background mt-0.5">{activeLinks}</div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
              <Link2 className="w-24 h-24 text-primary" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-card p-6 flex flex-col justify-between h-32 border border-primary/10 shadow-lg relative overflow-hidden group hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Recipient Views</div>
                <div className="font-display text-3xl font-bold text-on-background mt-0.5">{totalViews}</div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
              <Eye className="w-24 h-24 text-primary" />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass-card p-6 flex flex-col justify-between h-32 border border-primary/10 shadow-lg relative overflow-hidden group hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Unique Creators</div>
                <div className="font-display text-3xl font-bold text-on-background mt-0.5">{uniqueCreatorsCount}</div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
              <User className="w-24 h-24 text-primary" />
            </div>
          </div>
        </div>

        {/* Recent Creations Section */}
        <div className="animate-fade-in delay-150">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b border-primary/10 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-on-background">Your Created Keepsakes</h2>
              <p className="text-xs text-on-surface-variant mt-1">Showing {filteredCreations.length} of {creations.length} total digital keepsakes.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-on-surface-variant/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipient or title..."
                  className="w-full bg-white/60 border border-primary/15 py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-primary text-on-background shadow-inner rounded-xl"
                />
              </div>

              <button onClick={onNavigateToExplore} className="btn-primary py-2 px-5 text-[9px] font-label-caps uppercase tracking-widest font-bold whitespace-nowrap shadow-md">
                Create New
              </button>
            </div>
          </div>

          {filteredCreations.length === 0 ? (
            <div className="text-center p-16 glass-card rounded-2xl border border-dashed border-primary/20 bg-white/40">
              <BookOpen className="w-12 h-12 mx-auto text-primary/40 mb-4 animate-pulse" />
              <h3 className="font-display text-xl font-bold mb-2">
                {searchQuery ? `No cards match "${searchQuery}"` : "No experiences crafted yet"}
              </h3>
              <p className="font-body-lg text-on-surface-variant text-xs mb-6 max-w-sm mx-auto">
                {searchQuery ? "Try clearing your search query." : "Start building your first digital gift surprise for someone special."}
              </p>
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="btn-primary">
                  Clear Search
                </button>
              ) : (
                <button onClick={onNavigateToExplore} className="btn-primary">
                  Browse Templates
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-scale-in" id="creations-list">
              {filteredCreations.map((creation) => {
                if (!creation) return null;
                const isLive = creation.status === 'LIVE';
                const matchedTemplate = TEMPLATE_EXPERIENCES.find(t => t.id === creation.templateId);
                const templateFallbackImg = matchedTemplate?.image || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80';
                const imagesList = Array.isArray(creation.images) ? creation.images : [];
                const defaultImage = (imagesList.length > 0 && imagesList[0]?.url) || templateFallbackImg;

                return (
                  <div
                    id={`creation-card-${creation.id}`}
                    key={creation.id}
                    className="glass-card overflow-hidden group flex flex-col sm:flex-row relative border border-primary/10 bg-white/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto min-h-[180px] bg-primary/10 relative overflow-hidden shrink-0">
                      <div
                        className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${defaultImage}')` }}
                      />
                      <div className="absolute inset-0 bg-[#200b13]/10 group-hover:bg-transparent transition-all" />
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 relative z-10">
                      <div>
                        {/* Top Badges */}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2.5 py-0.5 border text-[8px] font-bold tracking-[0.25em] uppercase rounded-full ${
                            isLive
                              ? 'bg-green-500/10 text-green-700 border-green-500/20'
                              : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                          }`}>
                            {creation.status}
                          </span>
                          <span className="font-label-caps text-[9px] text-on-surface-variant/80 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {creation.createdAt}
                          </span>
                        </div>

                        {/* Creator Info */}
                        <div className="flex items-center gap-1.5 font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider mb-2">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>By: {creation.creatorName || 'Anonymous'}</span>
                        </div>

                        {/* Recipient & Title */}
                        <h3 className="font-display text-xl leading-tight mb-2 font-bold group-hover:text-primary transition-colors text-on-background">
                          For {creation.recipientName}
                        </h3>
                        
                        <p className="font-body-lg text-on-surface-variant text-[11px] mb-4 line-clamp-1 italic">
                          "{creation.messageTitle}"
                        </p>

                        {/* Details Pills */}
                        <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-on-surface-variant mb-6">
                          <span className="bg-primary/5 px-2 py-0.5 rounded-md border border-primary/5">🎵 {creation.musicTrack || 'music'}</span>
                          <span className="bg-primary/5 px-2 py-0.5 rounded-md border border-primary/5">👁️ {creation.views || 0} views</span>
                          <span className="bg-primary/5 px-2 py-0.5 rounded-md border border-primary/5">💬 {creation.replies?.length || 0} replies</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-primary/5">
                        <button
                          id={`btn-details-${creation.id}`}
                          onClick={() => setSelectedDetailCreationState(creation)}
                          className="py-1.5 px-3 text-[9px] font-bold font-label-caps rounded-xl text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="View Full Details"
                        >
                          <Info className="w-3.5 h-3.5" />
                          Details
                        </button>
                        <button
                          id={`btn-edit-${creation.id}`}
                          onClick={() => onNavigateToWizard(creation.templateId, creation.id)}
                          className="flex-1 py-1.5 text-[9px] font-bold font-label-caps rounded-xl text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          id={`btn-preview-${creation.id}`}
                          onClick={() => onPreviewCreation(creation.id)}
                          className="flex-1 py-1.5 text-[9px] font-bold font-label-caps rounded-xl text-white bg-primary hover:opacity-90 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </button>
                        <button
                          id={`btn-link-${creation.id}`}
                          onClick={() => handleCopyLink(creation)}
                          className="py-1.5 px-3 text-[9px] font-bold font-label-caps rounded-xl text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="Copy Link"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-${creation.id}`}
                          onClick={() => onDeleteCreation(creation.id)}
                          className="py-1.5 px-3 text-[9px] font-bold font-label-caps rounded-xl text-red-600 border border-red-200 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* --- CARD FULL DETAIL INSPECTOR MODAL --- */}
      {setSelectedDetailCreation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#200b13]/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-primary/10 p-6 md:p-8 w-full max-w-2xl rounded-3xl relative shadow-2xl max-h-[85vh] overflow-y-auto font-sans animate-scale-in">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetailCreationState(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-primary/10 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Card Inspector</span>
                <h2 className="font-display text-2xl text-on-background font-bold tracking-tight">
                  For {setSelectedDetailCreation.recipientName}
                </h2>
              </div>
            </div>

            {/* Grid Details */}
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-primary/5 border border-primary/10 font-mono rounded-2xl">
                <div>
                  <span className="text-[8px] uppercase text-on-surface-variant block font-bold">Created By</span>
                  <span className="font-bold text-primary">{setSelectedDetailCreation.creatorName || 'Anonymous'}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-on-surface-variant block font-bold">Recipient</span>
                  <span className="font-bold text-on-background">{setSelectedDetailCreation.recipientName}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-on-surface-variant block font-bold">Relationship</span>
                  <span className="text-on-background">{setSelectedDetailCreation.relationship || 'Partner'}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-on-surface-variant block font-bold">Template ID</span>
                  <span className="text-on-background">{setSelectedDetailCreation.templateId}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-on-surface-variant block font-bold">Ambient Music</span>
                  <span className="text-on-background">{setSelectedDetailCreation.musicTrack}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-on-surface-variant block font-bold">Theme / Particles</span>
                  <span className="text-on-background">{setSelectedDetailCreation.themeColor} / {setSelectedDetailCreation.particles}</span>
                </div>
              </div>

              {/* Message Details */}
              <div className="p-4 border border-primary/10 bg-white space-y-2 rounded-2xl shadow-sm">
                <span className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider block">Heartfelt Message Details</span>
                <h3 className="font-display text-lg font-bold text-on-background">{setSelectedDetailCreation.messageTitle}</h3>
                <p className="font-body-lg text-on-surface-variant leading-relaxed text-xs p-3.5 bg-primary/5 rounded-xl border border-primary/5 italic">
                  "{setSelectedDetailCreation.messageBody}"
                </p>
              </div>

              {/* Attached Photos */}
              {setSelectedDetailCreation.images && setSelectedDetailCreation.images.length > 0 && (
                <div className="p-4 border border-primary/10 bg-white space-y-3 rounded-2xl shadow-sm">
                  <span className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider block">Attached Photos ({setSelectedDetailCreation.images.length})</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {setSelectedDetailCreation.images.map((img, i) => (
                      <div key={i} className="border border-primary/5 p-2 bg-primary/5 text-center rounded-xl">
                        <img src={img.url} alt={`Photo ${i+1}`} className="w-full h-24 object-cover mb-1.5 rounded-lg shadow-sm" />
                        <span className="text-[9px] text-on-surface-variant line-clamp-1 italic">{img.caption || 'Memory photo'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipient Replies */}
              <div className="p-4 border border-primary/10 bg-white space-y-2 rounded-2xl shadow-sm">
                <span className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider block">Recipient Replies ({setSelectedDetailCreation.replies?.length || 0})</span>
                {setSelectedDetailCreation.replies && setSelectedDetailCreation.replies.length > 0 ? (
                  <div className="space-y-2">
                    {setSelectedDetailCreation.replies.map((reply, rIdx) => (
                      <div key={rIdx} className="p-3 bg-primary/5 rounded-xl border border-primary/5 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-primary">{reply.sender}</strong>
                          <span className="text-[9px] font-mono text-on-surface-variant">{reply.date}</span>
                        </div>
                        <p className="text-on-surface-variant italic">"{reply.text}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-on-surface-variant italic pl-2">No replies recorded yet.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary/10">
                <button
                  onClick={() => handleCopyLink(setSelectedDetailCreation)}
                  className="flex-1 btn-primary py-3 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Link2 className="w-4 h-4" />
                  {copiedDetailLink ? 'Copied Link!' : 'Copy Share Link'}
                </button>
                <button
                  onClick={() => {
                    onPreviewCreation(setSelectedDetailCreation.id);
                    setSelectedDetailCreationState(null);
                  }}
                  className="border border-primary/20 text-primary hover:bg-primary/5 py-3 px-6 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Preview Card
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Menu */}
      <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-between items-center px-8 py-3.5 bg-white/90 backdrop-blur-md border-t border-primary/10 shadow-lg rounded-t-3xl">
        <button className="flex flex-col items-center text-primary">
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span className="font-label-caps text-[8px] mt-1 font-bold uppercase tracking-wider">Dashboard</span>
        </button>
        <button onClick={onNavigateToExplore} className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-all">
          <BookOpen className="w-4.5 h-4.5" />
          <span className="font-label-caps text-[8px] mt-1 font-bold uppercase tracking-wider">Explore</span>
        </button>
        <button
          onClick={() => onNavigateToWizard('birthday')}
          className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          <span className="font-label-caps text-[8px] mt-1 font-bold uppercase tracking-wider">Create</span>
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-all"
        >
          <SettingsIcon className="w-4.5 h-4.5" />
          <span className="font-label-caps text-[8px] mt-1 font-bold uppercase tracking-wider">Settings</span>
        </button>
      </nav>

      {/* Admin Settings Modal Component */}
      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        creations={allGlobalCreations || creations}
        onImportCreations={handleImportCreations}
        onResetCreations={handleResetCreations}
      />
    </div>
  );
}
