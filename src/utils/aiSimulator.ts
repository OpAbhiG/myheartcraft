import { MagazineBasicInfo, MagazinePage, MagazinePhoto } from '../components/magazine/types';
import { ScrapbookElement } from '../components/scrapbook/types';

// Curated lists of editorial paragraphs, headings, and quotes per category & tone
const JOURNALISTIC_STORIES: { [key: string]: { [tone: string]: string[] } } = {
  birthday: {
    emotional: [
      "Another beautiful year added to a life already so rich in warmth and kindness. Each chapter we live is built on moments of quiet laughter, soft encouragement, and the simple beauty of being together.",
      "As we pause to look back on the path you have walked, we are filled with deep gratitude for the light you bring into our lives. May the days ahead be as bright and gentle as your spirit.",
      "Growing older is not about the passage of time, but the accumulation of love, wisdom, and memories. Today, we celebrate the unique masterpiece that is your life."
    ],
    fun: [
      "Here's to another 365-day trip around the sun! They say age is just a number, but in your case, it's a very large and impressive number of laughs, snacks, and adventures.",
      "No one does birthdays quite like you. It's time to cake, celebrate, and ignore the fact that we're all getting a little bit older and a lot more ridiculous.",
      "Let the celebrations begin! May your day be filled with too much sugar, loud music, and people reminding you of all your funniest moments."
    ],
    elegant: [
      "A celebration of grace, growth, and the timeless artistry of a life well-lived. Today, we honor the quiet strength and elegant journey of a truly remarkable individual.",
      "In the gallery of life, every year is a new brushstroke of sophistication and charm. Wishing you an exquisite birthday filled with peace and inspiration.",
      "With poise and warmth, you navigate the passing of time, reminding us all that true style is eternal. Happy birthday to someone who embodies grace."
    ]
  },
  travel: {
    cinematic: [
      "The horizon calls, a distant line dividing the sky and the unknown. We set out not to escape life, but to ensure life does not escape us. Every street turned, every train boarded, was a step into a larger story.",
      "Under the gold of a fading afternoon sun, the old city whispered its ancient secrets. We walked through shadows and light, capturing fragments of moments that would soon become our history.",
      "There is a quiet magic in lost tracks and empty roads. The noise of the world fades, replaced by the rhythm of footsteps and the heartbeat of adventure."
    ],
    minimal: [
      "Quiet spaces. Open roads. The simplicity of movement. We sought out destinations that offered space to breathe and silence to think.",
      "Between the departures and arrivals, we found a still point. A collection of shapes, textures, and moments stripped of excess.",
      "Travel is the art of leaving behind the unnecessary to make room for the essential."
    ],
    romantic: [
      "Every new place felt like ours. Walking hand-in-hand through foreign streets, sharing train rides and late-night talks under unfamiliar stars.",
      "The world is vast, yet the most beautiful view was always right next to me. Our journeys are written in shared glances and quiet mornings.",
      "We left our footprints in distant sands, but the memories are etched deeply in our hearts forever."
    ]
  },
  anniversary: {
    romantic: [
      "Years of shared laughter, quiet support, and an unbreakable bond that only grows deeper with time. Through every season, you have been my anchor and my home.",
      "We started with a simple promise, and today we look back on a beautiful tapestry woven from our choices, our struggles, and our deep, abiding love.",
      "To love and be loved is to feel the sun from both sides. Here is to the days we've shared and the endless tomorrow we continue to build together."
    ],
    emotional: [
      "Through the ups and downs of life, our hearts have beat to the same quiet rhythm. Thank you for being my constant, my peace, and my greatest joy.",
      "Every memory we share is a treasure, a testament to the life we have built together. I love you more with every passing sunset.",
      "Looking back, I would choose you every single time. Our love story is my favorite journey."
    ]
  }
};

const DEFAULT_STORIES = [
  "A beautiful collection of moments, captured to be remembered forever. Each page tells a part of a larger journey of connection, growth, and love.",
  "In the quiet spaces between events, we find the real substance of our memories. The smiles, the landscapes, and the shared silences.",
  "We create stories not to hold onto the past, but to celebrate the present and look forward to the future with open hearts."
];

const DEFAULT_QUOTES = [
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
  { text: "We do not remember days, we remember moments.", author: "Cesare Pavese" },
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { text: "Travel is the only thing you buy that makes you richer.", author: "Anonymous" },
  { text: "In all the world, there is no heart for me like yours.", author: "Maya Angelou" }
];

