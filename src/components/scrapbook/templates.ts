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
    pages: Array.from({ length: 8 }).map((_, i) => ({
      backgroundColor: i % 2 === 0 ? '#FAF9F6' : '#F5EFEB',
      backgroundTexture: i === 0 ? 'paper' : i % 2 === 0 ? 'minimal-cream' : 'vintage',
      elements: [
        {
          type: 'text', x: 20, y: i === 0 ? 15 : 10, width: 60, height: 12, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
          content: i === 0 ? 'MEMORIES COLLAGE' : i === 7 ? 'OUR KEEPSAKE' : 'Life Lately',
          styleData: { fontFamily: 'Playfair Display', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' }
        }
      ]
    }))
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
            type: 'text', x: 30, y: 75, width: 40, height: 8, rotation: 1, zIndex: 6, opacity: 1, isLocked: false,
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
          }
        ]
      },
      {
        backgroundColor: '#FFF0F2',
        backgroundTexture: 'minimal-blush',
        elements: [
          {
            type: 'text', x: 10, y: 70, width: 80, height: 20, rotation: 1, zIndex: 3, opacity: 0.9, isLocked: false,
            content: 'Write about the day here... what you felt, what you ate, the laughter you shared.',
            styleData: { fontFamily: 'Inter', fontSize: 'md', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1CFCC', borderRadius: '4px' }
          }
        ]
      },
      // Page 4 & 5
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: []
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: []
      },
      // Page 6 & 7
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: []
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: []
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
              type: 'text', x: 20, y: 70, width: 60, height: 15, rotation: 2, zIndex: 6, opacity: 1, isLocked: false,
              content: 'Wanderlust Edition',
              styleData: { fontFamily: 'Caveat', fontSize: '2xl', textAlign: 'center' }
            }
          ]
        };
      }
      return {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'travel',
        elements: []
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
          }
        ]
      },
      {
        backgroundColor: '#FFF0F2',
        backgroundTexture: 'minimal-blush',
        elements: [
          {
            type: 'text', x: 10, y: 15, width: 80, height: 30, rotation: -2, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: Where did you first meet and what did you wear?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold' }
          }
        ]
      },
      {
        backgroundColor: '#FFF0F2',
        backgroundTexture: 'minimal-blush',
        elements: [
          {
            type: 'text', x: 10, y: 15, width: 80, height: 30, rotation: 1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: What is a funny adventure you had together?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold' }
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: [
          {
            type: 'text', x: 10, y: 15, width: 80, height: 30, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: What makes this person stand out from everyone else?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold' }
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'notebook',
        elements: [
          {
            type: 'text', x: 10, y: 15, width: 80, height: 30, rotation: 2, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: List three small things that always make them smile.',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#D81B60', fontWeight: 'bold' }
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: [
          {
            type: 'text', x: 10, y: 15, width: 80, height: 30, rotation: -1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: Where is a location you both dream of visiting?',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#333', fontWeight: 'bold' }
          }
        ]
      },
      {
        backgroundColor: '#FAF9F6',
        backgroundTexture: 'kraft',
        elements: [
          {
            type: 'text', x: 10, y: 15, width: 80, height: 30, rotation: 1, zIndex: 5, opacity: 1, isLocked: false,
            content: '★ PROMPT: Write a special message for them to read in 5 years.',
            styleData: { fontFamily: 'Caveat', fontSize: 'xl', color: '#333', fontWeight: 'bold' }
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
