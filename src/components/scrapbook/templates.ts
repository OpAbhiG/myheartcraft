import { ScrapbookPage, ScrapbookElement } from './types';

export interface ScrapbookTemplatePreset {
  id: string;
  name: string;
  description: string;
  pages: {
    backgroundColor: string;
    backgroundTexture: string;
    elements: Omit<ScrapbookElement, 'id'>[];
  }[];
}

export const SCRAPBOOK_TEMPLATES: ScrapbookTemplatePreset[] = [
  {
    id: 'ai-auto',
    name: 'AI Auto-Design Engine 🔮',
    description: 'Memora AI automatically analyzes images and drafts layouts, typography, tape styles, and mixed-media details.',
    pages: [
      // Page 1: Cover
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'paper',
        elements: [
          {
            type: 'text', x: 15, y: 12, width: 70, height: 14, rotation: -2, zIndex: 10, opacity: 1, isLocked: false,
            content: 'OUR MEMORY BOOK',
            styleData: { fontFamily: 'Playfair Display', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center', color: '#4E433C' }
          },
          {
            type: 'photo', x: 25, y: 32, width: 50, height: 48, rotation: 5, zIndex: 5, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid', boxShadow: '4px 4px 12px rgba(0,0,0,0.15)' }
          },
          {
            type: 'tape', x: 42, y: 28, width: 16, height: 5, rotation: -6, zIndex: 12, opacity: 0.85, isLocked: false,
            content: 'washi_pink',
            styleData: { tapeType: 'washi', color: '#F8BBD0' }
          },
          {
            type: 'sticker', x: 74, y: 72, width: 14, height: 14, rotation: 12, zIndex: 15, opacity: 0.95, isLocked: false,
            content: 'pressed_flower'
          },
          {
            type: 'text', x: 25, y: 84, width: 50, height: 8, rotation: 1, zIndex: 11, opacity: 1, isLocked: false,
            content: 'Life lately & our favorite chapters',
            styleData: { fontFamily: 'Caveat', fontSize: 'lg', textAlign: 'center', color: '#888' }
          }
        ]
      },
      // Page 2: Newspaper collage
      {
        backgroundColor: '#F5EFEB',
        backgroundTexture: 'vintage',
        elements: [
          {
            type: 'paper', x: 12, y: 15, width: 44, height: 40, rotation: -4, zIndex: 4, opacity: 1, isLocked: false,
            content: 'newspaper_cutout',
            styleData: {}
          },
          {
            type: 'photo', x: 50, y: 22, width: 40, height: 42, rotation: 6, zIndex: 6, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'vintage', boxShadow: '3px 3px 10px rgba(0,0,0,0.15)' }
          },
          {
            type: 'sticker', x: 76, y: 12, width: 12, height: 12, rotation: -8, zIndex: 15, opacity: 0.9, isLocked: false,
            content: 'paper_clip'
          },
          {
            type: 'text', x: 15, y: 64, width: 70, height: 24, rotation: -1, zIndex: 8, opacity: 1, isLocked: false,
            content: '“Yesterday at golden hour, sweet memories were preserved forever in this custom digital scrapbook project.”',
            styleData: { fontFamily: 'Caveat', fontSize: 'lg', textAlign: 'center', color: '#4E433C' }
          }
        ]
      },
      // Page 3: Ticket details
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'minimal-cream',
        elements: [
          {
            type: 'photo', x: 12, y: 18, width: 42, height: 45, rotation: -6, zIndex: 5, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid', boxShadow: '4px 4px 12px rgba(0,0,0,0.12)' }
          },
          {
            type: 'paper', x: 54, y: 25, width: 36, height: 35, rotation: 8, zIndex: 4, opacity: 1, isLocked: false,
            content: 'vintage_card',
            styleData: {}
          },
          {
            type: 'tape', x: 62, y: 20, width: 18, height: 6, rotation: 12, zIndex: 10, opacity: 0.8, isLocked: false,
            content: 'washi_sage',
            styleData: { tapeType: 'washi', color: '#8FBC8F' }
          },
          {
            type: 'sticker', x: 25, y: 72, width: 16, height: 16, rotation: -12, zIndex: 15, opacity: 0.85, isLocked: false,
            content: 'coffee_stain'
          },
          {
            type: 'text', x: 44, y: 70, width: 44, height: 20, rotation: 1, zIndex: 11, opacity: 1, isLocked: false,
            content: 'Admit one to the archive of sweet adventures.',
            styleData: { fontFamily: 'Special Elite', fontSize: 'sm', color: '#555', textAlign: 'left' }
          }
        ]
      },
      // Page 4: Film strip page
      {
        backgroundColor: '#F5EFEB',
        backgroundTexture: 'minimal-cream',
        elements: [
          {
            type: 'sticker', x: 10, y: 12, width: 80, height: 26, rotation: 0, zIndex: 3, opacity: 0.95, isLocked: false,
            content: 'film_strip'
          },
          {
            type: 'photo', x: 18, y: 46, width: 36, height: 42, rotation: -5, zIndex: 5, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'rounded', boxShadow: '3px 3px 8px rgba(0,0,0,0.1)' }
          },
          {
            type: 'photo', x: 52, y: 46, width: 36, height: 42, rotation: 4, zIndex: 6, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'rounded', boxShadow: '3px 3px 8px rgba(0,0,0,0.1)' }
          },
          {
            type: 'tape', x: 38, y: 40, width: 14, height: 5, rotation: -2, zIndex: 12, opacity: 0.8, isLocked: false,
            content: 'washi_brown',
            styleData: { tapeType: 'washi', color: '#A0522D' }
          }
        ]
      },
      // Page 5: Lined notebook page
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: [
          {
            type: 'photo', x: 25, y: 12, width: 50, height: 48, rotation: -3, zIndex: 5, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid', boxShadow: '4px 4px 12px rgba(0,0,0,0.15)' }
          },
          {
            type: 'paper', x: 15, y: 64, width: 70, height: 26, rotation: 1, zIndex: 8, opacity: 1, isLocked: false,
            content: 'sticky_yellow',
            styleData: {}
          },
          {
            type: 'sticker', x: 12, y: 60, width: 12, height: 12, rotation: -15, zIndex: 15, opacity: 0.9, isLocked: false,
            content: 'paper_clip'
          }
        ]
      },
      // Page 6: Botanical backing page
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'paper',
        elements: [
          {
            type: 'paper', x: 12, y: 15, width: 38, height: 38, rotation: -5, zIndex: 4, opacity: 1, isLocked: false,
            content: 'pressed_flower_card',
            styleData: {}
          },
          {
            type: 'photo', x: 48, y: 18, width: 40, height: 44, rotation: 5, zIndex: 6, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'vintage', boxShadow: '3px 3px 10px rgba(0,0,0,0.15)' }
          },
          {
            type: 'sticker', x: 24, y: 68, width: 18, height: 18, rotation: 0, zIndex: 10, opacity: 0.85, isLocked: false,
            content: 'postal_mark'
          },
          {
            type: 'text', x: 46, y: 70, width: 44, height: 20, rotation: -2, zIndex: 9, opacity: 1, isLocked: false,
            content: 'Botanical collection gathered on our journeys.',
            styleData: { fontFamily: 'Caveat', fontSize: 'lg', color: '#4E433C', textAlign: 'center' }
          }
        ]
      },
      // Page 7: Lined journal paper
      {
        backgroundColor: '#F5EFEB',
        backgroundTexture: 'vintage',
        elements: [
          {
            type: 'photo', x: 15, y: 15, width: 42, height: 45, rotation: -6, zIndex: 5, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid', boxShadow: '4px 4px 12px rgba(0,0,0,0.12)' }
          },
          {
            type: 'photo', x: 50, y: 35, width: 38, height: 40, rotation: 8, zIndex: 6, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid', boxShadow: '4px 4px 12px rgba(0,0,0,0.12)' }
          },
          {
            type: 'text', x: 15, y: 70, width: 32, height: 20, rotation: -2, zIndex: 11, opacity: 1, isLocked: false,
            content: 'We write our days in the margins of life.',
            styleData: { fontFamily: 'Caveat', fontSize: 'md', color: '#4E433C', textAlign: 'center' }
          }
        ]
      },
      // Page 8: Back cover
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'paper',
        elements: [
          {
            type: 'text', x: 25, y: 35, width: 50, height: 12, rotation: 0, zIndex: 5, opacity: 1, isLocked: false,
            content: 'MEMORA ARCHIVE',
            styleData: { fontFamily: 'Special Elite', fontSize: '2xl', textAlign: 'center', color: '#4E433C' }
          },
          {
            type: 'sticker', x: 42, y: 52, width: 16, height: 16, rotation: 0, zIndex: 6, opacity: 0.9, isLocked: false,
            content: 'pressed_flower'
          },
          {
            type: 'text', x: 25, y: 72, width: 50, height: 8, rotation: 1, zIndex: 7, opacity: 1, isLocked: false,
            content: 'Thank you for exploring with me.',
            styleData: { fontFamily: 'Caveat', fontSize: 'lg', textAlign: 'center', color: '#888' }
          }
        ]
      }
    ]
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'A completely empty scrapbook. You are the sole creative director.',
    pages: Array.from({ length: 8 }).map((_, i) => ({
      backgroundColor: '#FAF9F6',
      backgroundTexture: i === 0 ? 'paper' : 'minimal-cream',
      elements: []
    }))
  },
  {
    id: 'guided',
    name: 'Lightly Guided Layout',
    description: 'Basic designated placement cards for photos, journal notes, and stickers.',
    pages: [
      // Page 1: Cover
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'paper',
        elements: [
          {
            type: 'text', x: 20, y: 15, width: 60, height: 10, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
            content: 'OUR STORY SCRAPBOOK',
            styleData: { fontFamily: 'Playfair Display', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 25, y: 30, width: 50, height: 48, rotation: 4, zIndex: 3, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid', boxShadow: '3px 3px 10px rgba(0,0,0,0.15)' }
          },
          {
            type: 'text', x: 30, y: 84, width: 40, height: 8, rotation: 1, zIndex: 6, opacity: 1, isLocked: false,
            content: 'Captured Moments',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', textAlign: 'center', color: '#888' }
          }
        ]
      },
      // Page 2 & 3: Double Spread
      {
        backgroundColor: '#FFF0F2',
        backgroundTexture: 'minimal-blush',
        elements: [
          {
            type: 'text', x: 10, y: 10, width: 80, height: 8, rotation: -1, zIndex: 2, opacity: 1, isLocked: false,
            content: 'The First Date',
            styleData: { fontFamily: 'Caveat', fontSize: '2xl', fontWeight: '600' }
          },
          {
            type: 'photo', x: 15, y: 22, width: 70, height: 50, rotation: -2, zIndex: 3, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'rounded', boxShadow: '3px 3px 10px rgba(0,0,0,0.1)' }
          }
        ]
      },
      {
        backgroundColor: '#FFF0F2',
        backgroundTexture: 'minimal-blush',
        elements: [
          {
            type: 'paper', x: 10, y: 15, width: 80, height: 50, rotation: 1, zIndex: 3, opacity: 0.9, isLocked: false,
            content: 'sticky_pink',
            styleData: {}
          },
          {
            type: 'text', x: 15, y: 25, width: 70, height: 30, rotation: 0, zIndex: 4, opacity: 1, isLocked: false,
            content: 'Double-click to write about the day here... what you felt, the laughter you shared.',
            styleData: { fontFamily: 'Inter', fontSize: 'lg', color: '#D81B60', textAlign: 'center' }
          }
        ]
      },
      // Page 4 & 5
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: [
          {
            type: 'photo', x: 15, y: 15, width: 38, height: 42, rotation: -5, zIndex: 5, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          },
          {
            type: 'photo', x: 50, y: 25, width: 38, height: 42, rotation: 6, zIndex: 6, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: [
          {
            type: 'text', x: 15, y: 15, width: 70, height: 30, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
            content: 'Our Favorite Escapes',
            styleData: { fontFamily: 'Special Elite', fontSize: 'xl' }
          },
          {
            type: 'paper', x: 15, y: 50, width: 70, height: 35, rotation: 1, zIndex: 6, opacity: 1, isLocked: false,
            content: 'newspaper_cutout',
            styleData: {}
          }
        ]
      },
      // Page 6 & 7
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: [
          {
            type: 'photo', x: 25, y: 15, width: 50, height: 52, rotation: -4, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'vintage' }
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: [
          {
            type: 'text', x: 15, y: 20, width: 70, height: 40, rotation: 2, zIndex: 4, opacity: 1, isLocked: false,
            content: '“A single picture holds ten thousand words. These notes are just the outline.”',
            styleData: { fontFamily: 'Caveat', fontSize: '2xl', color: '#4E433C' }
          }
        ]
      },
      // Page 8: Back cover
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'paper',
        elements: [
          {
            type: 'text', x: 25, y: 45, width: 50, height: 10, rotation: 0, zIndex: 1, opacity: 1, isLocked: false,
            content: 'THE END',
            styleData: { fontFamily: 'Special Elite', fontSize: '2xl', textAlign: 'center' }
          }
        ]
      }
    ]
  },
  {
    id: 'creative',
    name: 'Creative Collage Layout',
    description: 'Pre-arranged polaroid frames, stamps, floral designs, and paper headers.',
    pages: Array.from({ length: 8 }).map((_, i) => {
      if (i === 0) {
        return {
          backgroundColor: '#FAF9F6',
          backgroundTexture: 'paper',
          elements: [
            {
              type: 'text', x: 15, y: 15, width: 70, height: 12, rotation: -3, zIndex: 5, opacity: 1, isLocked: false,
              content: 'TRAVEL JOURNAL',
              styleData: { fontFamily: 'Special Elite', fontSize: '3xl', textAlign: 'center', backgroundColor: '#F0EAD6', borderStyle: 'solid', borderWidth: 1 }
            },
            {
              type: 'photo', x: 25, y: 35, width: 50, height: 46, rotation: 4, zIndex: 4, opacity: 1, isLocked: false,
              content: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=600&q=80',
              styleData: { frameType: 'polaroid' }
            },
            {
              type: 'text', x: 20, y: 84, width: 60, height: 10, rotation: 2, zIndex: 6, opacity: 1, isLocked: false,
              content: 'Wanderlust Edition',
              styleData: { fontFamily: 'Caveat', fontSize: '2xl', textAlign: 'center' }
            }
          ]
        };
      }
      const photoUrls = [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=600&q=80'
      ];
      return {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'travel',
        elements: [
          {
            type: 'photo', x: i % 2 === 0 ? 15 : 45, y: 20, width: 44, height: 46, rotation: i % 2 === 0 ? -6 : 5, zIndex: 4, opacity: 1, isLocked: false,
            content: photoUrls[i - 1] || photoUrls[0],
            styleData: { frameType: 'polaroid' }
          },
          {
            type: 'tape', x: i % 2 === 0 ? 25 : 55, y: 15, width: 16, height: 5, rotation: i % 2 === 0 ? -12 : 8, zIndex: 10, opacity: 0.85, isLocked: false,
            content: 'washi_green',
            styleData: { tapeType: 'washi', color: '#B2DFDB' }
          },
          {
            type: 'sticker', x: i % 2 === 0 ? 68 : 18, y: 70, width: 14, height: 14, rotation: 0, zIndex: 8, opacity: 0.9, isLocked: false,
            content: 'pressed_flower'
          },
          {
            type: 'text', x: i % 2 === 0 ? 15 : 45, y: 72, width: 44, height: 16, rotation: 1, zIndex: 5, opacity: 1, isLocked: false,
            content: 'Click here to write memories...',
            styleData: { fontFamily: 'Caveat', fontSize: 'lg', color: '#555', textAlign: 'center' }
          }
        ]
      };
    })
  },
  {
    id: 'story',
    name: 'Story Prompt Template',
    description: 'Scrapbook pages structured with specific question prompts (Where did we meet? First steps? Funny stories?).',
    pages: [
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'paper',
        elements: [
          {
            type: 'text', x: 20, y: 25, width: 60, height: 15, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
            content: 'OUR MEMORY JOURNAL',
            styleData: { fontFamily: 'Playfair Display', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 25, y: 45, width: 50, height: 44, rotation: 5, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          }
        ]
      },
      {
        backgroundColor: '#FFF0F2',
        backgroundTexture: 'minimal-blush',
        elements: [
          {
            type: 'text', x: 10, y: 12, width: 80, height: 14, rotation: -2, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: Where did you first meet and what did you wear?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 15, y: 28, width: 42, height: 42, rotation: 5, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          },
          {
            type: 'paper', x: 60, y: 35, width: 32, height: 35, rotation: -4, zIndex: 3, opacity: 0.9, isLocked: false,
            content: 'sticky_pink',
            styleData: {}
          }
        ]
      },
      {
        backgroundColor: '#FFF0F2',
        backgroundTexture: 'minimal-blush',
        elements: [
          {
            type: 'text', x: 10, y: 12, width: 80, height: 14, rotation: 1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: What is a funny adventure you had together?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 42, y: 28, width: 44, height: 44, rotation: -6, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          },
          {
            type: 'paper', x: 8, y: 35, width: 30, height: 35, rotation: 6, zIndex: 3, opacity: 0.9, isLocked: false,
            content: 'sticky_pink',
            styleData: {}
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: [
          {
            type: 'text', x: 10, y: 12, width: 80, height: 14, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: What makes this person stand out from everyone else?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 25, y: 28, width: 50, height: 44, rotation: 4, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          },
          {
            type: 'sticker', x: 74, y: 64, width: 14, height: 14, rotation: 12, zIndex: 15, opacity: 0.9, isLocked: false,
            content: 'pressed_flower'
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: [
          {
            type: 'text', x: 10, y: 12, width: 80, height: 14, rotation: 2, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: List three small things that always make them smile.',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 12, y: 28, width: 44, height: 44, rotation: -4, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          },
          {
            type: 'paper', x: 60, y: 32, width: 32, height: 35, rotation: 4, zIndex: 3, opacity: 0.9, isLocked: false,
            content: 'sticky_yellow',
            styleData: {}
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: [
          {
            type: 'text', x: 10, y: 12, width: 80, height: 14, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: Where is a location you both dream of visiting?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#333', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 42, y: 28, width: 44, height: 44, rotation: 6, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          },
          {
            type: 'paper', x: 8, y: 35, width: 30, height: 35, rotation: -4, zIndex: 3, opacity: 0.9, isLocked: false,
            content: 'sticky_yellow',
            styleData: {}
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: [
          {
            type: 'text', x: 10, y: 12, width: 80, height: 14, rotation: 1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: Write a special message for them to read in 5 years.',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#333', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            type: 'photo', x: 25, y: 28, width: 50, height: 44, rotation: -4, zIndex: 4, opacity: 1, isLocked: false,
            content: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
            styleData: { frameType: 'polaroid' }
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'paper',
        elements: [
          {
            type: 'text', x: 25, y: 45, width: 50, height: 10, rotation: 0, zIndex: 1, opacity: 1, isLocked: false,
            content: 'TO BE CONTINUED...',
            styleData: { fontFamily: 'Special Elite', fontSize: 'xl', textAlign: 'center' }
          }
        ]
      }
    ]
  }
];

export function buildPagesFromTemplate(
  templateId: string,
  projectName: string,
  type: string
): ScrapbookPage[] {
  const preset = SCRAPBOOK_TEMPLATES.find(t => t.id === templateId) || SCRAPBOOK_TEMPLATES[0];

  return preset.pages.map((p, idx) => {
    // Generate fresh elements from Omit<Element, 'id'> with unique IDs
    const elements: ScrapbookElement[] = p.elements.map((el, eIdx) => ({
      ...el,
      id: `el-${idx}-${eIdx}-${Date.now()}`
    })) as ScrapbookElement[];

    return {
      id: `page-${idx}-${Date.now()}`,
      pageNumber: idx + 1,
      backgroundColor: p.backgroundColor,
      backgroundTexture: p.backgroundTexture,
      elements
    };
  });
}
