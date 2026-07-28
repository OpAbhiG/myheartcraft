import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo, Redo, Plus, Trash2, Layers, Lock, Unlock, Copy, 
  Image as ImageIcon, Type, Sparkles, BookOpen, Music, 
  ChevronLeft, ChevronRight, Grid, Save, ArrowLeft, Crop,
  RotateCw, ZoomIn, Eye, Play, Sliders, Trash, Check, X,
  AlignLeft, AlignCenter, AlignRight, Bold, FolderOpen
} from 'lucide-react';
import { ScrapbookProject, ScrapbookPage, ScrapbookElement } from './types';
import { 
  SCRAPBOOK_BACKGROUNDS, SCRAPBOOK_STICKERS, SCRAPBOOK_TAPES, 
  SCRAPBOOK_PAPERS, SCRAPBOOK_DOODLES, SCRAPBOOK_STAMPS, 
  SCRAPBOOK_FONTS, MEMORY_PROMPTS 
} from './assets';
import { arrangeScrapbookPage, improveText } from '../../utils/aiSimulator';

interface ScrapbookEditorProps {
  project: ScrapbookProject;
  onSave: (updated: ScrapbookProject) => void;
  onClose: () => void;
  onPreview: (projectId: string) => void;
}

export default function ScrapbookEditor({
  project: initialProject,
  onSave,
  onClose,
  onPreview
}: ScrapbookEditorProps) {
  const [project, setProject] = useState<ScrapbookProject>(initialProject);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);

  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState<ScrapbookProject[]>([]);
  const [redoStack, setRedoStack] = useState<ScrapbookProject[]>([]);

  // Active Tool Panel
  const [activePanel, setActivePanel] = useState<'photos' | 'text' | 'stickers' | 'tapes' | 'paper' | 'doodles' | 'stamps' | 'backgrounds' | 'ai' | 'pages' | null>(null);

  // Photo Crop Modal States
  const [editingPhotoElement, setEditingPhotoElement] = useState<ScrapbookElement | null>(null);

  // UI States
  const [promptCategory, setPromptCategory] = useState<string>(project.type);
  const [showPromptsModal, setShowPromptsModal] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; elX: number; elY: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; elW: number; elH: number } | null>(null);
  const rotateStartRef = useRef<{ startAngle: number; initialRotation: number; centerX: number; centerY: number } | null>(null);

  // Current active page
  const currentPage = project.pages[currentPageIndex] || project.pages[0];

  // Helper to commit new history state
  const pushState = (nextProject: ScrapbookProject) => {
    setUndoStack(prev => [...prev, project]);
    setRedoStack([]);
    setProject(nextProject);
    // Auto-save to localStorage
    localStorage.setItem(`scrapbook_${nextProject.id}`, JSON.stringify(nextProject));
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

  // Add generic element helper
  const addElement = (type: ScrapbookElement['type'], content: string, customStyles: any = {}) => {
    const newEl: ScrapbookElement = {
      id: `el-${type}-${Date.now()}`,
      type,
      x: 30 + (Math.random() * 10),
      y: 35 + (Math.random() * 10),
      width: type === 'photo' ? 40 : type === 'text' ? 50 : type === 'tape' ? 25 : 18,
      height: type === 'photo' ? 45 : type === 'text' ? 15 : type === 'tape' ? 7 : 18,
      rotation: Math.floor(Math.random() * 14) - 7,
      zIndex: currentPage.elements.length + 1,
      opacity: 1,
      isLocked: false,
      content,
      styleData: {
        fontFamily: project.style === 'handmade-paper' ? 'Caveat' : 'Inter',
        fontSize: 'md',
        textAlign: 'center',
        ...customStyles
      }
    };

    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, elements: [...p.elements, newEl] };
      }
      return p;
    });

    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
    setSelectedElementId(newEl.id);
  };

  // Replace photo on canvas
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addElement('photo', event.target.result as string, {
            frameType: project.style === 'handmade-paper' ? 'polaroid' : 'rounded',
            boxShadow: '2px 4px 10px rgba(0,0,0,0.12)',
            crop: { zoom: 1, x: 0, y: 0, rotate: 0 }
          });
        }
      };
      reader.readAsDataURL(file as File);
    });
  };

  // Background change helper
  const handleBackgroundChange = (textureId: string, styleObj: any) => {
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return {
          ...p,
          backgroundTexture: textureId,
          backgroundColor: styleObj.backgroundColor || '#FAF9F6'
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
  };

  // Duplicate selected element
  const handleDuplicateElement = () => {
    if (!selectedElementId) return;
    const el = currentPage.elements.find(e => e.id === selectedElementId);
    if (!el) return;

    const duplicated: ScrapbookElement = {
      ...el,
      id: `el-dup-${Date.now()}`,
      x: el.x + 4,
      y: el.y + 4,
      zIndex: currentPage.elements.length + 1
    };

    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, elements: [...p.elements, duplicated] };
      }
      return p;
    });

    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
    setSelectedElementId(duplicated.id);
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (!selectedElementId) return;
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, elements: p.elements.filter(e => e.id !== selectedElementId) };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
    setSelectedElementId(null);
  };

  // Z-Index Sorting Layer Helpers
  const handleMoveLayer = (direction: 'forward' | 'backward') => {
    if (!selectedElementId) return;
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        const target = p.elements.find(e => e.id === selectedElementId);
        if (!target) return p;

        const maxZ = Math.max(...p.elements.map(e => e.zIndex), 0);
        let nextZ = target.zIndex;

        if (direction === 'forward') {
          nextZ = nextZ + 1;
        } else {
          nextZ = Math.max(1, nextZ - 1);
        }

        const sorted = p.elements.map(e => {
          if (e.id === selectedElementId) return { ...e, zIndex: nextZ };
          return e;
        });

        return { ...p, elements: sorted };
      }
      return p;
    });

    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
  };

  // Toggle Lock State
  const handleToggleLock = () => {
    if (!selectedElementId) return;
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return {
          ...p,
          elements: p.elements.map(e => e.id === selectedElementId ? { ...e, isLocked: !e.isLocked } : e)
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
  };

  // Update selected element property directly
  const updateElementProperty = (elementId: string, property: string, value: any) => {
    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return {
          ...p,
          elements: p.elements.map(e => {
            if (e.id === elementId) {
              if (property.includes('.')) {
                const [parent, child] = property.split('.');
                return {
                  ...e,
                  [parent]: {
                    ...(e[parent as keyof ScrapbookElement] as any),
                    [child]: value
                  }
                };
              }
              return { ...e, [property]: value };
            }
            return e;
          })
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
  };

  // Translation (Dragging) Event Handlers
  const handleDragStart = (e: React.MouseEvent, element: ScrapbookElement) => {
    if (element.isLocked) return;
    e.stopPropagation();
    setSelectedElementId(element.id);

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y
    };

    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragging = (e: MouseEvent) => {
    if (!dragStartRef.current || !selectedElementId || !canvasRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const canvasBounds = canvasRef.current.getBoundingClientRect();

    let newX = dragStartRef.current.elX + (dx / canvasBounds.width) * 100;
    let newY = dragStartRef.current.elY + (dy / canvasBounds.height) * 100;

    if (snapToGrid) {
      newX = Math.round(newX / 5) * 5;
      newY = Math.round(newY / 5) * 5;
    }

    // Bind boundary
    newX = Math.max(0, Math.min(100 - 10, newX));
    newY = Math.max(0, Math.min(100 - 10, newY));

    // Live update coordinates
    setProject(prev => {
      const page = prev.pages[currentPageIndex];
      return {
        ...prev,
        pages: prev.pages.map((p, idx) => {
          if (idx === currentPageIndex) {
            return {
              ...p,
              elements: p.elements.map(el => el.id === selectedElementId ? { ...el, x: newX, y: newY } : el)
            };
          }
          return p;
        })
      };
    });
  };

  const handleDragEnd = () => {
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
    dragStartRef.current = null;
    pushState(project);
  };

  // Scaling/Resizing Event Handlers
  const handleResizeStart = (e: React.MouseEvent, element: ScrapbookElement) => {
    e.stopPropagation();
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elW: element.width,
      elH: element.height
    };

    document.addEventListener('mousemove', handleResizing);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizing = (e: MouseEvent) => {
    if (!resizeStartRef.current || !selectedElementId || !canvasRef.current) return;

    const dx = e.clientX - resizeStartRef.current.x;
    const dy = e.clientY - resizeStartRef.current.y;
    const canvasBounds = canvasRef.current.getBoundingClientRect();

    let newW = resizeStartRef.current.elW + (dx / canvasBounds.width) * 100;
    let newH = resizeStartRef.current.elH + (dy / canvasBounds.height) * 100;

    newW = Math.max(5, Math.min(100, newW));
    newH = Math.max(5, Math.min(100, newH));

    setProject(prev => ({
      ...prev,
      pages: prev.pages.map((p, idx) => {
        if (idx === currentPageIndex) {
          return {
            ...p,
            elements: p.elements.map(el => el.id === selectedElementId ? { ...el, width: newW, height: newH } : el)
          };
        }
        return p;
      })
    }));
  };

  const handleResizeEnd = () => {
    document.removeEventListener('mousemove', handleResizing);
    document.removeEventListener('mouseup', handleResizeEnd);
    resizeStartRef.current = null;
    pushState(project);
  };

  // Rotation Event Handlers
  const handleRotateStart = (e: React.MouseEvent, element: ScrapbookElement) => {
    e.stopPropagation();
    if (!canvasRef.current) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const elCenterX = canvasBounds.left + ((element.x + element.width / 2) / 100) * canvasBounds.width;
    const elCenterY = canvasBounds.top + ((element.y + element.height / 2) / 100) * canvasBounds.height;

    const dx = e.clientX - elCenterX;
    const dy = e.clientY - elCenterY;
    const startAngle = Math.atan2(dy, dx);

    rotateStartRef.current = {
      startAngle,
      initialRotation: element.rotation,
      centerX: elCenterX,
      centerY: elCenterY
    };

    document.addEventListener('mousemove', handleRotating);
    document.addEventListener('mouseup', handleRotateEnd);
  };

  const handleRotating = (e: MouseEvent) => {
    if (!rotateStartRef.current || !selectedElementId) return;

    const dx = e.clientX - rotateStartRef.current.centerX;
    const dy = e.clientY - rotateStartRef.current.centerY;
    const currentAngle = Math.atan2(dy, dx);
    const angleDiff = currentAngle - rotateStartRef.current.startAngle;
    
    let newRotation = rotateStartRef.current.initialRotation + (angleDiff * 180) / Math.PI;

    setProject(prev => ({
      ...prev,
      pages: prev.pages.map((p, idx) => {
        if (idx === currentPageIndex) {
          return {
            ...p,
            elements: p.elements.map(el => el.id === selectedElementId ? { ...el, rotation: Math.round(newRotation) } : el)
          };
        }
        return p;
      })
    }));
  };

  const handleRotateEnd = () => {
    document.removeEventListener('mousemove', handleRotating);
    document.removeEventListener('mouseup', handleRotateEnd);
    rotateStartRef.current = null;
    pushState(project);
  };

  // AI Layout Assistance: Arrange Page For Me
  const handleAiArrangePage = () => {
    const photos = currentPage.elements.filter(e => e.type === 'photo').map(e => e.content);
    if (photos.length === 0) {
      alert("Please upload/add at least one photo on the page first so AI can suggest arrangements.");
      return;
    }

    const arrangedElements = arrangeScrapbookPage(photos, project.style);

    // Keep existing elements that are NOT photos or tapes (like custom titles written by user)
    const existingOther = currentPage.elements.filter(e => e.type !== 'photo' && e.type !== 'tape');
    const merged = [...existingOther, ...arrangedElements];

    const updatedPages = project.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, elements: merged };
      }
      return p;
    });

    pushState({ ...project, pages: updatedPages, updatedAt: new Date().toISOString() });
  };

  // AI Text Helper (simulated writing assistant)
  const handleAiImproveText = (elId: string, action: 'shorter' | 'longer' | 'emotional' | 'funny' | 'elegant' | 'cinematic' | 'grammar') => {
    const element = currentPage.elements.find(e => e.id === elId);
    if (!element) return;

    const improved = improveText(element.content, action);
    updateElementProperty(elId, 'content', improved);
  };

  // Add Page / Delete Page Manager
  const handleAddPage = () => {
    const newPage: ScrapbookPage = {
      id: `page-added-${Date.now()}`,
      pageNumber: project.pages.length + 1,
      backgroundColor: '#FAF9F6',
      backgroundTexture: 'minimal-cream',
      elements: []
    };

    pushState({
      ...project,
      pages: [...project.pages, newPage],
      updatedAt: new Date().toISOString()
    });
    setCurrentPageIndex(project.pages.length); // go to new page
  };

  const handleDeletePage = () => {
    if (project.pages.length <= 4) {
      alert("Scrapbooks must have at least 4 pages.");
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

  // Auto-Save Loop Notification
  const handleSaveDraft = () => {
    onSave({ ...project, updatedAt: new Date().toISOString() });
    alert('Project saved as draft successfully!');
  };

  const handlePublishProject = () => {
    const updated = { ...project, status: 'LIVE' as const, updatedAt: new Date().toISOString() };
    onSave(updated);
    alert('Scrapbook published successfully! It is now viewable via public link.');
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col antialiased select-none font-sans" id="scrapbook-editor-container">
      
      {/* Top Header Controls */}
      <header className="h-16 border-b border-[#333] px-6 flex justify-between items-center bg-[#151515] shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-[#282828] text-[#999] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              {project.title}
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#333] text-[#bbb] font-mono">{project.size} Size</span>
            </h1>
            <p className="text-[10px] text-[#666] font-mono mt-0.5">Style: {project.style.replace('-', ' ')}</p>
          </div>
        </div>

        {/* Undo/Redo & Save Status */}
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
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 border transition-colors ${snapToGrid ? 'bg-primary border-primary text-background' : 'border-[#333] hover:bg-[#222] text-[#999]'}`}
            title="Snap to Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => onPreview(project.id)}
            className="px-4 py-2 border border-[#444] text-[#ccc] hover:bg-[#282828] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>

          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-[#282828] hover:bg-[#383838] border border-[#444] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Save Draft
          </button>
          
          <button
            onClick={handlePublishProject}
            className="btn-primary py-2 px-4 text-xs font-bold bg-[#FAF9F6] text-black border-none hover:bg-white"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Main Studio Body Workspace */}
      <div className="flex-grow flex overflow-hidden relative">
        
        {/* Left Side toolbar panel tabs */}
        <aside className="w-16 bg-[#151515] border-r border-[#333] flex flex-col items-center py-4 gap-6 shrink-0">
          <button 
            onClick={() => setActivePanel(activePanel === 'photos' ? null : 'photos')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all ${activePanel === 'photos' ? 'bg-[#282828] text-white' : 'text-[#888] hover:text-white'}`}
            title="Photos"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">Photos</span>
          </button>
          
          <button 
            onClick={() => setActivePanel(activePanel === 'text' ? null : 'text')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all ${activePanel === 'text' ? 'bg-[#282828] text-white' : 'text-[#888] hover:text-white'}`}
            title="Text"
          >
            <Type className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">Text</span>
          </button>

          <button 
            onClick={() => setActivePanel(activePanel === 'stickers' ? null : 'stickers')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all ${activePanel === 'stickers' ? 'bg-[#282828] text-white' : 'text-[#888] hover:text-white'}`}
            title="Stickers"
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">Stickers</span>
          </button>

          <button 
            onClick={() => setActivePanel(activePanel === 'tapes' ? null : 'tapes')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all ${activePanel === 'tapes' ? 'bg-[#282828] text-white' : 'text-[#888] hover:text-white'}`}
            title="Washi Tape"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">Tapes</span>
          </button>

          <button 
            onClick={() => setActivePanel(activePanel === 'paper' ? null : 'paper')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all ${activePanel === 'paper' ? 'bg-[#282828] text-white' : 'text-[#888] hover:text-white'}`}
            title="Paper items"
          >
            <FolderOpen className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">Paper</span>
          </button>

          <button 
            onClick={() => setActivePanel(activePanel === 'backgrounds' ? null : 'backgrounds')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all ${activePanel === 'backgrounds' ? 'bg-[#282828] text-white' : 'text-[#888] hover:text-white'}`}
            title="Page Backgrounds"
          >
            <Grid className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">BGs</span>
          </button>

          <button 
            onClick={() => setActivePanel(activePanel === 'ai' ? null : 'ai')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all ${activePanel === 'ai' ? 'bg-[#282828] text-white' : 'text-amber-400 hover:text-amber-300'}`}
            title="AI Assistance"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">AI Tools</span>
          </button>

          <button 
            onClick={() => setActivePanel(activePanel === 'pages' ? null : 'pages')}
            className={`flex flex-col items-center justify-center p-2.5 w-12 h-12 transition-all mt-auto ${activePanel === 'pages' ? 'bg-[#282828] text-white' : 'text-[#888] hover:text-white'}`}
            title="Page List"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[8px] uppercase tracking-wider mt-1">Pages</span>
          </button>
        </aside>

        {/* Floating Tool Option Drawer */}
        {activePanel && (
          <div className="w-80 bg-[#1E1E1E] border-r border-[#333] flex flex-col shrink-0 overflow-y-auto z-20 shadow-lg">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#151515]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#999] font-bold">
                {activePanel} Drawer
              </span>
              <button onClick={() => setActivePanel(null)} className="p-1 hover:bg-[#282828] rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Photo Panel */}
              {activePanel === 'photos' && (
                <div className="space-y-4">
                  <div className="border border-dashed border-[#444] p-6 text-center hover:bg-[#282828] transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="w-8 h-8 mx-auto text-[#666] mb-2" />
                    <span className="text-xs text-[#ccc] block font-semibold">Upload Photo(s)</span>
                    <span className="text-[9px] text-[#666] block mt-1">Drag & Drop or click to browse</span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#777] block mb-2">Tip</span>
                    <p className="text-[10.5px] text-[#888] leading-relaxed">
                      Upload personal memories. Drag them around the board, and select them to apply Polaroid frames, rotate, or scale.
                    </p>
                  </div>
                </div>
              )}

              {/* Text Panel */}
              {activePanel === 'text' && (
                <div className="space-y-4">
                  <button
                    onClick={() => addElement('text', 'Memory Heading', { fontSize: '2xl', fontWeight: 'bold' })}
                    className="w-full py-3 bg-[#282828] hover:bg-[#383838] border border-[#444] text-xs uppercase tracking-wider text-left px-4 font-bold"
                  >
                    + Add Big Heading
                  </button>
                  <button
                    onClick={() => addElement('text', 'Write your sweet memory notes here. Share the small details that matter.', { fontSize: 'md' })}
                    className="w-full py-3 bg-[#282828] hover:bg-[#383838] border border-[#444] text-xs uppercase tracking-wider text-left px-4"
                  >
                    + Add Journal Note
                  </button>
                  <button
                    onClick={() => addElement('text', '"A beautiful quote of love."', { fontSize: 'lg', fontFamily: 'Caveat', color: '#ff7675' })}
                    className="w-full py-3 bg-[#282828] hover:bg-[#383838] border border-[#444] text-xs uppercase tracking-wider text-left px-4 italic"
                  >
                    + Add Romantic Quote
                  </button>

                  <div className="border-t border-[#333] pt-4">
                    <button
                      onClick={() => setShowPromptsModal(true)}
                      className="w-full py-2 border border-primary text-primary flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Memory Prompts
                    </button>
                  </div>
                </div>
              )}

              {/* Stickers Panel */}
              {activePanel === 'stickers' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {SCRAPBOOK_STICKERS.map(sticker => (
                      <button
                        key={sticker.id}
                        onClick={() => addElement('sticker', sticker.id, { stickerCategory: sticker.category })}
                        className="p-2.5 bg-[#252525] border border-[#3A3A3A] hover:border-primary flex items-center justify-center h-16 hover:scale-105 transition-all cursor-pointer"
                        title={sticker.name}
                      >
                        <div className="w-12 h-12 text-[#FAF9F6]" dangerouslySetInnerHTML={{ __html: sticker.svg }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tapes Panel */}
              {activePanel === 'tapes' && (
                <div className="space-y-4">
                  {SCRAPBOOK_TAPES.map(tape => (
                    <button
                      key={tape.id}
                      onClick={() => addElement('tape', tape.id, { tapeType: tape.id.includes('washi') ? 'washi' : 'masking', color: tape.defaultColor })}
                      className="w-full p-4 border border-[#333] hover:border-primary bg-[#252525] text-left transition-all"
                    >
                      <div className={`h-4 w-28 ${tape.textureClass} mb-2`} />
                      <span className="text-[10px] uppercase tracking-wider text-[#ccc] block font-mono">{tape.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Paper Items Panel */}
              {activePanel === 'paper' && (
                <div className="space-y-4">
                  {SCRAPBOOK_PAPERS.map(paper => (
                    <button
                      key={paper.id}
                      onClick={() => addElement('paper', paper.id, { paperType: paper.type, backgroundColor: paper.id.includes('yellow') ? '#FFFDE0' : paper.id.includes('pink') ? '#FFE5EE' : '#FFFFFF' })}
                      className="w-full p-4 border border-[#333] hover:border-primary bg-[#252525] text-left transition-all"
                    >
                      <div className="h-10 w-full border border-dashed border-[#555] bg-opacity-80 p-2 mb-2" style={{ backgroundColor: paper.id.includes('yellow') ? '#FFFDE0' : '#FAF9F6' }}>
                        <span className="text-[8px] text-[#777] font-mono">Cutout note preview</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#ccc] block font-mono">{paper.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Backgrounds Panel */}
              {activePanel === 'backgrounds' && (
                <div className="grid grid-cols-2 gap-3">
                  {SCRAPBOOK_BACKGROUNDS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => handleBackgroundChange(bg.id, bg.style)}
                      className="p-3 border border-[#333] hover:border-primary bg-[#252525] text-left flex flex-col gap-2 cursor-pointer"
                    >
                      <div className="h-10 w-full border border-[#444]" style={bg.style} />
                      <span className="text-[9px] uppercase tracking-wider text-[#ccc] block font-mono">{bg.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* AI Assistant Panel */}
              {activePanel === 'ai' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#777] block">Layout Assist</span>
                    <button
                      onClick={handleAiArrangePage}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-current" /> Arrange This Page For Me
                    </button>
                    <p className="text-[10px] text-[#888] leading-relaxed">
                      Memora AI will automatically arrange placed photos with artistic spacing, washi tapes, and polaroid frame borders. (Undoable at any time).
                    </p>
                  </div>

                  <div className="border-t border-[#333] pt-4 space-y-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#777] block font-mono">Writing Assist (Select text element first)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => selectedElementId && handleAiImproveText(selectedElementId, 'grammar')}
                        disabled={!selectedElementId}
                        className="py-2 border border-[#444] hover:bg-[#282828] text-[10px] uppercase tracking-wider disabled:opacity-40"
                      >
                        Fix Grammar
                      </button>
                      <button
                        onClick={() => selectedElementId && handleAiImproveText(selectedElementId, 'shorter')}
                        disabled={!selectedElementId}
                        className="py-2 border border-[#444] hover:bg-[#282828] text-[10px] uppercase tracking-wider disabled:opacity-40"
                      >
                        Make Shorter
                      </button>
                      <button
                        onClick={() => selectedElementId && handleAiImproveText(selectedElementId, 'emotional')}
                        disabled={!selectedElementId}
                        className="py-2 border border-[#444] hover:bg-[#282828] text-[10px] uppercase tracking-wider disabled:opacity-40"
                      >
                        More Emotional
                      </button>
                      <button
                        onClick={() => selectedElementId && handleAiImproveText(selectedElementId, 'funny')}
                        disabled={!selectedElementId}
                        className="py-2 border border-[#444] hover:bg-[#282828] text-[10px] uppercase tracking-wider disabled:opacity-40"
                      >
                        More Fun
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#333] pt-4 space-y-3">
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 block font-mono">Universal AI Prompt Spec</span>
                    <p className="text-[9.5px] text-[#888] leading-relaxed">
                      Generate a premium luxury scrapbook layout matching this exact aesthetic style using Midjourney, Imagen, or DALL-E.
                    </p>
                    <div className="p-2.5 bg-[#1a1a1a] border border-[#333] rounded text-[8.5px] font-mono text-gray-400 max-h-32 overflow-y-auto whitespace-pre-wrap select-all">
{`# MEMORA AI SCRAPBOOK STUDIO

You are an award-winning scrapbook artist, editorial designer, magazine art director, print designer, and visual storyteller.
Your task is to automatically create a premium handcrafted scrapbook page using the uploaded photos.

* Theme: "${project.title}"
* Style: ${project.style === 'handmade-paper' ? 'Handmade Paper & Polaroid Collages' : 'Vintage Journal & Newspaper Cutouts'}
* Color Palette: Beige, Cream, Sage Green, Dusty Pink, Vintage Blue
* Materials: Torn paper, Polaroid frames, Washi tape, Metallic paper clips, pressed flowers, postmarks
* Typography: Elegant serif titles, typewriter font accents, handwritten annotations
* Mood: Nostalgic, Authentic, Warm, Timeless

FINAL GOAL: Generate a completely original scrapbook page where all creative decisions—layout, composition, colors, typography, decorations, spacing, and layering—are made automatically.`}
                    </div>
                    <button
                      onClick={() => {
                        const promptText = `# MEMORA AI SCRAPBOOK STUDIO\n\nYou are an award-winning scrapbook artist, editorial designer, magazine art director, print designer, and visual storyteller.\nYour task is to automatically create a premium handcrafted scrapbook page using the uploaded photos.\n\n* Theme: "${project.title}"\n* Style: ${project.style === 'handmade-paper' ? 'Handmade Paper & Polaroid Collages' : 'Vintage Journal & Newspaper Cutouts'}\n* Color Palette: Beige, Cream, Sage Green, Dusty Pink, Vintage Blue\n* Materials: Torn paper, Polaroid frames, Washi tape, Metallic paper clips, pressed flowers, postmarks\n* Typography: Elegant serif titles, typewriter font accents, handwritten annotations\n* Mood: Nostalgic, Authentic, Warm, Timeless\n\nFINAL GOAL: Generate a completely original scrapbook page where all creative decisions—layout, composition, colors, typography, decorations, spacing, layering, and finishing details—are made automatically while preserving the exact identity of every person. The result should look like a professionally handcrafted luxury scrapbook created by an expert designer, not an AI-generated collage.`;
                        navigator.clipboard.writeText(promptText);
                        alert("Memora AI Scrapbook Prompt copied to clipboard!");
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer rounded transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" /> Copy Prompt Spec
                    </button>
                  </div>
                </div>
              )}

              {/* Pages Manager Panel */}
              {activePanel === 'pages' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#999] font-mono">Total Pages: {project.pages.length}</span>
                    <button
                      onClick={handleAddPage}
                      className="px-2.5 py-1 bg-primary text-background font-mono text-[9px] uppercase tracking-wider"
                    >
                      + Add Page
                    </button>
                  </div>

                  <div className="space-y-2 border-t border-[#333] pt-4">
                    {project.pages.map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => setCurrentPageIndex(idx)}
                        className={`w-full flex items-center justify-between p-2.5 border text-xs font-mono transition-all ${
                          idx === currentPageIndex ? 'border-primary bg-primary/10 text-white font-bold' : 'border-[#333] hover:bg-[#222] text-[#888]'
                        }`}
                      >
                        <span>Page {p.pageNumber} {idx === 0 ? '(Cover)' : idx === project.pages.length - 1 ? '(Back Cover)' : ''}</span>
                        <span className="text-[9px] text-[#666]">{p.elements.length} elements</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#333] pt-4">
                    <button
                      onClick={handleDeletePage}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Active Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canvas Area Container */}
        <main className="flex-grow flex items-center justify-center p-6 overflow-y-auto relative bg-[#1E1E1E]">
          {/* Canvas Wrapper */}
          <div 
            ref={canvasRef}
            className="w-full max-w-[500px] aspect-[1/1.414] bg-white border border-black relative shadow-2xl relative overflow-hidden"
            id="editor-canvas"
            style={{
              ...SCRAPBOOK_BACKGROUNDS.find(bg => bg.id === currentPage.backgroundTexture)?.style,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Guide Grid Lines */}
            {showGridLines && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_0),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_0)] bg-[size:20px_20px] pointer-events-none" />
            )}

            {/* Elements list rendering */}
            {currentPage.elements
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(el => {
                const isSelected = selectedElementId === el.id;

                return (
                  <div
                    key={el.id}
                    className={`absolute select-none cursor-move ${isSelected ? 'ring-2 ring-primary ring-offset-1 z-50' : ''}`}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: `rotate(${el.rotation}deg)`,
                      zIndex: el.zIndex,
                      opacity: el.opacity
                    }}
                    onMouseDown={(e) => handleDragStart(e, el)}
                  >
                    {/* Render Content based on element type */}
                    {el.type === 'photo' && (
                      <div className="w-full h-full p-2 bg-white shadow-md border border-gray-200 flex flex-col justify-between relative">
                        {/* Frame borders */}
                        <div className="w-full h-[82%] overflow-hidden bg-gray-100 relative">
                          <img
                            src={el.content}
                            alt="Scrapbook Memory"
                            className="w-full h-full object-cover"
                            style={{
                              transform: el.styleData.crop 
                                ? `scale(${el.styleData.crop.zoom}) rotate(${el.styleData.crop.rotate}deg) translate(${el.styleData.crop.x}px, ${el.styleData.crop.y}px)` 
                                : 'none'
                            }}
                          />
                        </div>
                        <div className="h-[15%] flex items-center justify-center overflow-hidden">
                          <span className="font-mono text-[8px] text-[#444] tracking-wide">Polaroid Print</span>
                        </div>

                        {/* Photo Corners overlay */}
                        {el.styleData.photoCorners && el.styleData.photoCorners !== 'none' && (
                          <div className="absolute inset-0 pointer-events-none z-20">
                            {/* Top Left */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-[6px] border-l-[6px] border-transparent" style={{ borderTopColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderLeftColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                            {/* Top Right */}
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-[6px] border-r-[6px] border-transparent" style={{ borderTopColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderRightColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                            {/* Bottom Left */}
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[6px] border-l-[6px] border-transparent" style={{ borderBottomColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderLeftColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                            {/* Bottom Right */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[6px] border-r-[6px] border-transparent" style={{ borderBottomColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderRightColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                          </div>
                        )}
                      </div>
                    )}

                    {el.type === 'text' && (
                      <div className="w-full h-full relative group/flap">
                        {el.styleData.isFlap ? (
                          <div className="w-full h-full relative" style={{ perspective: '800px' }}>
                            {/* Flap Cover */}
                            <div 
                              className="absolute inset-0 bg-[#e6dfd3] border border-[#d2b48c] p-2 flex items-center justify-center text-center font-mono text-[9px] uppercase tracking-wider text-rose-800 font-bold z-10 origin-top transition-transform duration-700 hover:[transform:rotateX(120deg)] select-none shadow-md cursor-pointer"
                            >
                              ✉️ {el.styleData.flapLabel || 'Lift Flap'}
                            </div>
                            {/* Text Body */}
                            <div 
                              className="w-full h-full p-2 overflow-hidden flex items-center justify-center leading-relaxed text-center whitespace-pre-wrap bg-white"
                              style={{
                                fontFamily: el.styleData.fontFamily || 'Inter',
                                fontSize: el.styleData.fontSize === '2xl' ? '1.3rem' : el.styleData.fontSize === 'lg' ? '1.05rem' : '0.75rem',
                                color: el.styleData.color || '#1A1A1A'
                              }}
                            >
                              {el.content}
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="w-full h-full p-2 overflow-hidden flex items-center justify-center leading-relaxed text-center whitespace-pre-wrap select-text cursor-text"
                            style={{
                              fontFamily: el.styleData.fontFamily || 'Inter',
                              fontSize: el.styleData.fontSize === '2xl' ? '1.3rem' : el.styleData.fontSize === 'lg' ? '1.05rem' : '0.75rem',
                              textAlign: el.styleData.textAlign || 'center',
                              color: el.styleData.color || '#1A1A1A',
                              backgroundColor: el.styleData.backgroundColor || 'transparent'
                            }}
                          >
                            {el.content}
                          </div>
                        )}
                      </div>
                    )}

                    {el.type === 'sticker' && (
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: SCRAPBOOK_STICKERS.find(s => s.id === el.content)?.svg || '' }} />
                    )}

                    {el.type === 'tape' && (
                      <div 
                        className={`w-full h-full opacity-90 ${SCRAPBOOK_TAPES.find(t => t.id === el.content)?.textureClass}`}
                        style={{ backgroundColor: el.styleData.color }}
                      />
                    )}

                    {el.type === 'paper' && (
                      <div className="w-full h-full pointer-events-none select-none">
                        {el.content === 'newspaper_cutout' ? (
                          <div className="w-full h-full p-3 border border-[#D5CEB8] shadow-md flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#F2EFE9', color: '#333', fontFamily: 'Special Elite, serif' }}>
                            <div className="text-[6.5px] uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-0.5 font-bold">DAILY TIMES // ISSUE 104</div>
                            <div className="text-[9px] font-bold leading-tight line-clamp-2">LATEST MEMORIES DECLARED SPECIAL</div>
                            <div className="text-[8px] opacity-80 leading-normal line-clamp-3 mt-1 font-sans">Yesterday at golden hour, sweet memories were preserved forever in this custom digital scrapbook project. Details inside.</div>
                          </div>
                        ) : el.content === 'vintage_card' ? (
                          <div className="w-full h-full p-3 border border-[#C4BCA2] shadow flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#E8E2CF', color: '#4E433C', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(0,0,0,0.05) 15px, rgba(0,0,0,0.05) 16px)' }}>
                            <div className="text-[7.5px] font-mono tracking-widest font-bold border-b border-dashed border-[#C4BCA2] pb-0.5">ADMIT ONE SURPRISE</div>
                            <div className="text-[9.5px] font-bold text-center py-1">★ TICKET NO. 928372 ★</div>
                            <div className="text-[7px] font-mono text-right opacity-60">MEMORA REC. DEPT</div>
                          </div>
                        ) : el.content.includes('sticky_yellow') ? (
                          <div className="w-full h-full p-3 shadow-md border-l-2 border-yellow-400/50 flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#FFFDE0' }}>
                            <div className="w-full h-2 bg-yellow-300/40 -mt-1.5 mb-1.5" />
                            <div className="text-[8.5px] font-sans text-yellow-950 leading-relaxed italic">Write a quick sticky memory...</div>
                          </div>
                        ) : el.content.includes('sticky_pink') ? (
                          <div className="w-full h-full p-3 shadow-md border-l-2 border-pink-400/50 flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#FFE5EE' }}>
                            <div className="w-full h-2 bg-pink-300/40 -mt-1.5 mb-1.5" />
                            <div className="text-[8.5px] font-sans text-pink-950 leading-relaxed italic">Important details...</div>
                          </div>
                        ) : el.content.includes('sticky_blue') ? (
                          <div className="w-full h-full p-3 shadow-md border-l-2 border-blue-400/50 flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#E3F2FD' }}>
                            <div className="w-full h-2 bg-blue-300/40 -mt-1.5 mb-1.5" />
                            <div className="text-[8.5px] font-sans text-blue-950 leading-relaxed italic">Note to self...</div>
                          </div>
                        ) : el.content === 'pressed_flower_card' ? (
                          <div className="w-full h-full p-3 border border-[#E6DEC9] shadow flex flex-col justify-between overflow-hidden bg-contain" style={{ backgroundColor: '#FAF4EB', backgroundImage: 'radial-gradient(#E8D0B3 2px, transparent 2px)', backgroundSize: '12px 12px' }}>
                            <div className="text-[7px] font-mono uppercase tracking-widest text-[#888]">Botanical Backing</div>
                            <div className="w-9 h-9 border border-[#E6DEC9]/45 rounded-full mx-auto my-1 flex items-center justify-center bg-white/70">🌸</div>
                          </div>
                        ) : (
                          <div 
                            className="w-full h-full p-3 font-mono text-[9px] text-gray-800 shadow"
                            style={{
                              backgroundColor: el.styleData?.backgroundColor || '#FAF9F6'
                            }}
                          >
                            Torn Sheet cutout
                          </div>
                        )}
                      </div>
                    )}

                    {/* Transform Handles when selected */}
                    {isSelected && !el.isLocked && (
                      <>
                        {/* Delete Quick Btn */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteElement(); }}
                          className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow z-50 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Rotation Handle */}
                        <div
                          className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full cursor-alias border border-white flex items-center justify-center z-50"
                          onMouseDown={(e) => handleRotateStart(e, el)}
                        >
                          <RotateCw className="w-2.5 h-2.5 text-white" />
                        </div>

                        {/* Resize handle bottom right */}
                        <div
                          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border border-white cursor-se-resize z-50"
                          onMouseDown={(e) => handleResizeStart(e, el)}
                        />
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </main>

        {/* Right Side properties inspector panel */}
        {selectedElementId && (
          <aside className="w-64 bg-[#151515] border-l border-[#333] p-4 flex flex-col gap-6 overflow-y-auto shrink-0 z-10 shadow-lg">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#666] block mb-2">Properties Inspector</span>
              <h4 className="text-xs uppercase font-bold tracking-wider text-white">Element Control</h4>
            </div>

            {/* Common Alignment Layer tools */}
            <div className="space-y-3">
              <span className="text-[10px] text-[#888] block font-mono">Depth & Layers</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMoveLayer('forward')}
                  className="py-2 bg-[#252525] border border-[#333] hover:bg-[#333] text-[10px] uppercase tracking-wider"
                >
                  Bring Forward
                </button>
                <button
                  onClick={() => handleMoveLayer('backward')}
                  className="py-2 bg-[#252525] border border-[#333] hover:bg-[#333] text-[10px] uppercase tracking-wider"
                >
                  Send Backward
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleToggleLock}
                  className="py-2 bg-[#252525] border border-[#333] hover:bg-[#333] text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  {currentPage.elements.find(e => e.id === selectedElementId)?.isLocked ? (
                    <><Unlock className="w-3.5 h-3.5 text-amber-400" /> Unlock</>
                  ) : (
                    <><Lock className="w-3.5 h-3.5" /> Lock Element</>
                  )}
                </button>
                <button
                  onClick={handleDuplicateElement}
                  className="py-2 bg-[#252525] border border-[#333] hover:bg-[#333] text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
              </div>
            </div>

            {/* Custom inputs per element type */}
            {currentPage.elements.find(e => e.id === selectedElementId)?.type === 'text' && (
              <div className="space-y-4 border-t border-[#333] pt-4">
                <span className="text-[10px] text-[#888] block font-mono">Edit Text Content</span>
                <textarea
                  value={currentPage.elements.find(e => e.id === selectedElementId)?.content || ''}
                  onChange={(e) => updateElementProperty(selectedElementId, 'content', e.target.value)}
                  rows={3}
                  className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
                />

                {/* Font Choices */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#888] block font-mono">Typography Font</span>
                  <select
                    value={currentPage.elements.find(e => e.id === selectedElementId)?.styleData.fontFamily || 'Inter'}
                    onChange={(e) => updateElementProperty(selectedElementId, 'styleData.fontFamily', e.target.value)}
                    className="w-full bg-[#222] border border-[#444] text-xs px-2.5 py-2 text-white focus:outline-none"
                  >
                    {SCRAPBOOK_FONTS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#888] block font-mono">Font Size</span>
                  <div className="flex border border-[#333] divide-x divide-[#333]">
                    {['sm', 'md', 'lg', '2xl'].map(sz => (
                      <button
                        key={sz}
                        onClick={() => updateElementProperty(selectedElementId, 'styleData.fontSize', sz)}
                        className={`flex-1 py-1.5 text-[10px] uppercase transition-all ${
                          currentPage.elements.find(e => e.id === selectedElementId)?.styleData.fontSize === sz ? 'bg-primary text-background' : 'hover:bg-[#282828] text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Choices */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#888] block font-mono">Color Palette</span>
                  <div className="flex gap-2">
                    {['#1A1A1A', '#FF7675', '#0984E3', '#20BF6B', '#FFFFFF'].map(c => (
                      <button
                        key={c}
                        onClick={() => updateElementProperty(selectedElementId, 'styleData.color', c)}
                        className="w-6 h-6 border border-white/20 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: c }}
                      >
                        {currentPage.elements.find(e => e.id === selectedElementId)?.styleData.color === c && (
                          <div className="w-2 h-2 bg-white rounded-full invert" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secret Lift-the-Flap Option */}
                <div className="space-y-3 border-t border-[#333] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#888] font-mono">Secret Lift-the-Flap</span>
                    <input
                      type="checkbox"
                      checked={currentPage.elements.find(e => e.id === selectedElementId)?.styleData.isFlap || false}
                      onChange={(e) => updateElementProperty(selectedElementId, 'styleData.isFlap', e.target.checked)}
                      className="w-3.5 h-3.5 accent-primary"
                    />
                  </div>
                  {currentPage.elements.find(e => e.id === selectedElementId)?.styleData.isFlap && (
                    <div className="space-y-1.5 animate-scale-in">
                      <span className="text-[9px] text-[#666] block font-mono">Flap Label Cover</span>
                      <input
                        type="text"
                        placeholder="e.g. Lift to read secret memory"
                        value={currentPage.elements.find(e => e.id === selectedElementId)?.styleData.flapLabel || ''}
                        onChange={(e) => updateElementProperty(selectedElementId, 'styleData.flapLabel', e.target.value)}
                        className="w-full bg-[#222] border border-[#444] px-2 py-1 text-xs text-white placeholder-gray-600 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom inputs for Tape color adjustments */}
            {currentPage.elements.find(e => e.id === selectedElementId)?.type === 'tape' && (
              <div className="space-y-4 border-t border-[#333] pt-4">
                <span className="text-[10px] text-[#888] block font-mono">Tape Color Shade</span>
                <div className="flex flex-wrap gap-2">
                  {['#F8BBD0', '#B2DFDB', '#FFF9C4', '#FFE0B2', '#EADBB6', '#81ECEC'].map(c => (
                    <button
                      key={c}
                      onClick={() => updateElementProperty(selectedElementId, 'styleData.color', c)}
                      className="w-8 h-8 rounded-none border border-white/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Photo Crop and Rotation Controls */}
            {currentPage.elements.find(e => e.id === selectedElementId)?.type === 'photo' && (
              <div className="space-y-4 border-t border-[#333] pt-4">
                <span className="text-[10px] text-[#888] block font-mono">Photo Corners</span>
                <select
                  value={currentPage.elements.find(e => e.id === selectedElementId)?.styleData.photoCorners || 'none'}
                  onChange={(e) => updateElementProperty(selectedElementId, 'styleData.photoCorners', e.target.value)}
                  className="w-full bg-[#222] border border-[#444] px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="none">No Corners</option>
                  <option value="gold">Gold Corners ✨</option>
                  <option value="black">Black Card Corners</option>
                  <option value="vintage">Vintage Kraft Corners</option>
                </select>

                <span className="text-[10px] text-[#888] block font-mono mt-2">Photo Custom Editor</span>
                <button
                  onClick={() => setEditingPhotoElement(currentPage.elements.find(e => e.id === selectedElementId) || null)}
                  className="w-full py-2 bg-primary text-background font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5"
                >
                  <Crop className="w-4 h-4" /> Open Photo Editor
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Prompts Drawer Modal overlay */}
      {showPromptsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-background text-on-background border border-primary w-full max-w-lg p-6 md:p-8 animate-scale-in">
            <div className="flex justify-between items-center mb-6 border-b border-primary/10 pb-3">
              <h3 className="font-display text-xl text-primary font-bold">Memory Spark Prompts</h3>
              <button onClick={() => setShowPromptsModal(false)} className="p-1 hover:bg-[#FAF9F6]">
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>
            
            <div className="mb-4">
              <span className="font-mono text-[9px] text-[#777] block mb-1">Select Prompt Category</span>
              <select 
                value={promptCategory} 
                onChange={(e) => setPromptCategory(e.target.value)}
                className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
              >
                <option value="our-story">Our Story (Romance)</option>
                <option value="travel">Travel Journal</option>
                <option value="birthday">Birthday Celebration</option>
                <option value="baby">Baby Milestones</option>
                <option value="friendship">Friendship Memories</option>
              </select>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {(MEMORY_PROMPTS[promptCategory as keyof typeof MEMORY_PROMPTS] || MEMORY_PROMPTS['our-story']).map((promptStr, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    addElement('text', promptStr, { fontSize: 'lg', fontFamily: 'Caveat', color: '#1A1A1A' });
                    setShowPromptsModal(false);
                  }}
                  className="w-full text-left p-3 border border-primary/10 hover:border-primary bg-surface hover:bg-surface-container-low text-xs transition-colors"
                >
                  {promptStr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Crop Modal */}
      {editingPhotoElement && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181818] border border-[#333] text-white w-full max-w-md p-6 rounded-none shadow-2xl animate-scale-in">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Crop, Zoom & Rotate Photo</h3>
            
            {/* Viewport */}
            <div className="w-full aspect-[4/3] bg-black border border-[#333] overflow-hidden relative flex items-center justify-center">
              <img
                src={editingPhotoElement.content}
                alt="Crop preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${editingPhotoElement.styleData.crop?.zoom || 1}) rotate(${editingPhotoElement.styleData.crop?.rotate || 0}deg)`
                }}
              />
            </div>

            {/* Slider bars */}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[9px] text-[#888]">ZOOM SCALE</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={editingPhotoElement.styleData.crop?.zoom || 1}
                  onChange={(e) => {
                    const zoomVal = parseFloat(e.target.value);
                    const cropData = { ...(editingPhotoElement.styleData.crop || { x: 0, y: 0, rotate: 0 }), zoom: zoomVal };
                    setEditingPhotoElement(prev => prev ? { ...prev, styleData: { ...prev.styleData, crop: cropData } } : null);
                  }}
                  className="w-2/3 accent-white"
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[9px] text-[#888]">ROTATION</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={editingPhotoElement.styleData.crop?.rotate || 0}
                  onChange={(e) => {
                    const rotateVal = parseInt(e.target.value);
                    const cropData = { ...(editingPhotoElement.styleData.crop || { x: 0, y: 0, zoom: 1 }), rotate: rotateVal };
                    setEditingPhotoElement(prev => prev ? { ...prev, styleData: { ...prev.styleData, crop: cropData } } : null);
                  }}
                  className="w-2/3 accent-white"
                />
              </div>
            </div>

            {/* Confirm Actions */}
            <div className="flex justify-end gap-3 mt-8 border-t border-[#333] pt-4">
              <button
                onClick={() => setEditingPhotoElement(null)}
                className="px-4 py-2 border border-[#444] text-[#ccc] hover:bg-[#222] text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingPhotoElement.styleData.crop) {
                    updateElementProperty(editingPhotoElement.id, 'styleData.crop', editingPhotoElement.styleData.crop);
                  }
                  setEditingPhotoElement(null);
                }}
                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
