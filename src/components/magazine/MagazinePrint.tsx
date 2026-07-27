import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { MagazineProject, MagazinePage } from './types';
import { MAGAZINE_STYLES } from './templates';

interface MagazinePrintProps {
  project: MagazineProject;
  onClose: () => void;
  onUpdateProject: (updated: MagazineProject) => void;
}

export default function MagazinePrint({
  project,
  onClose,
  onUpdateProject
}: MagazinePrintProps) {
  const [printMode, setPrintMode] = useState<'standard' | 'booklet'>('standard');

  const pageCount = project.pages.length;
  const isPageCountValid = pageCount % 4 === 0 && pageCount >= 8 && pageCount <= 32;

  const stylePreset = MAGAZINE_STYLES[project.style] || MAGAZINE_STYLES['minimal-editorial'];

  const getNextMultipleOf4 = (n: number) => {
    return Math.ceil(n / 4) * 4;
  };

  const handleFixPageCount = (type: 'blank' | 'photo' | 'closing') => {
    const targetCount = getNextMultipleOf4(pageCount);
    const needed = targetCount - pageCount;
    
    let addedPages: MagazinePage[] = [];
    for (let i = 0; i < needed; i++) {
      const pageNum = pageCount + i + 1;
      addedPages.push({
        id: `m-page-imposed-add-${pageNum}-${Date.now()}`,
        pageNumber: pageNum,
        layoutType: type === 'closing' && i === needed - 1 ? 'closing' : 'story',
        title: type === 'closing' && i === needed - 1 ? 'The End' : 'Empty Page',
        subtitle: 'Editorial Memory Note',
        bodyText: type === 'closing' && i === needed - 1 ? 'Thank you for reading.' : 'Additional photo or text space.',
        photoIds: [],
        backgroundColor: stylePreset.colorBackground,
        themeColor: stylePreset.colorTheme
      });
    }

    const updatedProject = {
      ...project,
      pages: [...project.pages, ...addedPages],
      updatedAt: new Date().toISOString()
    };

    onUpdateProject(updatedProject);
  };

  const calculateBookletSheets = (): { sheetNum: number; side: 'front' | 'back'; left: MagazinePage; right: MagazinePage }[] => {
    const N = project.pages.length;
    const numSheets = N / 4;
    const sheets: { sheetNum: number; side: 'front' | 'back'; left: MagazinePage; right: MagazinePage }[] = [];

    for (let i = 1; i <= numSheets; i++) {
      const frontLeftIdx = N - 2 * (i - 1) - 1;
      const frontRightIdx = 2 * (i - 1);
      
      const backLeftIdx = 2 * (i - 1) + 1;
      const backRightIdx = N - 2 * (i - 1) - 2;

      sheets.push({
        sheetNum: i,
        side: 'front',
        left: project.pages[frontLeftIdx],
        right: project.pages[frontRightIdx]
      });

      sheets.push({
        sheetNum: i,
        side: 'back',
        left: project.pages[backLeftIdx],
        right: project.pages[backRightIdx]
      });
    }

    return sheets;
  };

  const handlePrint = () => {
    window.print();
  };

  const renderPrintPage = (page: MagazinePage) => {
    if (!page) return <div className="w-full h-full bg-gray-100 flex items-center justify-center font-mono text-[9px] text-[#888]">BLANK SHEET</div>;
    const pagePhotos = page.photoIds.map(id => project.photos.find(ph => ph.id === id)?.url || '');

    return (
      <div 
        className="w-full h-full relative overflow-hidden select-none bg-white p-6 flex flex-col justify-between border border-[#e0e0e0]"
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
              <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ fontFamily: stylePreset.fontHeading }}>
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
          <div className="w-full h-full grid grid-cols-2 gap-4">
            <div className="h-full flex flex-col justify-between">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#888] block mb-3">EDITORIAL COLUMN</span>
                <h2 className="text-lg font-bold mb-3" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
                <p className="text-[9.5px] leading-relaxed opacity-85">{page.bodyText}</p>
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
            <div className="grid grid-cols-2 gap-2 h-64">
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
            <div className="grid grid-cols-2 gap-4 h-64">
              <div className="overflow-hidden">
                {pagePhotos[0] && <img src={pagePhotos[0]} alt="Story" className="w-full h-full object-cover" />}
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-3" style={{ fontFamily: stylePreset.fontHeading }}>{page.title}</h2>
                  <p className="text-[9.5px] leading-relaxed opacity-85">{page.bodyText}</p>
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
                      <span className="text-[9.5px] opacity-80">{desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {page.layoutType === 'hero' && (
          <div className="w-full h-full relative overflow-hidden p-0 -m-6">
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
              <p className="text-[9px] uppercase tracking-widest text-[#999] font-mono">{page.subtitle}</p>
            </div>
            <p className="text-[9.5px] leading-relaxed max-w-xs mx-auto opacity-80">{page.bodyText}</p>
            <div className="font-mono text-[7px] text-[#aaa] border-t border-primary/10 pt-4 mt-8">
              DESIGNED IN CREATOR STUDIO // MEMORA MAGAZINE
            </div>
          </div>
        )}
      </div>
    );
  };

  const sheets = isPageCountValid ? calculateBookletSheets() : [];

  return (
    <div className="fixed inset-0 bg-[#0F0F0F] z-50 flex flex-col text-white font-sans overflow-y-auto" id="magazine-print-panel">
      {/* Header */}
      <header className="h-16 px-6 border-b border-[#222] bg-[#141414] flex justify-between items-center shrink-0">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#777]">Magazine Export & Print Console</span>
          <h3 className="text-xs uppercase font-bold tracking-wider text-white mt-0.5">{project.basicInfo.title}</h3>
        </div>
        <button onClick={onClose} className="p-2 text-[#999] hover:text-white transition-colors" title="Close Print Console">
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1 border-r border-[#222] bg-[#141414] p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Print Configuration</h4>
            
            {isPageCountValid ? (
              <div className="bg-green-950/40 border border-green-500/50 p-4 text-xs space-y-2 mb-6">
                <div className="flex items-center gap-2 text-green-400 font-bold">
                  <CheckCircle className="w-4 h-4" /> Ready to print
                </div>
                <p className="text-[10.5px] text-green-300/80 leading-relaxed">
                  Your magazine has {pageCount} pages, which is a perfect booklet division. You can impose it onto A4 sheets.
                </p>
              </div>
            ) : (
              <div className="bg-amber-950/40 border border-amber-500/50 p-4 text-xs space-y-3 mb-6">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4" /> Booklet Imposition Alert
                </div>
                <p className="text-[10.5px] text-amber-300/80 leading-relaxed">
                  A foldable booklet requires a page count that is a multiple of 4 (e.g. 8, 12, 16, 20, 24, 32). Currently you have <strong>{pageCount}</strong> pages.
                </p>
                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-mono">Suggested Fix (Add {getNextMultipleOf4(pageCount) - pageCount} pages)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleFixPageCount('blank')}
                      className="py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-[9px] font-bold uppercase tracking-widest"
                    >
                      + Blank Pages
                    </button>
                    <button
                      onClick={() => handleFixPageCount('closing')}
                      className="py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-[9px] font-bold uppercase tracking-widest"
                    >
                      + Closing Cards
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-[10px] text-[#777] block font-mono uppercase tracking-wider">Sheet Imposition Mode</span>
            <button
              onClick={() => setPrintMode('standard')}
              className={`w-full py-3 px-4 border text-xs font-semibold uppercase tracking-wider text-left flex items-center justify-between transition-all ${
                printMode === 'standard' ? 'bg-primary border-primary text-background' : 'border-[#333] hover:bg-[#222]'
              }`}
            >
              <span>Standard Order (1 → 2 → 3)</span>
              <FileText className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setPrintMode('booklet')}
              disabled={!isPageCountValid}
              className={`w-full py-3 px-4 border text-xs font-semibold uppercase tracking-wider text-left flex items-center justify-between transition-all ${
                !isPageCountValid ? 'opacity-30 cursor-not-allowed border-[#222]' :
                printMode === 'booklet' ? 'bg-primary border-primary text-background' : 'border-[#333] hover:bg-[#222]'
              }`}
            >
              <span>A5 Booklet Layout (Foldable)</span>
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-8">
            <button
              onClick={handlePrint}
              className="w-full py-3.5 bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / Save to PDF
            </button>
            <p className="text-[9.5px] text-[#666] leading-relaxed mt-2 text-center">
              Opens your browser print panel. Set orientation to <strong>Landscape</strong> and margins to <strong>None</strong> for best booklets.
            </p>
          </div>
        </aside>

        {/* Right Preview */}
        <main className="lg:col-span-3 p-8 md:p-12 overflow-y-auto space-y-12 bg-[#0F0F0F]" id="magazine-print-sheet-showcase">
          <div className="border-b border-[#222] pb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {printMode === 'standard' ? 'Standard Layout Sheets (A4 / A5 Portrait)' : 'A5 Foldable Booklet Sheets (Landscape A4 Sheets)'}
            </h3>
            <p className="text-[10px] text-[#666] font-mono mt-1">Imposed sheets ready for print spooling</p>
          </div>

          {printMode === 'standard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {project.pages.map(page => (
                <div key={page.id} className="space-y-2">
                  <span className="font-mono text-[9px] text-[#666] uppercase block">Page {page.pageNumber}</span>
                  <div className="w-full aspect-[1/1.414] bg-white border border-[#333] shadow-md">
                    {renderPrintPage(page)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {sheets.map((sheet, idx) => (
                <div key={idx} className="space-y-3 max-w-4xl mx-auto">
                  <span className="font-mono text-[9px] text-[#777] uppercase block">
                    Sheet {sheet.sheetNum} — {sheet.side === 'front' ? 'Front Side (Outside)' : 'Back Side (Inside)'}
                  </span>
                  
                  <div className="w-full aspect-[1.414/1] bg-white border border-gray-400 p-1 flex gap-1 shadow-lg">
                    <div className="w-1/2 h-full relative">
                      {renderPrintPage(sheet.left)}
                    </div>
                    <div className="w-1/2 h-full relative border-l border-dashed border-gray-300">
                      {renderPrintPage(sheet.right)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #magazine-print-sheet-showcase, #magazine-print-sheet-showcase * {
            visibility: visible;
          }
          #magazine-print-sheet-showcase {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            background: white !important;
            color: black !important;
          }
          #magazine-print-panel header, aside, footer {
            display: none !important;
          }
          .border {
            border: none !important;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
