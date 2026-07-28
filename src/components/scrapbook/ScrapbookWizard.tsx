import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Plane, Cake, Smile, Users, BookOpen, PenTool, Music, HelpCircle, Layers } from 'lucide-react';
import { ScrapbookProject } from './types';
import { buildPagesFromTemplate } from './templates';

interface ScrapbookWizardProps {
  onSave: (newProject: ScrapbookProject) => void;
  onClose: () => void;
}

const TYPES = [
  { id: 'our-story', label: 'Our Story', desc: 'Relationship milestones, love stories & anniversaries.', icon: Heart },
  { id: 'travel', label: 'Travel Memories', desc: 'Holidays, road trips, adventures & journals.', icon: Plane },
  { id: 'birthday', label: 'Birthday Memories', desc: 'Celebrate birthdays & party memories.', icon: Cake },
  { id: 'baby', label: 'Baby Memories', desc: 'First smile, steps & monthly baby logs.', icon: Smile },
  { id: 'family', label: 'Family Memories', desc: 'Trips, family reunions, and parents tributes.', icon: Users },
  { id: 'friendship', label: 'Friendship Memories', desc: 'Group trips, college years & best friends.', icon: Smile },
  { id: 'journal', label: 'Personal Journal', desc: 'Achievements, goals & personal growth.', icon: BookOpen },
  { id: 'custom', label: 'Custom Scrapbook', desc: 'Completely open canvas for custom project.', icon: PenTool }
] as const;

const STYLES = [
  { id: 'handmade-paper', label: 'Handmade Paper', desc: 'Torn paper edges, polaroid frames & washi tapes.', sampleBg: '#FAF9F6' },
  { id: 'soft-memories', label: 'Soft Memories', desc: 'Blush hues, warm aesthetics & elegant frames.', sampleBg: '#FFF0F2' },
  { id: 'playful-collage', label: 'Playful Collage', desc: 'Stickers, colorful doodles & dynamic cuts.', sampleBg: '#FFF9C4' },
  { id: 'vintage-journal', label: 'Vintage Journal', desc: 'Typewriter text, aged kraft and post stamps.', sampleBg: '#EADBB6' },
  { id: 'minimal-scrapbook', label: 'Minimal Scrapbook', desc: 'Clean white sheets, subtle lines & crisp grids.', sampleBg: '#FFFFFF' },
  { id: 'digital-sticker-book', label: 'Digital Sticker Book', desc: 'Bright icons, fun shapes & sticker templates.', sampleBg: '#E2F0D9' }
] as const;

const TEMPLATES = [
  { id: 'ai-auto', label: 'AI Auto-Design Engine 🔮', desc: 'Memora AI automatically analyzes images and drafts layouts, typography, tape styles, and mixed-media details.' },
  { id: 'blank', label: 'Blank Page Canvas', desc: 'Completely blank layout. Full placement freedom.' },
  { id: 'guided', label: 'Lightly Guided', desc: 'Suggested zones for photos, captions, and notes.' },
  { id: 'creative', label: 'Creative Layout', desc: 'Pre-arranged photo structures, tape borders & tags.' },
  { id: 'story', label: 'Story Prompts', desc: 'Sequential pages with text questions for storytelling.' }
] as const;

const MUSIC_TRACKS = [
  { id: 'romantic_piano', label: 'Romantic Piano (Soft & Heartfelt)' },
  { id: 'acoustic_guitar', label: 'Acoustic Travel (Warm & Upbeat)' },
  { id: 'birthday_instrumental', label: 'Happy Birthday instrumental (Festive)' },
  { id: 'cinematic_strings', label: 'Epic Strings (Cinematic & Emotional)' },
  { id: 'none', label: 'No Background Audio' }
] as const;

