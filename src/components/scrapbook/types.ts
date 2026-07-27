export interface ScrapbookElement {
  id: string;
  type: 'photo' | 'text' | 'sticker' | 'tape' | 'doodle' | 'paper' | 'stamp';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  rotation: number; // degrees
  zIndex: number;
  opacity: number;
  isLocked: boolean;
  content: string; // Text content, Image URL, or Sticker/Tape asset key
  styleData: {
    fontFamily?: string;
    fontSize?: string; // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: string;
    backgroundColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: string;
    boxShadow?: string;
    frameType?: 'polaroid' | 'film_strip' | 'rounded' | 'torn_paper' | 'vintage' | 'circle' | 'heart' | 'tape_mounted' | 'full-bleed' | 'freeform' | 'none';
    crop?: {
      zoom: number;
      x: number; // crop offset x
      y: number; // crop offset y
      rotate: number;
      flipX?: boolean;
      flipY?: boolean;
    };
    stickerCategory?: string;
    tapeType?: 'washi' | 'paper' | 'masking';
    paperType?: 'torn' | 'sticky' | 'strip' | 'ticket' | 'postcard' | 'envelope';
    doodleType?: 'arrow' | 'heart' | 'star' | 'underline' | 'circle' | 'scribble' | 'hand-drawn-border';
    stampType?: 'date' | 'location' | 'travel' | 'memory' | 'custom';
  };
}

export interface ScrapbookPage {
  id: string;
  pageNumber: number;
  backgroundColor: string; // e.g. '#FDFCFB' or 'cream'
  backgroundTexture: string; // 'paper' | 'notebook' | 'kraft' | 'vintage' | 'fabric' | 'gradient' | 'floral' | 'travel' | 'minimal' | 'seasonal' | 'none'
  elements: ScrapbookElement[];
}

export interface ScrapbookProject {
  id: string;
  title: string;
  creatorName: string;
  recipientName?: string;
  type: 'our-story' | 'travel' | 'birthday' | 'baby' | 'family' | 'friendship' | 'journal' | 'custom';
  style: 'handmade-paper' | 'soft-memories' | 'playful-collage' | 'vintage-journal' | 'minimal-scrapbook' | 'digital-sticker-book';
  size: 'A5' | 'A4';
  startingTemplate: 'blank' | 'lightly-guided' | 'creative-layout' | 'story-template';
  createdAt: string;
  updatedAt: string;
  pages: ScrapbookPage[];
  status: 'DRAFT' | 'LIVE';
  privacy: 'public' | 'unlisted' | 'private';
  views: number;
  musicTrack?: string;
}
