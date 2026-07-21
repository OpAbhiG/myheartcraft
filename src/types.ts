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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gKeuk37Re3mdRB03EhAasFmdGa0DI45HJGYcTWAkkZ9R7rW7n4sMua1N9pqJu9AAeHrWpfLiQqkulbCUjE6LfWl9I3yQNFh03cNmpQc-WZTKfyuLtsgcbc0zcWbxewMUhCgkVUPGmi2ha1XwHRMIDo5UF6fEbz3X1JoT8GWzOYkv2gR5ZcyZkOELPeTdbV09IbP3uGxiubxlSgDxQbfRVgRY8lwlnZKdHWY8Fh_NnE2qE5ptedy4uw',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDNiv2lg4T0PHhICts2h_dKmFFEfWuReW2Pu7vtLI8JYdrQfIbHdvEKSdpi8X-z0vLbtBiyMzAwDIB2elk0OUj4eI0CBNyyBj1XHEuFpOnSsIEh-z6-WooroxWNjYCxdjX_OaEG635aXKcPtLSkdkbkInExAx8vzhGWcx2dgfIIIsVhwZqq6uN2icP29LAoFNdZ-ZGR86k3-A-BMeW-OXmY6Yax4PJW4c9eueoMlyMfmuVT2LreLiyw',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkEPYzZgR3Lj9yGfZ2mte-B43nW2T9K2xkRxvj6NKFdKqtNolXoffs8ZHzhEglfNNIIz9eWrdDIEtDoXanzYsqsjCqE5lgw2_snUFcl0_7Rk7464D3V7gDY_aDSoA2PCY-nuXKPHlK_WtDSLzcNAbX2D7kkWWkYKKUNArmkCS306aKSb3mkXn7XuCQcv_mQPmRAqJAwPlGo8EU9LL3JB64t7wt0VJD96a1SlgyXRd6KsWv5-JLkXg7-g',
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
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrBpdoe62kpjzOXe3Z_ycB62AjevXEi-hVS6XvMbrk98iPzrq3R3a3W7m7VGJK9pSruhANqqcBiGh1AFMyh-GjnaBkJVDzcqDW43jL7Ymf5Y8eZrXriP7CYIwUrC9SgYEPVRyg7bYiNkSOsm09LgE-nrTx3jCbFtQzCo_oL3xAv107yrUu5VwbXN3nPE_faVPMQZcvUvPj8MBEO7haICV00l7mhIUjCLaKDvfBOJwlufnzs-6CogmPow',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNMJlj69BUL6mpzGf-hECa3wLwpyw6zMm6_eQKzqQEEcA_ODxI4_t9dBUGTbWK0RmnNuMEduPRsmASJdsW-wgt-1S2piRHRTeQsEW4d8LZKjim8jHaazWSWEQsZUEgPnDJBhUxVYq8q7Zml8sfUiV0ZGjbMewcwUaxCNcXzbbFW75aCe3-1nVpZChGG_N3CsSEJxLtfNWdq1F2zFSwD9AmgmxdkSd1jRfupYAxAwczCgGga4ybmrzDbg',
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
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
    interactiveType: 'envelope',
    themeColor: 'emerald',
    particles: 'gold_dust',
    musicTrack: 'acoustic_guitar'
  }
];

export const EXPERIENCE_TEMPLATES = TEMPLATE_EXPERIENCES;
export const INITIAL_CREATIONS: Creation[] = [];
