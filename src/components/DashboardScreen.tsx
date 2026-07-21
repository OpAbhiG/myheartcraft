import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Settings as SettingsIcon, Plus, Eye, Link2, Edit3, Trash2, Calendar, User, Info, MessageSquare, Music, Sparkles, Heart, X, Copy, Check, Search } from 'lucide-react';
import { Creation, INITIAL_CREATIONS } from '../types';
import { generateShareableUrl } from '../utils/share';
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
  const [selectedDetailCreation, setSelectedDetailCreation] = useState<Creation | null>(null);
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
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row antialiased relative" id="dashboard-container">
      
      {/* Sidebar - Desktop */}
      <nav className="hidden lg:flex flex-col h-screen p-8 bg-surface-container w-64 fixed left-0 top-0 z-40 border-r border-primary/25">
        <div className="mb-12">
          <div className="font-display-lg text-2xl text-primary font-bold tracking-tight uppercase italic">MyHeartCraft</div>
          <div className="font-label-caps text-[9px] text-on-surface-variant mt-1.5 uppercase tracking-[0.25em] opacity-75">Creator Studio</div>
        </div>

        <ul className="flex-1 space-y-3">
          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-primary font-bold border border-primary bg-background rounded-none text-left">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="font-sans text-xs uppercase tracking-wider font-bold">Dashboard</span>
            </button>
          </li>
          <li>
            <button onClick={onNavigateToExplore} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant border border-transparent hover:border-primary/20 hover:bg-background rounded-none text-left transition-all">
              <BookOpen className="w-4 h-4 text-on-surface-variant/75" />
              <span className="font-sans text-xs uppercase tracking-wider">Explore Templates</span>
            </button>
          </li>
          <li>
            <button
              id="sidebar-btn-settings"
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant border border-transparent hover:border-primary/20 hover:bg-background rounded-none text-left transition-all"
            >
              <SettingsIcon className="w-4 h-4 text-on-surface-variant/75" />
              <span className="font-sans text-xs uppercase tracking-wider">Studio Settings</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto">
          <button
            id="sidebar-btn-new"
            onClick={onNavigateToExplore}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Experience
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-64 p-6 md:p-12 pb-24 md:pb-12 min-h-screen">
        
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#999] mb-4">Workspace overview</p>
          <h1 className="font-display-lg text-4xl md:text-6xl text-on-background mb-3 font-light tracking-tight">Creator Studio</h1>
          <p className="font-body-lg text-on-surface-variant text-sm md:text-base">Welcome back. Here is the catalog of all created digital moments and recipient details.</p>
        </div>

        {/* Top Stats Bento Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in delay-75">
          {/* Stat 1 */}
          <div className="glass-card rounded-none p-6 flex flex-col justify-between h-36 border border-primary/25">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center text-primary bg-background">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Total Created Cards</div>
                <div className="font-display-lg text-3xl font-light text-on-background mt-1">{totalExperiences}</div>
              </div>
            </div>
          </div>
          
          {/* Stat 2 */}
          <div className="glass-card rounded-none p-6 flex flex-col justify-between h-36 border border-primary/25">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center text-primary bg-background">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Active Live Links</div>
                <div className="font-display-lg text-3xl font-light text-on-background mt-1">{activeLinks}</div>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-card rounded-none p-6 flex flex-col justify-between h-36 border border-primary/25">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center text-primary bg-background">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Total Recipient Views</div>
                <div className="font-display-lg text-3xl font-light text-on-background mt-1">{totalViews}</div>
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass-card rounded-none p-6 flex flex-col justify-between h-36 border border-primary/25">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center text-primary bg-background">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Unique Creators</div>
                <div className="font-display-lg text-3xl font-light text-on-background mt-1">{uniqueCreatorsCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Creations Section */}
        <div className="animate-fade-in delay-150">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 border-b border-primary/20 pb-4">
            <div>
              <h2 className="font-display-lg text-2xl font-light text-on-background">Your Created Keepsakes</h2>
              <p className="text-[11px] text-on-surface-variant mt-1">Showing {filteredCreations.length} of {creations.length} total digital keepsakes.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-on-surface-variant" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipient or title..."
                  className="w-full bg-surface-container border border-primary/25 py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:border-primary text-on-background"
                />
              </div>

              <button onClick={onNavigateToExplore} className="font-label-caps text-[10px] text-primary hover:opacity-75 transition-all font-bold uppercase tracking-[0.25em] whitespace-nowrap">
                Create New
              </button>
            </div>
          </div>

          {filteredCreations.length === 0 ? (
            <div className="text-center p-16 glass-card rounded-none border border-dashed border-primary/40">
              <BookOpen className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-display-lg text-xl font-light mb-2">
                {searchQuery ? `No cards match "${searchQuery}"` : "No experiences crafted yet"}
              </h3>
              <p className="font-body-lg text-on-surface-variant text-xs mb-8">
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" id="creations-list">
              {filteredCreations.map((creation) => {
                if (!creation) return null;
                const isLive = creation.status === 'LIVE';
                const imagesList = Array.isArray(creation.images) ? creation.images : [];
                const defaultImage = (imagesList.length > 0 && imagesList[0]?.url) || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80';

                return (
                  <div
                    id={`creation-card-${creation.id}`}
                    key={creation.id}
                    className="glass-card rounded-none overflow-hidden group flex flex-col sm:flex-row relative border border-primary/25 bg-background shadow-sm hover:border-primary transition-all duration-300"
                  >
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto min-h-[180px] bg-primary-container relative overflow-hidden shrink-0">
                      <div
                        className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-103 grayscale"
                        style={{ backgroundImage: `url('${defaultImage}')` }}
                      />
                      <div className="absolute inset-0 bg-[#1A1A1A]/20" />
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 relative z-10">
                      <div>
                        {/* Top Badges */}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2.5 py-0.5 border text-[8px] font-bold tracking-[0.25em] uppercase rounded-none ${
                            isLive
                              ? 'bg-primary text-background border-primary'
                              : 'bg-background text-on-surface-variant border-primary/20'
                          }`}>
                            {creation.status}
                          </span>
                          <span className="font-label-caps text-[9px] text-on-surface-variant/80 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {creation.createdAt}
                          </span>
                        </div>

                        {/* Creator Info Badge */}
                        <div className="flex items-center gap-1.5 font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider mb-2">
                          <User className="w-3 h-3 text-primary" />
                          <span>Created By: {creation.creatorName || 'Anonymous'}</span>
                        </div>

                        {/* Recipient & Card Title */}
                        <h3 className="font-display-lg text-xl leading-tight mb-2 font-light group-hover:text-primary transition-colors text-on-background">
                          For {creation.recipientName} ({creation.relationship || 'Partner'})
                        </h3>
                        
                        <p className="font-body-lg text-on-surface-variant text-[11px] mb-4 line-clamp-1">
                          "{creation.messageTitle}"
                        </p>

                        {/* Parameter Details Pills */}
                        <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-on-surface-variant mb-6">
                          <span className="bg-surface-container px-2 py-0.5 border border-primary/10">🎵 {creation.musicTrack || 'music'}</span>
                          <span className="bg-surface-container px-2 py-0.5 border border-primary/10">👁️ {creation.views || 0} views</span>
                          <span className="bg-surface-container px-2 py-0.5 border border-primary/10">💬 {creation.replies?.length || 0} replies</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-primary/10">
                        <button
                          id={`btn-details-${creation.id}`}
                          onClick={() => setSelectedDetailCreation(creation)}
                          className="py-1.5 px-3 text-[9px] font-bold font-label-caps rounded-none text-primary border border-primary/30 hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
                          title="View Full Details"
                        >
                          <Info className="w-3 h-3" />
                          Details
                        </button>
                        <button
                          id={`btn-edit-${creation.id}`}
                          onClick={() => onNavigateToWizard(creation.templateId, creation.id)}
                          className="flex-1 py-1.5 text-[9px] font-bold font-label-caps rounded-none text-primary border border-primary/30 hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          id={`btn-preview-${creation.id}`}
                          onClick={() => onPreviewCreation(creation.id)}
                          className="flex-1 py-1.5 text-[9px] font-bold font-label-caps rounded-none text-primary border border-primary/30 hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Preview
                        </button>
                        <button
                          id={`btn-link-${creation.id}`}
                          onClick={() => handleCopyLink(creation)}
                          className="py-1.5 px-3 text-[9px] font-bold font-label-caps rounded-none text-primary border border-primary/30 hover:bg-primary hover:text-background transition-colors flex items-center justify-center"
                          title="Copy Link"
                        >
                          <Link2 className="w-3 h-3" />
                        </button>
                        <button
                          id={`btn-delete-${creation.id}`}
                          onClick={() => onDeleteCreation(creation.id)}
                          className="py-1.5 px-3 text-[9px] font-bold font-label-caps rounded-none text-red-700 border border-red-200 hover:bg-red-50 hover:text-white transition-colors flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
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
      {selectedDetailCreation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
          <div className="bg-background border border-primary p-6 md:p-10 w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetailCreation(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-primary/20 pb-4 mb-6">
              <div className="w-10 h-10 border border-primary flex items-center justify-center text-primary bg-background">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-widest">Card Inspector</span>
                <h2 className="font-display-lg text-2xl text-on-background font-light uppercase tracking-tight">
                  For {selectedDetailCreation.recipientName}
                </h2>
              </div>
            </div>

            {/* Grid Details */}
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-surface-container border border-primary/20 font-mono">
                <div>
                  <span className="text-[9px] uppercase text-on-surface-variant block font-bold">Created By</span>
                  <span className="font-bold text-primary">{selectedDetailCreation.creatorName || 'Anonymous'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-on-surface-variant block font-bold">Recipient Name</span>
                  <span className="font-bold text-on-background">{selectedDetailCreation.recipientName}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-on-surface-variant block font-bold">Relationship</span>
                  <span className="text-on-background">{selectedDetailCreation.relationship || 'Partner'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-on-surface-variant block font-bold">Template ID</span>
                  <span className="text-on-background">{selectedDetailCreation.templateId}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-on-surface-variant block font-bold">Ambient Music</span>
                  <span className="text-on-background">{selectedDetailCreation.musicTrack}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-on-surface-variant block font-bold">Theme / Particles</span>
                  <span className="text-on-background">{selectedDetailCreation.themeColor} / {selectedDetailCreation.particles}</span>
                </div>
              </div>

              {/* Message Details */}
              <div className="p-4 border border-primary/20 bg-background space-y-2">
                <span className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider block">Heartfelt Letter Title & Message</span>
                <h3 className="font-display-lg text-lg font-light text-on-background">{selectedDetailCreation.messageTitle}</h3>
                <p className="font-body-lg text-on-surface-variant leading-relaxed text-xs p-3 bg-surface-container border border-primary/10 italic">
                  "{selectedDetailCreation.messageBody}"
                </p>
              </div>

              {/* Attached Photos */}
              {selectedDetailCreation.images && selectedDetailCreation.images.length > 0 && (
                <div className="p-4 border border-primary/20 bg-background space-y-3">
                  <span className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider block">Attached Photos ({selectedDetailCreation.images.length})</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedDetailCreation.images.map((img, i) => (
                      <div key={i} className="border border-primary/10 p-2 bg-surface-container text-center">
                        <img src={img.url} alt={`Photo ${i+1}`} className="w-full h-24 object-cover mb-1.5" />
                        <span className="text-[10px] text-on-surface-variant line-clamp-1 italic">{img.caption || 'Memory photo'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipient Replies */}
              <div className="p-4 border border-primary/20 bg-background space-y-2">
                <span className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-wider block">Recipient Replies ({selectedDetailCreation.replies?.length || 0})</span>
                {selectedDetailCreation.replies && selectedDetailCreation.replies.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDetailCreation.replies.map((reply, rIdx) => (
                      <div key={rIdx} className="p-3 bg-surface-container border border-primary/10 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-primary">{reply.sender}</strong>
                          <span className="text-[9px] font-mono text-on-surface-variant">{reply.date}</span>
                        </div>
                        <p className="text-on-surface-variant italic">"{reply.text}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-on-surface-variant italic">No replies recorded yet.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary/20">
                <button
                  onClick={() => handleCopyLink(selectedDetailCreation)}
                  className="flex-1 btn-primary py-3 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  {copiedDetailLink ? 'Copied Link!' : 'Copy Share Link'}
                </button>
                <button
                  onClick={() => {
                    onPreviewCreation(selectedDetailCreation.id);
                    setSelectedDetailCreation(null);
                  }}
                  className="border border-primary text-primary hover:bg-primary/10 py-3 px-6 font-label-caps text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2"
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
      <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-between items-center px-6 py-3 bg-background border-t border-primary/20 shadow-lg">
        <button className="flex flex-col items-center text-primary">
          <LayoutDashboard className="w-4 h-4" />
          <span className="font-label-caps text-[8px] mt-1 font-bold uppercase tracking-wider">Dashboard</span>
        </button>
        <button onClick={onNavigateToExplore} className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors">
          <BookOpen className="w-4 h-4" />
          <span className="font-label-caps text-[8px] mt-1 font-bold uppercase tracking-wider">Explore</span>
        </button>
        <button
          onClick={() => onNavigateToWizard('birthday')}
          className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-label-caps text-[8px] mt-1 font-bold uppercase tracking-wider">Create</span>
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
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
