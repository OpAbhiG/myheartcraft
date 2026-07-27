import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Upload, Sparkles, X, Heart, Calendar, MapPin, Smile, Users, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { MagazineProject, MagazinePhoto } from './types';
import { assembleMagazinePages } from './templates';

interface MagazineWizardProps {
  onSave: (newProject: MagazineProject) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'birthday', label: 'Birthday', desc: 'Celebrate birthday milestones, gifts, and personal logs.' },
  { id: 'anniversary', label: 'Anniversary', desc: 'Celebrate relationship durations, marriages, and milestones.' },
  { id: 'baby', label: 'Baby Memories', desc: 'Log monthly baby growth, first smile, and steps.' },
  { id: 'our-story', label: 'Our Story', desc: 'Love story timeline, romantic messages, and memories.' },
  { id: 'travel', label: 'Travel Journal', desc: 'Holiday adventures, locations, and travel journals.' },
  { id: 'wedding', label: 'Wedding', desc: 'Bridal parties, ceremony details, and timeline of the big day.' },
  { id: 'family', label: 'Family Memories', desc: 'Trips, family reunions, and parents tributes.' },
  { id: 'personal', label: 'Personal Story', desc: 'Achievements, journals, and autobiography.' }
] as const;

const STYLES = [
  { id: 'minimal-editorial', label: 'Minimal Editorial', desc: 'Clean white sheets, elegant serif typography, large layouts.' },
  { id: 'cinematic', label: 'Cinematic Narrative', desc: 'Dark ambient sheets, dramatic visual grids, movie-like style.' },
  { id: 'modern-lifestyle', label: 'Modern Lifestyle', desc: 'Bold fonts, fashion column grids, contemporary style.' },
  { id: 'soft-memories', label: 'Soft Memories', desc: 'Warm cream shades, emotional typography, gentle margins.' },
  { id: 'classic-magazine', label: 'Classic Magazine', desc: 'Structured columns, traditional headings, editorial style.' }
] as const;

const TONES = [
  { id: 'emotional', label: 'Emotional & Warm' },
  { id: 'elegant', label: 'Sophisticated & Elegant' },
  { id: 'fun', label: 'Playful & Funny' },
  { id: 'romantic', label: 'Deeply Romantic' },
  { id: 'cinematic', label: 'Cinematic & Atmospheric' },
  { id: 'minimal', label: 'Subtle & Minimal' },
  { id: 'heartfelt', label: 'Direct & Heartfelt' }
] as const;

const AI_STEPS = [
  "Creating your editorial layout...",
  "Finding the best photo placements...",
  "Writing custom articles & titles...",
  "Arranging text blocks & quotes...",
  "Polishing final templates..."
];

