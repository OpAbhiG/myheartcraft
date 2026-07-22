export interface ImageAsset {
  url: string;
  caption: string;
}

export interface Reply {
  sender: string;
  text: string;
  date: string;
}

export interface Creation {
  id: string;
  recipientName: string;
  creatorName: string;
  specialDate: string;
  relationship: string;
  templateId: string;
  themeColor: string; // e.g., 'rose_gold', 'amethyst', 'golden_twilight', 'emerald'
  particles: 'hearts' | 'gold_dust' | 'confetti' | 'stars';
  musicTrack: string; // 'acoustic_guitar' | 'romantic_piano' | 'cinematic_strings' | 'none'
  messageTitle: string;
  messageBody: string;
  images: ImageAsset[];
  interactiveElement: 'puzzle' | 'envelope' | 'popup' | 'cake';
  createdAt: string;
  views: number;
  status: 'LIVE' | 'DRAFT';
  replies?: Reply[];
}

export interface ExperienceTemplate {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  duration: string;
  image: string;
  interactiveType: 'puzzle' | 'envelope' | 'popup' | 'cake';
  themeColor: string;
  particles: 'hearts' | 'gold_dust' | 'confetti' | 'stars';
  musicTrack: 'birthday_instrumental' | 'romantic_piano' | 'acoustic_guitar' | 'cinematic_strings' | 'none';
}

export const TEMPLATE_EXPERIENCES: ExperienceTemplate[] = [
  {
    id: 'birthday',
    title: 'Virtual Birthday Bash 🎂',
    category: 'Birthday',
    categoryLabel: 'Festive, Interactive',
    description: 'A personalized cinematic journey through their best moments, complete with virtual confetti, music ambiance, and candle-blowing.',
    duration: 'Interactive',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'cake',
    themeColor: 'rose_gold',
    particles: 'confetti',
    musicTrack: 'birthday_instrumental'
  },
  {
    id: 'proposal',
    title: 'Perfect Proposal 💍',
    category: 'Romantic',
    categoryLabel: 'Cinematic, Emotional',
    description: 'A breathtaking cinematic reveal with glowing stars, soft light particles, and handwritten timeline designed for the most important question.',
    duration: '15 mins',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'popup',
    themeColor: 'golden_twilight',
    particles: 'gold_dust',
    musicTrack: 'cinematic_strings'
  },
  {
    id: 'puzzle',
    title: 'Surprise Photo Puzzle 🧩',
    category: 'Interactive',
    categoryLabel: 'Memory, Playful',
    description: 'Hide your beautiful picture and secret letter behind an interactive memory puzzle that your recipient swaps tiles to solve and unlock.',
    duration: 'Interactive',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'puzzle',
    themeColor: 'emerald',
    particles: 'stars',
    musicTrack: 'acoustic_guitar'
  },
  {
    id: 'love_letter',
    title: 'Love Letter 💌',
    category: 'Romantic',
    categoryLabel: 'Handwritten, Sincere',
    description: 'An intimate, vintage parchment envelope experience with a wax seal that breaks open to reveal your deepest feelings and photo scrapbook.',
    duration: 'Customizable',
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'envelope',
    themeColor: 'rose_gold',
    particles: 'hearts',
    musicTrack: 'romantic_piano'
  },
  {
    id: 'anniversary',
    title: 'Anniversary Special 🌹',
    category: 'Romantic',
    categoryLabel: 'Romantic, Timeless',
    description: 'Walk through your years together in a beautifully curated digital scrapbook gallery with soothing piano ambiances.',
    duration: '10 mins',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'popup',
    themeColor: 'amethyst',
    particles: 'hearts',
    musicTrack: 'romantic_piano'
  },
  {
    id: 'sorry_card',
    title: 'Sorry Card / Apology Note 💔',
    category: 'Appreciation',
    categoryLabel: 'Sincere, Reconciliation',
    description: 'Express your deep apology, mend misunderstandings, and share your genuine warmth with a delicate handwritten letter and soft acoustic guitar loop.',
    duration: 'Customizable',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'envelope',
    themeColor: 'golden_twilight',
    particles: 'gold_dust',
    musicTrack: 'acoustic_guitar'
  },
  {
    id: 'mothers_day',
    title: 'Mother\'s Day Keepsake 🌸',
    category: 'Appreciation',
    categoryLabel: 'Warm, Gratitude',
    description: 'A heartfelt tribute card to honor Mom with a memory photo album, gentle floating stars, and sweet appreciation words.',
    duration: '5 mins',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'popup',
    themeColor: 'rose_gold',
    particles: 'stars',
    musicTrack: 'acoustic_guitar'
  },
  {
    id: 'thank_you',
    title: 'Thank You Card 🥂',
    category: 'Appreciation',
    categoryLabel: 'Warm, Connection',
    description: 'Express your sincere gratitude to a friend, mentor, or colleague with an animated letter opening experience.',
    duration: 'Customizable',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'envelope',
    themeColor: 'emerald',
    particles: 'gold_dust',
    musicTrack: 'acoustic_guitar'
  }
];

export const EXPERIENCE_TEMPLATES = TEMPLATE_EXPERIENCES;
export const INITIAL_CREATIONS: Creation[] = [];
