import React from 'react';
import { X, Sparkles, Image as ImageIcon, Type, ArrowRight, Heart } from 'lucide-react';
import { ScrapbookTemplate } from './types';

interface ScrapbookPreviewModalProps {
  template: ScrapbookTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: ScrapbookTemplate) => void;
}

export default function ScrapbookPreviewModal({
  template,
  onClose,
  onUseTemplate
}: ScrapbookPreviewModalProps) {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-primary/20 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Template Preview Visual */}
        <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
          <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
            <img
              src={template.previewUrl}
              alt={template.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-bold uppercase font-label-caps text-primary shadow-sm">
              {template.category}
            </div>
          </div>
        </div>

        {/* Right: Template Details & CTA */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase font-label-caps tracking-widest text-primary flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Handcrafted Template
              </span>
              <h2 className="font-display text-2xl font-bold text-on-background">{template.name}</h2>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{template.description}</p>
            </div>

            <div className="h-[1px] bg-primary/10 w-full" />

            {/* Template Features Badge Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Photo Slots</div>
                  <div className="text-sm font-bold text-on-background">{template.photoSlots.length} Frames</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Text Elements</div>
                  <div className="text-sm font-bold text-on-background">{template.textElements.length} Text Fields</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Included Layout Features:</div>
              <ul className="text-xs text-on-surface-variant space-y-1 pl-4 list-disc">
                <li>Pre-styled polaroid & rounded photo frames</li>
                <li>Washi tapes, stickers, and torn paper borders</li>
                <li>Handwritten typography & vintage textures</li>
                <li>Proportional smart image auto-fitting</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-3">
            <button
              onClick={() => onUseTemplate(template)}
              className="w-full btn-primary py-3.5 px-6 rounded-2xl font-label-caps tracking-widest font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl transition-all cursor-pointer"
            >
              Use This Template <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
