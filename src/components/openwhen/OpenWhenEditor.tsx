import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Trash2, Plus, Eye, Share2, Sparkles, Image as ImageIcon, Video, Mic, Gift, Calendar, Lock, ShieldAlert, Play, Square, X, RefreshCw } from 'lucide-react';
import { OpenWhenProject, OpenWhenMessage, OpenWhenMessagePhoto } from './types';
import { PRESET_PROMPTS } from './prompts';
import { improveText } from '../../utils/aiSimulator';

interface OpenWhenEditorProps {
  project: OpenWhenProject;
  onSave: (updated: OpenWhenProject) => void;
  onClose: () => void;
  onPreview: (projectId: string) => void;
  existingMemoraCreations?: { id: string; title: string; type: string }[];
}

export default function OpenWhenEditor({
  project: initialProject,
  onSave,
  onClose,
  onPreview,
  existingMemoraCreations = []
}: OpenWhenEditorProps) {
  const [project, setProject] = useState<OpenWhenProject>(initialProject);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [newCustomPrompt, setNewCustomPrompt] = useState('');

  // Audio Recording States (simulated)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [undoStack, setUndoStack] = useState<OpenWhenProject[]>([]);
  const [redoStack, setRedoStack] = useState<OpenWhenProject[]>([]);

  const activeMessage = project.messages[activeMessageIndex] || project.messages[0];

  const pushState = (nextProject: OpenWhenProject) => {
    setUndoStack(prev => [...prev, project]);
    setRedoStack([]);
    setProject(nextProject);
    localStorage.setItem(`openwhen_${nextProject.id}`, JSON.stringify(nextProject));
  };

  const handleUpdateMessage = (field: keyof OpenWhenMessage, value: any) => {
    const updatedMessages = project.messages.map((msg, idx) => {
      if (idx === activeMessageIndex) {
        return { ...msg, [field]: value };
      }
      return msg;
    });
    pushState({ ...project, messages: updatedMessages, updatedAt: new Date().toISOString() });
  };

  const handleAddEnvelope = () => {
    if (!newCustomPrompt.trim()) return;
    const newMsg: OpenWhenMessage = {
      id: `ow-msg-${Date.now()}`,
      promptTitle: newCustomPrompt.trim(),
      textContent: `Write your message for: "${newCustomPrompt.trim()}"`,
      photos: [],
      unlockMode: 'honor',
      status: 'SEALED'
    };

    pushState({
      ...project,
      messages: [...project.messages, newMsg],
      updatedAt: new Date().toISOString()
    });
    setNewCustomPrompt('');
    setActiveMessageIndex(project.messages.length); // go to new msg
  };

  const handleDeleteEnvelope = (idxToDelete: number) => {
    if (project.messages.length <= 1) {
      alert("Collections must contain at least 1 message envelope.");
      return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this envelope?")) return;

    const remaining = project.messages.filter((_, idx) => idx !== idxToDelete);
    pushState({
      ...project,
      messages: remaining,
      updatedAt: new Date().toISOString()
    });
    setActiveMessageIndex(Math.max(0, activeMessageIndex - 1));
  };

  // Image Upload helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newPhotos: OpenWhenMessagePhoto[] = [];
    files.forEach((file, fIdx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const photoObj: OpenWhenMessagePhoto = {
            url: event.target.result as string,
            caption: 'Memory photo'
          };
          // Append to active message photos
          const currentPhotos = [...(activeMessage.photos || []), photoObj];
          handleUpdateMessage('photos', currentPhotos);
        }
      };
      reader.readAsDataURL(file as File);
    });
  };

  const handleDeletePhoto = (photoIdx: number) => {
    const remaining = activeMessage.photos.filter((_, idx) => idx !== photoIdx);
    handleUpdateMessage('photos', remaining);
  };

  // Voice recording (simulated)
  const startRecording = async () => {
    try {
      setIsRecording(true);
      audioChunksRef.current = [];
      // Setup simulated progress
      setTimeout(() => {
        if (isRecording) stopRecording();
      }, 30000); // max 30s limit
    } catch (e) {}
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Set a simulated placeholder audio
    const mockAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    handleUpdateMessage('voiceUrl', mockAudioUrl);
  };

  const deleteRecording = () => {
    handleUpdateMessage('voiceUrl', undefined);
  };

  // AI Tone rewriting helper
  const handleAiTextRewrite = (action: 'shorter' | 'longer' | 'emotional' | 'funny' | 'elegant' | 'cinematic' | 'grammar') => {
    const originalText = activeMessage.textContent;
    // Build context prompt
    const toneText = improveText(originalText, action);
    handleUpdateMessage('textContent', toneText);
  };

  const handleSave = () => {
    onSave({ ...project, updatedAt: new Date().toISOString() });
    alert('Open When... collection saved as draft!');
  };

  const handlePublish = () => {
    const updated = { ...project, status: 'LIVE' as const, updatedAt: new Date().toISOString() };
    onSave(updated);
    alert('Collection published successfully!');
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col antialiased font-sans select-none" id="open-when-editor">
      
      {/* Header */}
      <header className="h-16 border-b border-[#2a2a2a] px-6 bg-[#1C1C1C] flex justify-between items-center shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-[#282828] text-[#999] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold tracking-wide flex items-center gap-2">
              {project.title}
              <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#333] text-[#bbb] font-mono">For {project.recipientName}</span>
            </h1>
            <p className="text-[10px] text-[#666] font-mono mt-0.5">Style: {project.style.replace('-', ' ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onPreview(project.id)}
            className="px-4 py-2 border border-[#444] text-[#ccc] hover:bg-[#282828] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preview Collection
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#282828] hover:bg-[#383838] border border-[#444] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className="btn-primary py-2 px-4 text-xs bg-[#FAF9F6] text-black border-none hover:bg-white"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* Left Side: Envelope list */}
        <aside className="w-64 border-r border-[#2a2a2a] bg-[#1C1C1C] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#2a2a2a]">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#777] font-bold block mb-3">Envelopes List</span>
            
            {/* Quick Add Custom Envelope */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCustomPrompt}
                onChange={(e) => setNewCustomPrompt(e.target.value)}
                placeholder="Custom Open When..."
                className="w-full bg-[#252525] border border-[#444] px-2 py-1 text-xs text-white placeholder-[#555] focus:outline-none"
              />
              <button
                onClick={handleAddEnvelope}
                className="bg-primary text-background p-1 text-xs hover:bg-white font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {project.messages.map((msg, idx) => {
              const isActive = idx === activeMessageIndex;
              return (
                <div 
                  key={msg.id}
                  className={`w-full p-3 border transition-all text-left group flex justify-between items-center cursor-pointer ${
                    isActive ? 'border-primary bg-primary/10 text-white font-bold' : 'border-[#333] hover:bg-[#252525] text-[#888]'
                  }`}
                  onClick={() => setActiveMessageIndex(idx)}
                >
                  <div className="flex-1 truncate pr-2">
                    <span className="text-[8px] uppercase tracking-wider block font-mono text-gray-500">Envelope {idx + 1}</span>
                    <h4 className="text-xs truncate">{msg.promptTitle}</h4>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEnvelope(idx);
                    }}
                    className="p-1 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Envelope"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Pane: Message Editor */}
        <main className="flex-grow p-8 overflow-y-auto space-y-8 bg-[#141414]">
          {activeMessage ? (
            <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column Form edits */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border-b border-[#333] pb-4">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#666]">Editing envelope</span>
                  <h2 className="text-xl font-bold uppercase tracking-tight">{activeMessage.promptTitle}</h2>
                </div>

                {/* Letter Text Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] text-[#888] uppercase tracking-wider">Heartfelt Letter Content</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAiTextRewrite('emotional')}
                        className="text-[8px] uppercase font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" /> Make Emotional
                      </button>
                      <button
                        onClick={() => handleAiTextRewrite('funny')}
                        className="text-[8px] uppercase font-bold text-amber-400 hover:text-amber-300"
                      >
                        Make Fun
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={activeMessage.textContent}
                    onChange={(e) => handleUpdateMessage('textContent', e.target.value)}
                    rows={6}
                    className="w-full bg-[#1c1c1c] border border-[#333] p-4 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary whitespace-pre-wrap"
                  />
                </div>

                {/* Multi-Photo Uploads */}
                <div className="space-y-3">
                  <label className="font-mono text-[9px] text-[#888] uppercase tracking-wider block">Attachment Photos</label>
                  <div className="flex gap-3 items-center">
                    <label className="border border-dashed border-[#444] px-4 py-3 text-xs text-[#999] hover:bg-[#222] transition-colors cursor-pointer flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Upload Photos
                      <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <span className="text-[10px] text-gray-500">Currently: {activeMessage.photos.length} photos</span>
                  </div>

                  {activeMessage.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {activeMessage.photos.map((ph, idx) => (
                        <div key={idx} className="relative w-16 h-16 border border-[#333] overflow-hidden">
                          <img src={ph.url} alt="Attached" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleDeletePhoto(idx)}
                            className="absolute top-0 right-0 bg-red-600 text-white p-0.5 hover:bg-red-700 cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Message Recorder */}
                <div className="space-y-3 pt-2">
                  <label className="font-mono text-[9px] text-[#888] uppercase tracking-wider block">Voice Note Memo</label>
                  
                  {activeMessage.voiceUrl ? (
                    <div className="flex items-center gap-4 bg-[#1c1c1c] p-3 border border-[#333] max-w-sm">
                      <Mic className="w-4 h-4 text-green-500" />
                      <audio src={activeMessage.voiceUrl} controls className="h-6 w-48 shrink-0" />
                      <button onClick={deleteRecording} className="text-red-500 hover:text-red-400 text-xs uppercase tracking-wider ml-auto font-bold">Delete</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {isRecording ? (
                        <button
                          onClick={stopRecording}
                          className="px-4 py-2 border border-red-500 bg-red-950/20 text-red-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 animate-pulse"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" /> Stop Recording...
                        </button>
                      ) : (
                        <button
                          onClick={startRecording}
                          className="px-4 py-2 border border-[#444] text-[#ccc] hover:bg-[#222] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <Mic className="w-3.5 h-3.5" /> Record Voice Memo
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Surprise Links / Linking Cards */}
                <div className="space-y-3 pt-2">
                  <label className="font-mono text-[9px] text-[#888] uppercase tracking-wider block">Linked Keepsake surprise</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-500 block font-mono">Linked Project Surprise</span>
                      <select
                        value={activeMessage.surpriseContent?.type === 'memora-project' ? activeMessage.surpriseContent.value : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleUpdateMessage('surpriseContent', {
                              type: 'memora-project',
                              value: e.target.value,
                              label: 'Open Linked Surprise Keepsake'
                            });
                          } else {
                            handleUpdateMessage('surpriseContent', undefined);
                          }
                        }}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="">No linked project</option>
                        {existingMemoraCreations.map(c => (
                          <option key={c.id} value={c.id}>{c.title} ({c.type})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-500 block font-mono">Surprise Coupon Code (Optional)</span>
                      <input
                        type="text"
                        placeholder="e.g. COFFEEFORYOU"
                        value={activeMessage.surpriseContent?.type === 'coupon' ? activeMessage.surpriseContent.value : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleUpdateMessage('surpriseContent', {
                              type: 'coupon',
                              value: e.target.value,
                              label: 'Reveal Surprise Gift Code'
                            });
                          } else {
                            handleUpdateMessage('surpriseContent', undefined);
                          }
                        }}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Unlock settings & preview */}
              <div className="space-y-6">
                <div className="bg-[#1C1C1C] border border-[#2a2a2a] p-5 space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-white">Unlock Configuration</h4>
                  
                  {/* Unlock mode selection */}
                  <div className="space-y-3">
                    {([
                      { id: 'honor', label: 'Honor System', desc: 'Recipient self-regulates when to open envelope.' },
                      { id: 'date', label: 'Date Locked', desc: 'Cannot be opened before a selected milestone date.' },
                      { id: 'manual', label: 'Manual Release', desc: 'Sender releases it later from the studio.' }
                    ] as const).map(mode => {
                      const isSelected = activeMessage.unlockMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => handleUpdateMessage('unlockMode', mode.id)}
                          className={`w-full text-left p-3.5 border transition-all flex items-start gap-2.5 ${
                            isSelected ? 'border-primary bg-primary/5' : 'border-[#333] hover:bg-[#252525]'
                          }`}
                        >
                          <Lock className={`w-3.5 h-3.5 mt-0.5 ${isSelected ? 'text-primary' : 'text-gray-600'}`} />
                          <div>
                            <span className="text-xs font-bold block mb-1 text-white">{mode.label}</span>
                            <span className="text-[10px] text-gray-500 block leading-relaxed">{mode.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Date picker if locked */}
                  {activeMessage.unlockMode === 'date' && (
                    <div className="space-y-1.5 border-t border-[#333] pt-4 animate-scale-in">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#999] block flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Unlock Date
                      </label>
                      <input
                        type="date"
                        value={activeMessage.unlockDate || ''}
                        onChange={(e) => handleUpdateMessage('unlockDate', e.target.value)}
                        className="w-full bg-[#222] border border-[#444] px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-[#666]">Select an envelope to begin customization.</div>
          )}
        </main>

      </div>
    </div>
  );
}