export function generateMagazineText(
  info: MagazineBasicInfo,
  category: string,
  style: string,
  tone: string,
  pageType: string
): { title: string; subtitle: string; body?: string; quote?: string; author?: string; caption?: string } {
  const name = info.names || info.personName || "Us";
  const date = info.eventDate || new Date().toLocaleDateString();
  const location = info.location || "Somewhere beautiful";

  // Pick paragraph list
  const categoryStories = JOURNALISTIC_STORIES[category] || JOURNALISTIC_STORIES['birthday'];
  const storyPool = categoryStories[tone] || categoryStories['emotional'] || DEFAULT_STORIES;
  const paragraph1 = storyPool[0] || DEFAULT_STORIES[0];
  const paragraph2 = storyPool[1] || DEFAULT_STORIES[1];

  // Pick quote
  const quotePool = DEFAULT_QUOTES;
  const quoteObj = quotePool[Math.floor(Math.random() * quotePool.length)];

  switch (pageType) {
    case 'cover':
      return {
        title: info.title || `${name.toUpperCase()} MAGAZINE`,
        subtitle: info.subtitle || `A Curated Collection of Memories // Vol. I // ${date}`,
        caption: `SPECIAL EDITORIAL ISSUE // ${location.toUpperCase()}`
      };
    case 'editorial-split':
      return {
        title: "A Quiet Reflection",
        subtitle: `An interview with ${name} on life, love, and what matters most.`,
        body: `${paragraph1}\n\nWritten during a golden hour in ${location}, this special feature explores the chapters that define who we are.`
      };
    case 'story':
      return {
        title: "The Chapters That Shape Us",
        subtitle: "A story told through lenses and letters.",
        body: `${paragraph2}\n\n${info.description || 'Memories are notes written on the margins of our lives. They tell us where we have been and guide us where we are going.'}`
      };
    case 'quote':
      return {
        title: "Words to Live By",
        subtitle: "Editorial thoughts",
        quote: info.customMessage || quoteObj.text,
        author: info.names ? `— ${info.names}` : quoteObj.author
      };
    case 'timeline':
      return {
        title: "A Timeline of Milestones",
        subtitle: "Key dates in our journey",
        body: info.milestones || `First Meet • ${date}\nFirst Adventure • ${location}\nToday • Creating Memories Together`
      };
    case 'celebration':
      return {
        title: info.age ? `Celebrating ${info.age} Years` : "A Grand Celebration",
        subtitle: `Honoring ${name} on ${date}`,
        body: `Gathered together in ${location}, we celebrate the love, laughter, and light that surrounds us. Here's to many more beautiful memories.`
      };
    case 'closing':
      return {
        title: "Until Next Time",
        subtitle: "The journey continues",
        body: "Thank you for being part of this story. These pages may close, but the memories will remain open forever."
      };
    default:
      return {
        title: "Memory Detail",
        subtitle: location,
        body: paragraph1,
        caption: `Captured on ${date} at ${location}`
      };
  }
}

export function improveText(
  originalText: string,
  action: 'shorter' | 'longer' | 'emotional' | 'funny' | 'elegant' | 'cinematic' | 'grammar'
): string {
  if (!originalText) return "A beautiful moment captured in time.";

  const grammarFix = originalText.replace(/\s+/g, ' ').trim();

  switch (action) {
    case 'shorter':
      return grammarFix.split('. ').slice(0, 1).join('. ') + '.';
    case 'longer':
      return `${grammarFix} It is in these quiet instances, captured between frames and breaths, that the true weight of our experiences becomes clear. We hold onto these fragments of time, knowing they form the foundation of our shared story.`;
    case 'emotional':
      return `With a heart full of love: ${grammarFix} Every look, every laugh, and every quiet moment we've spent together is a reminder of how deeply we are connected.`;
    case 'funny':
      return `${grammarFix} (And yes, we actually managed to capture this without anyone blinking, tripping, or eating all the cake first. Miracles do happen!)`;
    case 'elegant':
      return `An exquisite depiction of sentiment: ${grammarFix} Crafted with grace and preserved in timeless elegance, defining a legacy of beautiful memories.`;
    case 'cinematic':
      return `The camera pans, capturing the golden shafts of light. ${grammarFix} A silent frame in a grand film of memories, forever frozen in beautiful cinematic motion.`;
    case 'grammar':
    default:
      return grammarFix.charAt(0).toUpperCase() + grammarFix.slice(1);
  }
}

