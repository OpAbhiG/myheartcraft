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
            className="absolute"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.width}%`,
              height: `${el.height}%`,
              transform: `rotate(${el.rotation}deg)`,
              zIndex: el.zIndex,
              opacity: el.opacity,
              pointerEvents: el.styleData?.isFlap ? 'auto' : 'none'
            }}
          >
            {el.type === 'photo' && (
              <div className="w-full h-full p-2 bg-white shadow-md border border-gray-200 flex flex-col justify-between relative">
                <div className="w-full h-[82%] overflow-hidden bg-gray-50 relative">
                  <img
                    src={el.content}
                    alt="Memory"
                    className="w-full h-full object-cover"
                    style={{
                      transform: el.styleData?.crop 
                        ? `scale(${el.styleData.crop.zoom}) rotate(${el.styleData.crop.rotate}deg) translate(${el.styleData.crop.x}px, ${el.styleData.crop.y}px)` 
                        : 'none'
                    }}
                  />
                </div>
                <div className="h-[15%] flex items-center justify-center overflow-hidden">
                  <span className="font-mono text-[7px] text-[#555]">Polaroid Print</span>
                </div>

                {/* Photo Corners overlay */}
                {el.styleData?.photoCorners && el.styleData.photoCorners !== 'none' && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Top Left */}
                    <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-[7px] border-l-[7px] border-transparent" style={{ borderTopColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderLeftColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                    {/* Top Right */}
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-[7px] border-r-[7px] border-transparent" style={{ borderTopColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderRightColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                    {/* Bottom Left */}
                    <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-[7px] border-l-[7px] border-transparent" style={{ borderBottomColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderLeftColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                    {/* Bottom Right */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-[7px] border-r-[7px] border-transparent" style={{ borderBottomColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B', borderRightColor: el.styleData.photoCorners === 'gold' ? '#D97706' : el.styleData.photoCorners === 'black' ? '#1F2937' : '#8B5A2B' }} />
                  </div>
                )}
              </div>
            )}

            {el.type === 'text' && (
              <div className="w-full h-full relative group">
                {el.styleData?.isFlap ? (
                  <div className="w-full h-full relative" style={{ perspective: '800px' }}>
                    {/* Flap Cover */}
                    <div 
                      className="absolute inset-0 bg-[#e6dfd3] border border-[#d2b48c] p-2 flex items-center justify-center text-center font-mono text-[9px] uppercase tracking-wider text-rose-800 font-bold z-10 origin-top transition-transform duration-700 hover:[transform:rotateX(120deg)] select-none shadow-md cursor-pointer"
                    >
                      ✉️ {el.styleData?.flapLabel || 'Lift Flap'}
                    </div>
                    {/* Text Body */}
                    <div 
                      className="w-full h-full p-2 overflow-hidden flex items-center justify-center leading-relaxed text-center whitespace-pre-wrap bg-white"
                      style={{
                        fontFamily: el.styleData?.fontFamily || 'Inter',
                        fontSize: el.styleData?.fontSize === '2xl' ? '1.3rem' : el.styleData?.fontSize === 'lg' ? '1.05rem' : '0.75rem',
                        color: el.styleData?.color || '#1A1A1A'
                      }}
                    >
                      {el.content}
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full p-1 flex items-center justify-center leading-relaxed text-center whitespace-pre-wrap"
                    style={{
                      fontFamily: el.styleData?.fontFamily || 'Inter',
                      fontSize: el.styleData?.fontSize === '2xl' ? '1.3rem' : el.styleData?.fontSize === 'lg' ? '1.05rem' : '0.75rem',
                      color: el.styleData?.color || '#1A1A1A',
                      backgroundColor: el.styleData?.backgroundColor || 'transparent'
                    }}
                  >
                    {el.content}
                  </div>
                )}
              </div>
            )}

            {el.type === 'sticker' && (
              <div className="w-full h-full font-sans text-on-surface" dangerouslySetInnerHTML={{ __html: SCRAPBOOK_STICKERS.find(s => s.id === el.content)?.svg || '' }} />
            )}

            {el.type === 'tape' && (
              <div 
                className={`w-full h-full opacity-90 ${SCRAPBOOK_TAPES.find(t => t.id === el.content)?.textureClass}`}
                style={{ backgroundColor: el.styleData?.color }}
              />
            )}

            {el.type === 'paper' && (
              <div className="w-full h-full pointer-events-none select-none">
                {el.content === 'newspaper_cutout' ? (
                  <div className="w-full h-full p-3 border border-[#D5CEB8] shadow-md flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#F2EFE9', color: '#333', fontFamily: 'Special Elite, serif' }}>
                    <div className="text-[6.5px] uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-0.5 font-bold">DAILY TIMES // ISSUE 104</div>
                    <div className="text-[9px] font-bold leading-tight line-clamp-2">LATEST MEMORIES DECLARED SPECIAL</div>
                    <div className="text-[8px] opacity-80 leading-normal line-clamp-3 mt-1 font-sans">Yesterday at golden hour, sweet memories were preserved forever in this custom digital scrapbook project. Details inside.</div>
                  </div>
                ) : el.content === 'vintage_card' ? (
                  <div className="w-full h-full p-3 border border-[#C4BCA2] shadow flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#E8E2CF', color: '#4E433C', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(0,0,0,0.05) 15px, rgba(0,0,0,0.05) 16px)' }}>
                    <div className="text-[7.5px] font-mono tracking-widest font-bold border-b border-dashed border-[#C4BCA2] pb-0.5">ADMIT ONE SURPRISE</div>
                    <div className="text-[9.5px] font-bold text-center py-1">★ TICKET NO. 928372 ★</div>
                    <div className="text-[7px] font-mono text-right opacity-60">MEMORA REC. DEPT</div>
                  </div>
                ) : el.content.includes('sticky_yellow') ? (
                  <div className="w-full h-full p-3 shadow-md border-l-2 border-yellow-400/50 flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#FFFDE0' }}>
                    <div className="w-full h-2 bg-yellow-300/40 -mt-1.5 mb-1.5" />
                    <div className="text-[8.5px] font-sans text-yellow-950 leading-relaxed italic">Write a quick sticky memory...</div>
                  </div>
                ) : el.content.includes('sticky_pink') ? (
                  <div className="w-full h-full p-3 shadow-md border-l-2 border-pink-400/50 flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#FFE5EE' }}>
                    <div className="w-full h-2 bg-pink-300/40 -mt-1.5 mb-1.5" />
                    <div className="text-[8.5px] font-sans text-pink-950 leading-relaxed italic">Important details...</div>
                  </div>
                ) : el.content.includes('sticky_blue') ? (
                  <div className="w-full h-full p-3 shadow-md border-l-2 border-blue-400/50 flex flex-col justify-between overflow-hidden" style={{ backgroundColor: '#E3F2FD' }}>
                    <div className="w-full h-2 bg-blue-300/40 -mt-1.5 mb-1.5" />
                    <div className="text-[8.5px] font-sans text-blue-950 leading-relaxed italic">Note to self...</div>
                  </div>
                ) : el.content === 'pressed_flower_card' ? (
                  <div className="w-full h-full p-3 border border-[#E6DEC9] shadow flex flex-col justify-between overflow-hidden bg-contain" style={{ backgroundColor: '#FAF4EB', backgroundImage: 'radial-gradient(#E8D0B3 2px, transparent 2px)', backgroundSize: '12px 12px' }}>
                    <div className="text-[7px] font-mono uppercase tracking-widest text-[#888]">Botanical Backing</div>
                    <div className="w-9 h-9 border border-[#E6DEC9]/45 rounded-full mx-auto my-1 flex items-center justify-center bg-white/70">🌸</div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full p-3 font-mono text-[9px] text-gray-800 shadow"
                    style={{
                      backgroundColor: el.styleData?.backgroundColor || '#FAF9F6'
                    }}
                  >
                    Torn Sheet cutout
                  </div>
                )}
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
