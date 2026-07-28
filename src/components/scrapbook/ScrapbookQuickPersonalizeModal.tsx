import React, { useState } from 'react';
import { X, Sparkles, Upload, ArrowRight, Heart, Calendar, User, Image as ImageIcon } from 'lucide-react';
import { ScrapbookTemplate } from './types';

interface QuickPersonalizeModalProps {
  template: ScrapbookTemplate | null;
  onClose: () => void;
  onStartCreation: (data: {
    title: string;
    names: string;
    date: string;
    memory: string;
    photos: File[];
  }) => void;
}

export default function ScrapbookQuickPersonalizeModal({
  template,
  onClose,
  onStartCreation
}: QuickPersonalizeModalProps) {
  const [names, setNames] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [memory, setMemory] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  if (!template) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArr]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const filesArr = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...filesArr]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartCreation({
      title: template.name,
      names: names.trim() || 'Abhishek & Priya',
      date: date.trim() || '12 JUNE 2026',
      memory: memory.trim() || 'Our favorite day together',
      photos: uploadedFiles
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-primary/20 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] font-bold uppercase font-label-caps tracking-widest text-primary flex items-center justify-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Easy Mode Personalization
          </span>
          <h2 className="font-display text-2xl font-bold text-on-background">Personalize Your Scrapbook</h2>
          <p className="text-xs text-on-surface-variant mt-1">Fill in these quick details to auto-populate <strong>{template.name}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Names Input */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" /> Names / Subject
            </label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="e.g. Abhishek & Priya"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-on-background focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          {/* Date Input */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Date / Occasion
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. 12 June 2026"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-on-background focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          {/* Memory Caption */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-primary" /> Short Memory / Message
            </label>
            <textarea
              rows={2}
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="e.g. A day filled with laughter, sunrises, and golden memories..."
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-on-background focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          {/* Upload Photos Dropzone */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-primary" /> Upload Photos ({uploadedFiles.length} selected)
            </label>
            
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold text-on-background">Drag & drop your photos here</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">or click to browse JPG, PNG, WEBP files</p>
            </div>

            {/* Thumbnail previews */}
            {uploadedFiles.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full btn-primary py-3.5 px-6 rounded-2xl font-label-caps tracking-widest font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl transition-all cursor-pointer mt-4"
          >
            Create My Scrapbook <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
