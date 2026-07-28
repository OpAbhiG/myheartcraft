import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Save, Download, Share2, Eye, RotateCcw, RotateCw, 
  Upload, Image as ImageIcon, Type, Sparkles, Layers, Sliders, 
  ZoomIn, ZoomOut, Move, Trash2, Check, X, Edit3, Grid, Lock
} from 'lucide-react';
import { ScrapbookTemplate, ScrapbookProject, PhotoSlot, TextElement, PhotoCrop } from './types';
import { exportScrapbookPage } from './exportScrapbook';

interface ScrapbookEditorProps {
  template: ScrapbookTemplate;
  existingProject?: ScrapbookProject | null;
  initialPersonalization?: {
    title?: string;
    names?: string;
    date?: string;
    memory?: string;
    photos?: File[];
  };
  onSave: (project: ScrapbookProject) => void;
  onClose: () => void;
}

export default function ScrapbookEditor({
  template,
  existingProject,
  initialPersonalization,
  onSave,
  onClose
}: ScrapbookEditorProps) {
  // Mode state: 'easy' | 'edit'
  const [mode, setMode] = useState<'easy' | 'edit'>('edit');
  const [activeTab, setActiveTab] = useState<'photos' | 'text' | 'elements' | 'background'>('photos');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Canvas Ref for Export
  const canvasRef = useRef<HTMLDivElement>(null);

  // Uploaded User Images (local object URLs)
  const [userPhotos, setUserPhotos] = useState<string[]>(() => {
    if (initialPersonalization?.photos && initialPersonalization.photos.length > 0) {
      return initialPersonalization.photos.map(f => URL.createObjectURL(f));
    }
    return [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
    ];
  });

  // Slot Image Assignments (slotId -> url)
  const [slotAssignments, setSlotAssignments] = useState<Record<string, { url: string; crop: PhotoCrop }>>(() => {
    const initial: Record<string, { url: string; crop: PhotoCrop }> = {};
    const photoList = initialPersonalization?.photos?.map(f => URL.createObjectURL(f)) || userPhotos;
    
    template.photoSlots.forEach((slot, idx) => {
      const assignedUrl = photoList[idx] || photoList[0] || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';
      initial[slot.id] = {
        url: assignedUrl,
        crop: { x: 0, y: 0, scale: 1, rotation: 0 }
      };
    });
    return initial;
  });

  // Text Elements Values (elementId -> string)
  const [textValues, setTextValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.textElements.forEach(el => {
      if (el.id === 'title' && initialPersonalization?.title) {
        initial[el.id] = initialPersonalization.title;
      } else if (el.id === 'names' && initialPersonalization?.names) {
        initial[el.id] = initialPersonalization.names;
      } else if (el.id === 'date' && initialPersonalization?.date) {
        initial[el.id] = initialPersonalization.date;
      } else if (el.id === 'memory' && initialPersonalization?.memory) {
        initial[el.id] = initialPersonalization.memory;
      } else {
        initial[el.id] = el.defaultText || el.placeholder;
      }
    });
    return initial;
  });

  // Selected Photo Slot for Crop Adjustment
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  // Drag & Drop State
  const [draggedPhotoUrl, setDraggedPhotoUrl] = useState<string | null>(null);

  // Photo Upload Handler
  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map((f: File) => URL.createObjectURL(f));
      setUserPhotos(prev => [...urls, ...prev]);
    }
  };

  // Drop photo onto a slot
  const handleDropOnSlot = (slotId: string) => {
    if (draggedPhotoUrl) {
      setSlotAssignments(prev => ({
        ...prev,
        [slotId]: {
          url: draggedPhotoUrl,
          crop: { x: 0, y: 0, scale: 1, rotation: 0 }
        }
      }));
      setDraggedPhotoUrl(null);
    }
  };

  // Save Project
  const handleSaveProject = () => {
    const project: ScrapbookProject = {
      id: existingProject?.id || `scrapbook-${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      title: textValues['title'] || template.name,
      status: 'LIVE',
      photos: Object.entries(slotAssignments).map(([slotId, val]: [string, { url: string; crop: PhotoCrop }]) => ({
        slotId,
        url: val.url,
        crop: val.crop
      })),
      texts: textValues,
      createdAt: existingProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: existingProject?.views || 1
    };
    onSave(project);
    alert('Scrapbook project saved successfully!');
  };

  // Download / Export Artwork as High-Res A4 PNG, JPG, or PDF
  const handleExportArtwork = async (format: 'png' | 'jpg' | 'pdf' = 'png') => {
    try {
      setIsExporting(true);
      await exportScrapbookPage(
        template,
        slotAssignments,
        textValues,
        format,
        textValues['title'] || template.name
      );
      setIsExporting(false);
    } catch (e) {
      console.error('Export error:', e);
      setIsExporting(false);
      alert('Could not export scrapbook page. Please try again.');
    }
  };

  // Active slot crop being edited
  const editingSlot = editingSlotId ? template.photoSlots.find(s => s.id === editingSlotId) : null;
  const editingAssignment = editingSlotId ? slotAssignments[editingSlotId] : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Studio Bar */}
      <header className="h-16 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/60 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Studio
          </button>
          <div className="h-4 w-[1px] bg-slate-700" />
          <h1 className="font-display font-bold text-sm text-slate-100 truncate max-w-[200px] sm:max-w-xs">{template.name}</h1>
        </div>

        {/* Mode Toggle & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Easy / Edit Mode Selector */}
          <div className="hidden sm:flex border border-slate-700 p-0.5 rounded-xl bg-slate-900/60">
            <button
              onClick={() => setMode('easy')}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-label-caps transition-all ${
                mode === 'easy' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Easy Mode
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-label-caps transition-all ${
                mode === 'edit' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Edit Mode
            </button>
          </div>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            title="Preview final scrapbook"
          >
            <Eye className="w-4 h-4" /> <span className="hidden md:inline">Preview</span>
          </button>

          <button
            onClick={handleSaveProject}
            className="btn-primary py-2 px-4 rounded-xl font-label-caps text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save
          </button>

          <div className="relative group">
            <button
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-xl font-label-caps text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export ▼'}
            </button>
            <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1.5 w-48 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
              <button
                onClick={() => handleExportArtwork('png')}
                className="w-full text-left py-2 px-3 hover:bg-slate-700 rounded-lg text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
              >
                📸 Download PNG (2480x3508)
              </button>
              <button
                onClick={() => handleExportArtwork('jpg')}
                className="w-full text-left py-2 px-3 hover:bg-slate-700 rounded-lg text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
              >
                🖼️ Download JPG (High Res)
              </button>
              <button
                onClick={() => handleExportArtwork('pdf')}
                className="w-full text-left py-2 px-3 hover:bg-slate-700 rounded-lg text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
              >
                📄 Printable A4 PDF (300 DPI)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Body Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Control Sidebar */}
        <aside className="w-80 bg-slate-800/60 border-r border-slate-700/60 flex flex-col z-20 shrink-0 hidden md:flex">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-700/60 p-2 gap-1 bg-slate-900/40">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider font-label-caps flex items-center justify-center gap-1 transition-all ${
                activeTab === 'photos' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Photos
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider font-label-caps flex items-center justify-center gap-1 transition-all ${
                activeTab === 'text' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Text
            </button>
          </div>

          {/* Sidebar Content Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            
            {/* PHOTOS TAB */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-label-caps">Your Uploaded Photos</h3>
                  <p className="text-[10px] text-slate-400">Drag any photo thumbnail into a canvas frame below.</p>
                </div>

                {/* Upload Button */}
                <label className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-600 hover:border-primary bg-slate-900/40 hover:bg-primary/5 text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-semibold">
                  <Upload className="w-4 h-4 text-primary" />
                  Upload Photos
                  <input type="file" multiple accept="image/*" onChange={handleUploadPhotos} className="hidden" />
                </label>

                {/* Photo Thumbnails Library Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {userPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => setDraggedPhotoUrl(url)}
                      className="aspect-square rounded-xl overflow-hidden border border-slate-700 hover:border-primary cursor-grab active:cursor-grabbing relative group shadow-sm"
                    >
                      <img src={url} alt="photo thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold transition-opacity">
                        Drag to Frame
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEXT TAB */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-label-caps">Editable Text Fields</h3>
                  <p className="text-[10px] text-slate-400">Update placeholders to customize your scrapbook text.</p>
                </div>

                <div className="space-y-3">
                  {template.textElements.map(el => (
                    <div key={el.id} className="space-y-1 bg-slate-900/40 p-3 rounded-xl border border-slate-700/60">
                      <label className="text-[9px] font-bold uppercase tracking-wider font-label-caps text-slate-300 block">
                        {el.placeholder}
                      </label>
                      <input
                        type="text"
                        value={textValues[el.id] || ''}
                        onChange={(e) => setTextValues(prev => ({ ...prev, [el.id]: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Canvas Viewport Container */}
        <main className="flex-1 bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-auto relative">
          
          {/* Main Scrapbook Canvas Render Box */}
          <div
            ref={canvasRef}
            className="relative shadow-2xl overflow-hidden transition-all duration-300 border border-slate-800 rounded-2xl shrink-0"
            style={{
              width: `${template.canvas.width * 0.55}px`,
              height: `${template.canvas.height * 0.55}px`,
              backgroundColor: template.canvas.backgroundColor || '#fbf9f2'
            }}
          >
            {/* Background Texture Layer */}
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80')` }} />

            {/* Decorations Layer (Notes, Kraft Cards, Flowers, Cupcake Stickers) */}
            {template.decorations.map(dec => {
              const scaleVal = 0.55;
              return (
                <div
                  key={dec.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${dec.x * scaleVal}px`,
                    top: `${dec.y * scaleVal}px`,
                    width: `${dec.width * scaleVal}px`,
                    height: `${dec.height * scaleVal}px`,
                    transform: `rotate(${dec.rotation || 0}deg)`
                  }}
                >
                  {dec.type === 'torn-note' && (
                    <div className="w-full h-full bg-rose-100/90 border border-rose-200 p-4 shadow-md rounded-lg flex flex-col font-handwritten relative overflow-hidden">
                      <div className="text-rose-800 font-bold text-lg mb-1">{dec.textContent || 'Memories ♥'}</div>
                      <div className="w-full border-b border-rose-200 border-dashed mb-2" />
                    </div>
                  )}

                  {dec.type === 'kraft-note' && (
                    <div className="w-full h-full bg-[#e7d5c0] border border-[#d4be9b] p-3 shadow-md rounded-md flex items-center justify-center text-center font-handwritten text-xs font-bold text-[#4a3b32] whitespace-pre-line leading-snug">
                      {dec.textContent}
                    </div>
                  )}

                  {dec.type === 'paper-texture' && (
                    <div className="w-full h-full bg-[#fff1f2] border border-rose-200/60 p-4 shadow-sm rounded-xl" />
                  )}

                  {dec.type === 'cupcake' && (
                    <div className="w-full h-full flex items-center justify-center text-4xl drop-shadow-md animate-bounce">
                      🧁
                    </div>
                  )}

                  {dec.type === 'flower' && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-2xl text-amber-700/80 drop-shadow-sm">
                      🌸 🌾
                    </div>
                  )}

                  {dec.type === 'tape' && (
                    <div className="w-full h-full bg-amber-200/80 border border-amber-300/50 shadow-sm opacity-90 backdrop-blur-[1px]" />
                  )}

                  {dec.type === 'doodle' && (
                    <div className="w-full h-full flex items-center justify-center text-rose-500 font-bold text-2xl drop-shadow-sm">
                      ⭐
                    </div>
                  )}
                </div>
              );
            })}

            {/* Photo Slots Layer */}
            {template.photoSlots.map(slot => {
              const assignment = slotAssignments[slot.id];
              const scaleVal = 0.55; // Canvas scale multiplier for 1200x1600 display

              return (
                <div
                  key={slot.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropOnSlot(slot.id)}
                  onClick={() => setEditingSlotId(slot.id)}
                  className={`absolute transition-transform cursor-pointer group ${
                    slot.shape === 'polaroid' ? 'bg-white p-3 pb-8 shadow-[0_15px_30px_rgba(0,0,0,0.18)] border border-slate-200/80 rounded-sm' :
                    slot.shape === 'torn-paper' ? 'bg-[#fdfbf7] p-2.5 shadow-[0_12px_25px_rgba(0,0,0,0.16)] border-2 border-dashed border-amber-800/30 rounded-md' :
                    slot.shape === 'paper' ? 'bg-[#fffdfa] p-3 shadow-[0_12px_25px_rgba(0,0,0,0.16)] border border-amber-900/20 rounded-md' :
                    'rounded-2xl overflow-hidden border-4 border-white shadow-[0_12px_25px_rgba(0,0,0,0.18)]'
                  }`}
                  style={{
                    left: `${slot.x * scaleVal}px`,
                    top: `${slot.y * scaleVal}px`,
                    width: `${slot.width * scaleVal}px`,
                    height: `${slot.height * scaleVal}px`,
                    transform: `rotate(${slot.rotation || 0}deg)`
                  }}
                >
                  {/* Washi Tape & Paper Clip Overlays */}
                  {(slot.tapeDecoration === 'top-left' || slot.tapeDecoration === 'corners') && (
                    <div className="absolute -top-3 -left-3 w-16 h-5 bg-amber-200/80 border border-amber-300/50 shadow-sm transform -rotate-12 z-20 pointer-events-none opacity-90 backdrop-blur-[1px]" />
                  )}
                  {(slot.tapeDecoration === 'top-right' || slot.tapeDecoration === 'corners') && (
                    <div className="absolute -top-3 -right-3 w-16 h-5 bg-rose-200/80 border border-rose-300/50 shadow-sm transform rotate-12 z-20 pointer-events-none opacity-90 backdrop-blur-[1px]" />
                  )}
                  {slot.tapeDecoration === 'top-center' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-emerald-200/80 border border-emerald-300/50 shadow-sm z-20 pointer-events-none opacity-90 backdrop-blur-[1px]" />
                  )}
                  {slot.tapeDecoration === 'paper-clip' && (
                    <div className="absolute -top-4 right-6 w-4 h-10 border-2 border-slate-400 bg-slate-200/60 rounded-full z-20 pointer-events-none shadow-md transform rotate-6" />
                  )}

                  {/* Photo Frame Container */}
                  <div className="w-full h-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                    {assignment ? (
                      <img
                        src={assignment.url}
                        alt="frame photo"
                        className="w-full h-full object-cover transition-all"
                        style={{
                          transform: `scale(${assignment.crop.scale || 1}) translate(${assignment.crop.x}%, ${assignment.crop.y}%) rotate(${assignment.crop.rotation || 0}deg)`
                        }}
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                        <span className="text-[9px] font-bold font-label-caps uppercase">Add Photo</span>
                      </div>
                    )}

                    {/* Frame Hover Edit Badge */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-slate-900 font-label-caps text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-lg shadow-md flex items-center gap-1">
                        <Edit3 className="w-3 h-3 text-primary" /> Edit Photo
                      </button>
                    </div>
                  </div>

                  {/* Polaroid Bottom Caption Text */}
                  {slot.shape === 'polaroid' && (
                    <div className="mt-2 text-center text-[10px] font-handwritten text-slate-700 font-bold truncate px-1">
                      {slot.captionPlaceholder || 'Sweet Memory'}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Text Elements Layer */}
            {template.textElements.map(el => {
              const scaleVal = 0.55;
              const textVal = textValues[el.id] || el.defaultText;

              return (
                <div
                  key={el.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${el.x * scaleVal}px`,
                    top: `${el.y * scaleVal}px`,
                    width: `${el.width * scaleVal}px`,
                    textAlign: el.align || 'left'
                  }}
                >
                  <span
                    className={`inline-block whitespace-pre-line text-slate-800 ${
                      el.fontFamily === 'handwritten' ? 'font-handwritten font-bold' :
                      el.fontFamily === 'cursive' ? 'font-cursive font-bold' : 'font-display font-bold'
                    }`}
                    style={{
                      fontSize: `${el.fontSize * scaleVal}px`,
                      color: el.color || '#3a2e2b'
                    }}
                  >
                    {textVal}
                  </span>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* PHOTO CROP ADJUSTMENT MODAL */}
      {editingSlot && editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-100">Adjust Photo Frame Crop</h3>
              <button onClick={() => setEditingSlotId(null)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="h-56 bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-700">
              <img
                src={editingAssignment.url}
                alt="crop preview"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${editingAssignment.crop.scale}) translate(${editingAssignment.crop.x}%, ${editingAssignment.crop.y}%)`
                }}
              />
            </div>

            {/* Zoom & Position Controls */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase font-label-caps text-slate-300">
                  <span>Zoom Level</span>
                  <span>{Math.round(editingAssignment.crop.scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={editingAssignment.crop.scale}
                  onChange={(e) => {
                    const newScale = parseFloat(e.target.value);
                    setSlotAssignments(prev => ({
                      ...prev,
                      [editingSlotId!]: {
                        ...editingAssignment,
                        crop: { ...editingAssignment.crop, scale: newScale }
                      }
                    }));
                  }}
                  className="w-full accent-primary"
                />
              </div>

              {/* Offset X & Y Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase font-label-caps text-slate-300">Pan Horizontal</span>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={editingAssignment.crop.x}
                    onChange={(e) => {
                      const newX = parseFloat(e.target.value);
                      setSlotAssignments(prev => ({
                        ...prev,
                        [editingSlotId!]: {
                          ...editingAssignment,
                          crop: { ...editingAssignment.crop, x: newX }
                        }
                      }));
                    }}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase font-label-caps text-slate-300">Pan Vertical</span>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={editingAssignment.crop.y}
                    onChange={(e) => {
                      const newY = parseFloat(e.target.value);
                      setSlotAssignments(prev => ({
                        ...prev,
                        [editingSlotId!]: {
                          ...editingAssignment,
                          crop: { ...editingAssignment.crop, y: newY }
                        }
                      }));
                    }}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditingSlotId(null)}
              className="w-full btn-primary py-3 rounded-xl font-label-caps font-bold text-xs uppercase cursor-pointer"
            >
              Done Adjusting
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl flex items-center justify-between text-white mb-4">
            <h2 className="font-display font-bold text-xl">{template.name} - Final Preview</h2>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="relative shadow-2xl overflow-hidden rounded-2xl bg-white scale-90 sm:scale-100"
            style={{
              width: `${template.canvas.width * 0.7}px`,
              height: `${template.canvas.height * 0.7}px`,
              backgroundColor: template.canvas.backgroundColor || '#ffffff'
            }}
          >
            {template.photoSlots.map(slot => {
              const assignment = slotAssignments[slot.id];
              const scaleVal = 0.7;
              return (
                <div
                  key={slot.id}
                  className={`absolute ${
                    slot.shape === 'polaroid' ? 'bg-white p-3 pb-8 shadow-xl border border-gray-200' :
                    'rounded-2xl overflow-hidden border-4 border-white shadow-xl'
                  }`}
                  style={{
                    left: `${slot.x * scaleVal}px`,
                    top: `${slot.y * scaleVal}px`,
                    width: `${slot.width * scaleVal}px`,
                    height: `${slot.height * scaleVal}px`,
                    transform: `rotate(${slot.rotation || 0}deg)`
                  }}
                >
                  <div className="w-full h-full relative overflow-hidden">
                    {assignment && (
                      <img
                        src={assignment.url}
                        alt="frame"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${assignment.crop.scale || 1}) translate(${assignment.crop.x}%, ${assignment.crop.y}%)`
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {template.textElements.map(el => {
              const scaleVal = 0.7;
              return (
                <div
                  key={el.id}
                  className="absolute"
                  style={{
                    left: `${el.x * scaleVal}px`,
                    top: `${el.y * scaleVal}px`,
                    width: `${el.width * scaleVal}px`,
                    textAlign: el.align || 'center'
                  }}
                >
                  <span
                    className="inline-block font-display font-bold"
                    style={{
                      fontSize: `${(el.fontSize || 24) * scaleVal}px`,
                      color: el.color || '#1e293b'
                    }}
                  >
                    {textValues[el.id] || el.defaultText}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-label-caps text-xs font-bold uppercase cursor-pointer"
            >
              Edit Again
            </button>
            <button
              onClick={handleSaveProject}
              className="btn-primary px-5 py-2.5 rounded-xl font-label-caps text-xs font-bold uppercase cursor-pointer"
            >
              Save Project
            </button>
            <button
              onClick={() => handleExportArtwork('png')}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-label-caps text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={() => handleExportArtwork('jpg')}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-label-caps text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download JPG
            </button>
            <button
              onClick={() => handleExportArtwork('pdf')}
              disabled={isExporting}
              className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-label-caps text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Printable A4 PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
