import { MagazinePage, MagazinePhoto, MagazineBasicInfo } from './types';
import { generateMagazineText } from '../../utils/aiSimulator';

export interface MagazineStylePreset {
  id: string;
  name: string;
  fontHeading: string;
  fontBody: string;
  colorBackground: string;
  colorTheme: string;
  lineHeight: string;
  letterSpacing: string;
  textColor: string;
  tagline: string;
}

export const MAGAZINE_STYLES: { [key: string]: MagazineStylePreset } = {
  'minimal-editorial': {
    id: 'minimal-editorial',
    name: 'Minimal Editorial',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    colorBackground: '#FAF9F6',
    colorTheme: '#1A1A1A',
    lineHeight: '1.75',
    letterSpacing: '0.05em',
    textColor: '#1A1A1A',
    tagline: 'CURATED ESSENTIALS // VOLUME I'
  },
  'cinematic': {
    id: 'cinematic',
    name: 'Cinematic Narrative',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    colorBackground: '#121212',
    colorTheme: '#E5A93C', // golden accent
    lineHeight: '1.6',
    letterSpacing: '0.02em',
    textColor: '#FAF9F6',
    tagline: 'SCENES FROM A SENTIMENTAL JOURNEY'
  },
  'modern-lifestyle': {
    id: 'modern-lifestyle',
    name: 'Modern Lifestyle',
    fontHeading: 'Inter', // Sans-serif for clean bold
    fontBody: 'Inter',
    colorBackground: '#FFFFFF',
    colorTheme: '#E91E63', // hot pink / bold
    lineHeight: '1.65',
    letterSpacing: '0.1em',
    textColor: '#111111',
    tagline: 'PEOPLE • PLACES • MOMENTS'
  },
  'soft-memories': {
    id: 'soft-memories',
    name: 'Soft Memories',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    colorBackground: '#FFF0F2', // soft blush
    colorTheme: '#D81B60',
    lineHeight: '1.7',
    letterSpacing: '0.04em',
    textColor: '#2D3748',
    tagline: 'FRAGMENTS OF SWEET RECOLLECTIONS'
  },
  'classic-magazine': {
    id: 'classic-magazine',
    name: 'Classic Magazine',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    colorBackground: '#FAF8F5',
    colorTheme: '#2C3E50',
    lineHeight: '1.625',
    letterSpacing: '0.03em',
    textColor: '#1A1A1A',
    tagline: 'THE WEEKLY GREETING & CHRONICLE'
  }
};

export interface MagazinePalette {
  id: string;
  name: string;
  colorBackground: string;
  colorTheme: string;
  textColor: string;
  secondaryColor: string;
}

export const MAGAZINE_PALETTES: { [key: string]: MagazinePalette } = {
  'terracotta': {
    id: 'terracotta',
    name: 'Warm Terracotta 🏺',
    colorBackground: '#FDFBF7',
    colorTheme: '#C05A3E',
    textColor: '#2E1A16',
    secondaryColor: '#EEDAC2'
  },
  'emerald': {
    id: 'emerald',
    name: 'Emerald Luxury 🌿',
    colorBackground: '#F4F7F4',
    colorTheme: '#0F5132',
    textColor: '#1A3324',
    secondaryColor: '#D1E7DD'
  },
  'midnight': {
    id: 'midnight',
    name: 'Midnight Gold 🌙',
    colorBackground: '#121620',
    colorTheme: '#ECC94B',
    textColor: '#F7FAFC',
    secondaryColor: '#1E293B'
  },
  'rose': {
    id: 'rose',
    name: 'Soft Rose 🌸',
    colorBackground: '#FFF0F2',
    colorTheme: '#D81B60',
    textColor: '#4A1525',
    secondaryColor: '#FFD1DC'
  },
  'ink': {
    id: 'ink',
    name: 'Minimal Ink 🖋️',
    colorBackground: '#FFFFFF',
    colorTheme: '#111111',
    textColor: '#111111',
    secondaryColor: '#E2E8F0'
  }
};

// Layout templates definition
export interface MagazineLayoutBlueprint {
  type: MagazinePage['layoutType'];
  title: string;
  subtitle: string;
}

export const MAGAZINE_LAYOUTS: { [key: string]: MagazineLayoutBlueprint } = {
  'cover': { type: 'cover', title: 'Cover Page', subtitle: 'Headline Title & Hero Photo' },
  'editorial-split': { type: 'editorial-split', title: 'Editorial Split', subtitle: 'Large portrait image with editor intro text' },
  'photo-grid': { type: 'photo-grid', title: 'Photo Grid / Grid Wall', subtitle: '2x2 clean square alignment layout' },
  'masonry': { type: 'masonry', title: 'Masonry Collage', subtitle: 'Imperfect balanced dynamic layout' },
  'hero': { type: 'hero', title: 'Full-page Hero image', subtitle: 'Full-bleed high quality memory photo' },
  'story': { type: 'story', title: 'Featured Story spread', subtitle: 'Written descriptions and side-caption' },
  'quote': { type: 'quote', title: 'Quotes Showcase', subtitle: 'Highlighted custom message or famous quote' },
  'timeline': { type: 'timeline', title: 'Chronological Timeline', subtitle: 'Significant date highlights and events list' },
  'celebration': { type: 'celebration', title: 'Celebration Spread', subtitle: 'Full page focus on events and milestones' },
  'closing': { type: 'closing', title: 'Back Cover Credit', subtitle: 'Closing note and thank you' }
};

export function assembleMagazinePages(
  info: MagazineBasicInfo,
  styleId: string,
  photos: MagazinePhoto[],
  category: string
): MagazinePage[] {
  const selectedStyle = MAGAZINE_STYLES[styleId] || MAGAZINE_STYLES['minimal-editorial'];
  const photoIds = photos.map(p => p.id);

  // Define page template layout sequences
  const layoutSequence: MagazinePage['layoutType'][] = [
    'cover',
    'editorial-split',
    'photo-grid',
    'story',
    'timeline',
    'quote',
    'hero',
    'closing'
  ];

  return layoutSequence.map((type, idx) => {
    const textData = generateMagazineText(info, category, styleId, info.tone, type);
    
    // Assign photo references
    let assignedPhotos: string[] = [];
    if (type === 'cover') {
      const coverPhoto = photos.find(p => p.isCover)?.id || photoIds[0] || '';
      assignedPhotos = coverPhoto ? [coverPhoto] : [];
    } else if (type === 'editorial-split') {
      assignedPhotos = photoIds[1] ? [photoIds[1]] : [photoIds[0]];
    } else if (type === 'photo-grid') {
      assignedPhotos = photoIds.slice(2, 6);
    } else if (type === 'story') {
      assignedPhotos = photoIds[6] ? [photoIds[6]] : [photoIds[0]];
    } else if (type === 'quote') {
      assignedPhotos = photoIds[7] ? [photoIds[7]] : [];
    } else if (type === 'hero') {
      const fav = photos.find(p => p.isFavorite)?.id || photoIds[4] || photoIds[0];
      assignedPhotos = [fav];
    }

    return {
      id: `m-page-${idx}-${Date.now()}`,
      pageNumber: idx + 1,
      layoutType: type,
      title: textData.title,
      subtitle: textData.subtitle,
      bodyText: textData.body,
      quoteText: textData.quote,
      quoteAuthor: textData.author,
      photoIds: assignedPhotos,
      backgroundColor: selectedStyle.colorBackground,
      themeColor: selectedStyle.colorTheme
    };
  });
}