export function arrangeLayout(
  photos: MagazinePhoto[],
  category: string,
  style: string
): Omit<MagazinePage, 'id'>[] {
  const pages: Omit<MagazinePage, 'id'>[] = [];
  const photoIds = photos.map(p => p.id);

  // 1. Cover page (uses first photo or favorite)
  const coverPhotoId = photos.find(p => p.isCover)?.id || photoIds[0] || '';
  pages.push({
    pageNumber: 1,
    layoutType: 'cover',
    photoIds: coverPhotoId ? [coverPhotoId] : []
  });

  // 2. Editorial Split Page (uses second photo)
  const p2Id = photoIds[1] || coverPhotoId;
  pages.push({
    pageNumber: 2,
    layoutType: 'editorial-split',
    photoIds: p2Id ? [p2Id] : []
  });

  // 3. Photo Grid or Masonry Page (uses 3-4 photos)
  const gridPhotos = photoIds.slice(2, 6);
  if (gridPhotos.length > 0) {
    pages.push({
      pageNumber: 3,
      layoutType: 'photo-grid',
      photoIds: gridPhotos
    });
  }

  // 4. Story / Timeline page
  const p7Id = photoIds[6] || coverPhotoId;
  pages.push({
    pageNumber: 4,
    layoutType: 'story',
    photoIds: p7Id ? [p7Id] : []
  });

  // 5. Timeline / Celebration page
  pages.push({
    pageNumber: 5,
    layoutType: 'timeline',
    photoIds: []
  });

  // 6. Quote Page (uses another photo)
  const p8Id = photoIds[7] || photoIds[3] || coverPhotoId;
  pages.push({
    pageNumber: 6,
    layoutType: 'quote',
    photoIds: p8Id ? [p8Id] : []
  });

  // 7. Full-page Hero / Celebration (uses one favorite photo)
  const heroPhotoId = photos.find(p => p.isFavorite)?.id || photoIds[8] || photoIds[4] || coverPhotoId;
  pages.push({
    pageNumber: 7,
    layoutType: 'hero',
    photoIds: heroPhotoId ? [heroPhotoId] : []
  });

  // 8. Closing / Back Cover page
  pages.push({
    pageNumber: 8,
    layoutType: 'closing',
    photoIds: []
  });

  return pages;
}

export function arrangeScrapbookPage(
  photos: string[],
  style: string
): ScrapbookElement[] {
  const elements: ScrapbookElement[] = [];
  const spacing = 15;

  // Let's place photos first with overlaps and rotations
  photos.forEach((photoUrl, idx) => {
    const id = `el-photo-${idx}-${Date.now()}`;
    const rotation = (idx % 2 === 0 ? 5 : -7) * (idx + 1);
    
    // Polaroids or tape mounted frame based on style
    const frameType = style === 'handmade-paper' ? 'polaroid' :
                      style === 'vintage-journal' ? 'vintage' : 'rounded';

    elements.push({
      id,
      type: 'photo',
      x: 10 + (idx * 25) + (Math.random() * 8),
      y: 15 + (idx * 12) + (Math.random() * 5),
      width: 40,
      height: 45,
      rotation,
      zIndex: idx + 2,
      opacity: 1,
      isLocked: false,
      content: photoUrl,
      styleData: {
        frameType,
        boxShadow: '3px 3px 10px rgba(0,0,0,0.15)',
        crop: { zoom: 1, x: 0, y: 0, rotate: 0 }
      }
    });

    // Add Washi tape on top of the photo if style permits
    if (style === 'handmade-paper' || style === 'playful-collage') {
      elements.push({
        id: `el-tape-${idx}-${Date.now()}`,
        type: 'tape',
        x: 10 + (idx * 25) + 10,
        y: 12 + (idx * 12),
        width: 18,
        height: 6,
        rotation: rotation - 12,
        zIndex: idx + 10,
        opacity: 0.85,
        isLocked: false,
        content: 'washi_pink',
        styleData: {
          tapeType: 'washi',
          color: idx % 2 === 0 ? '#ffb3ba' : '#baffc9'
        }
      });
    }
  });

  // Add text memory/note card
  elements.push({
    id: `el-text-${Date.now()}`,
    type: 'text',
    x: 20,
    y: 65,
    width: 60,
    height: 25,
    rotation: -2,
    zIndex: 20,
    opacity: 1,
    isLocked: false,
    content: "Writing down our sweet memories from this wonderful day. It's the small details we cherish most.",
    styleData: {
      fontFamily: style === 'handmade-paper' || style === 'vintage-journal' ? 'Caveat' : 'Inter',
      fontSize: 'lg',
      color: '#1a1a1a',
      textAlign: 'center',
      backgroundColor: style === 'handmade-paper' ? '#fffdeb' : 'transparent', // yellow sticky note look
      borderRadius: '2px',
      borderStyle: 'none'
    }
  });

  // Add some decorative stickers or doodles
  elements.push({
    id: `el-sticker-${Date.now()}`,
    type: 'sticker',
    x: 75,
    y: 10,
    width: 15,
    height: 15,
    rotation: 15,
    zIndex: 25,
    opacity: 0.95,
    isLocked: false,
    content: 'heart_sparkle',
    styleData: {
      stickerCategory: 'love'
    }
  });

  if (style === 'playful-collage') {
    elements.push({
      id: `el-doodle-${Date.now()}`,
      type: 'doodle',
      x: 5,
      y: 55,
      width: 12,
      height: 12,
      rotation: -10,
      zIndex: 5,
      opacity: 0.8,
      isLocked: false,
      content: 'arrow_drawn',
      styleData: {
        doodleType: 'arrow'
      }
    });
  }

  return elements;
}
