import { ScrapbookTemplate } from './types';

export const INITIAL_SCRAPBOOK_TEMPLATES: ScrapbookTemplate[] = [
  // 1. Our Love Story (Love)
  {
    id: 'love-story-01',
    name: 'Our Love Story',
    category: 'Love',
    description: 'A romantic vintage scrapbook layout featuring polaroid frames, washi tape, and handwritten quotes.',
    previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#fbf9f5',
      backgroundTexture: 'vintage-parchment'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 60,
        y: 180,
        width: 320,
        height: 380,
        shape: 'polaroid',
        rotation: -4,
        required: true,
        tapeDecoration: 'top-left',
        captionPlaceholder: 'First Day We Met'
      },
      {
        id: 'photo_2',
        x: 420,
        y: 220,
        width: 320,
        height: 380,
        shape: 'polaroid',
        rotation: 5,
        required: true,
        tapeDecoration: 'top-right',
        captionPlaceholder: 'Favorite Memory Together'
      },
      {
        id: 'photo_3',
        x: 100,
        y: 600,
        width: 280,
        height: 320,
        shape: 'rounded',
        rotation: 2,
        required: false,
        tapeDecoration: 'corners'
      },
      {
        id: 'photo_4',
        x: 420,
        y: 630,
        width: 300,
        height: 320,
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
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'handwritten',
        fontSize: 38,
        color: '#be123c',
        editable: true,
        align: 'center'
      },
      {
        id: 'names',
        type: 'names',
        placeholder: 'You & Me',
        defaultText: 'You & Me',
        x: 80,
        y: 120,
        width: 640,
        fontFamily: 'cursive',
        fontSize: 26,
        color: '#475569',
        editable: true,
        align: 'center'
      },
      {
        id: 'date',
        type: 'date',
        placeholder: '12 JUNE 2026',
        defaultText: '12 JUNE 2026',
        x: 100,
        y: 960,
        width: 600,
        fontFamily: 'sans',
        fontSize: 14,
        color: '#94a3b8',
        editable: true,
        align: 'center'
      }
    ],
    decorations: [
      {
        id: 'tape-1',
        type: 'tape',
        x: 80,
        y: 165,
        width: 100,
        height: 30,
        rotation: -12,
        locked: true
      },
      {
        id: 'heart-1',
        type: 'doodle',
        x: 370,
        y: 160,
        width: 45,
        height: 45,
        rotation: 10,
        locked: true
      }
    ]
  },

  // 2. Forever Us (Couple)
  {
    id: 'forever-us-02',
    name: 'Forever Us',
    category: 'Couple',
    description: 'Elegant golden-hour collage for couples with rose accents and torn paper texture aesthetics.',
    previewUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#fffcf7',
      backgroundTexture: 'craft-paper'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 80,
        y: 160,
        width: 640,
        height: 360,
        shape: 'rounded',
        rotation: 0,
        required: true,
        tapeDecoration: 'top-center'
      },
      {
        id: 'photo_2',
        x: 80,
        y: 560,
        width: 300,
        height: 340,
        shape: 'polaroid',
        rotation: -4,
        required: true
      },
      {
        id: 'photo_3',
        x: 420,
        y: 560,
        width: 300,
        height: 340,
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
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'serif',
        fontSize: 34,
        color: '#881337',
        editable: true,
        align: 'center'
      },
      {
        id: 'memory',
        type: 'body',
        placeholder: 'Every moment with you feels like a dream come true.',
        defaultText: 'Every moment with you feels like a dream come true.',
        x: 100,
        y: 930,
        width: 600,
        fontFamily: 'handwritten',
        fontSize: 18,
        color: '#475569',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 3. Birthday Memories (Birthday)
  {
    id: 'birthday-01',
    name: 'Birthday Memories',
    category: 'Birthday',
    description: 'Vibrant celebratory scrapbook template with confetti, birthday balloons, and festive notes.',
    previewUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#fefce8',
      backgroundTexture: 'pink-pastel'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 100,
        y: 180,
        width: 600,
        height: 380,
        shape: 'polaroid',
        rotation: -2,
        required: true,
        captionPlaceholder: 'The Grand Celebration 🎉'
      },
      {
        id: 'photo_2',
        x: 100,
        y: 600,
        width: 270,
        height: 300,
        shape: 'rounded',
        rotation: -3,
        required: false
      },
      {
        id: 'photo_3',
        x: 430,
        y: 600,
        width: 270,
        height: 300,
        shape: 'rounded',
        rotation: 3,
        required: false
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'HAPPY BIRTHDAY!',
        defaultText: 'HAPPY BIRTHDAY!',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'handwritten',
        fontSize: 40,
        color: '#c026d3',
        editable: true,
        align: 'center'
      },
      {
        id: 'subheading',
        type: 'subheading',
        placeholder: 'Wishing you another year of joy & adventures',
        defaultText: 'Wishing you another year of joy & adventures',
        x: 80,
        y: 120,
        width: 640,
        fontFamily: 'sans',
        fontSize: 16,
        color: '#6b21a8',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 4. Birthday Celebration (Birthday)
  {
    id: 'birthday-02',
    name: 'Birthday Celebration',
    category: 'Birthday',
    description: 'Festive photobooth filmstrip style scrapbook for milestone birthday parties.',
    previewUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#f8fafc',
      backgroundTexture: 'grid'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 70,
        y: 180,
        width: 320,
        height: 350,
        shape: 'polaroid',
        rotation: -3,
        required: true
      },
      {
        id: 'photo_2',
        x: 410,
        y: 180,
        width: 320,
        height: 350,
        shape: 'polaroid',
        rotation: 3,
        required: true
      },
      {
        id: 'photo_3',
        x: 240,
        y: 570,
        width: 320,
        height: 350,
        shape: 'polaroid',
        rotation: 0,
        required: true
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'CHEERS TO YOU!',
        defaultText: 'CHEERS TO YOU!',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'vintage',
        fontSize: 36,
        color: '#0284c7',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 5. Adventure Diary (Travel)
  {
    id: 'travel-01',
    name: 'Adventure Diary',
    category: 'Travel',
    description: 'Wanderlust travel scrapbook featuring map borders, postcard frames, and location stamps.',
    previewUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#fafaf9',
      backgroundTexture: 'vintage-parchment'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 80,
        y: 170,
        width: 380,
        height: 360,
        shape: 'torn-paper',
        rotation: -2,
        required: true
      },
      {
        id: 'photo_2',
        x: 480,
        y: 200,
        width: 240,
        height: 320,
        shape: 'polaroid',
        rotation: 4,
        required: true
      },
      {
        id: 'photo_3',
        x: 80,
        y: 560,
        width: 640,
        height: 360,
        shape: 'rounded',
        rotation: 0,
        required: false
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'WANDERLUST DIARIES',
        defaultText: 'WANDERLUST DIARIES',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'vintage',
        fontSize: 34,
        color: '#15803d',
        editable: true,
        align: 'center'
      },
      {
        id: 'location',
        type: 'subheading',
        placeholder: 'Exploring The Mountains & Seas',
        defaultText: 'Exploring The Mountains & Seas',
        x: 80,
        y: 110,
        width: 640,
        fontFamily: 'handwritten',
        fontSize: 20,
        color: '#334155',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 6. Travel Postcards (Travel)
  {
    id: 'travel-02',
    name: 'Travel Postcards',
    category: 'Travel',
    description: 'Postcard styled scrapbook layout with vintage stamp frames and travel log captions.',
    previewUrl: 'https://images.unsplash.com/photo-1476514525535-ce74f45814ce?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#fffbeb',
      backgroundTexture: 'craft-paper'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 80,
        y: 170,
        width: 310,
        height: 340,
        shape: 'polaroid',
        rotation: -4,
        required: true
      },
      {
        id: 'photo_2',
        x: 410,
        y: 170,
        width: 310,
        height: 340,
        shape: 'polaroid',
        rotation: 3,
        required: true
      },
      {
        id: 'photo_3',
        x: 80,
        y: 550,
        width: 640,
        height: 360,
        shape: 'rounded',
        rotation: 0,
        required: true
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'POSTCARDS FROM AFAR',
        defaultText: 'POSTCARDS FROM AFAR',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'serif',
        fontSize: 32,
        color: '#b45309',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 7. Family Moments (Family)
  {
    id: 'family-01',
    name: 'Family Moments',
    category: 'Family',
    description: 'Warm family keepsake scrapbook layout with heart badges and homey handwritten headings.',
    previewUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#fef2f2',
      backgroundTexture: 'linen'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 90,
        y: 170,
        width: 620,
        height: 380,
        shape: 'rounded',
        rotation: 0,
        required: true
      },
      {
        id: 'photo_2',
        x: 90,
        y: 580,
        width: 290,
        height: 320,
        shape: 'polaroid',
        rotation: -3,
        required: true
      },
      {
        id: 'photo_3',
        x: 420,
        y: 580,
        width: 290,
        height: 320,
        shape: 'polaroid',
        rotation: 3,
        required: true
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'HOME IS WHERE THE HEART IS',
        defaultText: 'HOME IS WHERE THE HEART IS',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'handwritten',
        fontSize: 34,
        color: '#991b1b',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 8. Home & Heart (Family)
  {
    id: 'family-02',
    name: 'Home & Heart',
    category: 'Family',
    description: 'Cozy memory album layout featuring multi-photo polaroids and handwritten family notes.',
    previewUrl: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#f1f5f9',
      backgroundTexture: 'grid'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 80,
        y: 180,
        width: 310,
        height: 350,
        shape: 'polaroid',
        rotation: -2,
        required: true
      },
      {
        id: 'photo_2',
        x: 410,
        y: 180,
        width: 310,
        height: 350,
        shape: 'polaroid',
        rotation: 2,
        required: true
      },
      {
        id: 'photo_3',
        x: 80,
        y: 560,
        width: 640,
        height: 350,
        shape: 'rounded',
        rotation: 0,
        required: true
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'SWEET FAMILY MEMORIES',
        defaultText: 'SWEET FAMILY MEMORIES',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'cursive',
        fontSize: 34,
        color: '#334155',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 9. Best Friends (Friendship)
  {
    id: 'friendship-01',
    name: 'Best Friends',
    category: 'Friendship',
    description: 'Fun and lively scrapbook template for best friends with stickers, doodles, and photo slots.',
    previewUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#fef3c7',
      backgroundTexture: 'pink-pastel'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 80,
        y: 170,
        width: 310,
        height: 360,
        shape: 'polaroid',
        rotation: -4,
        required: true
      },
      {
        id: 'photo_2',
        x: 410,
        y: 170,
        width: 310,
        height: 360,
        shape: 'polaroid',
        rotation: 4,
        required: true
      },
      {
        id: 'photo_3',
        x: 80,
        y: 570,
        width: 640,
        height: 350,
        shape: 'rounded',
        rotation: 0,
        required: true
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'BEST FRIENDS FOREVER',
        defaultText: 'BEST FRIENDS FOREVER',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'handwritten',
        fontSize: 38,
        color: '#d97706',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  },

  // 10. Little Moments (Baby)
  {
    id: 'baby-01',
    name: 'Little Moments',
    category: 'Baby',
    description: 'Soft pastel memory album layout for baby milestones, first steps, and cute photos.',
    previewUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
    canvas: {
      width: 800,
      height: 1066,
      aspectRatio: '3:4',
      backgroundColor: '#f0fdf4',
      backgroundTexture: 'linen'
    },
    photoSlots: [
      {
        id: 'photo_1',
        x: 100,
        y: 170,
        width: 600,
        height: 400,
        shape: 'polaroid',
        rotation: 0,
        required: true,
        captionPlaceholder: 'Little Sunshine 🍼'
      },
      {
        id: 'photo_2',
        x: 100,
        y: 600,
        width: 280,
        height: 300,
        shape: 'circle',
        rotation: 0,
        required: true
      },
      {
        id: 'photo_3',
        x: 420,
        y: 600,
        width: 280,
        height: 300,
        shape: 'rounded',
        rotation: 2,
        required: true
      }
    ],
    textElements: [
      {
        id: 'title',
        type: 'heading',
        placeholder: 'LITTLE MOMENTS OF JOY',
        defaultText: 'LITTLE MOMENTS OF JOY',
        x: 80,
        y: 60,
        width: 640,
        fontFamily: 'handwritten',
        fontSize: 36,
        color: '#16a34a',
        editable: true,
        align: 'center'
      }
    ],
    decorations: []
  }
];
