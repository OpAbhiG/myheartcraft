/**
 * Scrapbook Module Types & Schema Architecture
 */

export type ScrapbookCategory =
  | 'All'
  | 'Love'
  | 'Birthday'
  | 'Travel'
  | 'Family'
  | 'Friendship'
  | 'Baby'
  | 'Wedding'
  | 'Anniversary'
  | 'Couple'
  | 'Memories'
  | 'Minimal'
  | 'Vintage'
  | 'Cute'
  | 'Aesthetic';

export type FrameShape = 'polaroid' | 'rounded' | 'square' | 'circle' | 'torn-paper' | 'paper' | 'oval';

export interface PhotoCrop {
  x: number; // offset X percentage (-50 to 50)
  y: number; // offset Y percentage (-50 to 50)
  scale: number; // 1 to 3
  rotation?: number; // degrees
}

export interface PhotoSlot {
  id: string;
  x: number; // px relative to 1200x1600 canvas width
  y: number;
  width: number;
  height: number;
  shape: FrameShape;
  rotation?: number; // degrees
  label?: string;
  required?: boolean;
  frameBorderColor?: string;
  tapeDecoration?: 'top-center' | 'corners' | 'top-left' | 'top-right' | 'paper-clip' | 'none';
  captionPlaceholder?: string;
}

export interface TextElement {
  id: string;
  type: 'heading' | 'subheading' | 'body' | 'date' | 'names' | 'quote' | 'textarea';
  placeholder: string;
  defaultText: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  fontFamily: 'handwritten' | 'serif' | 'sans' | 'vintage' | 'cursive';
  fontSize: number;
  color?: string;
  rotation?: number;
  editable: boolean;
  align?: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

export interface DecorationElement {
  id: string;
  type: 'sticker' | 'tape' | 'doodle' | 'flower' | 'stamp' | 'paper-texture' | 'ribbon' | 'paper-clip' | 'cupcake' | 'kraft-note' | 'torn-note';
  url?: string;
  svgContent?: string;
  textContent?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
  bgColor?: string;
}

export interface ScrapbookCanvasConfig {
  width: number; // e.g. 1200
  height: number; // e.g. 1600 (3:4 ratio)
  aspectRatio: '3:4' | '1:1' | '16:9' | '4:5';
  backgroundColor: string;
  backgroundImage?: string;
  backgroundTexture?: 'craft-paper' | 'vintage-parchment' | 'grid' | 'linen' | 'pink-pastel' | 'dark-slate' | 'cream-paper';
}

export interface ScrapbookTemplate {
  id: string;
  name: string;
  category: ScrapbookCategory;
  description: string;
  previewUrl: string;
  canvas: ScrapbookCanvasConfig;
  photoSlots: PhotoSlot[];
  textElements: TextElement[];
  decorations: DecorationElement[];
  createdDate?: string;
}

export interface UserPhotoAssignment {
  slotId: string;
  url: string;
  crop: PhotoCrop;
  fileName?: string;
}

export interface ScrapbookProject {
  id: string;
  userId?: string;
  templateId: string;
  templateName: string;
  title: string;
  creatorName?: string;
  recipientName?: string;
  eventDate?: string;
  status: 'DRAFT' | 'LIVE';
  photos: UserPhotoAssignment[];
  texts: Record<string, string>; // elementId -> text string
  createdAt: string;
  updatedAt: string;
  views?: number;
  customDecorations?: DecorationElement[];
}