export default function ScrapbookWizard({ onSave, onClose }: ScrapbookWizardProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<typeof TYPES[number]['id']>('our-story');
  const [style, setStyle] = useState<typeof STYLES[number]['id']>('handmade-paper');
  const [size, setSize] = useState<'A5' | 'A4'>('A5');
  const [template, setTemplate] = useState<typeof TEMPLATES[number]['id']>('guided');

  // Metadata states
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [musicTrack, setMusicTrack] = useState<string>('romantic_piano');

  const handleNext = () => {
    if (step < 5) {
      if (step === 1 && !title) {
        // Pre-fill default title based on selection
        const selectedType = TYPES.find(t => t.id === type);
        setTitle(`${creatorName || 'My'} ${selectedType?.label || 'Scrapbook'}`);
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreateProject = () => {
    if (!title.trim() || !creatorName.trim()) {
      alert('Please fill out the Scrapbook Title and Creator Name.');
      return;
    }

    const pages = buildPagesFromTemplate(template, title, type);

    const newProject: ScrapbookProject = {
      id: `scrapbook-${Date.now()}`,
      title,
      creatorName,
      recipientName: recipientName.trim() || undefined,
      type,
      style,
      size,
      startingTemplate: template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages,
      status: 'DRAFT',
      privacy: 'unlisted',
      views: 0,
      musicTrack
    };

    onSave(newProject);
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface antialiased flex items-center justify-center p-6 md:p-12 relative overflow-hidden" id="scrapbook-wizard">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_0)] [background-size:16px_16px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-background border border-primary p-6 md:p-10 relative z-10 animate-scale-in">
        {/* Top Header info */}
        <div className="flex justify-between items-center mb-8 border-b border-primary/20 pb-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#999]">Creating Scrapbook // Step {step} of 5</span>
            <h2 className="font-display text-2xl md:text-3xl text-primary font-bold mt-1">
              {step === 1 && "Choose Scrapbook Theme"}
              {step === 2 && "Select Visual Style"}
              {step === 3 && "Scrapbook Layout Size"}
              {step === 4 && "Choose Starting Template"}
              {step === 5 && "Scrapbook Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-wider font-mono hover:text-red-500 font-semibold"
          >
            Cancel
          </button>
        </div>

        {/* Wizard Step Render */}
        <div className="min-h-[300px]">
          {/* Step 1: Scrapbook Type */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {TYPES.map(t => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`p-5 flex flex-col items-center justify-center text-center border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-background shadow-md'
                        : 'border-primary/10 hover:border-primary/45 bg-surface-container-low hover:bg-surface-container-high'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-4 ${isSelected ? 'text-background' : 'text-primary'}`} />
                    <span className="font-sans text-xs font-bold uppercase tracking-wider mb-2">{t.label}</span>
                    <span className="text-[10px] opacity-75 line-clamp-2 leading-relaxed">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Visual Style */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {STYLES.map(s => {
                const isSelected = style === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-6 border text-left cursor-pointer transition-all flex flex-col justify-between h-[150px] ${
                      isSelected
                        ? 'border-primary shadow-md'
                        : 'border-primary/15 bg-surface hover:border-primary/40'
                    }`}
                    style={{ borderLeftWidth: isSelected ? '5px' : '1px' }}
                  >
                    <div>
                      <div className="w-8 h-4 border border-primary/20 mb-3" style={{ backgroundColor: s.sampleBg }} />
                      <span className="font-display text-lg text-primary font-bold block mb-1">{s.label}</span>
                      <p className="text-[10.5px] text-on-surface-variant leading-relaxed">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 3: Scrapbook Size */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto py-4">
              {/* A5 Size */}
              <button
                onClick={() => setSize('A5')}
                className={`p-6 border text-center cursor-pointer transition-all flex flex-col items-center justify-between ${
                  size === 'A5' ? 'border-primary bg-primary/5 shadow-md' : 'border-primary/20 bg-surface'
                }`}
              >
                <div className="w-24 h-36 border-2 border-dashed border-primary/40 flex items-center justify-center bg-white mb-6">
                  <span className="font-mono text-[10px] text-primary/60">A5 Portrait</span>
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-widest mb-1.5">A5 — Personal Memory Book</h3>
                  <span className="text-[10px] text-on-surface-variant font-mono mb-3 block">148 × 210 mm</span>
                  <p className="text-[11px] text-on-surface-variant max-w-xs leading-relaxed">
                    Great for birthday books, baby logs, gifts, and printing directly at home onto A4 paper sheets.
                  </p>
                </div>
              </button>

              {/* A4 Size */}
              <button
                onClick={() => setSize('A4')}
                className={`p-6 border text-center cursor-pointer transition-all flex flex-col items-center justify-between ${
                  size === 'A4' ? 'border-primary bg-primary/5 shadow-md' : 'border-primary/20 bg-surface'
                }`}
              >
                <div className="w-32 h-44 border-2 border-dashed border-primary/40 flex items-center justify-center bg-white mb-6">
                  <span className="font-mono text-[10px] text-primary/60">A4 Portrait</span>
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-widest mb-1.5">A4 — Large Memory Scrapbook</h3>
                  <span className="text-[10px] text-on-surface-variant font-mono mb-3 block">210 × 297 mm</span>
                  <p className="text-[11px] text-on-surface-variant max-w-xs leading-relaxed">
                    Perfect for holiday photo scrapbooks, wedding memory walls, and large family photo collections.
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Step 4: Starting Template */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto py-2">
              {TEMPLATES.map(t => {
                const isSelected = template === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-6 border text-left cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-primary/10 hover:border-primary/30 bg-surface'
                    }`}
                  >
                    <Layers className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans text-xs font-bold uppercase tracking-wider mb-1.5">{t.label}</h4>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 5: Metadata Form */}
          {step === 5 && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Scrapbook Title */}
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Scrapbook Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Europe Road Trip 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-primary px-4 py-3 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary placeholder-on-surface-variant/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Creator */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Creator Name *</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full border border-primary px-4 py-3 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Recipient */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Recipient Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full border border-primary px-4 py-3 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              {/* Music Ambient */}
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" /> Background Audio Ambiance
                </label>
                <select
                  value={musicTrack}
                  onChange={(e) => setMusicTrack(e.target.value)}
                  className="w-full border border-primary px-4 py-3 text-xs bg-background focus:outline-none"
                >
                  {MUSIC_TRACKS.map(track => (
                    <option key={track.id} value={track.id}>
                      {track.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Nav */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-primary/20">
          <button
            onClick={handleBack}
            className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-primary flex items-center gap-2 transition-all ${
              step === 1 ? 'opacity-40 pointer-events-none' : 'hover:bg-primary/5'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="btn-primary py-2.5 px-5 text-[10px] flex items-center gap-2"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleCreateProject}
              className="btn-primary py-2.5 px-6 text-[10px]"
            >
              Assemble Scrapbook
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
