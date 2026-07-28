import { ScrapbookTemplate } from './types';

export const INITIAL_SCRAPBOOK_TEMPLATES: ScrapbookTemplate[] = [
  // 1. Birthday Memories — Template 01 (1200 x 1600 px)
  {
    id: 'birthday-memories-01',
    name: 'Birthday Memories — Template 01',
    category: 'Birthday',
    description: 'A premium handcrafted 1200 × 1600 px birthday scrapbook page with 5 photo frames, paper clips, dried flowers, washi tape, torn paper notes, and a cupcake sticker.',
    previewUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 1200,
      height: 1600,
      aspectRatio: '3:4',
      backgroundColor: '#fbf9f2',
      backgroundTexture: 'cream-paper'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 430,
        y: 90,
        width: 600,
        height: 520,
        shape: 'polaroid',
        rotation: 2,
        required: true,
        tapeDecoration: 'top-center',
        captionPlaceholder: 'Happy Birthday Hero Moment 🎂'
      },
      {
        id: 'photo_2',
        x: 50,
        y: 600,
        width: 500,
        height: 430,
        shape: 'torn-paper',
        rotation: -3,
        required: true,
        tapeDecoration: 'top-left',
        captionPlaceholder: 'Unforgettable Smile'
      },
      {
        id: 'photo_3',
        x: 570,
        y: 610,
        width: 330,
        height: 330,
        shape: 'polaroid',
        rotation: 2,
        required: true,
        tapeDecoration: 'top-right',
        captionPlaceholder: 'Pure Joy'
      },
      {
        id: 'photo_4',
        x: 600,
        y: 930,
        width: 500,
        height: 350,
        shape: 'paper',
        rotation: -2,
        required: true,
        tapeDecoration: 'paper-clip',
        captionPlaceholder: 'Celebration Moments'
      },
      {
        id: 'photo_5',
        x: 40,
        y: 1030,
        width: 420,
        height: 380,
        shape: 'polaroid',
        rotation: 3,
        required: true,
        tapeDecoration: 'top-center',
        captionPlaceholder: 'Best Friends Fun'
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'Happy Birthday!',
        defaultText: 'Happy Birthday!',
        x: 40,
        y: 70,
        width: 380,
        fontFamily: 'handwritten',
        fontSize: 52,
        color: '#4a3b32',
        editable: true,
        align: 'left'
      },
      {
        id: 'subtitle',
        type: 'subheading',
        placeholder: 'Wishing you a day as special as you are!',
        defaultText: 'Wishing you a day as special as you are!',
        x: 40,
        y: 160,
        width: 360,
        fontFamily: 'sans',
        fontSize: 16,
        color: '#64748b',
        editable: true,
        align: 'left'
      },
      {
        id: 'memory',
        type: 'textarea',
        placeholder: 'Write your favorite birthday memory here...',
        defaultText: 'Write your favorite birthday memory here...',
        x: 915,
        y: 680,
        width: 210,
        fontFamily: 'handwritten',
        fontSize: 16,
        color: '#3a2e2b',
        editable: true,
        align: 'left'
      },
      {
        id: 'quote',
        type: 'quote',
        placeholder: 'Good times + Crazy friends = Amazing memories',
        defaultText: 'Good times +\nCrazy friends =\nAmazing memories',
        x: 480,
        y: 1095,
        width: 100,
        fontFamily: 'handwritten',
        fontSize: 14,
        color: '#332724',
        editable: true,
        align: 'center'
      },
      {
        id: 'name',
        type: 'names',
        placeholder: 'Birthday Girl / Boy',
        defaultText: 'Birthday Girl / Boy',
        x: 630,
        y: 1350,
        width: 350,
        fontFamily: 'cursive',
        fontSize: 32,
        color: '#991b1b',
        editable: true,
        align: 'left'
      },
      {
        id: 'date',
        type: 'date',
        placeholder: 'Date: DD / MM / YYYY',
        defaultText: 'Date: DD / MM / YYYY',
        x: 630,
        y: 1410,
        width: 350,
        fontFamily: 'sans',
        fontSize: 16,
        color: '#475569',
        editable: true,
        align: 'left'
      }
    ],
    decorations: [
      // Memories Pink Torn Note
      {
        id: 'memories-note',
        type: 'torn-note',
        x: 900,
        y: 620,
        width: 240,
        height: 300,
        rotation: 3,
        bgColor: '#ffe4e6',
        textContent: 'Memories ♥',
        locked: true
      },
      // Center Kraft Note
      {
        id: 'kraft-note',
        type: 'kraft-note',
        x: 480,
        y: 1070,
        width: 100,
        height: 260,
        rotation: -4,
        bgColor: '#e7d5c0',
        locked: true
      },
      // Birthday Info Torn Card
      {
        id: 'info-card',
        type: 'paper-texture',
        x: 600,
        y: 1320,
        width: 500,
        height: 190,
        rotation: 1,
        bgColor: '#fff1f2',
        locked: true
      },
      // Cupcake Sticker 🧁
      {
        id: 'cupcake-sticker',
        type: 'cupcake',
        x: 1010,
        y: 1360,
        width: 70,
        height: 70,
        rotation: 6,
        locked: true
      },
      // Dried Flowers Accent
      {
        id: 'dried-flower-1',
        type: 'flower',
        x: 1010,
        y: 130,
        width: 70,
        height: 180,
        rotation: 8,
        locked: true
      },
      // Hand-drawn Stars & Hearts
      {
        id: 'star-1',
        type: 'doodle',
        x: 390,
        y: 60,
        width: 40,
        height: 40,
        rotation: 15,
        locked: true
      },
      {
        id: 'heart-1',
        type: 'doodle',
        x: 390,
        y: 160,
        width: 30,
        height: 30,
        rotation: -10,
        locked: true
      }
    ]
  },

  // 2. Our Love Story (Love)
  {
    id: 'love-story-01',
    name: 'Our Love Story',
    category: 'Love',
    description: 'A romantic vintage scrapbook layout featuring polaroid frames, washi tape, and handwritten quotes.',
    previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 1200,
      height: 1600,
      aspectRatio: '3:4',
      backgroundColor: '#fbf9f5',
      backgroundTexture: 'vintage-parchment'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 90,
        y: 270,
        width: 480,
        height: 570,
        shape: 'polaroid',
        rotation: -4,
        required: true,
        tapeDecoration: 'top-left',
        captionPlaceholder: 'First Day We Met'
      },
      {
        id: 'photo_2',
        x: 630,
        y: 330,
        width: 480,
        height: 570,
        shape: 'polaroid',
        rotation: 5,
        required: true,
        tapeDecoration: 'top-right',
        captionPlaceholder: 'Favorite Memory Together'
      },
      {
        id: 'photo_3',
        x: 150,
        y: 900,
        width: 420,
        height: 480,
        shape: 'rounded',
        rotation: 2,
        required: false,
        tapeDecoration: 'corners'
      },
      {
        id: 'photo_4',
        x: 630,
        y: 940,
        width: 450,
        height: 480,
        shape: 'polaroid',
        rotation: -3,
        required: false
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'OUR LOVE STORY',
        defaultText: 'OUR LOVE STORY',
        x: 120,
        y: 90,
        width: 960,
        fontFamily: 'handwritten',
        fontSize: 56,
        color: '#be123c',
        editable: true,
        align: 'center'
      },
      {
        id: 'names',
        type: 'names',
        placeholder: 'You & Me',
        defaultText: 'You & Me',
        x: 120,
        y: 180,
        width: 960,
        fontFamily: 'cursive',
        fontSize: 38,
        color: '#475569',
        editable: true,
        align: 'center'
      },
      {
        id: 'date',
        type: 'date',
        placeholder: '12 JUNE 2026',
        defaultText: '12 JUNE 2026',
        x: 150,
        y: 1440,
        width: 900,
        fontFamily: 'sans',
        fontSize: 20,
        color: '#94a3b8',
        editable: true,
        align: 'center'
      }
    ],
    decorations: [
      {
        id: 'tape-1',
        type: 'tape',
        x: 120,
        y: 240,
        width: 150,
        height: 45,
        rotation: -12,
        locked: true
      },
      {
        id: 'heart-1',
        type: 'doodle',
        x: 555,
        y: 240,
        width: 65,
        height: 65,
        rotation: 10,
        locked: true
      }
    ]
  },

  // 3. Forever Us (Couple)
  {
    id: 'forever-us-02',
    name: 'Forever Us',
    category: 'Couple',
    description: 'Elegant golden-hour collage for couples with rose accents and torn paper texture aesthetics.',
    previewUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 1200,
      height: 1600,
      aspectRatio: '3:4',
      backgroundColor: '#fffcf7',
      backgroundTexture: 'craft-paper'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 120,
        y: 240,
        width: 960,
        height: 540,
        shape: 'rounded',
        rotation: 0,
        required: true,
        tapeDecoration: 'top-center'
      },
      {
        id: 'photo_2',
        x: 120,
        y: 840,
        width: 450,
        height: 510,
        shape: 'polaroid',
        rotation: -4,
        required: true
      },
      {
        id: 'photo_3',
        x: 630,
        y: 840,
        width: 450,
        height: 510,
        shape: 'polaroid',
        rotation: 4,
        required: true
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'FOREVER & ALWAYS',
        defaultText: 'FOREVER & ALWAYS',
        x: 120,
        y: 90,
        width: 960,
        fontFamily: 'serif',
        fontSize: 52,
        color: '#881337',
        editable: true,
        align: 'center'
      },
      {
        id: 'memory',
        type: 'body',
        placeholder: 'Every moment with you feels like a dream come true.',
        defaultText: 'Every moment with you feels like a dream come true.',
        x: 150,
        y: 1395,
        width: 900,
        fontFamily: 'handwritten',
        fontSize: 26,
        color: '#475569',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  }
];
