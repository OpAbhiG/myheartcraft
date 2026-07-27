export interface MagazinePhoto {
  id: string;
  url: string;
  caption: string;
  isCover?: boolean;
  isFavorite?: boolean;
  width?: number;
  height?: number;
  orientation?: 'portrait' | 'landscape' | 'square';
  aspectRatio?: number;
  quality?: 'high' | 'medium' | 'low';
}

export interface MagazinePage {
  id: string;
  pageNumber: number;
  layoutType: 'cover' | 'editorial-split' | 'photo-grid' | 'masonry' | 'hero' | 'story' | 'quote' | 'timeline' | 'celebration' | 'closing' | 'back-cover';
  title?: string;
  subtitle?: string;
  bodyText?: string;
  quoteText?: string;
  quoteAuthor?: string;
  photoIds: string[]; // references to photos in project.photos
  backgroundColor?: string;
  themeColor?: string;
}

export interface MagazineBasicInfo {
  title: string;
  subtitle?: string;
  personName?: string;
  names?: string; // for couples e.g. "Jack & Jill"
  eventDate?: string;
  location?: string;
  age?: string;
  description?: string;
  customMessage?: string;
  relationshipDuration?: string;
  milestones?: string; // Comma separated milestones
  tone: 'emotional' | 'elegant' | 'fun' | 'romantic' | 'cinematic' | 'minimal' | 'heartfelt';
}

export interface MagazineProject {
  id: string;
  creatorName: string;
  recipientName?: string;
  category: 'birthday' | 'anniversary' | 'baby' | 'our-story' | 'travel' | 'wedding' | 'family' | 'personal';
  style: 'minimal-editorial' | 'cinematic' | 'modern-lifestyle' | 'soft-memories' | 'classic-magazine';
  size: 'A5' | 'A4';
  basicInfo: MagazineBasicInfo;
  photos: MagazinePhoto[];
  pages: MagazinePage[];
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'LIVE';
  privacy: 'public' | 'unlisted' | 'private';
  views: number;
  musicTrack?: string;
  palette?: 'terracotta' | 'emerald' | 'midnight' | 'rose' | 'ink' | 'none';
}
