import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Settings as SettingsIcon, Plus, Eye, Link2, Edit3, Trash2, Calendar } from 'lucide-react';
import { Creation, INITIAL_CREATIONS } from '../types';
import { generateShareableUrl } from '../utils/share';
import AdminSettingsModal from './AdminSettingsModal';

interface DashboardScreenProps {
  creations: Creation[];
  onNavigateToExplore: () => void;
  onNavigateToWizard: (templateId?: string, editCreationId?: string) => void;
  onPreviewCreation: (creationId: string) => void;
  onDeleteCreation: (creationId: string) => void;
  onUpdateCreations?: (updated: Creation[]) => void;
}

export default function DashboardScreen({
  creations,
  onNavigateToExplore,
  onNavigateToWizard,
  onPreviewCreation,
  onDeleteCreation,
  onUpdateCreations
}: DashboardScreenProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const totalExperiences = creations.length;
  const activeLinks = creations.filter(c => c.status === 'LIVE').length;
  const totalViews = creations.reduce((sum, c) => sum + c.views, 0);

  const handleCopyLink = (id: string) => {
    const found = creations.find(c => c.id === id);
    if (found) {
      const shareableUrl = generateShareableUrl(found);
      navigator.clipboard.writeText(shareableUrl);
      alert('Copied shareable surprise link to clipboard!');
    } else {
      const origin = window.location.origin + window.location.pathname;
      const shareableUrl = `${origin}?giftId=${id}`;
      navigator.clipboard.writeText(shareableUrl);
      alert('Copied shareable link to clipboard!');
    }
  };

  const handleImportCreations = (imported: Creation[]) => {
    if (onUpdateCreations) {
      onUpdateCreations(imported);
    } else {
      localStorage.setItem('myheartcraft_creations', JSON.stringify(imported));
      window.location.reload();
    }
  };

  const handleResetCreations = () => {
    if (onUpdateCreations) {
      onUpdateCreations(INITIAL_CREATIONS);
    } else {
      localStorage.setItem('myheartcraft_creations', JSON.stringify(INITIAL_CREATIONS));
      window.location.reload();
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
          <p className="font-body-lg text-on-surface-variant text-sm md:text-base">Welcome back. Here is the catalog of your written and created digital moments.</p>
        </div>

        {/* Top Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in delay-75">
          {/* Stat 1 */}
          <div className="glass-card rounded-none p-6 flex flex-col justify-between h-36 border border-primary/25">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center text-primary bg-background">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Total Experiences</div>
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
                <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Active Links</div>
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
                <div className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Total Views</div>
                <div className="font-display-lg text-3xl font-light text-on-background mt-1">{totalViews}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Creations Section */}
        <div className="animate-fade-in delay-150">
          <div className="flex justify-between items-end mb-8 border-b border-primary/20 pb-4">
            <h2 className="font-display-lg text-2xl font-light text-on-background">Your Written Creations</h2>
            <button onClick={onNavigateToExplore} className="font-label-caps text-[10px] text-primary hover:opacity-75 transition-all font-bold uppercase tracking-[0.25em]">
              Create New
            </button>
          </div>

          {creations.length === 0 ? (
            <div className="text-center p-16 glass-card rounded-none border border-dashed border-primary/40">
              <BookOpen className="w-10 h-10 mx-auto text-primary mb-4" />
              <h3 className="font-display-lg text-xl font-light mb-2">No experiences crafted yet</h3>
              <p className="font-body-lg text-on-surface-variant text-xs mb-8">Start building your first digital gift surprise for someone special.</p>
              <button onClick={onNavigateToExplore} className="btn-primary">
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" id="creations-list">
              {creations.map((creation) => {
                const isLive = creation.status === 'LIVE';
                
                // Find template image placeholder if not supplied
                const defaultImage = creation.images[0]?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80';

                return (
                  <div
                    id={`creation-card-${creation.id}`}
                    key={creation.id}
                    className="glass-card rounded-none overflow-hidden group flex flex-col sm:flex-row relative border border-primary/25 bg-background"
                  >
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto min-h-[160px] bg-primary-container relative overflow-hidden shrink-0">
                      <div
                        className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-103 grayscale"
                        style={{ backgroundImage: `url('${defaultImage}')` }}
                      />
                      <div className="absolute inset-0 bg-[#1A1A1A]/20" />
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1 relative z-10">
                      <div>
                        <div className="flex justify-between items-start mb-4">
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

                        <h3 className="font-display-lg text-xl leading-tight mb-2 font-light group-hover:text-primary transition-colors text-on-background">
                          For {creation.recipientName}'s {creation.templateId === 'birthday' ? 'Birthday' : 'Celebration'}
                        </h3>
                        <p className="font-body-lg text-on-surface-variant text-[11px] mb-6 line-clamp-1">
                          {creation.messageTitle} • {creation.views} Views
                        </p>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-primary/10">
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
                          onClick={() => handleCopyLink(creation.id)}
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
        creations={creations}
        onImportCreations={handleImportCreations}
        onResetCreations={handleResetCreations}
      />
    </div>
  );
}
