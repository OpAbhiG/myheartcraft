import React, { useState } from 'react';
import { Copy, Sparkles, Eye, Share2, ArrowRight, Heart, Check } from 'lucide-react';
import { Creation } from '../types';
import { generateShareableUrl } from '../utils/share';

interface SuccessScreenProps {
  creation?: Creation;
  type?: 'card' | 'scrapbook' | 'magazine';
  projectName?: string;
  shareUrl?: string;
  onPreview: () => void;
  onGoToDashboard: () => void;
}

export default function SuccessScreen({
  creation,
  type = 'card',
  projectName,
  shareUrl,
  onPreview,
  onGoToDashboard
}: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  // Generate portable shareable URL
  const finalShareUrl = shareUrl || (creation ? generateShareableUrl(creation) : '');
  
  const displayTitle = type === 'scrapbook' 
    ? 'Book of memories is live!' 
    : type === 'magazine' 
      ? 'Editorial issue is printed!' 
      : 'The magic is ready.';

  const displayBadge = type === 'scrapbook'
    ? 'Scrapbook Assembled'
    : type === 'magazine'
      ? 'AI Magazine Published'
      : 'Your keepsake is live!';

  const displayDesc = type === 'scrapbook'
    ? `Copy the unique link below to share your digital scrapbook "${projectName || 'My Scrapbook'}". Your recipient can turn pages and listen to your selected music.`
    : type === 'magazine'
      ? `Copy the unique link below to share your digital magazine column "${projectName || 'Our Memories'}". Your recipient can read your custom written articles.`
      : `Copy the unique link below to share your digital creation. ${creation?.recipientName || 'Your recipient'} can open it on any mobile or desktop screen.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(finalShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    let text = `Hey! I created something special for you. Open this link to see it: ${finalShareUrl}`;
    if (type === 'scrapbook') {
      text = `Hey! I made a beautiful digital scrapbook album of our memories. Check it out here: ${finalShareUrl}`;
    } else if (type === 'magazine') {
      text = `Hey! Check out this custom editorial magazine I made featuring our photos and stories: ${finalShareUrl}`;
    } else if (creation) {
      text = `Hey ${creation.recipientName}! I created something incredibly special and custom for you. Open this surprise link to unfold your memories and see it: ${finalShareUrl}`;
    }
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-background text-on-background min-h-screen py-16 px-6 md:px-16 flex flex-col justify-center items-center relative overflow-x-hidden font-sans" id="success-screen">
      {/* Background Orbs */}
      <div className="glow-orb-backdrop top-10 left-10 opacity-[0.04]" />
      <div className="glow-orb-backdrop glow-orb-2 bottom-10 right-10 opacity-[0.04]" />

      {/* Main Success Container */}
      <div className="w-full max-w-2xl text-center relative z-10 border border-primary/10 p-8 md:p-14 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl animate-scale-in" id="success-card">
        
        {/* Animated Celebration Top Logo */}
        <div className="w-14 h-14 rounded-2xl border border-primary/10 flex items-center justify-center mx-auto mb-6 text-primary bg-background shadow-sm">
          <Heart className="w-6 h-6 fill-current text-primary animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/10 rounded-full font-label-caps text-[9px] tracking-[0.15em] uppercase mb-4 font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          {displayBadge}
        </span>

        <h1 className="font-display-lg text-3xl md:text-5xl text-on-background mb-4 tracking-tight leading-tight uppercase font-bold">
          {displayTitle}
        </h1>
        <p className="font-body-lg text-on-surface-variant text-xs max-w-md mx-auto mb-10 leading-relaxed">
          {displayDesc}
        </p>

        {/* Link Share Box Container */}
        <div className="mb-8 p-2 bg-primary/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between border border-primary/10 gap-4" id="link-container">
          <span className="font-mono text-[11px] text-on-surface-variant truncate w-full sm:w-2/3 text-left pl-3 select-all">
            {finalShareUrl}
          </span>
          <button
            id="btn-copy-link"
            onClick={handleCopyLink}
            className={`w-full sm:w-auto font-label-caps text-[10px] px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold uppercase tracking-widest cursor-pointer shadow-sm ${
              copied
                ? 'bg-green-600 text-white border border-green-700'
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
            className="border border-primary/20 bg-white/70 text-on-surface font-label-caps text-[9px] tracking-widest font-bold hover:bg-primary/5 py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all uppercase cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Surprise
          </button>
          <button
            id="btn-whatsapp-share"
            onClick={handleWhatsAppShare}
            className="border border-green-600/20 text-green-700 hover:bg-green-600/5 py-3 px-8 rounded-xl font-label-caps text-[9px] tracking-widest font-bold flex items-center justify-center gap-2 transition-all uppercase cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-green-600" />
            WhatsApp Share
          </button>
        </div>

        {/* Bento Divider */}
        <div className="h-[1px] bg-primary/10 w-full mb-10" />

        {/* Bento: What Happens Next */}
        <div className="text-left">
          <h3 className="font-label-caps text-[9px] text-primary font-bold uppercase tracking-[0.2em] mb-6">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-next-steps">
            
            {/* Bento Step 1 */}
            <div className="p-5 bg-[#FAF6F7] border border-primary/5 rounded-2xl shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold font-mono mb-3">
                1
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Send the Link</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Send the link in a private message, email, or embed it inside a virtual card text.
              </p>
            </div>

            {/* Bento Step 2 */}
            <div className="p-5 bg-[#FAF6F7] border border-primary/5 rounded-2xl shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold font-mono mb-3">
                2
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Recipient Opens It</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                They will experience beautiful visual spreads, animations, music, and interactive elements.
              </p>
            </div>

            {/* Bento Step 3 */}
            <div className="p-5 bg-[#FAF6F7] border border-primary/5 rounded-2xl shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold font-mono mb-3">
                3
              </div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-on-background mb-1">Receive Feedback</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Once they open and read your creation, they can respond with a warm thank you message straight back to your studio!
              </p>
            </div>

          </div>
        </div>

        {/* Return dashboard */}
        <button
          id="btn-return-dashboard"
          onClick={onGoToDashboard}
          className="mt-10 inline-flex items-center gap-1.5 text-[9px] text-primary font-bold font-label-caps uppercase tracking-widest hover:text-[#8d3c59] transition-all cursor-pointer hover:translate-x-1"
        >
          Go To Creator Studio
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
