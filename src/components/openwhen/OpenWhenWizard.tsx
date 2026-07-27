import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Layers, HelpCircle, CheckSquare, Square, Plus, Trash2 } from 'lucide-react';
import { OpenWhenProject, OpenWhenMessage } from './types';
import { PRESET_PROMPTS, OCCASION_LABELS } from './prompts';

interface OpenWhenWizardProps {
  onSave: (newProject: OpenWhenProject) => void;
  onClose: () => void;
}

const STYLES = [
  { id: 'soft-emotional', label: 'Soft & Emotional', desc: 'Blush pink hues, serif fonts, emotional transition flows.' },
  { id: 'minimal-editorial', label: 'Minimal Editorial', desc: 'Clean white space, sans typography, magazine layouts.' },
  { id: 'dark-cinematic', label: 'Dark & Cinematic', desc: 'Dramatic dark lighting backgrounds, gold highlights.' },
  { id: 'playful-fun', label: 'Playful & Fun', desc: 'Vibrant bouncy layouts, bright cartoon assets.' },
  { id: 'personal-handwritten', label: 'Personal & Handwritten', desc: 'Notebook grids, paper fibers, cursive letters.' }
] as const;

export default function OpenWhenWizard({ onSave, onClose }: OpenWhenWizardProps) {
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState<keyof typeof OCCASION_LABELS>('romantic');
  const [style, setStyle] = useState<typeof STYLES[number]['id']>('soft-emotional');
  
  // Prompts selection
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);
  const [newCustomPrompt, setNewCustomPrompt] = useState('');

  // Metadata Form
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [introduction, setIntroduction] = useState('');

  const handleNext = () => {
    if (step === 1) {
      // Auto-prefill default prompts based on occasion
      const defaults = (PRESET_PROMPTS[occasion] || []).map(p => p.title);
      setSelectedPrompts(defaults);
    }
    if (step === 3 && !title) {
      setTitle(`For ${recipientName || 'You'}`);
      setIntroduction(`I created these messages for the moments when I can't be right next to you. Open each envelope when the moment feels right.`);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleTogglePrompt = (promptTitle: string) => {
    setSelectedPrompts(prev => 
      prev.includes(promptTitle) ? prev.filter(t => t !== promptTitle) : [...prev, promptTitle]
    );
  };

  const handleAddCustomPrompt = () => {
    if (!newCustomPrompt.trim()) return;
    setCustomPrompts(prev => [...prev, newCustomPrompt.trim()]);
    setSelectedPrompts(prev => [...prev, newCustomPrompt.trim()]);
    setNewCustomPrompt('');
  };

  const handleRemoveCustomPrompt = (promptText: string) => {
    setCustomPrompts(prev => prev.filter(t => t !== promptText));
    setSelectedPrompts(prev => prev.filter(t => t !== promptText));
  };

  const handleAssembleCollection = () => {
    if (!title.trim() || !recipientName.trim() || !creatorName.trim()) {
      alert('Please fill out Title, Recipient, and Creator Name fields.');
      return;
    }

    // Build the messages list
    const messages: OpenWhenMessage[] = selectedPrompts.map((pTitle, idx) => ({
      id: `ow-msg-${idx}-${Date.now()}`,
      promptTitle: pTitle,
      textContent: `Hey ${recipientName}, you opened this envelope because the moment arrived: "${pTitle}". Write your heartfelt words here.`,
      photos: [],
      unlockMode: 'honor',
      status: 'SEALED'
    }));

    const newProject: OpenWhenProject = {
      id: `openwhen-${Date.now()}`,
      title,
      creatorName,
      recipientName,
      relationship,
      occasion,
      style,
      coverMessage: 'One gift. Many moments.',
      introduction,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'DRAFT',
      privacy: 'unlisted',
      enableAnalytics: true,
      views: 0
    };

    onSave(newProject);
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface antialiased flex items-center justify-center p-6 md:p-12 relative overflow-hidden" id="open-when-wizard">
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_0)] [background-size:16px_16px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-background border border-primary p-6 md:p-10 relative z-10 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-primary/20 pb-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#999]">Collection Setup // Step {step} of 4</span>
            <h2 className="font-display text-2xl md:text-3xl text-primary font-bold mt-1">
              {step === 1 && "Choose Occasion Theme"}
              {step === 2 && "Select Prompts Envelopes"}
              {step === 3 && "Select Design Style"}
              {step === 4 && "Collection Details"}
            </h2>
          </div>
          <button onClick={onClose} className="text-[10px] uppercase tracking-wider font-mono hover:text-red-500 font-semibold">
            Cancel
          </button>
        </div>

        {/* Form Body steps */}
        <div className="min-h-[300px]">
          {/* Step 1: Occasions */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
              {Object.keys(OCCASION_LABELS).map(key => {
                const label = OCCASION_LABELS[key as keyof typeof OCCASION_LABELS];
                const isSelected = occasion === key;
                return (
                  <button
                    key={key}
                    onClick={() => setOccasion(key as any)}
                    className={`p-6 border text-left cursor-pointer transition-all flex flex-col justify-between h-[130px] ${
                      isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-primary/10 hover:border-primary/30 bg-surface'
                    }`}
                    style={{ borderLeftWidth: isSelected ? '5px' : '1px' }}
                  >
                    <div>
                      <span className="font-sans text-xs font-bold uppercase tracking-wider block mb-2">{label}</span>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        Occasion templates and suggested titles tailored for your recipient relationship.
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Choose Prompts */}
          {step === 2 && (
            <div className="space-y-6">
              <span className="font-mono text-[9px] text-[#777] uppercase block">Suggested Moment Prompts</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {(PRESET_PROMPTS[occasion] || []).map(preset => {
                  const isChecked = selectedPrompts.includes(preset.title);
                  return (
                    <button
                      key={preset.title}
                      onClick={() => handleTogglePrompt(preset.title)}
                      className={`p-3.5 border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isChecked ? 'border-primary bg-primary/5' : 'border-primary/10 hover:bg-surface-container-low'
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" /> : <Square className="w-4 h-4 text-primary/30 mt-0.5 shrink-0" />}
                      <div>
                        <span className="text-xs font-bold block mb-1 text-primary">{preset.title}</span>
                        <p className="text-[10px] text-on-surface-variant leading-relaxed">{preset.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Prompts section */}
              <div className="border-t border-primary/10 pt-4 space-y-4">
                <span className="font-mono text-[9px] text-[#777] uppercase block">Add Custom Envelopes</span>
                <div className="flex gap-2 max-w-xl">
                  <input
                    type="text"
                    value={newCustomPrompt}
                    onChange={(e) => setNewCustomPrompt(e.target.value)}
                    placeholder="e.g. Open when you get a new job"
                    className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                  />
                  <button
                    onClick={handleAddCustomPrompt}
                    className="btn-primary py-2 px-4 text-xs font-bold shrink-0"
                  >
                    + Add Envelope
                  </button>
                </div>

                {customPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {customPrompts.map((cp, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-xs px-2.5 py-1 text-primary">
                        {cp}
                        <button onClick={() => handleRemoveCustomPrompt(cp)} className="hover:text-red-500 font-bold">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Styles */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {STYLES.map(s => {
                const isSelected = style === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-6 border text-left cursor-pointer transition-all flex flex-col justify-between h-[150px] ${
                      isSelected ? 'border-primary shadow-md' : 'border-primary/15 bg-surface hover:border-primary/40'
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

          {/* Step 4: Metadata details Form */}
          {step === 4 && (
            <div className="max-w-xl mx-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block font-semibold">Collection Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. For Priya"
                    className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block font-semibold">Relationship</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Partner, Best Friend"
                    className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block font-semibold">Recipient Name *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Priya"
                    className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block font-semibold">Your Name *</label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="e.g. Abhishek"
                    className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#777] block font-semibold">Collection Introduction / Welcome note</label>
                <textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="I created this collection for moments when I cannot be there next to you..."
                  rows={4}
                  className="w-full border border-primary px-3 py-2 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions Nav */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-primary/20">
          <button
            onClick={handleBack}
            className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-primary flex items-center gap-2 transition-all ${
              step === 1 ? 'opacity-40 pointer-events-none' : 'hover:bg-primary/5'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="btn-primary py-2.5 px-5 text-[10px] flex items-center gap-2"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleAssembleCollection}
              className="btn-primary py-2.5 px-6 text-[10px]"
            >
              Assemble Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
