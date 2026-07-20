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
  musicTrack: 'romantic_piano' | 'acoustic_guitar' | 'cinematic_strings' | 'none';
}

export const EXPERIENCE_TEMPLATES: ExperienceTemplate[] = [
  {
    id: 'birthday',
    title: 'Birthday Surprise',
    category: 'Celebration',
    categoryLabel: 'Celebration, Warm',
    description: 'A personalized cinematic journey through their best moments, complete with virtual confetti and candle-blowing.',
    duration: '5 mins',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gKeuk37Re3mdRB03EhAasFmdGa0DI45HJGYcTWAkkZ9R7rW7n4sMua1N9pqJu9AAeHrWpfLiQqkulbCUjE6LfWl9I3yQNFh03cNmpQc-WZTKfyuLtsgcbc0zcWbxewMUhCgkVUPGmi2ha1XwHRMIDo5UF6fEbz3X1JoT8GWzOYkv2gR5ZcyZkOELPeTdbV09IbP3uGxiubxlSgDxQbfRVgRY8lwlnZKdHWY8Fh_NnE2qE5ptedy4uw',
    interactiveType: 'cake',
    themeColor: 'rose_gold',
    particles: 'confetti',
    musicTrack: 'acoustic_guitar'
  },
  {
    id: 'anniversary',
    title: 'Anniversary Timeline',
    category: 'Romantic',
    categoryLabel: 'Romantic, Elegant',
    description: 'Walk through your years together in a beautifully curated, interactive digital scrapbook gallery with elegant memories.',
    duration: '10 mins',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrBpdoe62kpjzOXe3Z_ycB62AjevXEi-hVS6XvMbrk98iPzrq3R3a3W7m7VGJK9pSruhANqqcBiGh1AFMyh-GjnaBkJVDzcqDW43jL7Ymf5Y8eZrXriP7CYIwUrC9SgYEPVRyg7bYiNkSOsm09LgE-nrTx3jCbFtQzCo_oL3xAv107yrUu5VwbXN3nPE_faVPMQZcvUvPj8MBEO7haICV00l7mhIUjCLaKDvfBOJwlufnzs-6CogmPow',
    interactiveType: 'envelope',
    themeColor: 'amethyst',
    particles: 'hearts',
    musicTrack: 'romantic_piano'
  },
  {
    id: 'puzzle',
    title: 'Digital Puzzle',
    category: 'Playful',
    categoryLabel: 'Celebration, Playful',
    description: 'Hide your beautiful picture and message behind an interactive puzzle that they have to swap pieces to solve.',
    duration: 'Interactive',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkEPYzZgR3Lj9yGfZ2mte-B43nW2T9K2xkRxvj6NKFdKqtNolXoffs8ZHzhEglfNNIIz9eWrdDIEtDoXanzYsqsjCqE5lgw2_snUFcl0_7Rk7464D3V7gDY_aDSoA2PCY-nuXKPHlK_WtDSLzcNAbX2D7kkWWkYKKUNArmkCS306aKSb3mkXn7XuCQcv_mQPmRAqJAwPlGo8EU9LL3JB64t7wt0VJD96a1SlgyXRd6KsWv5-JLkXg7-g',
    interactiveType: 'puzzle',
    themeColor: 'emerald',
    particles: 'stars',
    musicTrack: 'acoustic_guitar'
  },
  {
    id: 'proposal',
    title: 'The Proposal',
    category: 'Milestone',
    categoryLabel: 'Cinematic, Emotional',
    description: 'A breathtaking cinematic reveal with glowing stars and soft light particles, designed for the most important question.',
    duration: '15 mins',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDNiv2lg4T0PHhICts2h_dKmFFEfWuReW2Pu7vtLI8JYdrQfIbHdvEKSdpi8X-z0vLbtBiyMzAwDIB2elk0OUj4eI0CBNyyBj1XHEuFpOnSsIEh-z6-WooroxWNjYCxdjX_OaEG635aXKcPtLSkdkbkInExAx8vzhGWcx2dgfIIIsVhwZqq6uN2icP29LAoFNdZ-ZGR86k3-A-BMeW-OXmY6Yax4PJW4c9eueoMlyMfmuVT2LreLiyw',
    interactiveType: 'popup',
    themeColor: 'golden_twilight',
    particles: 'gold_dust',
    musicTrack: 'cinematic_strings'
  },
  {
    id: 'thank_you',
    title: 'Thank You Card',
    category: 'Appreciation',
    categoryLabel: 'Warm, Sincere',
    description: 'Express your deep gratitude with a delicate, animated handwritten letter opening experience with falling leaves or stars.',
    duration: 'Customizable',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNMJlj69BUL6mpzGf-hECa3wLwpyw6zMm6_eQKzqQEEcA_ODxI4_t9dBUGTbWK0RmnNuMEduPRsmASJdsW-wgt-1S2piRHRTeQsEW4d8LZKjim8jHaazWSWEQsZUEgPnDJBhUxVYq8q7Zml8sfUiV0ZGjbMewcwUaxCNcXzbbFW75aCe3-1nVpZChGG_N3CsSEJxLtfNWdq1F2zFSwD9AmgmxdkSd1jRfupYAxAwczCgGga4ybmrzDbg',
    interactiveType: 'envelope',
    themeColor: 'rose_gold',
    particles: 'gold_dust',
    musicTrack: 'acoustic_guitar'
  }
];

