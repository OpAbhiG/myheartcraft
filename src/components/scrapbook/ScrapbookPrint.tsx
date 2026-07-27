import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { ScrapbookProject, ScrapbookPage } from './types';
import { SCRAPBOOK_BACKGROUNDS } from './assets';

interface ScrapbookPrintProps {
  project: ScrapbookProject;
  onClose: () => void;
  onUpdateProject: (updated: ScrapbookProject) => void;
}

export default function ScrapbookPrint({
  project,
  onClose,
  onUpdateProject
}: ScrapbookPrintProps) {
  const [printMode, setPrintMode] = useState<'standard' | 'booklet'>('standard');

  const pageCount = project.pages.length;
  const isPageCountValid = pageCount % 4 === 0 && pageCount >= 8 && pageCount <= 32;

  // Suggesting page additions
  const getNextMultipleOf4 = (n: number) => {
    return Math.ceil(n / 4) * 4;
  };

  const handleFixPageCount = (type: 'blank' | 'photo' | 'closing') => {
    const targetCount = getNextMultipleOf4(pageCount);
    const needed = targetCount - pageCount;
    
    let addedPages: ScrapbookPage[] = [];
    for (let i = 0; i < needed; i++) {
      const pageNum = pageCount + i + 1;
      addedPages.push({
        id: `page-imposed-add-${pageNum}-${Date.now()}`,
        pageNumber: pageNum,
        backgroundColor: '#FAF9F6',
        backgroundTexture: type === 'blank' ? 'none' : 'paper',
        elements: type === 'closing' && i === needed - 1 ? [
          {
            id: `el-imposed-closing-${Date.now()}`,
            type: 'text',
            x: 25,
            y: 45,
            width: 50,
            height: 10,
            rotation: 0,
            zIndex: 1,
            opacity: 1,
            isLocked: false,
            content: 'MADE WITH LOVE',
            styleData: { fontFamily: 'Special Elite', fontSize: 'xl', textAlign: 'center' }
          }
        ] : []
      });
    }

    const updatedProject = {
      ...project,
      pages: [...project.pages, ...addedPages],
      updatedAt: new Date().toISOString()
    };

    onUpdateProject(updatedProject);
  };

  // Booklet imposition logic
  // Returns paired pages: { sheetNumber, side: 'front'|'back', leftPage: Page, rightPage: Page }
  const calculateBookletSheets = (): { sheetNum: number; side: 'front' | 'back'; left: ScrapbookPage; right: ScrapbookPage }[] => {
    const N = project.pages.length;
    const numSheets = N / 4;
    const sheets: { sheetNum: number; side: 'front' | 'back'; left: ScrapbookPage; right: ScrapbookPage }[] = [];

    for (let i = 1; i <= numSheets; i++) {
      // Front side: Left is Page N - 2*(i-1), Right is Page 2*(i-1) + 1
      const frontLeftIdx = N - 2 * (i - 1) - 1;
      const frontRightIdx = 2 * (i - 1);
      
      // Back side: Left is Page 2*(i-1) + 1, Right is Page N - 2*(i-1) - 2
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

  const renderPrintPage = (page: ScrapbookPage) => {
    if (!page) return <div className="w-full h-full bg-gray-100 flex items-center justify-center font-mono text-[9px] text-[#888]">BLANK SHEET</div>;

    const bgPreset = SCRAPBOOK_BACKGROUNDS.find(bg => bg.id === page.backgroundTexture);

    return (
      <div 
        className="w-full h-full relative overflow-hidden select-none bg-white border border-gray-300"
        style={{
          ...bgPreset?.style,
          aspectRatio: '1/1.414'
        }}
      >
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] text-gray-400 z-50">Page {page.pageNumber}</span>
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
              <div className="w-full h-full p-2 bg-white shadow border border-gray-150 flex flex-col justify-between">
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
                <div className="h-[15%] flex items-center justify-center">
                  <span className="font-mono text-[6px] text-gray-500">Polaroid Print</span>
                </div>
              </div>
            )}

            {el.type === 'text' && (
              <div 
                className="w-full h-full p-1 flex items-center justify-center leading-relaxed text-center whitespace-pre-wrap"
                style={{
                  fontFamily: el.styleData.fontFamily || 'Inter',
                  fontSize: el.styleData.fontSize === '2xl' ? '1.25rem' : el.styleData.fontSize === 'lg' ? '1rem' : '0.7rem',
                  color: el.styleData.color || '#1A1A1A',
                  backgroundColor: el.styleData.backgroundColor || 'transparent'
                }}
              >
                {el.content}
              </div>
            )}

            {el.type === 'sticker' && (
              <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: el.content }} />
            )}

            {el.type === 'tape' && (
              <div 
                className="w-full h-full opacity-80"
                style={{ backgroundColor: el.styleData.color || '#F8BBD0' }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const sheets = isPageCountValid ? calculateBookletSheets() : [];

  return (
    <div className="fixed inset-0 bg-[#0F0F0F] z-50 flex flex-col text-white font-sans overflow-y-auto" id="scrapbook-print-panel">
      {/* Header */}
      <header className="h-16 px-6 border-b border-[#222] bg-[#141414] flex justify-between items-center shrink-0">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#777]">Export & Print Console</span>
          <h3 className="text-xs uppercase font-bold tracking-wider text-white mt-0.5">{project.title}</h3>
        </div>
        <button onClick={onClose} className="p-2 text-[#999] hover:text-white transition-colors" title="Close Print Console">
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4">
        {/* Left Control Sidebar */}
        <aside className="lg:col-span-1 border-r border-[#222] bg-[#141414] p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Print Configuration</h4>
            
            {/* Page Count validation banner */}
            {isPageCountValid ? (
              <div className="bg-green-950/40 border border-green-500/50 p-4 text-xs space-y-2 mb-6">
                <div className="flex items-center gap-2 text-green-400 font-bold">
                  <CheckCircle className="w-4 h-4" /> Ready to print
                </div>
                <p className="text-[10.5px] text-green-300/80 leading-relaxed">
                  Your scrapbook has {pageCount} pages, which is a perfect booklet division. You can impose it onto A4 sheets.
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

          {/* Mode Selector */}
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

        {/* Right Preview area */}
        <main className="lg:col-span-3 p-8 md:p-12 overflow-y-auto space-y-12 bg-[#0F0F0F]" id="print-sheet-showcase">
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
                  
                  {/* Booklet spread (2 portrait A5 side-by-side on 1 landscape A4) */}
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

      {/* CSS Injected specifically for print layout rendering */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-sheet-showcase, #print-sheet-showcase * {
            visibility: visible;
          }
          #print-sheet-showcase {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            background: white !important;
            color: black !important;
          }
          #scrapbook-print-panel header, aside, footer {
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