export default function MagazineWizard({ onSave, onClose }: MagazineWizardProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<typeof CATEGORIES[number]['id']>('birthday');
  const [style, setStyle] = useState<typeof STYLES[number]['id']>('minimal-editorial');
  const [size, setSize] = useState<'A5' | 'A4'>('A5');
  const [photos, setPhotos] = useState<MagazinePhoto[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStepIdx, setGenStepIdx] = useState(0);

  // Form Fields (adaptive)
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [personName, setPersonName] = useState('');
  const [names, setNames] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [relationshipDuration, setRelationshipDuration] = useState('');
  const [milestones, setMilestones] = useState('');
  const [tone, setTone] = useState<typeof TONES[number]['id']>('emotional');

  const handleNext = () => {
    if (step < 5) {
      if (step === 1 && !title) {
        const catObj = CATEGORIES.find(c => c.id === category);
        setTitle(`${catObj?.label || 'Our'} Memories`);
        setSubtitle('A curated collection of special moments.');
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newPhotos = files.map((file, idx) => {
      const reader = new FileReader();
      const photoId = `ph-${Date.now()}-${idx}`;
      
      const newPhotoObj: MagazinePhoto = {
        id: photoId,
        url: '', // will be set on reader load
        caption: 'Memory captured',
        isCover: idx === 0, // default first image is cover
        isFavorite: idx === 1 // default second is favorite
      };

      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, url: event.target?.result as string } : p));
        }
      };
      reader.readAsDataURL(file as File);

      return newPhotoObj;
    });

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleCover = (id: string) => {
    setPhotos(prev => prev.map(p => ({
      ...p,
      isCover: p.id === id
    })));
  };

  // AI Generation Loop Simulation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenStepIdx(prev => {
          if (prev < AI_STEPS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              finishGeneration();
            }, 600);
            return prev;
          }
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleTriggerGeneration = () => {
    if (!title.trim() || !creatorName.trim()) {
      alert('Please fill out the Magazine Title and Creator Name.');
      return;
    }
    if (photos.length < 5) {
      alert('Please upload at least 5 photos for the editorial design layouts.');
      return;
    }

    setGenStepIdx(0);
    setIsGenerating(true);
  };

  const finishGeneration = () => {
    const basicInfo = {
      title,
      subtitle,
      personName: personName || undefined,
      names: names || undefined,
      eventDate: eventDate || undefined,
      location: location || undefined,
      age: age || undefined,
      description: description || undefined,
      customMessage: customMessage || undefined,
      relationshipDuration: relationshipDuration || undefined,
      milestones: milestones || undefined,
      tone
    };

    const pages = assembleMagazinePages(basicInfo, style, photos, category);

    const newProject: MagazineProject = {
      id: `magazine-${Date.now()}`,
      creatorName,
      recipientName: recipientName || undefined,
      category,
      style,
      size,
      basicInfo,
      photos,
      pages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'DRAFT',
      privacy: 'unlisted',
      views: 0
    };

    setIsGenerating(false);
    onSave(newProject);
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface antialiased flex items-center justify-center p-6 md:p-12 relative overflow-hidden" id="magazine-wizard">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_0)] [background-size:16px_16px] pointer-events-none" />

      {isGenerating ? (
        /* AI Generation Loading screen */
        <div className="w-full max-w-lg bg-background border border-primary p-8 md:p-12 text-center relative z-10 shadow-2xl animate-scale-in">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
          <h3 className="font-display text-2xl font-bold mb-2">Creating Your Magazine</h3>
          <p className="text-xs text-on-surface-variant max-w-xs mx-auto mb-8">
            Our editorial system is arranging your photos and composing custom stories.
          </p>

          <div className="space-y-4">
            <div className="w-full bg-primary/10 h-1.5 rounded-none overflow-hidden relative">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${((genStepIdx + 1) / AI_STEPS.length) * 100}%` }}
              />
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#999] h-4">
              {AI_STEPS[genStepIdx]}
            </div>
          </div>
        </div>
      ) : (
        /* Wizard Steps */
        <div className="w-full max-w-4xl bg-background border border-primary p-6 md:p-10 relative z-10 animate-scale-in">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-primary/20 pb-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#999]">AI Magazine Generator // Step {step} of 5</span>
              <h2 className="font-display text-2xl md:text-3xl text-primary font-bold mt-1">
                {step === 1 && "Select Category"}
                {step === 2 && "Choose Editorial Style"}
                {step === 3 && "Magazine Layout Size"}
                {step === 4 && "Story Information Form"}
                {step === 5 && "Upload Editorial Photos"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[10px] uppercase tracking-wider font-mono hover:text-red-500 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="min-h-[300px]">
            {/* Step 1: Category */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-5 flex flex-col items-center justify-center text-center border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-background shadow-md'
                          : 'border-primary/10 hover:border-primary/45 bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <Layers className={`w-8 h-8 mb-4 ${isSelected ? 'text-background' : 'text-primary'}`} />
                      <span className="font-sans text-xs font-bold uppercase tracking-wider mb-2">{cat.label}</span>
                      <span className="text-[10px] opacity-75 line-clamp-2 leading-relaxed">{cat.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Editorial Style */}
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
                        <span className="font-display text-lg text-primary font-bold block mb-1">{s.label}</span>
                        <p className="text-[10.5px] text-on-surface-variant leading-relaxed">{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Size */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto py-4">
                <button
                  onClick={() => setSize('A5')}
                  className={`p-6 border text-center cursor-pointer transition-all flex flex-col items-center justify-between ${
                    size === 'A5' ? 'border-primary bg-primary/5 shadow-md' : 'border-primary/20 bg-surface'
                  }`}
                >
                  <div className="w-24 h-36 border border-primary/20 flex items-center justify-center bg-white mb-6">
                    <span className="font-mono text-[9px] text-[#888]">A5 Format</span>
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-bold uppercase tracking-widest mb-1.5 font-bold">A5 — Easy Home Print</h3>
                    <span className="text-[10px] text-[#888] font-mono mb-3 block">148 × 210 mm</span>
                    <p className="text-[11px] text-on-surface-variant max-w-xs leading-relaxed">
                      Arranges pages onto A4 booklet print sheets so you can double-side print, fold, and staple.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSize('A4')}
                  className={`p-6 border text-center cursor-pointer transition-all flex flex-col items-center justify-between ${
                    size === 'A4' ? 'border-primary bg-primary/5 shadow-md' : 'border-primary/20 bg-surface'
                  }`}
                >
                  <div className="w-32 h-44 border border-primary/20 flex items-center justify-center bg-white mb-6">
                    <span className="font-mono text-[9px] text-[#888]">A4 Format</span>
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-bold uppercase tracking-widest mb-1.5 font-bold">A4 — Premium Large Format</h3>
                    <span className="text-[10px] text-[#888] font-mono mb-3 block">210 × 297 mm</span>
                    <p className="text-[11px] text-on-surface-variant max-w-xs leading-relaxed">
                      Designed for professional printing, large photo layouts, weddings, and premium journals.
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* Step 4: Info Form */}
            {step === 4 && (
              <div className="max-w-xl mx-auto space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Magazine Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. CELEBRATING LIFE"
                      className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Magazine Subtitle</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. A collection of warm stories"
                      className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Creator Name *</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Recipient Name (Optional)</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Jack"
                      className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                    />
                  </div>
                </div>

                {/* Adaptive Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category === 'birthday' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Celebrant Name</label>
                        <input
                          type="text"
                          value={personName}
                          onChange={(e) => setPersonName(e.target.value)}
                          placeholder="e.g. Jack Smith"
                          className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Age Celebrated</label>
                        <input
                          type="text"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 30"
                          className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  {(category === 'anniversary' || category === 'our-story') && (
                    <>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Couple Names</label>
                        <input
                          type="text"
                          value={names}
                          onChange={(e) => setNames(e.target.value)}
                          placeholder="e.g. Jack & Jill"
                          className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Years / Duration</label>
                        <input
                          type="text"
                          value={relationshipDuration}
                          onChange={(e) => setRelationshipDuration(e.target.value)}
                          placeholder="e.g. 5 Years"
                          className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  {category === 'travel' && (
                    <>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Travel Destination</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Amalfi Coast, Italy"
                          className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Travel Companions</label>
                        <input
                          type="text"
                          value={names}
                          onChange={(e) => setNames(e.target.value)}
                          placeholder="e.g. Jack & Jill"
                          className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Event / Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Editorial Tone</label>
                    <select
                      value={tone}
                      onChange={(e: any) => setTone(e.target.value)}
                      className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                    >
                      {TONES.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block">Short Story Description / Summary</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a quick summary of what this magazine celebrates. This description will be expanded into custom editorial articles by our system."
                    rows={3}
                    className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Photo upload */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="border border-dashed border-primary/20 p-8 text-center hover:bg-surface-container-high transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">Select and upload photos</span>
                  <span className="text-[10px] text-[#999] block mt-1">Requires 5-40 photos. Currently uploaded: {photos.length}</span>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 max-h-60 overflow-y-auto p-1">
                    {photos.map(p => (
                      <div key={p.id} className="relative border border-primary bg-background h-24 overflow-hidden group">
                        <img src={p.url} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeletePhoto(p.id)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-none hover:bg-red-700 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleToggleCover(p.id)}
                          className={`absolute bottom-1 left-1 text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 border ${
                            p.isCover ? 'bg-primary border-primary text-background' : 'bg-background/85 border-[#444] text-on-surface'
                          }`}
                        >
                          Cover
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav buttons */}
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
                onClick={handleTriggerGeneration}
                disabled={photos.length < 5}
                className={`btn-primary py-2.5 px-6 text-[10px] flex items-center gap-2 ${
                  photos.length < 5 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate AI Magazine
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