export const INITIAL_CREATIONS: Creation[] = [
  {
    id: 'birthday-person-7x92k',
    recipientName: 'Person',
    creatorName: 'Abhishek',
    specialDate: '2026-07-25',
    relationship: 'Partner',
    templateId: 'birthday',
    themeColor: 'rose_gold',
    particles: 'confetti',
    musicTrack: 'acoustic_guitar',
    messageTitle: 'Happy Birthday to my Favorite Person! 🎂',
    messageBody: 'Person, wishing you a day filled with laughter, love, and endless joy. You make every single moment brighter, and I am so grateful to celebrate another amazing year of your life. Keep shining and smiling! Here is a little walk down memory lane to remind you of how much you are loved.',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDeis4xurkuDvw7heB3Sg_ocw2ZjY0tbwM3tWxpz4F-OpqGkDMn-hHdIF4IcPwiQ5LPkgcxoOX03PojfJa-eJ1BAwfqcL4NRCPcr6mCUTqoqy6WIeOaQ82F_lHTqkk-EpkeFhqSXMm_Q_RMXqOvzzzYZl9vlLL2yZWtFYx2S7baLRvA_y494EghYI5eP_ZsXXSdMfnP77uxAhgtvs0j0Q4NYmmYDHhXIjOMr9gfQM_sJu_mSnyBs-EIA',
        caption: 'The moment we wrapped your favorite gift together'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqFee02yy1lI_WruPT3mZBWxOo0s0udZMVpA-9NEWpnVfaI3t4shIZQfZ_wYBmtmW9x0qJ8RYOakw-V3AktYJIUXl3FGvyUNOMDv45X2qgGksCEugtmG5ksCgs5Y5IPVaAt8VeY3JKUUfdJejJnlfXFIWoRwpPA7MjCdWNdGFj-maeMW9d_phk3RU8LgHSC_1vI2YQyITyMEszmbUkCSA7Kv2Q0ldSBaGiArlAndLZYP7daKVOQOIHeA',
        caption: 'Holding hands and promising to walk side-by-side forever'
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArR3ashizzHw_39rTPZTPeF7QeKNRT_l4E_aZ9x7JiMh94Gt3lpqLaH3cxALhgdZeN4TmOoMZ8ibgeuFk1XcN6rABWCWEAcfTkGlkoLHzazAoq-qSy5kTEGOoj0RDg5tm7enbec07NJ5V6PJtlwniQtUghYiaLKjqvwq0A-dsRwWiGZWuQiqjXzG4ckPJAS_RR-6rQHMRVwXVkWrUakEB1TyL2koXm8IwpQkAHaRDXFRzvEBGpjMFQVQ',
        caption: 'Late night lavender tea and writing deep letters'
      }
    ],
    interactiveElement: 'cake',
    createdAt: '2024-10-24',
    views: 142,
    status: 'LIVE',
    replies: [
      {
        sender: 'Person',
        text: 'This is the most beautiful thing anyone has ever made for me! I am literally crying right now. Thank you so much Abhishek! ❤️😭',
        date: '2024-10-25'
      }
    ]
  },
  {
    id: 'anniversary-10th-9a8d1',
    recipientName: 'Sarah',
    creatorName: 'Michael',
    specialDate: '2026-11-02',
    relationship: 'Partner',
    templateId: 'anniversary',
    themeColor: 'amethyst',
    particles: 'hearts',
    musicTrack: 'romantic_piano',
    messageTitle: 'Happy 10th Anniversary, My Love 💍',
    messageBody: 'Sarah, ten years ago we promised to build a life together, and every single day since has been an absolute dream. Through all the laughter, the challenges, the quiet mornings, and the grand adventures, you have been my rock. Here is a timeline of our first decade together. I cannot wait for the next fifty.',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqFee02yy1lI_WruPT3mZBWxOo0s0udZMVpA-9NEWpnVfaI3t4shIZQfZ_wYBmtmW9x0qJ8RYOakw-V3AktYJIUXl3FGvyUNOMDv45X2qgGksCEugtmG5ksCgs5Y5IPVaAt8VeY3JKUUfdJejJnlfXFIWoRwpPA7MjCdWNdGFj-maeMW9d_phk3RU8LgHSC_1vI2YQyITyMEszmbUkCSA7Kv2Q0ldSBaGiArlAndLZYP7daKVOQOIHeA',
        caption: 'The day we put these rings on our fingers'
      }
    ],
    interactiveElement: 'envelope',
    createdAt: '2024-11-02',
    views: 0,
    status: 'DRAFT',
    replies: []
  },
  {
    id: 'mom-tribute-3k1u9',
    recipientName: 'Mom',
    creatorName: 'Julian',
    specialDate: '2026-09-15',
    relationship: 'Parent',
    templateId: 'thank_you',
    themeColor: 'rose_gold',
    particles: 'gold_dust',
    musicTrack: 'acoustic_guitar',
    messageTitle: 'A Deep Thank You to the Best Mom 🌸',
    messageBody: 'Dear Mom, I wanted to create a small surprise just to express how incredibly grateful I am for everything you have done for me. Your warmth, patience, guidance, and endless love have shaped who I am today. Thank you for always listening and believing in me. This letter and these little memories are a tribute to you.',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArR3ashizzHw_39rTPZTPeF7QeKNRT_l4E_aZ9x7JiMh94Gt3lpqLaH3cxALhgdZeN4TmOoMZ8ibgeuFk1XcN6rABWCWEAcfTkGlkoLHzazAoq-qSy5kTEGOoj0RDg5tm7enbec07NJ5V6PJtlwniQtUghYiaLKjqvwq0A-dsRwWiGZWuQiqjXzG4ckPJAS_RR-6rQHMRVwXVkWrUakEB1TyL2koXm8IwpQkAHaRDXFRzvEBGpjMFQVQ',
        caption: 'A quiet afternoon with dried lavender and deep talks'
      }
    ],
    interactiveElement: 'envelope',
    createdAt: '2024-09-15',
    views: 308,
    status: 'LIVE',
    replies: [
      {
        sender: 'Mom',
        text: 'Oh Julian, this is so incredibly thoughtful of you. It made my whole week. I love you so much and am so proud of the man you have become.',
        date: '2024-09-16'
      }
    ]
  }
];
