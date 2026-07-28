export interface StickerAsset {
  id: string;
  name: string;
  category: string;
  svg: string; // inline SVG for clean scalable styling
}

export interface TapeAsset {
  id: string;
  name: string;
  textureClass: string; // CSS style or background definition
  defaultColor: string;
}

export interface PaperAsset {
  id: string;
  name: string;
  type: string;
  bgStyle: string;
}

export interface DoodleAsset {
  id: string;
  name: string;
  svg: string;
}

export interface StampAsset {
  id: string;
  name: string;
  text: string;
}

export const SCRAPBOOK_FONTS = [
  { value: 'Caveat', label: 'Playful Hand (Caveat)', importName: 'Caveat' },
  { value: 'Reenie Beanie', label: 'Quick Note (Reenie Beanie)', importName: 'Reenie+Beanie' },
  { value: 'Special Elite', label: 'Vintage Typewriter (Special Elite)', importName: 'Special+Elite' },
  { value: 'Playfair Display', label: 'Elegant Serif (Playfair)', importName: 'Playfair+Display' },
  { value: 'Inter', label: 'Modern Sans (Inter)', importName: 'Inter' }
];

export const SCRAPBOOK_BACKGROUNDS = [
  { id: 'paper', label: 'Handmade Paper', type: 'texture', style: { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 2px, transparent 2px, transparent 10px), linear-gradient(to bottom, #FAF9F6, #F4F3EF)' } },
  { id: 'notebook', label: 'Notebook Grid', type: 'texture', style: { backgroundColor: '#FDFDFD', backgroundImage: 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)', backgroundSize: '20px 20px' } },
  { id: 'kraft', label: 'Kraft Brown Paper', type: 'texture', style: { backgroundColor: '#C8A27C', backgroundImage: 'radial-gradient(rgba(0,0,0,0.08) 1px, transparent 0)', backgroundSize: '8px 8px' } },
  { id: 'vintage', label: 'Vintage Aged Letter', type: 'texture', style: { backgroundColor: '#EADBB6', backgroundImage: 'radial-gradient(#d3c299 15%, transparent 16%)', backgroundSize: '16px 16px' } },
  { id: 'fabric', label: 'Soft Linen Fabric', type: 'texture', style: { backgroundColor: '#F0EAD6', backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.03) 50%, transparent 50%), linear-gradient(rgba(0,0,0,0.03) 50%, transparent 50%)', backgroundSize: '4px 4px' } },
  { id: 'gradient', label: 'Sunset Pastel Gradient', type: 'gradient', style: { background: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)' } },
  { id: 'floral', label: 'Floral Mint Pattern', type: 'texture', style: { backgroundColor: '#E2F0D9', backgroundImage: 'radial-gradient(#c5dfb5 20%, transparent 20%), radial-gradient(#c5dfb5 20%, transparent 20%)', backgroundSize: '30px 30px', backgroundPosition: '0 0, 15px 15px' } },
  { id: 'travel', label: 'Adventure Map Outline', type: 'texture', style: { backgroundColor: '#EFECE1', backgroundImage: 'repeating-radial-gradient(circle, rgba(0,0,0,0.01), rgba(0,0,0,0.01) 10px, rgba(0,0,0,0.02) 20px)' } },
  { id: 'minimal-cream', label: 'Minimal Soft Cream', type: 'color', style: { backgroundColor: '#FAF9F6' } },
  { id: 'minimal-blush', label: 'Minimal Soft Blush', type: 'color', style: { backgroundColor: '#FFF0F2' } }
];

export const SCRAPBOOK_STICKERS: StickerAsset[] = [
  // Love / Hearts
  {
    id: 'heart_sketch',
    name: 'Drawn Heart',
    category: 'love',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M50,85 C20,60 10,40 10,25 C10,12 22,5 35,5 C43,5 48,10 50,15 C52,10 57,5 65,5 C78,5 90,12 90,25 C90,40 80,60 50,85 Z" fill="#FF8B94" stroke="#FF5E6C" /></svg>`
  },
  {
    id: 'love_banner',
    name: 'Love Ribbon',
    category: 'love',
    svg: `<svg viewBox="0 0 100 60" fill="none"><path d="M5,10 L95,10 L85,30 L95,50 L5,50 L15,30 Z" fill="#FFAAA6" stroke="#FF8B94" stroke-width="4" /><text x="50" y="36" fill="white" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">LOVE</text></svg>`
  },
  // Stars / sparkles
  {
    id: 'star_doodle',
    name: 'Doodle Star',
    category: 'stars',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#FFEAA7" stroke="#F1C40F" /></svg>`
  },
  {
    id: 'sparkles_flat',
    name: 'Magic Sparkles',
    category: 'stars',
    svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50,10 L55,40 L85,45 L55,50 L50,80 L45,50 L15,45 L45,40 Z" fill="#FFEAA7" /><path d="M20,10 L22,25 L37,27 L22,30 L20,45 L18,30 L3,27 L18,25 Z" fill="#FFD2FC" /></svg>`
  },
  // Flowers / botanical
  {
    id: 'flower_daisy',
    name: 'Daisy Flower',
    category: 'flowers',
    svg: `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="15" fill="#FFD2FC" /><circle cx="50" cy="20" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="50" cy="80" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="20" cy="50" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="80" cy="50" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="28" cy="28" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="72" cy="72" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="28" cy="72" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="72" cy="28" r="15" fill="white" stroke="#E0DBEC" stroke-width="2" /><circle cx="50" cy="50" r="10" fill="#FFEAA7" /></svg>`
  },
  // Travel
  {
    id: 'travel_luggage',
    name: 'Suitcase',
    category: 'travel',
    svg: `<svg viewBox="0 0 100 80" fill="none"><rect x="15" y="20" width="70" height="50" rx="8" fill="#D5A6BD" stroke="#8E44AD" stroke-width="4" /><rect x="35" y="5" width="30" height="15" rx="3" fill="none" stroke="#8E44AD" stroke-width="4" /><rect x="25" y="20" width="10" height="50" fill="#8E44AD" opacity="0.3" /><rect x="65" y="20" width="10" height="50" fill="#8E44AD" opacity="0.3" /></svg>`
  },
  {
    id: 'travel_plane',
    name: 'Paper Airplane',
    category: 'travel',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><polygon points="10,80 90,20 60,90 45,55" fill="#E8F8F5" stroke="#16A085" /><polygon points="45,55 90,20 10,80" fill="none" stroke="#16A085" /></svg>`
  },
  // Birthday
  {
    id: 'bday_balloon',
    name: 'Confetti Balloon',
    category: 'birthday',
    svg: `<svg viewBox="0 0 80 120" fill="none"><ellipse cx="40" cy="45" rx="30" ry="38" fill="#FFC3A0" stroke="#FF5E62" stroke-width="3" /><path d="M40,83 L36,92 L44,92 Z" fill="#FF5E62" /><path d="M40,92 Q42,105 35,115" stroke="#FF5E62" stroke-width="2" stroke-linecap="round" fill="none" /></svg>`
  },
  {
    id: 'bday_cupcake',
    name: 'Sweet Cupcake',
    category: 'birthday',
    svg: `<svg viewBox="0 0 80 90" fill="none"><path d="M15,45 Q40,30 65,45 L55,80 L25,80 Z" fill="#C7F464" /><path d="M10,42 Q40,15 70,42" stroke="#FF6B6B" stroke-width="8" fill="none" stroke-linecap="round" /><circle cx="40" cy="22" r="8" fill="#FF6B6B" /></svg>`
  },
  // Baby
  {
    id: 'baby_duck',
    name: 'Rubber Duck',
    category: 'baby',
    svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M30,50 C15,50 10,70 25,85 C45,95 75,90 85,75 C95,60 80,45 60,50" fill="#FFE853" /><circle cx="50" cy="25" r="18" fill="#FFE853" /><circle cx="58" cy="22" r="2.5" fill="black" /><path d="M68,25 Q80,25 74,32 Q68,36 65,30" fill="#FF9F43" /></svg>`
  },
  {
    id: 'pressed_flower',
    name: 'Pressed Flower 🌸',
    category: 'vintage',
    svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50,15 C52,35 68,30 68,45 C68,55 55,60 50,85 C45,60 32,55 32,45 C32,30 48,35 50,15 Z" fill="#E8C3C9" opacity="0.75" stroke="#D19DA4" stroke-width="2" /><path d="M15,50 C35,52 30,68 45,68 C55,68 60,55 85,50 C60,45 55,32 45,32 C30,32 35,48 15,50 Z" fill="#E8C3C9" opacity="0.75" stroke="#D19DA4" stroke-width="2" /><circle cx="50" cy="50" r="8" fill="#F4D03F" /></svg>`
  },
  {
    id: 'paper_clip',
    name: 'Paper Clip 📎',
    category: 'vintage',
    svg: `<svg viewBox="0 0 40 100" fill="none" stroke="#7F8C8D" stroke-width="3" stroke-linecap="round"><path d="M10,80 L10,30 C10,18 30,18 30,30 L30,70 C30,78 18,78 18,70 L18,35 C18,30 25,30 25,35 L25,60" fill="none" /></svg>`
  },
  {
    id: 'film_strip',
    name: 'Retro Film Strip 🎞️',
    category: 'vintage',
    svg: `<svg viewBox="0 0 120 40" fill="#222" stroke="#444" stroke-width="2"><rect x="5" y="5" width="110" height="30" rx="3" /><rect x="15" y="10" width="22" height="20" fill="#eee" /><rect x="47" y="10" width="22" height="20" fill="#eee" /><rect x="79" y="10" width="22" height="20" fill="#eee" /><rect x="8" y="7" width="4" height="4" fill="white" /><rect x="20" y="7" width="4" height="4" fill="white" /><rect x="32" y="7" width="4" height="4" fill="white" /><rect x="44" y="7" width="4" height="4" fill="white" /><rect x="56" y="7" width="4" height="4" fill="white" /><rect x="68" y="7" width="4" height="4" fill="white" /><rect x="80" y="7" width="4" height="4" fill="white" /><rect x="92" y="7" width="4" height="4" fill="white" /><rect x="104" y="7" width="4" height="4" fill="white" /><rect x="8" y="29" width="4" height="4" fill="white" /><rect x="20" y="29" width="4" height="4" fill="white" /><rect x="32" y="29" width="4" height="4" fill="white" /><rect x="44" y="29" width="4" height="4" fill="white" /><rect x="56" y="29" width="4" height="4" fill="white" /><rect x="68" y="29" width="4" height="4" fill="white" /><rect x="80" y="29" width="4" height="4" fill="white" /><rect x="92" y="29" width="4" height="4" fill="white" /><rect x="104" y="29" width="4" height="4" fill="white" /></svg>`
  },
  {
    id: 'coffee_stain',
    name: 'Coffee Stain ☕',
    category: 'vintage',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#8B5A2B" stroke-width="3" opacity="0.45" stroke-linecap="round"><path d="M30,30 A35,35 0 1,0 75,40" /><path d="M40,35 A30,30 0 1,0 65,70" stroke-width="1.5" /><path d="M70,25 C75,25 78,28 78,35 C78,42 70,50 65,48" stroke-width="2" /></svg>`
  },
  {
    id: 'postal_mark',
    name: 'Vintage Postmark 📮',
    category: 'vintage',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="#2C3E50" stroke-width="2.5" opacity="0.65" stroke-linecap="round"><circle cx="50" cy="50" r="38" stroke-dasharray="8 4" /><circle cx="50" cy="50" r="30" /><text x="50" y="44" fill="#2C3E50" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">OFFICIAL MAIL</text><text x="50" y="55" fill="#2C3E50" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">LONDON 1926</text><path d="M20,50 L80,50 M30,62 L70,62" stroke-width="1.5" /></svg>`
  }
];

export const SCRAPBOOK_TAPES: TapeAsset[] = [
  { id: 'washi_pink', name: 'Pink Washi Tape', textureClass: 'bg-pink-300/80 border-t border-b border-pink-400/40 border-dashed', defaultColor: '#F8BBD0' },
  { id: 'washi_green', name: 'Mint Washi Tape', textureClass: 'bg-teal-200/80 border-t border-b border-teal-300/40 border-dashed', defaultColor: '#B2DFDB' },
  { id: 'washi_yellow', name: 'Yellow Polka Tape', textureClass: 'bg-yellow-200/80 border-t border-b border-yellow-300/40 border-dashed', defaultColor: '#FFF9C4' },
  { id: 'washi_stripe', name: 'Diagonal Stripe Tape', textureClass: 'bg-amber-100 border-t border-b border-dashed border-amber-300/50', defaultColor: '#FFE0B2' },
  { id: 'masking_tape', name: 'Classic Masking Tape', textureClass: 'bg-[#F5F2EB]/70 shadow-sm border border-[#E8E2D5]', defaultColor: '#FAF8F5' },
  { id: 'washi_sage', name: 'Sage Green Tape', textureClass: 'bg-emerald-800/60 border-t border-b border-emerald-900/30 border-dashed', defaultColor: '#8FBC8F' },
  { id: 'washi_brown', name: 'Warm Brown Polka', textureClass: 'bg-amber-900/45 border-t border-b border-amber-950/20 border-dashed', defaultColor: '#A0522D' },
  { id: 'washi_butter', name: 'Butter Yellow Tape', textureClass: 'bg-yellow-100/90 border-t border-b border-yellow-200/50 border-dashed', defaultColor: '#FFF8DC' },
  { id: 'washi_vintage_blue', name: 'Vintage Blue Tape', textureClass: 'bg-blue-300/70 border-t border-b border-blue-400/30 border-dashed', defaultColor: '#4682B4' }
];

export const SCRAPBOOK_PAPERS: PaperAsset[] = [
  { id: 'sticky_yellow', name: 'Yellow Sticky Note', type: 'sticky', bgStyle: 'background-color: #FFFDE0; box-shadow: 2px 2px 8px rgba(0,0,0,0.1); border-left: 1px solid rgba(0,0,0,0.05);' },
  { id: 'sticky_pink', name: 'Pink Sticky Note', type: 'sticky', bgStyle: 'background-color: #FFE5EE; box-shadow: 2px 2px 8px rgba(0,0,0,0.1); border-left: 1px solid rgba(0,0,0,0.05);' },
  { id: 'sticky_blue', name: 'Blue Sticky Note', type: 'sticky', bgStyle: 'background-color: #E3F2FD; box-shadow: 2px 2px 8px rgba(0,0,0,0.1); border-left: 1px solid rgba(0,0,0,0.05);' },
  { id: 'torn_white', name: 'Torn Writing Sheet', type: 'torn', bgStyle: 'background-color: #FFFFFF; filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.15)); border: 1px dashed #DDD;' },
  { id: 'vintage_card', name: 'Vintage Grid Ticket', type: 'ticket', bgStyle: 'background-color: #E8E2CF; border: 1px solid #C4BCA2; background-image: repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(0,0,0,0.05) 15px, rgba(0,0,0,0.05) 16px);' },
  { id: 'newspaper_cutout', name: 'Newspaper Cutout', type: 'newspaper', bgStyle: 'background-color: #F2EFE9; font-family: "Special Elite", serif; color: #333; border: 1px solid #D5CEB8; box-shadow: 2px 2px 6px rgba(0,0,0,0.1);' },
  { id: 'pressed_flower_card', name: 'Pressed Flower Backing', type: 'card', bgStyle: 'background-color: #FAF4EB; border: 1px solid #E6DEC9; background-image: radial-gradient(#E8D0B3 2px, transparent 2px); background-size: 12px 12px;' }
];

export const SCRAPBOOK_DOODLES: DoodleAsset[] = [
  {
    id: 'doodle_arrow',
    name: 'Arrow drawn',
    svg: `<svg viewBox="0 0 100 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M10,20 L90,20 M70,5 L90,20 L70,35" /></svg>`
  },
  {
    id: 'doodle_underline',
    name: 'Scribble Underline',
    svg: `<svg viewBox="0 0 120 20" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><path d="M5,10 Q35,3 65,10 T115,8 Q85,15 55,10 T5,14" /></svg>`
  },
  {
    id: 'doodle_circle',
    name: 'Highlight Circle',
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M50,10 C25,12 10,35 15,60 C20,85 45,95 70,90 C92,85 95,55 85,35 C78,20 60,12 45,15" /></svg>`
  },
  {
    id: 'doodle_heart',
    name: 'Quick Love Heart',
    svg: `<svg viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M25,42 C10,28 5,18 5,12 C5,6 10,2 16,2 C21,2 24,6 25,9 C26,6 29,2 34,2 C40,2 45,6 45,12 C45,18 40,28 25,42 Z" /></svg>`
  }
];

export const SCRAPBOOK_STAMPS: StampAsset[] = [
  { id: 'stamp_approved', name: 'APPROVED STAMP', text: 'OFFICIALLY APPROVED' },
  { id: 'stamp_love', name: 'HEART STAMP', text: 'WITH ETERNAL LOVE' },
  { id: 'stamp_adventure', name: 'ADVENTURE STAMP', text: 'EXPLORE THE UNKNOWN' },
  { id: 'stamp_memory', name: 'MEMORIES STAMP', text: 'CHERISHED MOMENT' },
  { id: 'stamp_date', name: 'DATE PLACEHOLDER', text: 'MEMORA DEPT: ' + new Date().toLocaleDateString() }
];

export const MEMORY_PROMPTS = {
  'our-story': [
    "Where did you first meet?",
    "What do you remember about your first conversation?",
    "What is one moment you will never forget?",
    "What is your favorite inside joke together?",
    "Where was your first date and what did you eat?"
  ],
  'travel': [
    "Where did you go and who was with you?",
    "What was the funniest unexpected moment of the trip?",
    "What was your absolute favorite location or view?",
    "Describe the local food you tried. Did you love it?",
    "What did you listen to on the journey?"
  ],
  'birthday': [
    "What is your birthday wish for them this year?",
    "What was the funniest moment from their celebration?",
    "What makes this person's presence in your life so special?",
    "Describe a milestone achievement they had this past year."
  ],
  'baby': [
    "What was their first smile or laugh like?",
    "What was their first word, or funny babble sounds?",
    "What major milestone or change happened this month?",
    "What is their favorite toy or comfort blanket?"
  ],
  'friendship': [
    "How did you two first become friends?",
    "What is the funniest memory you share?",
    "What is one thing about this friendship you are most grateful for?",
    "What adventure is next on your friend bucket list?"
  ]
};
