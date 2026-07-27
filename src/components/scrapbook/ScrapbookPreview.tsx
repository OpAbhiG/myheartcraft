import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Play, Square, Music, Image } from 'lucide-react';
import { ScrapbookProject, ScrapbookPage } from './types';
import { SCRAPBOOK_BACKGROUNDS, SCRAPBOOK_STICKERS, SCRAPBOOK_TAPES } from './assets';
import { ambientMusic } from '../../utils/audio';

interface ScrapbookPreviewProps {
  project: ScrapbookProject;
  onClose: () => void;
  isPublic?: boolean;
}

export default function ScrapbookPreview({
  project,
  onClose,
  isPublic = false
}: ScrapbookPreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Manage Background music
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex]);

  const handleNext = () => {
    // Desktop view advances by 2 pages, mobile by 1 page
    const isDesktop = window.innerWidth >= 768;
    const step = isDesktop ? 2 : 1;
    if (currentPageIndex + step < project.pages.length) {
      setCurrentPageIndex(prev => prev + step);
    }
  };

  const handlePrev = () => {
    const isDesktop = window.innerWidth >= 768;
    const step = isDesktop ? 2 : 1;
    if (currentPageIndex - step >= 0) {
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

  // Helper to render single page content
  const renderPage = (page: ScrapbookPage) => {
    if (!page) return null;

    const bgPreset = SCRAPBOOK_BACKGROUNDS.find(bg => bg.id === page.backgroundTexture);

    return (
      <div 
        className="w-full h-full relative overflow-hidden select-none bg-white border border-primary/20 shadow-md"
        style={{
          ...bgPreset?.style,
          aspectRatio: '1/1.414'
        }}
      >
        {page.elements.map(el => (
          <div
            key={el.id}
            className="absolute pointer-events-none"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.width}%`,
              height: `${el.height}%`,
              transform: `rotate(${el.rotation}deg)`,
              zIndex: el.zIndex,
              opacity: el.opacity
            }}
          >
            {el.type === 'photo' && (
              <div className="w-full h-full p-2 bg-white shadow-md border border-gray-200 flex flex-col justify-between">
                <div className="w-full h-[82%] overflow-hidden bg-gray-50 relative">
                  <img
                    src={el.content}
                    alt="Memory"
                    className="w-full h-full object-cover"
                    style={{
                      transform: el.styleData.crop 
                        ? `scale(${el.styleData.crop.zoom}) rotate(${el.styleData.crop.rotate}deg) translate(${el.styleData.crop.x}px, ${el.styleData.crop.y}px)` 
                        : 'none'
                    }}
                  />
                </div>
                <div className="h-[15%] flex items-center justify-center overflow-hidden">
                  <span className="font-mono text-[7px] text-[#555]">Polaroid Print</span>
                </div>
              </div>
            )}

            {el.type === 'text' && (
              <div 
                className="w-full h-full p-1 flex items-center justify-center leading-relaxed text-center whitespace-pre-wrap"
                style={{
                  fontFamily: el.styleData.fontFamily || 'Inter',
                  fontSize: el.styleData.fontSize === '2xl' ? '1.3rem' : el.styleData.fontSize === 'lg' ? '1.05rem' : '0.75rem',
                  color: el.styleData.color || '#1A1A1A',
                  backgroundColor: el.styleData.backgroundColor || 'transparent'
                }}
              >
                {el.content}
              </div>
            )}

            {el.type === 'sticker' && (
              <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: SCRAPBOOK_STICKERS.find(s => s.id === el.content)?.svg || '' }} />
            )}

            {el.type === 'tape' && (
              <div 
                className={`w-full h-full opacity-90 ${SCRAPBOOK_TAPES.find(t => t.id === el.content)?.textureClass}`}
                style={{ backgroundColor: el.styleData.color }}
              />
            )}

            {el.type === 'paper' && (
              <div 
                className="w-full h-full p-3 font-mono text-[9px] text-gray-800 shadow"
                style={{
                  backgroundColor: el.styleData.backgroundColor || '#FAF9F6'
                }}
              >
                {el.content.includes('ticket') ? '★ TICKET NO. 928372 ★' : 'Note cutout'}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const isDesktop = window.innerWidth >= 768;
  const leftPageIndex = currentPageIndex;
  const rightPageIndex = currentPageIndex + 1;

  const leftPage = project.pages[leftPageIndex];
  const rightPage = isDesktop ? project.pages[rightPageIndex] : null;

  return (
    <div className="fixed inset-0 bg-[#0F0F0F] z-50 flex flex-col text-white select-none font-sans" id="scrapbook-preview-screen">
      
      {/* Top bar controls */}
      <header className="h-16 px-6 border-b border-[#222] bg-[#141414] flex justify-between items-center z-10 shrink-0">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#777]">Preview Screen</span>
          <h3 className="text-xs uppercase font-bold tracking-wider text-white mt-0.5">{project.title}</h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Audio music control */}
          {project.musicTrack && project.musicTrack !== 'none' && (
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`px-3 py-1.5 border text-[10px] uppercase font-mono tracking-widest flex items-center gap-1.5 transition-all ${
                isPlayingAudio ? 'bg-primary border-primary text-background' : 'border-[#444] text-[#ccc] hover:bg-[#222]'
              }`}
            >
              {isPlayingAudio ? (
                <><Square className="w-3.5 h-3.5" /> Stop Audio</>
              ) : (
                <><Play className="w-3.5 h-3.5 fill-current" /> Play Audio</>
              )}
            </button>
          )}

          <button onClick={toggleFullscreen} className="p-2 text-[#999] hover:text-white transition-colors" title="Toggle Fullscreen">
            <Maximize className="w-5 h-5" />
          </button>

          <button onClick={onClose} className="p-2 text-[#999] hover:text-white transition-colors" title="Close Preview">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Flipbook Container */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[#0A0A0A]">
        {/* Navigation arrow left */}
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className={`absolute left-6 md:left-12 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all ${
            currentPageIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-100 hover:scale-105'
          }`}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* The Spread Page Showcase */}
        <div className="w-full max-w-5xl flex gap-1 justify-center items-center relative z-10 animate-scale-in">
          {/* Left Page Spread */}
          {leftPage && (
            <div className="w-full max-w-[420px] aspect-[1/1.414]">
              {renderPage(leftPage)}
            </div>
          )}

          {/* Right Page Spread (desktop only) */}
          {isDesktop && rightPageIndex < project.pages.length && (
            <div className="w-full max-w-[420px] aspect-[1/1.414]">
              {renderPage(project.pages[rightPageIndex])}
            </div>
          )}
        </div>

        {/* Navigation arrow right */}
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

      {/* Bottom thumbnails navigator */}
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
