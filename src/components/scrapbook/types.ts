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

export type FrameShape = 'polaroid' | 'rounded' | 'square' | 'circle' | 'torn-paper' | 'oval';

export interface PhotoCrop {
  x: number; // offset X percentage (-50 to 50)
  y: number; // offset Y percentage (-50 to 50)
  scale: number; // 1 to 3
  rotation?: number; // degrees
}

export interface PhotoSlot {
  id: string;
  x: number; // px or % relative to canvas width
  y: number;
  width: number;
  height: number;
  shape: FrameShape;
  rotation?: number; // degrees
  label?: string; // e.g. "Photo 1 - Golden Hour"
  required?: boolean;
  frameBorderColor?: string;
  tapeDecoration?: 'top-center' | 'corners' | 'top-left' | 'top-right' | 'none';
  captionPlaceholder?: string;
}

export interface TextElement {
  id: string;
  type: 'heading' | 'subheading' | 'body' | 'date' | 'names' | 'quote';
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
}

export interface DecorationElement {
  id: string;
  type: 'sticker' | 'tape' | 'doodle' | 'flower' | 'stamp' | 'paper-texture' | 'ribbon';
  url?: string;
  svgContent?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
}

export interface ScrapbookCanvasConfig {
  width: number; // e.g. 800
  height: number; // e.g. 1066 (3:4 ratio)
  aspectRatio: '3:4' | '1:1' | '16:9' | '4:5';
  backgroundColor: string;
  backgroundImage?: string;
  backgroundTexture?: 'craft-paper' | 'vintage-parchment' | 'grid' | 'linen' | 'pink-pastel' | 'dark-slate';
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

export interface UserTextAssignment {
  elementId: string;
  text: string;
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
