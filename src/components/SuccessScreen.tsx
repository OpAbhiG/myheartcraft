import React, { useState } from 'react';
import { Copy, Sparkles, Eye, Share2, ArrowRight, Heart, Send, Check } from 'lucide-react';
import { Creation } from '../types';
import { generateShareableUrl } from '../utils/share';

interface SuccessScreenProps {
  creation: Creation;
  onPreview: () => void;
  onGoToDashboard: () => void;
}

export default function SuccessScreen({
  creation,
  onPreview,
  onGoToDashboard
}: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  // Generate portable shareable URL that opens on any device
  const shareableUrl = generateShareableUrl(creation);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const text = `Hey ${creation.recipientName}! I created something incredibly special and custom for you. Open this surprise link to unfold your memories and see it: ${shareableUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-background text-on-background min-h-screen py-16 px-6 md:px-16 flex flex-col justify-center items-center relative overflow-x-hidden font-sans" id="success-screen">
      
      {/* Sparkly Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-radial-gradient from-primary-container/5 via-transparent to-transparent" />

      {/* Main Success Container */}
      <div className="w-full max-w-2xl text-center relative z-10 border border-primary p-8 md:p-14 bg-background shadow-none animate-fade-in" id="success-card">
        
        {/* Animated Celebration Top Logo */}
        <div className="w-14 h-14 border border-primary flex items-center justify-center mx-auto mb-6 text-primary bg-background">
          <Heart className="w-6 h-6 fill-current text-primary" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border border-primary/20 font-label-caps text-[9px] tracking-[0.15em] uppercase mb-4 font-bold">
          <Sparkles className="w-3 h-3 text-primary" />
          Your keepsake is live!
        </span>

        <h1 className="font-display-lg text-3xl md:text-5xl text-on-background mb-4 tracking-tight leading-tight uppercase font-light">
          The magic is ready.
        </h1>
        <p className="font-body-lg text-on-surface-variant text-xs max-w-md mx-auto mb-10 leading-relaxed">
          Copy the unique link below to share your digital creation. {creation.recipientName} can open it on any mobile or desktop screen.
        </p>

        {/* Link Share Box Container */}
        <div className="mb-8 p-2 bg-surface-container rounded-none flex flex-col sm:flex-row items-center justify-between border border-primary/20 gap-4" id="link-container">
          <span className="font-mono text-[11px] text-on-surface-variant truncate w-full sm:w-2/3 text-left pl-3 select-all">
            {shareableUrl}
          </span>
          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className={`w-full sm:w-auto font-label-caps text-[10px] px-6 py-3 rounded-none flex items-center justify-center gap-2 transition-all font-bold uppercase tracking-widest ${
              copied
                ? 'bg-green-700 text-background border border-green-700'
                : 'btn-primary'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied Link!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            id="btn-preview-keepsake"
            onClick={onPreview}
            className="border border-primary/30 text-on-surface font-label-caps text-[9px] tracking-widest font-bold hover:bg-primary/5 py-3 px-8 rounded-none flex items-center justify-center gap-2 transition-colors uppercase"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Surprise
          </button>
          <button
            id="btn-whatsapp-share"
            onClick={handleWhatsAppShare}
            className="border border-green-600/30 text-green-700 hover:bg-green-600/5 py-3 px-8 rounded-none font-label-caps text-[9px] tracking-widest font-bold flex items-center justify-center gap-2 transition-colors uppercase"
          >
            <Share2 className="w-3.5 h-3.5 text-green-600" />
            WhatsApp Share
          </button>
        </div>

        {/* Bento Divider */}
        <div className="h-[1px] bg-primary/20 w-full mb-10" />

        {/* Bento: What Happens Next */}
        <div className="text-left">
          <h3 className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-[0.2em] mb-6">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-next-steps">
            
            {/* Bento Step 1 */}
            <div className="p-5 bg-background border border-primary/10 rounded-none">
              <div className="w-6 h-6 border border-primary/30 text-primary flex items-center justify-center text-[10px] font-bold font-mono mb-3">
                1
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Send the Link</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Send the link in a cute private message, email, or embed it inside a virtual greeting card text.
              </p>
            </div>

            {/* Bento Step 2 */}
            <div className="p-5 bg-background border border-primary/10 rounded-none">
              <div className="w-6 h-6 border border-primary/30 text-primary flex items-center justify-center text-[10px] font-bold font-mono mb-3">
                2
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Recipient Opens It</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                They will experience beautiful transition loadings and solve a custom interaction to open your keepsake.
              </p>
            </div>

            {/* Bento Step 3 */}
            <div className="p-5 bg-background border border-primary/10 rounded-none">
              <div className="w-6 h-6 border border-primary/30 text-primary flex items-center justify-center text-[10px] font-bold font-mono mb-3">
                3
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Receive Replies</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Once they read your emotional letter, they can write a sweet reply back to you, saved on your dashboard!
              </p>
            </div>

          </div>
        </div>

        {/* Return dashboard */}
        <button
          id="btn-return-dashboard"
          onClick={onGoToDashboard}
          className="mt-10 inline-flex items-center gap-1.5 text-[9px] text-primary font-bold font-label-caps uppercase tracking-widest hover:opacity-85 transition-opacity"
        >
          Go To Creator Studio
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
