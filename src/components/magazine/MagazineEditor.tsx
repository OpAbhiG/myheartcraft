import React, { useState } from 'react';
import { ArrowLeft, Eye, Grid, Undo, Redo, Save, Trash2, Plus, Sparkles, Image as ImageIcon, Type, Layout, AlignLeft, RefreshCw, X, Crop, Move } from 'lucide-react';
import { MagazineProject, MagazinePage, MagazinePhoto } from './types';
import { MAGAZINE_LAYOUTS, MAGAZINE_STYLES, MAGAZINE_PALETTES, assembleMagazinePages } from './templates';
import { improveText, generateMagazineText } from '../../utils/aiSimulator';

interface MagazineEditorProps {
  project: MagazineProject;
  onSave: (updated: MagazineProject) => void;
  onClose: () => void;
  onPreview: (projectId: string) => void;
}

export default function MagazineEditor({
  project: initialProject,
  onSave,
  onClose,
  onPreview
}: MagazineEditorProps) {
  const [project, setProject] = useState<MagazineProject>(initialProject);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  
  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState<MagazineProject[]>([]);
  const [redoStack, setRedoStack] = useState<MagazineProject[]>([]);

  // Editing Photo States
  const [croppingPhoto, setCroppingPhoto] = useState<MagazinePhoto | null>(null);

  const currentPage = project.pages[currentPageIndex] || project.pages[0];
  
  const basePreset = MAGAZINE_STYLES[project.style] || MAGAZINE_STYLES['minimal-editorial'];
  const palettePreset = project.palette && project.palette !== 'none' ? MAGAZINE_PALETTES[project.palette] : null;

  const stylePreset = {
    ...basePreset,
    colorBackground: palettePreset ? palettePreset.colorBackground : basePreset.colorBackground,
    colorTheme: palettePreset ? palettePreset.colorTheme : basePreset.colorTheme,
    textColor: palettePreset ? palettePreset.textColor : basePreset.textColor
  };

  const pushState = (nextProject: MagazineProject) => {
    setUndoStack(prev => [...prev, project]);
    setRedoStack([]);
    setProject(nextProject);
    localStorage.setItem(`magazine_${nextProject.id}`, JSON.stringify(nextProject));
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, project]);
    setProject(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, project]);
    setProject(next);
  };

  // Change page layout type
  const handleChangePageLayout = (layoutType: MagazinePage['layoutType']) => {
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        // Regenerate default texts based on layout type
        const textData = generateMagazineText(project.basicInfo, project.category, project.style, project.basicInfo.tone, layoutType);
        return {
          ...p,
          layoutType,
          title: textData.title,
          subtitle: textData.subtitle,
          bodyText: textData.body,
          quoteText: textData.quote,
          quoteAuthor: textData.author
        };
      }
      return p;
    });

    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
  };

  // Update text values
  const handleUpdateText = (field: 'title' | 'subtitle' | 'bodyText' | 'quoteText' | 'quoteAuthor', val: string) => {
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, [field]: val };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
  };

  // AI text adjustments
  const handleAiTextAction = (field: 'title' | 'subtitle' | 'bodyText', action: 'shorter' | 'longer' | 'emotional' | 'funny' | 'elegant' | 'cinematic' | 'grammar') => {
    const originalText = currentPage[field] || '';
    const improved = improveText(originalText, action);
    handleUpdateText(field, improved);
  };

  // Replace photo on current page
  const handleReplacePhoto = (photoIdIndex: number, newPhotoUrl: string) => {
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        const photoIds = [...p.photoIds];
        
        // Find if we already have a photo in this index
        // Or append a new photo reference
        const newPhotoObj: MagazinePhoto = {
          id: `ph-replaced-${Date.now()}`,
          url: newPhotoUrl,
          caption: 'Replaced photo'
        };

        // Update project.photos list as well
        const updatedPhotos = [...project.photos, newPhotoObj];

        photoIds[photoIdIndex] = newPhotoObj.id;

        return { ...p, photoIds };
      }
      return p;
    });

    pushState({
      ...project,
      pages: updatedPages,
      photos: [...project.photos, { id: `ph-replaced-${Date.now()}`, url: newPhotoUrl, caption: 'Memory photo' }],
      updatedAt: new Date().toISOString()
    });
  };

  const handlePhotoUploadInput = (e: React.ChangeEvent<HTMLInputElement>, photoIndex: number) => {
    if (!e.target.files || !e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleReplacePhoto(photoIndex, event.target.result as string);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  // Page managers
  const handleAddPage = () => {
    const newPage: MagazinePage = {
      id: `m-page-add-${Date.now()}`,
      pageNumber: project.pages.length + 1,
      layoutType: 'story',
      title: 'A New Chapter',
      subtitle: 'Stories worth remembering',
      bodyText: 'Fill this page with your memories, text descriptions, and photos.',
      photoIds: [],
      backgroundColor: stylePreset.colorBackground,
      themeColor: stylePreset.colorTheme
    };

    pushState({
      ...project,
      pages: [...project.pages, newPage],
      updatedAt: new Date().toISOString()
    });
    setCurrentPageIndex(project.pages.length);
  };

  const handleDeletePage = () => {
    if (project.pages.length <= 4) {
      alert("Magazines require at least 4 pages.");
      return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this page?")) return;

    const remainingPages = project.pages
      .filter((_, idx) => idx !== currentPageIndex)
      .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));

    pushState({
      ...project,
      pages: remainingPages,
      updatedAt: new Date().toISOString()
    });
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  const handleSave = () => {
    onSave({ ...project, updatedAt: new Date().toISOString() });
    alert('Magazine draft saved successfully!');
  };

  // Helper to render responsive layouts inside Editor Canvas
  const renderLayoutPreview = (page: MagazinePage) => {
    const pagePhotos = page.photoIds.map(id => project.photos.find(ph => ph.id === id)?.url || '');
    
    switch (page.layoutType) {
      case 'cover':
        return (
          <div className="w-full h-full flex flex-col justify-between p-8" style={{ color: stylePreset.textColor }}>
            <div className="text-center space-y-2 mt-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-75">{stylePreset.tagline}</span>
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight" style={{ fontFamily: stylePreset.fontHeading }}>
                {page.title}
              </h1>
              <p className="text-[10px] uppercase tracking-widest opacity-80">{page.subtitle}</p>
            </div>
            
            <div className="h-64 bg-gray-50 border border-primary/20 relative group overflow-hidden">
              {pagePhotos[0] ? (
                <img src={pagePhotos[0]} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#999] font-mono">No cover photo selected</div>
              )}
              {/* Overlay upload button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <label className="bg-white text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer">
                  Replace Photo
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 0)} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono border-t border-primary/10 pt-4">
              <span>MEMORA EDITORIAL CO.</span>
              <span>SPECIAL ISSUE</span>
            </div>
          </div>
        );

      case 'editorial-split':
        return (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 p-6 gap-6" style={{ color: stylePreset.textColor }}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#888] block mb-3">FEATURE COLUMN</span>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
                <p className="text-[9.5px] uppercase tracking-wider text-[#999] mb-4">{page.subtitle}</p>
                <p className="text-[11px] leading-relaxed opacity-85 whitespace-pre-wrap">{page.bodyText}</p>
              </div>
              <span className="font-mono text-[7px] text-[#999]">VOL I // SPECIAL EDITION</span>
            </div>

            <div className="h-full bg-gray-50 border border-primary/20 relative group overflow-hidden">
              {pagePhotos[0] ? (
                <img src={pagePhotos[0]} alt="Editorial" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#999] font-mono">No photo</div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <label className="bg-white text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer">
                  Replace Photo
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 0)} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        );

      case 'photo-grid':
        return (
          <div className="w-full h-full p-6 flex flex-col justify-between" style={{ color: stylePreset.textColor }}>
            <div>
              <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
              <p className="text-[9px] uppercase tracking-wider text-center text-[#999] mb-6">{page.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 h-72">
              {[0, 1, 2, 3].map(gridIdx => (
                <div key={gridIdx} className="w-full h-full bg-gray-50 border border-primary/10 relative group overflow-hidden">
                  {pagePhotos[gridIdx] ? (
                    <img src={pagePhotos[gridIdx]} alt="Grid" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-[#999] font-mono">Empty Slot</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label className="bg-white text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer">
                      Replace Photo
                      <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, gridIdx)} className="hidden" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'story':
        return (
          <div className="w-full h-full p-6 flex flex-col justify-between" style={{ color: stylePreset.textColor }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-72">
              <div className="bg-gray-50 border border-primary/20 relative group overflow-hidden">
                {pagePhotos[0] ? (
                  <img src={pagePhotos[0]} alt="Story" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#999] font-mono">No photo</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="bg-white text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer">
                    Replace Photo
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 0)} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-3" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
                  <p className="text-[11px] leading-relaxed opacity-85 whitespace-pre-wrap">{page.bodyText}</p>
                </div>
              </div>
            </div>
            <p className="text-center text-[9px] uppercase tracking-widest border-t border-primary/10 pt-4 mt-4 font-mono">{page.subtitle}</p>
          </div>
        );

      case 'quote':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-12 text-center" style={{ color: stylePreset.textColor }}>
            <span className="text-3xl text-primary opacity-60 mb-4" style={{ fontFamily: stylePreset.fontHeading }}>“</span>
            <blockquote className="text-lg md:text-xl font-semibold mb-4 leading-relaxed italic" style={{ fontFamily: stylePreset.fontHeading }}>
              {page.quoteText || 'A beautiful memory worth remembering.'}
            </blockquote>
            <cite className="font-mono text-[9px] uppercase tracking-widest text-[#777] not-italic">
              {page.quoteAuthor || '— Anonymous'}
            </cite>
          </div>
        );

      case 'timeline':
        return (
          <div className="w-full h-full p-8 flex flex-col justify-between" style={{ color: stylePreset.textColor }}>
            <div>
              <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
              <p className="text-[9px] uppercase tracking-wider text-center text-[#999] mb-8">{page.subtitle}</p>
            </div>

            <div className="flex-grow space-y-4 max-w-sm mx-auto">
              {page.bodyText?.split('\n').map((line, idx) => {
                const [time, desc] = line.split(' • ');
                return (
                  <div key={idx} className="flex gap-4 border-l border-primary/20 pl-4 relative pb-2">
                    <div className="w-2.5 h-2.5 bg-primary absolute -left-[5px] top-1" />
                    <div>
                      <span className="font-mono text-[10px] font-bold block">{time || 'Milestone'}</span>
                      <span className="text-[11px] opacity-80">{desc || 'Description of the moment.'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'masonry':
        return (
          <div className="w-full h-full p-6 flex flex-col justify-between" style={{ color: stylePreset.textColor }}>
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily: stylePreset.fontHeading }}>{page.title || "Portfolio Collection"}</h2>
              <p className="text-[8px] uppercase tracking-wider text-[#999]">{page.subtitle || "Selected Fragments"}</p>
            </div>
            
            <div className="relative flex-grow h-48 w-full flex items-center justify-center">
              <div className="absolute left-2 top-2 w-[42%] h-[65%] border border-[#ddd] bg-white p-1 shadow-md -rotate-6 z-10 overflow-hidden group">
                {pagePhotos[0] ? (
                  <img src={pagePhotos[0]} alt="Masonry 1" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">Empty</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="bg-white text-black px-1.5 py-1 text-[7px] font-bold uppercase tracking-wider cursor-pointer">
                    Replace
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 0)} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="w-[50%] h-[80%] border border-[#ddd] bg-white p-1.5 shadow-xl rotate-3 z-0 overflow-hidden group">
                {pagePhotos[1] ? (
                  <img src={pagePhotos[1]} alt="Masonry 2" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">Empty</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="bg-white text-black px-1.5 py-1 text-[7px] font-bold uppercase tracking-wider cursor-pointer">
                    Replace
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 1)} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="absolute right-2 bottom-4 w-[38%] h-[60%] border border-[#ddd] bg-white p-1 shadow-md -rotate-3 z-10 overflow-hidden group">
                {pagePhotos[2] ? (
                  <img src={pagePhotos[2]} alt="Masonry 3" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">Empty</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="bg-white text-black px-1.5 py-1 text-[7px] font-bold uppercase tracking-wider cursor-pointer">
                    Replace
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 2)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {page.bodyText && (
              <p className="text-[9px] text-center italic opacity-85 mt-2 max-w-xs mx-auto leading-relaxed">
                {page.bodyText}
              </p>
            )}
          </div>
        );

      case 'celebration':
        return (
          <div className="w-full h-full p-6 flex flex-col justify-between" style={{ color: stylePreset.textColor }}>
            <div className="text-center space-y-1">
              <span className="font-mono text-[7px] uppercase tracking-[0.2em] opacity-75">special celebration</span>
              <h2 className="text-lg font-bold uppercase tracking-tight" style={{ fontFamily: stylePreset.fontHeading }}>
                {page.title || "Celebrating Life"}
              </h2>
              <p className="text-[8px] uppercase tracking-wider text-primary font-bold">{page.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 h-40 my-3">
              <div className="h-full border border-primary/10 overflow-hidden shadow-sm relative group">
                {pagePhotos[0] ? (
                  <img src={pagePhotos[0]} alt="Celebration 1" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">Empty</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="bg-white text-black px-1.5 py-1 text-[7px] font-bold uppercase tracking-wider cursor-pointer">
                    Replace
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 0)} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="h-full border border-primary/10 overflow-hidden shadow-sm relative group">
                {pagePhotos[1] ? (
                  <img src={pagePhotos[1]} alt="Celebration 2" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[8px] text-gray-400">Empty</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="bg-white text-black px-1.5 py-1 text-[7px] font-bold uppercase tracking-wider cursor-pointer">
                    Replace
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 1)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <p className="text-[9px] leading-relaxed text-center opacity-85 px-2">
              {page.bodyText || "A toast to the beautiful milestones we've shared, and the exciting adventures that lie ahead."}
            </p>
          </div>
        );

      case 'hero':
        return (
          <div className="w-full h-full relative overflow-hidden group">
            {pagePhotos[0] ? (
              <img src={pagePhotos[0]} alt="Hero Full" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#999] bg-gray-50 font-mono">No hero photo selected</div>
            )}
            {/* Absolute overlay elements for editorial style */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm p-4 border border-white/20">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h3>
              <p className="text-[9px] text-[#ccc] uppercase tracking-wider mt-1">{page.subtitle}</p>
            </div>
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <label className="bg-white text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer">
                Replace Photo
                <input type="file" accept="image/*" onChange={(e) => handlePhotoUploadInput(e, 0)} className="hidden" />
              </label>
            </div>
          </div>
        );

      case 'closing':
      default:
        return (
          <div className="w-full h-full flex flex-col justify-between p-8 text-center" style={{ color: stylePreset.textColor }}>
            <div className="mt-20">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
              <p className="text-xs uppercase tracking-widest text-[#999] font-mono">{page.subtitle}</p>
            </div>

            <p className="text-[11px] leading-relaxed max-w-xs mx-auto opacity-80 whitespace-pre-wrap">{page.bodyText}</p>

            <div className="font-mono text-[8px] text-[#aaa] border-t border-primary/10 pt-6 mt-12">
              DESIGNED IN CREATOR STUDIO // MEMORA MAGAZINE
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col antialiased font-sans" id="magazine-editor-container">
      {/* Top Header Controls */}
      <header className="h-16 border-b border-[#2a2a2a] px-6 flex justify-between items-center bg-[#1C1C1C] shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-[#282828] text-[#999] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              {project.basicInfo.title}
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#333] text-[#bbb] font-mono">{project.size} Format</span>
            </h1>
            <p className="text-[10px] text-[#666] font-mono mt-0.5">Style: {project.style.replace('-', ' ')}</p>
          </div>
        </div>

        {/* Undo/Redo & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#333] divide-x divide-[#333] bg-[#222]">
            <button 
              onClick={handleUndo} 
              disabled={undoStack.length === 0}
              className={`p-2.5 transition-colors ${undoStack.length === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#333] text-white'}`}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={redoStack.length === 0}
              className={`p-2.5 transition-colors ${redoStack.length === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#333] text-white'}`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onPreview(project.id)}
            className="px-4 py-2 border border-[#444] text-[#ccc] hover:bg-[#282828] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#282828] hover:bg-[#383838] border border-[#444] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Save Draft
          </button>
          
          <button
            onClick={() => {
              const updated = { ...project, status: 'LIVE' as const, updatedAt: new Date().toISOString() };
              onSave(updated);
              alert('Magazine published successfully!');
            }}
            className="btn-primary py-2 px-4 text-xs bg-[#FAF9F6] text-black border-none hover:bg-white"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* Left Page List Column */}
        <aside className="w-56 border-r border-[#2a2a2a] bg-[#1C1C1C] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#2a2a2a] flex justify-between items-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#777] font-bold">Magazine Pages</span>
            <button onClick={handleAddPage} className="p-1 hover:bg-[#2a2a2a] text-[#aaa] hover:text-white" title="Add page">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {project.pages.map((p, idx) => {
              const isActive = idx === currentPageIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`w-full text-left p-3 border transition-all flex flex-col justify-between ${
                    isActive ? 'border-primary bg-primary/10 text-white font-bold' : 'border-[#333] hover:bg-[#252525] text-[#888]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span>Page {p.pageNumber}</span>
                    <span className="text-[8px] uppercase tracking-wider bg-black/40 px-1 py-0.5">{p.layoutType}</span>
                  </div>
                  <h4 className="text-[11px] mt-2 line-clamp-1 opacity-90">{p.title || 'Untitled Page'}</h4>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Canvas Column */}
        <main className="flex-grow flex items-center justify-center p-6 overflow-y-auto relative bg-[#141414]">
          <div 
            className="w-full max-w-[420px] aspect-[1/1.414] shadow-2xl relative border border-black overflow-hidden"
            style={{ backgroundColor: stylePreset.colorBackground }}
          >
            {renderLayoutPreview(currentPage)}
          </div>
        </main>

        {/* Right Settings Settings Column */}
        <aside className="w-80 border-l border-[#2a2a2a] bg-[#1C1C1C] p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#777] block mb-2">Page Inspector</span>
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">Editorial Controls</h4>
          </div>

          {/* Change Layout Template selection */}
          <div className="space-y-2.5">
            <label className="font-mono text-[9px] uppercase tracking-wider text-[#888] block">Page Layout Grid</label>
            <select
              value={currentPage.layoutType}
              onChange={(e: any) => handleChangePageLayout(e.target.value)}
              className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none"
            >
              {Object.keys(MAGAZINE_LAYOUTS).map(layKey => (
                <option key={layKey} value={layKey}>
                  {MAGAZINE_LAYOUTS[layKey].title}
                </option>
              ))}
            </select>
          </div>

          {/* Designer Color Palette selection */}
          <div className="space-y-2.5 border-t border-[#2a2a2a] pt-4">
            <label className="font-mono text-[9px] uppercase tracking-wider text-[#888] block">Designer Color Palette</label>
            <select
              value={project.palette || 'none'}
              onChange={(e: any) => pushState({ ...project, palette: e.target.value as any })}
              className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="none">Default Theme Style</option>
              {Object.keys(MAGAZINE_PALETTES).map(palKey => (
                <option key={palKey} value={palKey}>
                  {MAGAZINE_PALETTES[palKey].name}
                </option>
              ))}
            </select>
          </div>

          {/* Page Details Form */}
          <div className="space-y-4 border-t border-[#2a2a2a] pt-4">
            <span className="text-[10px] text-[#888] block font-mono">Page Text Values</span>
            
            {/* Title field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[9px] text-[#777] uppercase">Page Headline</label>
                <button
                  onClick={() => handleAiTextAction('title', 'elegant')}
                  className="text-[8px] uppercase font-bold text-amber-400 flex items-center gap-1 hover:text-amber-300"
                >
                  <Sparkles className="w-2.5 h-2.5 fill-current" /> AI Tone
                </button>
              </div>
              <input
                type="text"
                value={currentPage.title || ''}
                onChange={(e) => handleUpdateText('title', e.target.value)}
                className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Subtitle field */}
            <div className="space-y-1">
              <label className="font-mono text-[9px] text-[#777] uppercase">Page Subtitle</label>
              <input
                type="text"
                value={currentPage.subtitle || ''}
                onChange={(e) => handleUpdateText('subtitle', e.target.value)}
                className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Body Text (if editorial/story page) */}
            {['editorial-split', 'story', 'timeline', 'closing'].includes(currentPage.layoutType) && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[9px] text-[#777] uppercase">Paragraph Article</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAiTextAction('bodyText', 'shorter')}
                      className="text-[8px] uppercase text-amber-400 hover:text-amber-300"
                    >
                      Shorter
                    </button>
                    <button
                      onClick={() => handleAiTextAction('bodyText', 'longer')}
                      className="text-[8px] uppercase text-amber-400 hover:text-amber-300"
                    >
                      Expand
                    </button>
                  </div>
                </div>
                <textarea
                  value={currentPage.bodyText || ''}
                  onChange={(e) => handleUpdateText('bodyText', e.target.value)}
                  rows={4}
                  className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Quote field */}
            {currentPage.layoutType === 'quote' && (
              <>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-[#777] uppercase">Quote Text</label>
                  <textarea
                    value={currentPage.quoteText || ''}
                    onChange={(e) => handleUpdateText('quoteText', e.target.value)}
                    rows={3}
                    className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-[#777] uppercase">Quote Author</label>
                  <input
                    type="text"
                    value={currentPage.quoteAuthor || ''}
                    onChange={(e) => handleUpdateText('quoteAuthor', e.target.value)}
                    className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Delete active page */}
          <div className="border-t border-[#2a2a2a] pt-4 mt-auto">
            <button
              onClick={handleDeletePage}
              className="w-full py-2.5 bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Active Page
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
