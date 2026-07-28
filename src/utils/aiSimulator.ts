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


