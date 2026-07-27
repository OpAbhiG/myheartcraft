export interface OpenWhenMessagePhoto {
  url: string;
  caption: string;
}

export interface OpenWhenMessage {
  id: string;
  promptTitle: string;
  textContent: string;
  photos: OpenWhenMessagePhoto[];
  voiceUrl?: string; // base64 or audio blob url
  videoUrl?: string;
  surpriseContent?: {
    type: 'coupon' | 'link' | 'memora-project';
    value: string; // Coupon code, URL, or Memora creation ID (Card/Magazine/Scrapbook)
    label?: string; // Text for the link button
  };
  unlockMode: 'honor' | 'date' | 'manual';
  unlockDate?: string; // YYYY-MM-DD
  status: 'SEALED' | 'OPENED';
  openedAt?: string; // timestamp
}

export interface OpenWhenProject {
  id: string;
  title: string;
  creatorName: string;
  recipientName: string;
  relationship: string;
  occasion: 'romantic' | 'friendship' | 'family' | 'birthday' | 'ldr' | 'custom';
  style: 'soft-emotional' | 'minimal-editorial' | 'dark-cinematic' | 'playful-fun' | 'personal-handwritten';
  coverMessage?: string;
  introduction?: string;
  messages: OpenWhenMessage[];
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'LIVE';
  privacy: 'public' | 'unlisted' | 'private';
  password?: string;
  enableAnalytics: boolean;
  views: number;
}
