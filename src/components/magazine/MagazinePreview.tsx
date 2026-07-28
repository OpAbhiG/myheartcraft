import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Play, Square } from 'lucide-react';
import { MagazineProject, MagazinePage } from './types';
import { MAGAZINE_STYLES, MAGAZINE_PALETTES } from './templates';
import { ambientMusic } from '../../utils/audio';

interface MagazinePreviewProps {
  project: MagazineProject;
  onClose: () => void;
}

const playPageFlipSound = () => {
  try {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-7 * (i / bufferSize));
      data[i] = (Math.random() * 2 - 1) * decay * 0.12;
    }
    
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.6;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noiseNode.start();
  } catch (err) {
    console.error("Audio page flip error:", err);
  }
};

export default function MagazinePreview({
  project,
  onClose
}: MagazinePreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const basePreset = MAGAZINE_STYLES[project.style] || MAGAZINE_STYLES['minimal-editorial'];
  const palettePreset = project.palette && project.palette !== 'none' ? MAGAZINE_PALETTES[project.palette] : null;

  const stylePreset = {
    ...basePreset,
    colorBackground: palettePreset ? palettePreset.colorBackground : basePreset.colorBackground,
    colorTheme: palettePreset ? palettePreset.colorTheme : basePreset.colorTheme,
    textColor: palettePreset ? palettePreset.textColor : basePreset.textColor
  };

  useEffect(() => {
    if (project.musicTrack && project.musicTrack !== 'none' && isPlayingAudio) {
      ambientMusic.start(project.musicTrack);
    } else {
      ambientMusic.stop();
    }
    return () => {
      ambientMusic.stop();
    };
  }, [isPlayingAudio, project.musicTrack]);

  const handleNext = () => {
    const isDesktop = window.innerWidth >= 768;
    const step = isDesktop ? 2 : 1;
    if (currentPageIndex + step < project.pages.length) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev + step);
    }
  };

  const handlePrev = () => {
    const isDesktop = window.innerWidth >= 768;
    const step = isDesktop ? 2 : 1;
    if (currentPageIndex - step >= 0) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev - step);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Helper to render static pages inside Preview spread
  const renderPage = (page: MagazinePage) => {
    if (!page) return null;
    const pagePhotos = page.photoIds.map(id => project.photos.find(ph => ph.id === id)?.url || '');

    return (
      <div 
        className="w-full h-full relative overflow-hidden select-none bg-white p-6 md:p-8 flex flex-col justify-between border border-[#e0e0e0] shadow-lg"
        style={{
          backgroundColor: stylePreset.colorBackground,
          color: stylePreset.textColor,
          aspectRatio: '1/1.414'
        }}
      >
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[7px] text-[#999]">Page {page.pageNumber}</span>
        
        {page.layoutType === 'cover' && (
          <div className="w-full h-full flex flex-col justify-between p-4">
            <div className="text-center space-y-2 mt-4">
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] opacity-75">{stylePreset.tagline}</span>
              <h1 className="text-3xl font-bold uppercase tracking-tight" style={{ fontFamily: stylePreset.fontHeading }}>
                {page.title}
              </h1>
              <p className="text-[9px] uppercase tracking-widest opacity-80">{page.subtitle}</p>
            </div>
            
            <div className="h-56 bg-gray-50 border border-primary/20 overflow-hidden">
              {pagePhotos[0] && <img src={pagePhotos[0]} alt="Cover" className="w-full h-full object-cover" />}
            </div>

            <div className="flex justify-between items-center text-[7px] font-mono border-t border-primary/15 pt-3">
              <span>MEMORA EDITORIAL</span>
              <span>SPECIAL ISSUE</span>
            </div>
          </div>
        )}

        {page.layoutType === 'editorial-split' && (
          <div className="w-full h-full grid grid-cols-2 gap-6">
            <div className="h-full flex flex-col justify-between">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#888] block mb-3">EDITORIAL COLUMN</span>
                <h2 className="text-lg font-bold mb-3" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
                <p className="text-[10px] leading-relaxed opacity-85">{page.bodyText}</p>
              </div>
            </div>
            <div className="h-full overflow-hidden">
              {pagePhotos[0] && <img src={pagePhotos[0]} alt="Editorial" className="w-full h-full object-cover" />}
            </div>
          </div>
        )}

        {page.layoutType === 'photo-grid' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
              <p className="text-[8px] uppercase tracking-wider text-[#999]">{page.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 h-64">
              {[0, 1, 2, 3].map(gridIdx => (
                <div key={gridIdx} className="w-full h-full bg-gray-100 overflow-hidden">
                  {pagePhotos[gridIdx] && <img src={pagePhotos[gridIdx]} alt="Grid" className="w-full h-full object-cover" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {page.layoutType === 'story' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-6 h-64">
              <div className="overflow-hidden">
                {pagePhotos[0] && <img src={pagePhotos[0]} alt="Story" className="w-full h-full object-cover" />}
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-3" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
                  <p className="text-[10px] leading-relaxed opacity-85">{page.bodyText}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {page.layoutType === 'quote' && (
          <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center">
            <span className="text-3xl text-primary opacity-60 mb-2" style={{ fontFamily: stylePreset.fontHeading }}>“</span>
            <blockquote className="text-md font-semibold mb-3 leading-relaxed italic" style={{ fontFamily: stylePreset.fontHeading }}>
              {page.quoteText}
            </blockquote>
            <cite className="font-mono text-[8px] uppercase tracking-widest text-[#777] not-italic">
              {page.quoteAuthor}
            </cite>
          </div>
        )}

        {page.layoutType === 'timeline' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold mb-1" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
              <p className="text-[8px] uppercase tracking-wider text-[#999]">{page.subtitle}</p>
            </div>
            <div className="flex-grow space-y-3 max-w-xs mx-auto">
              {page.bodyText?.split('\n').map((line, idx) => {
                const [time, desc] = line.split(' • ');
                return (
                  <div key={idx} className="flex gap-4 border-l border-primary/20 pl-4 relative pb-1">
                    <div className="w-2 h-2 bg-primary absolute -left-[4px] top-1" />
                    <div>
                      <span className="font-mono text-[9px] font-bold block">{time}</span>
                      <span className="text-[10px] opacity-80">{desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {page.layoutType === 'hero' && (
          <div className="w-full h-full relative overflow-hidden p-0 -m-8">
            {pagePhotos[0] && <img src={pagePhotos[0]} alt="Hero Full" className="w-full h-full object-cover" />}
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm p-4 border border-white/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h3>
              <p className="text-[8px] text-[#ccc] uppercase tracking-wider mt-1">{page.subtitle}</p>
            </div>
          </div>
        )}

        {page.layoutType === 'closing' && (
          <div className="w-full h-full flex flex-col justify-between p-6 text-center">
            <div className="mt-12">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-3" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
              <p className="text-[10px] uppercase tracking-widest text-[#999] font-mono">{page.subtitle}</p>
            </div>
            <p className="text-[10px] leading-relaxed max-w-xs mx-auto opacity-80">{page.bodyText}</p>
            <div className="font-mono text-[7px] text-[#aaa] border-t border-primary/10 pt-4 mt-8">
              DESIGNED IN CREATOR STUDIO // MEMORA MAGAZINE
            </div>
          </div>
        )}
      </div>
    );
  };

  const isDesktop = window.innerWidth >= 768;
  const leftPageIndex = currentPageIndex;
  const rightPageIndex = currentPageIndex + 1;

  const leftPage = project.pages[leftPageIndex];
  const rightPage = isDesktop ? project.pages[rightPageIndex] : null;

  return (
    <div className="fixed inset-0 bg-[#0F0F0F] z-50 flex flex-col text-white font-sans" id="magazine-preview-screen">
      
      {/* Top Header */}
      <header className="h-16 px-6 border-b border-[#222] bg-[#141414] flex justify-between items-center z-10 shrink-0">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#777]">Digital Magazine Reader</span>
          <h3 className="text-xs uppercase font-bold tracking-wider text-white mt-0.5">{project.basicInfo.title}</h3>
        </div>

        <div className="flex items-center gap-4">
          {project.musicTrack && project.musicTrack !== 'none' && (
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`px-3 py-1.5 border text-[10px] uppercase font-mono tracking-widest flex items-center gap-1.5 transition-all ${
                isPlayingAudio ? 'bg-primary border-primary text-background' : 'border-[#444] text-[#ccc] hover:bg-[#222]'
              }`}
            >
              {isPlayingAudio ? 'Stop Music' : 'Play Music'}
            </button>
          )}

          <button onClick={toggleFullscreen} className="p-2 text-[#999] hover:text-white transition-colors">
            <Maximize className="w-5 h-5" />
          </button>

          <button onClick={onClose} className="p-2 text-[#999] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Pages spread */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[#0A0A0A]">
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className={`absolute left-6 md:left-12 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all ${
            currentPageIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-100 hover:scale-105'
          }`}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div className="w-full max-w-5xl flex justify-center items-center relative z-10 animate-scale-in bg-black/45 p-6 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex gap-[1px] relative rounded-xl overflow-hidden shadow-2xl bg-black/20">
            {leftPage && (
              <div className="w-full max-w-[420px] aspect-[1/1.414] relative transition-transform duration-500 origin-right">
                {renderPage(leftPage)}
                {/* Book crease shading */}
                <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/25 via-black/10 to-transparent pointer-events-none z-20" />
              </div>
            )}

            {isDesktop && (
              <div className="w-[1px] h-auto bg-black/45 self-stretch z-30 shadow-inner" />
            )}

            {isDesktop && rightPageIndex < project.pages.length && (
              <div className="w-full max-w-[420px] aspect-[1/1.414] relative transition-transform duration-500 origin-left">
                {renderPage(project.pages[rightPageIndex])}
                {/* Book crease shading */}
                <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none z-20" />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={isDesktop ? (rightPageIndex >= project.pages.length - 1) : (leftPageIndex >= project.pages.length - 1)}
          className={`absolute right-6 md:right-12 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all ${
            (isDesktop ? rightPageIndex >= project.pages.length - 1 : leftPageIndex >= project.pages.length - 1)
              ? 'opacity-20 cursor-not-allowed' : 'opacity-100 hover:scale-105'
          }`}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Footer navigator */}
      <footer className="h-20 bg-[#141414] border-t border-[#222] flex items-center justify-center gap-3 px-6 overflow-x-auto shrink-0">
        {project.pages.map((p, idx) => {
          const isCurrent = idx === currentPageIndex || (isDesktop && idx === currentPageIndex + 1);
          return (
            <button
              key={p.id}
              onClick={() => setCurrentPageIndex(isDesktop ? Math.floor(idx / 2) * 2 : idx)}
              className={`w-10 h-14 border transition-all shrink-0 flex items-center justify-center text-[9px] font-mono ${
                isCurrent ? 'border-primary ring-2 ring-primary scale-105 text-white font-bold' : 'border-[#333] text-[#666] hover:border-[#555]'
              }`}
            >
              <span>{p.pageNumber}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
}
