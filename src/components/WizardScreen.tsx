import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Cake, FileText, Image, Lock, Play, Music, Gift, Heart, Plus } from 'lucide-react';
import { Creation, ExperienceTemplate, EXPERIENCE_TEMPLATES } from '../types';

interface WizardScreenProps {
  templateId: string;
  editCreationId?: string; // If editing an existing creation
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
  // Find current template
  const template = EXPERIENCE_TEMPLATES.find(t => t.id === templateId) || EXPERIENCE_TEMPLATES[0];

  // 1. Wizard Form State
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Initialize form state
  const [recipientName, setRecipientName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [specialDate, setSpecialDate] = useState('');
  const [relationship, setRelationship] = useState('');
  const [themeColor, setThemeColor] = useState(template.themeColor);
  const [particles, setParticles] = useState<'hearts' | 'gold_dust' | 'confetti' | 'stars'>(template.particles);
  const [musicTrack, setMusicTrack] = useState(template.musicTrack || 'romantic_piano');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [interactiveElement, setInteractiveElement] = useState<'puzzle' | 'envelope' | 'popup' | 'cake'>(template.interactiveType);
  const [images, setImages] = useState<{ url: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      caption: 'The beautiful days we spend laughing together'
    }
  ]);
  const [decorFX, setDecorFX] = useState('confetti_burst');

  // Load existing creation if editing
  useEffect(() => {
    if (editCreationId) {
      const existing = initialCreations.find(c => c.id === editCreationId);
      if (existing) {
        setRecipientName(existing.recipientName);
        setCreatorName(existing.creatorName);
        setSpecialDate(existing.specialDate);
        setRelationship(existing.relationship);
        setThemeColor(existing.themeColor);
        setParticles(existing.particles);
        setMusicTrack(existing.musicTrack);
        setMessageTitle(existing.messageTitle);
        setMessageBody(existing.messageBody);
        setInteractiveElement(existing.interactiveElement);
        setImages(existing.images.length > 0 ? existing.images : [
          {
            url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
            caption: 'A beautiful memory we share'
          }
        ]);
      }
    } else {
      // Set default placeholders based on template
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
  }, [editCreationId, templateId, template]);

  // Handle step transitions
  const handleNext = () => {
    if (step === 1 && (!recipientName.trim() || !creatorName.trim())) {
      alert("Please fill in both Recipient's and Your names to continue!");
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final Submit
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
      onClose();
    }
  };

  // Image helpers
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

  // Step names
  const stepTitles = [
    'Basic Details',
    'Color Theme',
    'Atmospheric FX',
    'Heartfelt Letter',
    'Interactive Lock',
    'Memory Vault',
    'Gift Wrapping',
    'Review & Publish'
  ];

  // Selected preview details
  const themeDetails: { [key: string]: { name: string; class: string; glow: string } } = {
    rose_gold: { name: 'Rose Gold', class: 'from-[#e29898] to-[#8a4d4e]', glow: 'shadow-[#e29898]/30' },
    amethyst: { name: 'Deep Amethyst', class: 'from-[#d1bdf8] to-[#66568a]', glow: 'shadow-[#66568a]/30' },
    golden_twilight: { name: 'Golden Twilight', class: 'from-[#ffe088] to-[#735c00]', glow: 'shadow-[#735c00]/30' },
    emerald: { name: 'Royal Emerald', class: 'from-[#a7f3d0] to-[#047857]', glow: 'shadow-[#047857]/30' }
  };

  const currentTheme = themeDetails[themeColor] || themeDetails.rose_gold;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans overflow-x-hidden relative" id="wizard-container">
      {/* Subtle background overlay */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-tr from-primary-container/2 via-transparent to-secondary-container/2" />

      {/* Header Bar */}
      <header className="bg-background border-b border-primary/20 flex justify-between items-center px-6 md:px-16 w-full z-50 h-20 top-0 sticky">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onClose}>
          <div className="w-9 h-9 border border-primary flex items-center justify-center text-primary bg-background">
            <Heart className="w-4 h-4 fill-current text-primary" />
          </div>
          <span className="font-display-lg text-xl font-bold tracking-tight text-primary uppercase italic">MyHeartCraft Studio</span>
        </div>
        <button id="btn-close-wizard" onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 font-label-caps text-[10px] tracking-wider uppercase font-bold">
          <X className="w-4 h-4" />
          <span className="hidden md:inline">Save & Exit</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col md:flex-row relative">
        {/* Left: Interactive Step Forms */}
        <div className="w-full md:w-3/5 lg:w-1/2 px-6 md:px-16 py-12 flex flex-col justify-center animate-enter" id="wizard-left-pane">
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-[0.2em]">Step {step} of {totalSteps}</span>
              <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">{stepTitles[step - 1]}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-none overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8" id={`wizard-step-header-${step}`}>
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-background mb-2 font-light tracking-tight">
              {step === 1 && "Let's begin the magic."}
              {step === 2 && "Pick an elegant color story."}
              {step === 3 && "Set the sensory ambiance."}
              {step === 4 && "Write a beautiful message."}
              {step === 5 && "Choose an interactive entry lock."}
              {step === 6 && "Embed your favorite memories."}
              {step === 7 && "Add special effects."}
              {step === 8 && "Review your masterpiece."}
            </h1>
            <p className="font-body-lg text-on-surface-variant text-xs leading-relaxed max-w-xl">
              {step === 1 && "Tell us about the person you are celebrating. This helps us tailor the template beautifully."}
              {step === 2 && "Choose a rich palette that best suits the mood of your digital card keepsake."}
              {step === 3 && "Add floating particle dust effects and matching ambient background music loops."}
              {step === 4 && "Add your title heading and customized digital letter to your special person."}
              {step === 5 && "The recipient must solve or click this interactive minigame to unfold your personalized letter."}
              {step === 6 && "Add photos that show your best moments. Paste image URLs or select defaults."}
              {step === 7 && "Add decorative virtual components that celebrate their arrival on screen."}
              {step === 8 && "Make sure all details are pristine. Clicking publish launches this digital keepsake!"}
            </p>
          </div>

          {/* Form Step Contents */}
          <div className="space-y-6" id={`wizard-step-form-${step}`}>
            
            {/* STEP 1: BASIC DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="recipient-name">Recipient's Name</label>
                    <input
                      id="recipient-name"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Who is this surprise for?"
                      className="w-full bg-transparent border-b border-primary/20 py-2 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    />
                  </div>
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="your-name">Your Name</label>
                    <input
                      id="your-name"
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      placeholder="How should we sign it?"
                      className="w-full bg-transparent border-b border-primary/20 py-2 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="special-date">The Special Date</label>
                    <input
                      id="special-date"
                      type="date"
                      value={specialDate}
                      onChange={(e) => setSpecialDate(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-2 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                    />
                  </div>
                  <div className="flex flex-col group">
                    <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="relationship">Relationship</label>
                    <select
                      id="relationship"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-2 text-sm focus:outline-none focus:border-primary transition-colors font-sans"
                    >
                      <option value="" disabled>How do you know them?</option>
                      <option value="Partner">Partner / Spouse</option>
                      <option value="Friend">Best Friend</option>
                      <option value="Parent">Parent / Guardian</option>
                      <option value="Child">Son / Daughter</option>
                      <option value="Sibling">Brother / Sister</option>
                      <option value="Other">Other Close Person</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: COLOR THEME */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="theme-selector-grid">
                {Object.keys(themeDetails).map((key) => {
                  const item = themeDetails[key];
                  return (
                    <button
                      id={`theme-btn-${key}`}
                      key={key}
                      onClick={() => setThemeColor(key)}
                      className={`p-5 rounded-none border text-left flex items-center gap-4 transition-all duration-300 ${
                        themeColor === key
                          ? 'border-primary ring-1 ring-primary bg-primary/5'
                          : 'border-primary/20 hover:border-primary/50 bg-background'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-none bg-gradient-to-tr border border-primary/20 ${item.class}`} />
                      <div>
                        <div className="font-bold text-xs font-display-lg uppercase tracking-wider text-on-background">{item.name}</div>
                        <div className="text-[10px] text-on-surface-variant uppercase mt-1 font-label-caps tracking-widest">Premium Palette</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 3: AMBIENCE */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-3 block">
                    <Sparkles className="w-3 h-3 inline mr-1 text-primary" /> Floating Particles (Drifting effect)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'confetti', label: 'Festive Confetti' },
                      { id: 'hearts', label: 'Floating Hearts' },
                      { id: 'gold_dust', label: 'Golden Glimmer' },
                      { id: 'stars', label: 'Shimmering Stars' }
                    ].map(p => (
                      <button
                        id={`particles-btn-${p.id}`}
                        key={p.id}
                        onClick={() => setParticles(p.id as any)}
                        className={`py-3 px-2 rounded-none text-[9px] font-bold text-center border font-label-caps uppercase tracking-widest transition-all duration-200 ${
                          particles === p.id
                            ? 'border-primary bg-primary text-background'
                            : 'border-primary/20 text-on-surface-variant hover:bg-primary/5 hover:text-on-surface bg-background'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-3 block">
                    <Music className="w-3 h-3 inline mr-1 text-primary" /> Ambient Music Loop (Web-synthesized)
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'birthday_instrumental', label: 'Happy Birthday Instrumental 🎂', desc: 'Upbeat music-box & piano Happy Birthday song melody' },
                      { id: 'romantic_piano', label: 'Romantic Piano', desc: 'Pure calming piano notes' },
                      { id: 'acoustic_guitar', label: 'Acoustic Ambiance', desc: 'Intimate acoustic chords' },
                      { id: 'cinematic_strings', label: 'Cinematic Strings', desc: 'Atmospheric orchestra swell' },
                      { id: 'none', label: 'Quiet', desc: 'Silent experience' }
                    ].map(m => (
                      <button
                        id={`music-btn-${m.id}`}
                        key={m.id}
                        onClick={() => setMusicTrack(m.id)}
                        className={`w-full p-4 rounded-none border text-left flex items-center justify-between transition-all duration-250 ${
                          musicTrack === m.id
                            ? 'border-primary bg-primary/5'
                            : 'border-primary/20 hover:border-primary/40 bg-background'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs uppercase tracking-wider text-on-background">{m.label}</div>
                          <div className="text-[10px] text-on-surface-variant mt-1 leading-relaxed font-body-lg">{m.desc}</div>
                        </div>
                        {musicTrack === m.id && <Play className="w-3.5 h-3.5 text-primary fill-current" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: LETTER WRITING */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex flex-col group">
                  <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="letter-title">Letter Title Heading</label>
                  <input
                    id="letter-title"
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="e.g. Happy Birthday, My Love! 🎂"
                    className="w-full bg-transparent border-b border-primary/20 py-2 focus:outline-none focus:border-primary focus:ring-0 transition-colors text-base font-semibold"
                  />
                </div>

                <div className="flex flex-col group">
                  <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant mb-2 group-focus-within:text-primary transition-all tracking-widest" htmlFor="letter-body">Keepsake Letter Message</label>
                  <textarea
                    id="letter-body"
                    rows={6}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Write your beautiful heartfelt words of gratitude and love here..."
                    className="w-full bg-transparent border border-primary/20 rounded-none p-4 focus:outline-none focus:border-primary focus:ring-0 transition-colors text-xs leading-relaxed font-body-lg"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: INTERACTIVE LOCK */}
            {step === 5 && (
              <div className="space-y-4" id="lock-selector">
                {[
                  { id: 'cake', title: 'Virtual Birthday Cake', desc: 'A beautiful birthday cake where candles must be tapped to blow them out.', icon: Cake },
                  { id: 'envelope', title: 'Wax-Sealed Envelope', desc: 'A classic parchment envelope sealed with wax they must break to open.', icon: FileText },
                  { id: 'popup', title: '3D Folding Keepsake Card', desc: 'An artistic card that unfolds layers of photo frames on click.', icon: Heart },
                  { id: 'puzzle', title: 'Interactive Photo Puzzle', desc: 'A tile-swapping photo puzzle of your cover memory that must be solved.', icon: Lock }
                ].map(l => {
                  const Icon = l.icon;
                  return (
                    <button
                      id={`lock-btn-${l.id}`}
                      key={l.id}
                      onClick={() => setInteractiveElement(l.id as any)}
                      className={`w-full p-4 rounded-none border text-left flex items-start gap-4 transition-all duration-250 ${
                        interactiveElement === l.id
                          ? 'border-primary bg-primary/5'
                          : 'border-primary/20 hover:border-primary/30 bg-background'
                      }`}
                    >
                      <div className="w-10 h-10 border border-primary/30 flex items-center justify-center text-primary mt-0.5 shrink-0 bg-background">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wider text-on-background">{l.title}</div>
                        <div className="text-[10px] text-on-surface-variant mt-1 leading-relaxed font-body-lg">{l.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 6: MEMORY VAULT (PHOTOS) */}
            {step === 6 && (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2" id="memory-images-form">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant tracking-widest">Embed Keepsake Photos</span>
                  <button
                    id="btn-add-photo"
                    type="button"
                    onClick={handleAddImage}
                    className="text-[9px] text-primary font-bold font-label-caps uppercase tracking-widest flex items-center gap-1 hover:opacity-85"
                  >
                    <Plus className="w-4 h-4" /> Add Photo
                  </button>
                </div>

                {images.map((img, idx) => (
                  <div id={`image-row-${idx}`} key={idx} className="p-4 bg-surface-container rounded-none relative space-y-3 border border-primary/20">
                    <button
                      id={`btn-remove-photo-${idx}`}
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 text-on-surface-variant hover:text-red-700 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col group">
                      <label className="text-[9px] font-bold font-label-caps uppercase text-on-surface-variant tracking-wider mb-1">Photo URL {idx + 1}</label>
                      <input
                        id={`photo-url-input-${idx}`}
                        type="text"
                        value={img.url}
                        onChange={(e) => handleImageChange(idx, 'url', e.target.value)}
                        placeholder="Paste image web link (or keep default)"
                        className="w-full bg-transparent border-b border-primary/20 py-1 text-xs focus:outline-none focus:border-primary font-mono"
                      />
                    </div>

                    <div className="flex flex-col group">
                      <label className="text-[9px] font-bold font-label-caps uppercase text-on-surface-variant tracking-wider mb-1">Emotional Caption</label>
                      <input
                        id={`photo-caption-input-${idx}`}
                        type="text"
                        value={img.caption}
                        onChange={(e) => handleImageChange(idx, 'caption', e.target.value)}
                        placeholder="Write a sweet memory/caption..."
                        className="w-full bg-transparent border-b border-primary/20 py-1 text-xs focus:outline-none focus:border-primary font-body-lg"
                      />
                    </div>

                    {/* Pre-made quick pick options */}
                    {idx === 0 && (
                      <div className="pt-1">
                        <span className="text-[8px] text-on-surface-variant font-bold uppercase tracking-widest">Quick picks:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {[
                            { label: 'Wrapped Gift', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDeis4xurkuDvw7heB3Sg_ocw2ZjY0tbwM3tWxpz4F-OpqGkDMn-hHdIF4IcPwiQ5LPkgcxoOX03PojfJa-eJ1BAwfqcL4NRCPcr6mCUTqoqy6WIeOaQ82F_lHTqkk-EpkeFhqSXMm_Q_RMXqOvzzzYZl9vlLL2yZWtFYx2S7baLRvA_y494EghYI5eP_ZsXXSdMfnP77uxAhgtvs0j0Q4NYmmYDHhXIjOMr9gfQM_sJu_mSnyBs-EIA' },
                            { label: 'Hands & Rings', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqFee02yy1lI_WruPT3mZBWxOo0s0udZMVpA-9NEWpnVfaI3t4shIZQfZ_wYBmtmW9x0qJ8RYOakw-V3AktYJIUXl3FGvyUNOMDv45X2qgGksCEugtmG5ksCgs5Y5IPVaAt8VeY3JKUUfdJejJnlfXFIWoRwpPA7MjCdWNdGFj-maeMW9d_phk3RU8LgHSC_1vI2YQyITyMEszmbUkCSA7Kv2Q0ldSBaGiArlAndLZYP7daKVOQOIHeA' },
                            { label: 'Letter Lavender', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArR3ashizzHw_39rTPZTPeF7QeKNRT_l4E_aZ9x7JiMh94Gt3lpqLaH3cxALhgdZeN4TmOoMZ8ibgeuFk1XcN6rABWCWEAcfTkGlkoLHzazAoq-qSy5kTEGOoj0RDg5tm7enbec07NJ5V6PJtlwniQtUghYiaLKjqvwq0A-dsRwWiGZWuQiqjXzG4ckPJAS_RR-6rQHMRVwXVkWrUakEB1TyL2koXm8IwpQkAHaRDXFRzvEBGpjMFQVQ' }
                          ].map((opt, oIdx) => (
                            <button
                              id={`quick-pic-btn-${oIdx}`}
                              key={oIdx}
                              type="button"
                              onClick={() => handleImageChange(idx, 'url', opt.url)}
                              className="px-2 py-0.5 bg-background border border-primary/25 text-[8px] font-bold font-label-caps uppercase text-primary hover:bg-primary hover:text-background"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 7: GIFT WRAPPING */}
            {step === 7 && (
              <div className="space-y-4" id="fx-selector">
                <label className="font-label-caps text-[9px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 block">Trigger Celebratory FX on Reveal</label>
                {[
                  { id: 'confetti_burst', title: 'Exploding Confetti Burst', desc: 'Releases a joyful high-density burst of multicolored paper upon unlocking.' },
                  { id: 'floating_lanterns', title: 'Floating Golden Lanterns', desc: 'Slowly floats romantic golden light particles up from the bottom boundary.' },
                  { id: 'falling_petals', title: 'Falling Soft Rose Petals', desc: 'Gently drifts warm blush-pink flower petals from the top edge downward.' },
                  { id: 'shimmer_sparkles', title: 'Magical Shimmering Sparkles', desc: 'Triggers a series of golden stars glimmering all across the viewport canvas.' }
                ].map(fx => (
                  <button
                    id={`fx-btn-${fx.id}`}
                    key={fx.id}
                    onClick={() => setDecorFX(fx.id)}
                    className={`w-full p-4 rounded-none border text-left flex items-start gap-4 transition-all duration-250 ${
                      decorFX === fx.id
                        ? 'border-primary bg-primary/5'
                        : 'border-primary/20 hover:border-primary/30 bg-background'
                    }`}
                  >
                    <div className="w-10 h-10 border border-primary/30 flex items-center justify-center text-primary mt-0.5 shrink-0 bg-background">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wider text-on-background">{fx.title}</div>
                      <div className="text-[10px] text-on-surface-variant mt-1 leading-relaxed font-body-lg">{fx.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 8: REVIEW & PUBLISH */}
            {step === 8 && (
              <div className="space-y-4" id="review-panel">
                <div className="p-6 bg-surface-container rounded-none border border-primary/25 space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-primary/10 pb-1.5"><span className="text-on-surface-variant font-medium">Recipient:</span> <span className="font-bold text-on-background">{recipientName}</span></div>
                  <div className="flex justify-between border-b border-primary/10 pb-1.5"><span className="text-on-surface-variant font-medium">Your Sign-off:</span> <span className="font-bold text-on-background">{creatorName}</span></div>
                  <div className="flex justify-between border-b border-primary/10 pb-1.5"><span className="text-on-surface-variant font-medium">Special Occasion:</span> <span className="font-bold text-on-background">{relationship} ({specialDate || 'Unspecified Date'})</span></div>
                  <div className="flex justify-between border-b border-primary/10 pb-1.5"><span className="text-on-surface-variant font-medium">Color Theme:</span> <span className="font-bold text-on-background uppercase">{themeColor.replace('_', ' ')}</span></div>
                  <div className="flex justify-between border-b border-primary/10 pb-1.5"><span className="text-on-surface-variant font-medium">Ambiance:</span> <span className="font-bold text-on-background capitalize">{particles.replace('_', ' ')} Dust & {musicTrack.replace('_', ' ')}</span></div>
                  <div className="flex justify-between border-b border-primary/10 pb-1.5"><span className="text-on-surface-variant font-medium">Lock Game:</span> <span className="font-bold text-on-background capitalize">{interactiveElement} Unlock</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Memory Media:</span> <span className="font-bold text-on-background">{images.length} Photos Embedded</span></div>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-primary bg-primary/5 p-4 rounded-none border border-primary/20 flex gap-3 items-center leading-relaxed">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Your digital keepsake is ready to be written to our cloud server, granting a secure private URL for {recipientName}!
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right: Live-Updating Glassmorphic Sidebar Card Preview */}
        <div className="hidden md:flex w-2/5 lg:w-1/2 p-12 items-center justify-center relative bg-surface-container-low/20 border-l border-primary/10" id="wizard-right-pane">
          <div className="absolute inset-0 bg-radial-gradient from-primary-container/10 to-transparent pointer-events-none" />
          
          <div className="glass-card w-full max-w-sm rounded-none p-6 relative overflow-hidden group border border-primary bg-background shadow-none">
            {/* Top decorative gradient bar */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${currentTheme.class}`} />

            <div className="text-center mb-6 pt-2">
              {templateId === 'birthday' ? (
                <Cake className="w-8 h-8 text-primary mx-auto mb-3" />
              ) : (
                <Heart className="w-8 h-8 text-primary mx-auto mb-3 fill-current" />
              )}
              <h3 className="font-display-lg text-2xl text-on-background font-light capitalize tracking-tight">
                {templateId === 'birthday' ? 'Birthday Theme' : `${templateId} Theme`}
              </h3>
              <p className="font-body-lg text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Preview Picture Wrapper */}
            <div className="w-full aspect-[4/3] rounded-none overflow-hidden relative mb-4 border border-primary/20 bg-primary-container">
              <div
                className="bg-cover bg-center w-full h-full grayscale"
                style={{ backgroundImage: `url('${images[0]?.url || template.image}')` }}
              />
              <div className="absolute inset-0 bg-background/20" />
              {recipientName && (
                <div className="absolute bottom-3 left-3 bg-background border border-primary py-1 px-3 rounded-none text-[8px] font-bold text-primary font-label-caps uppercase tracking-widest">
                  For {recipientName}
                </div>
              )}
            </div>

            {/* Theme state badge */}
            <div className="flex items-center gap-1.5 text-[9px] text-primary justify-center uppercase font-label-caps font-bold tracking-widest">
              <Sparkles className="w-3 h-3 text-primary" />
              Theme Selected: {currentTheme.name}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Buttons Bar */}
      <nav className="bg-background fixed bottom-0 w-full z-50 flex justify-between items-center px-6 md:px-16 py-4 border-t border-primary/20 shadow-md">
        <button
          id="wizard-btn-back"
          onClick={handleBack}
          className="border border-primary/30 text-on-surface font-label-caps text-[9px] tracking-widest font-bold hover:bg-primary/5 py-2.5 px-6 rounded-none flex items-center gap-1 uppercase transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Center dots indicators */}
        <div className="hidden md:flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-none transition-all duration-300 ${
                step === i + 1 ? 'bg-primary w-4' : 'bg-primary/20'
              }`}
            />
          ))}
        </div>

        <button
          id="wizard-btn-next"
          onClick={handleNext}
          className="btn-primary px-8 py-2.5 text-[9px] tracking-widest uppercase font-bold"
        >
          {step === totalSteps ? 'Generate Keepsake' : 'Next Step'}
          <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
        </button>
      </nav>

      {/* Spacer padding bottom so contents aren't blocked by fixed bottom nav */}
      <div className="h-24 w-full" />
    </div>
  );
}
export const WizardAnims = () => (
  <style>{`
    .animate-enter {
      animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);
