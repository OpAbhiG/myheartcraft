import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Plus, Play, Pause, Music, Gift, Heart, Volume2 } from 'lucide-react';
import { Creation, EXPERIENCE_TEMPLATES } from '../types';
import { ambientMusic } from '../utils/audio';

interface WizardScreenProps {
  templateId: string;
  editCreationId?: string;
  initialCreations: Creation[];
  onSave: (creation: Creation) => void;
  onClose: () => void;
}

export default function WizardScreen({
  templateId,
  editCreationId,
  initialCreations,
  onSave,
  onClose
}: WizardScreenProps) {
  const template = EXPERIENCE_TEMPLATES.find(t => t.id === templateId) || EXPERIENCE_TEMPLATES[0];

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [specialDate, setSpecialDate] = useState('');
  const [relationship, setRelationship] = useState('Partner');
  const [themeColor, setThemeColor] = useState(template.themeColor || 'rose_gold');
  const [particles, setParticles] = useState<'hearts' | 'gold_dust' | 'confetti' | 'stars'>(template.particles || 'confetti');
  const [musicTrack, setMusicTrack] = useState(template.musicTrack || 'birthday_instrumental');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [interactiveElement, setInteractiveElement] = useState<'puzzle' | 'envelope' | 'popup' | 'cake'>(template.interactiveType || 'cake');
  const [images, setImages] = useState<{ url: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      caption: 'The beautiful days we spend laughing together'
    }
  ]);

  const [playingPreviewTrack, setPlayingPreviewTrack] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      ambientMusic.stop(0.1);
    };
  }, []);

  useEffect(() => {
    ambientMusic.stop(0.1);
    setPlayingPreviewTrack(null);
  }, [step]);

  useEffect(() => {
    if (editCreationId) {
      const existing = initialCreations.find(c => c.id === editCreationId);
      if (existing) {
        setRecipientName(existing.recipientName || '');
        setCreatorName(existing.creatorName || '');
        setSpecialDate(existing.specialDate || '');
        setRelationship(existing.relationship || 'Partner');
        setThemeColor(existing.themeColor || 'rose_gold');
        setParticles(existing.particles || 'confetti');
        setMusicTrack(existing.musicTrack || 'birthday_instrumental');
        setMessageTitle(existing.messageTitle || '');
        setMessageBody(existing.messageBody || '');
        setInteractiveElement(existing.interactiveElement || 'cake');
        setImages(existing.images && existing.images.length > 0 ? existing.images : [
          {
            url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
            caption: 'A beautiful memory we share'
          }
        ]);
      }
    } else {
      if (templateId === 'birthday') {
        setMessageTitle("Happy Birthday to my Favorite Person! 🎂");
        setMessageBody("Wishing you a beautiful day filled with joy and endless laughter. You mean so much to me, and I wanted to put together this little keepsake to celebrate you!");
      } else if (templateId === 'anniversary') {
        setMessageTitle("Happy Anniversary, My Partner in All Things! 💍");
        setMessageBody("Thank you for another year of incredible love, support, and friendship. Every single day with you is a gift, and I look forward to many more chapters together.");
      } else if (templateId === 'proposal') {
        setMessageTitle("To the one who holds my heart... ❤️");
        setMessageBody("From the very first moment we met, I knew you were the one. Every laugh, every conversation, every silent moment we shared only made me realize how much I want to spend forever with you.");
      } else {
        setMessageTitle("A special surprise crafted just for you 🌟");
        setMessageBody("Just a little digital letter and some of my favorite moments of us to put a smile on your face today. Thank you for being such an important part of my life.");
      }
    }
  }, [editCreationId, templateId]);

  const handleTogglePreview = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (trackId === 'none') {
      ambientMusic.stop(0.1);
      setPlayingPreviewTrack(null);
      return;
    }

    if (playingPreviewTrack === trackId) {
      ambientMusic.stop(0.1);
      setPlayingPreviewTrack(null);
    } else {
      setPlayingPreviewTrack(trackId);
      ambientMusic.start(trackId);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!recipientName.trim() || !creatorName.trim())) {
      alert("Please enter both Recipient Name and Your Name to proceed!");
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      ambientMusic.stop(0.1);
      const creationId = editCreationId || `creation-${recipientName.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 5)}`;
      const savedCreation: Creation = {
        id: creationId,
        recipientName,
        creatorName,
        specialDate,
        relationship,
        templateId,
        themeColor,
        particles,
        musicTrack,
        messageTitle,
        messageBody,
        interactiveElement,
        images,
        createdAt: new Date().toISOString().split('T')[0],
        views: editCreationId ? initialCreations.find(c => c.id === editCreationId)?.views || 0 : 0,
        status: 'LIVE',
        replies: editCreationId ? initialCreations.find(c => c.id === editCreationId)?.replies || [] : []
      };

      onSave(savedCreation);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      ambientMusic.stop(0.1);
      onClose();
    }
  };

  const handleAddImage = () => {
    setImages([...images, { url: '', caption: '' }]);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (index: number, key: 'url' | 'caption', value: string) => {
    const updated = [...images];
    updated[index][key] = value;
    setImages(updated);
  };

  const stepTitles = [
    'Recipient Details',
    'Message & Photos',
    'Theme & Lock Game',
    'Ambiance & Audio'
  ];

  const themeDetails: { [key: string]: { name: string; class: string; glow: string } } = {
    rose_gold: { name: 'Rose Gold', class: 'from-[#e29898] to-[#8a4d4e]', glow: 'shadow-[#e29898]/30' },
    amethyst: { name: 'Deep Amethyst', class: 'from-[#d1bdf8] to-[#66568a]', glow: 'shadow-[#66568a]/30' },
    golden_twilight: { name: 'Golden Twilight', class: 'from-[#ffe088] to-[#735c00]', glow: 'shadow-[#735c00]/30' },
    emerald: { name: 'Royal Emerald', class: 'from-[#a7f3d0] to-[#047857]', glow: 'shadow-[#047857]/30' }
  };

  const currentTheme = themeDetails[themeColor] || themeDetails.rose_gold;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans overflow-x-hidden relative animate-fade-in" id="wizard-container">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10 opacity-[0.03]" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10 opacity-[0.03]" />

      {/* Header Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-primary/10 flex justify-between items-center px-6 md:px-16 w-full z-50 h-20 top-0 sticky">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { ambientMusic.stop(0.1); onClose(); }}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Heart className="w-4 h-4 fill-current text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-primary uppercase italic">Memora Studio</span>
        </div>
        <button id="btn-close-wizard" onClick={() => { ambientMusic.stop(0.1); onClose(); }} className="text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 font-label-caps text-[9px] tracking-wider uppercase font-bold cursor-pointer">
          <X className="w-4 h-4" />
          <span className="hidden md:inline">Close Wizard</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col md:flex-row relative">
        {/* Left: Interactive Step Forms */}
        <div className="w-full md:w-3/5 lg:w-1/2 px-6 md:px-16 py-10 flex flex-col justify-center animate-enter" id="wizard-left-pane">
          
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-caps text-[8px] text-primary uppercase font-bold tracking-[0.2em]">Step {step} of {totalSteps}</span>
              <span className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">{stepTitles[step - 1]}</span>
            </div>
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8" id={`wizard-step-header-${step}`}>
            <h1 className="font-display text-3xl md:text-4xl text-on-background mb-2 font-bold tracking-tight">
              {step === 1 && "1. Who is this gift for?"}
              {step === 2 && "2. Write letter & add photos."}
              {step === 3 && "3. Select theme & surprise lock."}
              {step === 4 && "4. Pick ambiance & audio loop."}
            </h1>
            <p className="font-body-lg text-on-surface-variant text-xs leading-relaxed max-w-xl">
              {step === 1 && "Specify the recipient and creator details to personalize your gift surprise."}
              {step === 2 && "Express your feelings in a custom letter and attach special memory photos."}
              {step === 3 && "Choose a rich color palette and select how the recipient unlocks their letter on screen."}
              {step === 4 && "Select background particle dust and listen to ambient background music loops in real-time."}
            </p>
          </div>

          {/* Form Step Contents */}
          <div className="space-y-6" id={`wizard-step-form-${step}`}>
            
            {/* STEP 1: RECIPIENT & CREATOR DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="recipient-name">Recipient's Name *</label>
                    <input
                      id="recipient-name"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Who is this surprise for?"
                      className="w-full bg-transparent border-b border-primary/20 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="your-name">Your Name (Creator) *</label>
                    <input
                      id="your-name"
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      placeholder="How should we sign it?"
                      className="w-full bg-transparent border-b border-primary/20 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="relationship">Relationship</label>
                    <select
                      id="relationship"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    >
                      <option value="Partner">Partner / Spouse ❤️</option>
                      <option value="Friend">Best Friend ✨</option>
                      <option value="Parent">Parent / Guardian 🏡</option>
                      <option value="Child">Son / Daughter 🌟</option>
                      <option value="Sibling">Brother / Sister 🥳</option>
                      <option value="Other">Other Close Person 🎁</option>
                    </select>
                  </div>

                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="special-date">Special Occasion Date</label>
                    <input
                      id="special-date"
                      type="date"
                      value={specialDate}
                      onChange={(e) => setSpecialDate(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LETTER & PHOTO SCRAPBOOK */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4 border-b border-primary/10 pb-6">
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="letter-title">Letter Title Heading</label>
                    <input
                      id="letter-title"
                      type="text"
                      value={messageTitle}
                      onChange={(e) => setMessageTitle(e.target.value)}
                      placeholder="e.g. Happy Birthday, My Favorite Person! 🎂"
                      className="w-full bg-transparent border-b border-primary/20 py-2 focus:outline-none focus:border-primary transition-colors text-base font-semibold"
                    />
                  </div>

                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="letter-body">Keepsake Message Letter</label>
                    <textarea
                      id="letter-body"
                      rows={4}
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder="Write your beautiful heartfelt message here..."
                      className="w-full bg-primary/5 border border-primary/10 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all text-xs leading-relaxed font-body-lg"
                    />
                  </div>
                </div>

                {/* Photo Memory Scrapbook */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant tracking-widest">Memory Photos ({images.length})</label>
                    <button
                      id="btn-add-photo"
                      type="button"
                      onClick={handleAddImage}
                      className="text-[9px] text-primary font-bold font-label-caps uppercase tracking-widest flex items-center gap-1 hover:opacity-85 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Photo
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {images.map((img, idx) => (
                      <div id={`image-row-${idx}`} key={idx} className="p-4 bg-primary/5 rounded-2xl relative space-y-2.5 border border-primary/5 animate-scale-in">
                        <button
                          id={`btn-remove-photo-${idx}`}
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2.5 right-2.5 text-on-surface-variant hover:text-red-700 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[8px] font-bold font-label-caps uppercase text-on-surface-variant block mb-1">Photo URL {idx + 1}</label>
                            <input
                              id={`photo-url-input-${idx}`}
                              type="text"
                              value={img.url}
                              onChange={(e) => handleImageChange(idx, 'url', e.target.value)}
                              placeholder="Paste photo URL"
                              className="w-full bg-transparent border-b border-primary/20 py-1 text-xs focus:outline-none focus:border-primary font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[8px] font-bold font-label-caps uppercase text-on-surface-variant block mb-1">Caption</label>
                            <input
                              id={`photo-caption-input-${idx}`}
                              type="text"
                              value={img.caption}
                              onChange={(e) => handleImageChange(idx, 'caption', e.target.value)}
                              placeholder="Memory caption..."
                              className="w-full bg-transparent border-b border-primary/20 py-1 text-xs focus:outline-none focus:border-primary font-body-lg"
                            />
                          </div>
                        </div>

                        {idx === 0 && (
                          <div className="pt-1.5 flex flex-wrap items-center gap-1.5 border-t border-primary/5">
                            <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Quick Pics:</span>
                            {[
                              { label: 'Wrapped Gift 🎁', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDeis4xurkuDvw7heB3Sg_ocw2ZjY0tbwM3tWxpz4F-OpqGkDMn-hHdIF4IcPwiQ5LPkgcxoOX03PojfJa-eJ1BAwfqcL4NRCPcr6mCUTqoqy6WIeOaQ82F_lHTqkk-EpkeFhqSXMm_Q_RMXqOvzzzYZl9vlLL2yZWtFYx2S7baLRvA_y494EghYI5eP_ZsXXSdMfnP77uxAhgtvs0j0Q4NYmmYDHhXIjOMr9gfQM_sJu_mSnyBs-EIA' },
                              { label: 'Loving Hands 💍', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqFee02yy1lI_WruPT3mZBWxOo0s0udZMVpA-9NEWpnVfaI3t4shIZQfZ_wYBmtmW9x0qJ8RYOakw-V3AktYJIUXl3FGvyUNOMDv45X2qgGksCEugtmG5ksCgs5Y5IPVaAt8VeY3JKUUfdJejJnlfXFIWoRwpPA7MjCdWNdGFj-maeMW9d_phk3RU8LgHSC_1vI2YQyITyMEszmbUkCSA7Kv2Q0ldSBaGiArlAndLZYP7daKVOQOIHeA' },
                              { label: 'Lavender Letter 💌', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArR3ashizzHw_39rTPZTPeF7QeKNRT_l4E_aZ9x7JiMh94Gt3lpqLaH3cxALhgdZeN4TmOoMZ8ibgeuFk1XcN6rABWCWEAcfTkGlkoLHzazAoq-qSy5kTEGOoj0RDg5tm7enbec07NJ5V6PJtlwniQtUghYiaLKjqvwq0A-dsRwWiGZWuQiqjXzG4ckPJAS_RR-6rQHMRVwXVkWrUakEB1TyL2koXm8IwpQkAHaRDXFRzvEBGpjMFQVQ' }
                            ].map((opt, oIdx) => (
                              <button
                                id={`quick-pic-btn-${oIdx}`}
                                key={oIdx}
                                type="button"
                                onClick={() => handleImageChange(idx, 'url', opt.url)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-primary/10 text-[8px] font-bold font-label-caps uppercase text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: COLOR THEME & VISUAL INTERACTIVE LOCK */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Color Theme Selector */}
                <div>
                  <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant tracking-widest mb-3 block">Color Theme Palette</label>
                  <div className="grid grid-cols-2 gap-3" id="theme-selector-grid">
                    {Object.keys(themeDetails).map((key) => {
                      const item = themeDetails[key];
                      return (
                        <button
                          id={`theme-btn-${key}`}
                          key={key}
                          onClick={() => setThemeColor(key)}
                          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                            themeColor === key
                              ? 'border-primary ring-1 ring-primary bg-primary/5 font-bold shadow-md'
                              : 'border-primary/15 hover:border-primary/30 bg-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr border border-primary/10 ${item.class}`} />
                          <div>
                            <div className="font-bold text-xs uppercase text-on-background">{item.name}</div>
                            <div className="text-[7.5px] text-on-surface-variant uppercase font-label-caps">Keepsake Theme</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Lock Selector */}
                <div>
                  <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant tracking-widest mb-3 block">
                    Interactive Surprise Lock Game
                  </label>
                  
                  <div className="grid grid-cols-1 gap-3.5" id="lock-selector">
                    {[
                      {
                        id: 'cake',
                        title: 'Birthday Cake 🎂',
                        desc: 'Recipient taps glowing candles to blow them out & unlock your letter.',
                        badge: 'Candle Blow Minigame',
                        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=150&q=80'
                      },
                      {
                        id: 'puzzle',
                        title: 'Photo Puzzle 🧩',
                        desc: 'Recipient swaps 4 puzzle tiles of your memory photo to solve & unlock.',
                        badge: 'Tile Memory Game',
                        image: images[0]?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80'
                      },
                      {
                        id: 'envelope',
                        title: 'Wax Envelope 💌',
                        desc: 'Classic parchment envelope sealed with wax seal that breaks on tap.',
                        badge: 'Classic Touch Seal',
                        image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=150&q=80'
                      },
                      {
                        id: 'popup',
                        title: '3D Unfolding Card 💖',
                        desc: 'Artistic folding card that unfolds photo frame layers on screen.',
                        badge: '3D Unfolding Frames',
                        image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=150&q=80'
                      }
                    ].map(l => (
                      <button
                        id={`lock-btn-${l.id}`}
                        key={l.id}
                        onClick={() => setInteractiveElement(l.id as any)}
                        className={`p-4 rounded-2xl border text-left flex gap-4 justify-between items-center transition-all duration-200 relative overflow-hidden cursor-pointer ${
                          interactiveElement === l.id
                            ? 'border-primary ring-1 ring-primary bg-primary/5 shadow-md scale-[1.01]'
                            : 'border-primary/15 hover:border-primary/30 bg-white hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex-1">
                          <span className="font-label-caps text-[7.5px] uppercase tracking-wider text-primary font-bold block mb-1">
                            {l.badge}
                          </span>
                          <div className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">{l.title}</div>
                          <div className="text-[10px] text-on-surface-variant leading-relaxed">{l.desc}</div>
                          <div className="mt-3 text-[9px] font-bold font-label-caps uppercase text-primary">
                            {interactiveElement === l.id ? '✓ Selected' : 'Select'}
                          </div>
                        </div>

                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-primary/10 bg-primary/5 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <img src={l.image} alt={l.title} className="w-full h-full object-cover" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: AMBIANCE & MUSIC */}
            {step === 4 && (
              <div className="space-y-6">
                {/* Floating Particles */}
                <div>
                  <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant tracking-widest mb-3 block">
                    <Sparkles className="w-3.5 h-3.5 inline mr-1 text-primary animate-pulse" /> Floating Ambiance Particles
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'confetti', label: 'Confetti 🎉' },
                      { id: 'hearts', label: 'Hearts ❤️' },
                      { id: 'gold_dust', label: 'Gold Dust ✨' },
                      { id: 'stars', label: 'Stars 🌟' }
                    ].map(p => (
                      <button
                        id={`particles-btn-${p.id}`}
                        key={p.id}
                        onClick={() => setParticles(p.id as any)}
                        className={`py-3 px-2 rounded-xl text-[9px] font-bold text-center border font-label-caps uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                          particles === p.id
                            ? 'border-primary bg-primary text-white'
                            : 'border-primary/15 text-on-surface-variant hover:bg-primary/5 bg-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Music Loops */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-label-caps text-[8px] uppercase font-bold text-on-surface-variant tracking-widest flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-primary" /> Ambient Music Loops
                    </label>
                    {playingPreviewTrack && (
                      <span className="text-[9px] text-green-700 font-bold font-mono animate-pulse flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" /> Playing Preview...
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 'birthday_instrumental', label: 'Happy Birthday Loop 🎂', desc: 'Upbeat music-box & piano Happy Birthday melody' },
                      { id: 'romantic_piano', label: 'Romantic Piano 🎹', desc: 'Pure calming acoustic piano chords' },
                      { id: 'acoustic_guitar', label: 'Acoustic Ambiance 🎸', desc: 'Warm intimate acoustic guitar chords' },
                      { id: 'cinematic_strings', label: 'Cinematic Strings 🎻', desc: 'Atmospheric orchestra swells' },
                      { id: 'none', label: 'Quiet / Silent 🤫', desc: 'No background audio loop' }
                    ].map(m => {
                      const isSelected = musicTrack === m.id;
                      const isPlayingThis = playingPreviewTrack === m.id;

                      return (
                        <div
                          id={`music-card-${m.id}`}
                          key={m.id}
                          onClick={() => setMusicTrack(m.id)}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-primary ring-1 ring-primary bg-primary/5 shadow-sm'
                              : 'border-primary/15 hover:border-primary/35 bg-white'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs uppercase tracking-wider text-on-background flex items-center gap-2">
                              {m.label}
                              {isSelected && <span className="text-[8px] bg-primary text-white px-2 py-0.5 rounded-full font-label-caps font-bold">Selected</span>}
                            </div>
                            <div className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">{m.desc}</div>
                          </div>

                          {m.id !== 'none' && (
                            <button
                              type="button"
                              onClick={(e) => handleTogglePreview(m.id, e)}
                              className={`py-1.5 px-3 rounded-xl text-[9px] font-label-caps font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all cursor-pointer ${
                                isPlayingThis
                                  ? 'bg-green-700 text-white border-green-700 animate-pulse'
                                  : 'border-primary/20 text-primary hover:bg-primary hover:text-white bg-white shadow-sm'
                              }`}
                              title={isPlayingThis ? "Pause Preview" : "Listen Preview"}
                            >
                              {isPlayingThis ? (
                                <><Pause className="w-3 h-3 fill-current" /> Pause</>
                              ) : (
                                <><Play className="w-3 h-3 fill-current" /> Listen</>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Card Mockup Preview */}
        <div className="hidden md:flex w-2/5 lg:w-1/2 p-12 items-center justify-center relative bg-primary/5 border-l border-primary/10" id="wizard-right-pane">
          <div className="glass-card w-full max-w-sm rounded-3xl p-6 relative overflow-hidden group border border-primary/10 bg-white shadow-2xl">
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentTheme.class}`} />

            <div className="text-center mb-6 pt-2">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2 fill-current animate-pulse" />
              <h3 className="font-display text-2xl text-on-background font-bold tracking-tight">
                {recipientName ? `For ${recipientName}` : 'Keepsake Surprise'}
              </h3>
              <p className="font-body-lg text-on-surface-variant text-[11px] mt-1.5 italic">
                From {creatorName || 'Your Special Someone'}
              </p>
            </div>

            {/* Preview Picture Wrapper */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative mb-4 border border-primary/10 bg-primary/5">
              <div
                className="bg-cover bg-center w-full h-full grayscale"
                style={{ backgroundImage: `url('${images[0]?.url || template.image}')` }}
              />
              <div className="absolute inset-0 bg-background/10" />
              <div className="absolute bottom-2.5 left-2.5 bg-white border border-primary/15 py-0.5 px-2.5 rounded-lg text-[8px] font-bold text-primary font-label-caps uppercase tracking-widest shadow-sm">
                Lock: {interactiveElement}
              </div>
            </div>

            {/* Preview Details */}
            <div className="space-y-1.5 text-center">
              <div className="text-[10px] text-on-surface-variant font-bold truncate">
                "{messageTitle || 'Happy Birthday!'}"
              </div>
              <div className="flex items-center gap-1 text-[8px] text-primary justify-center uppercase font-label-caps font-bold tracking-widest">
                <Sparkles className="w-3 h-3 text-primary" />
                Theme: {currentTheme.name} • Music: {musicTrack.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md fixed bottom-0 w-full z-50 flex justify-between items-center px-6 md:px-16 py-4 border-t border-primary/10 shadow-lg rounded-t-3xl">
        <button
          id="wizard-btn-back"
          onClick={handleBack}
          className="border border-primary/20 text-on-surface font-label-caps text-[9px] tracking-widest font-bold hover:bg-primary/5 py-2.5 px-6 rounded-xl flex items-center gap-1.5 uppercase transition-all cursor-pointer shadow-sm bg-white"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Center dots indicators */}
        <div className="hidden md:flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i + 1 ? 'bg-primary w-5' : 'bg-primary/20 w-2'
              }`}
            />
          ))}
        </div>

        <button
          id="wizard-btn-next"
          onClick={handleNext}
          className="btn-primary px-8 py-2.5 text-[9px] tracking-widest uppercase font-bold shadow-md"
        >
          {step === totalSteps ? 'Publish Keepsake' : 'Next Step'}
          <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
        </button>
      </nav>

      <div className="h-24 w-full" />
    </div>
  );
}

export const WizardAnims = () => (
  <style>{`
    .animate-enter {
      animation: slideUpFade 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
    }
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);
