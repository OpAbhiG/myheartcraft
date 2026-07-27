export interface PresetPrompt {
  title: string;
  description: string;
}

export const OCCASION_LABELS = {
  romantic: 'Romantic (Partners)',
  friendship: 'Friendship (Best Friends)',
  family: 'Family (Parents, Siblings)',
  birthday: 'Birthday surprises',
  ldr: 'Long Distance Relationships',
  custom: 'Completely Custom'
};

export const PRESET_PROMPTS: { [key: string]: PresetPrompt[] } = {
  romantic: [
    { title: 'Open when you miss me', description: 'A message for when distance feels difficult and you need to feel close.' },
    { title: 'Open when we have had a fight', description: 'Read this when things are tense to remind us what matters most.' },
    { title: 'Open when you need a hug', description: 'A warm envelope to wrap around your heart when you feel cold.' },
    { title: 'Open when you can’t sleep', description: 'A soothing note to keep you company in the quiet hours.' },
    { title: 'Open when you want to remember us', description: 'Revisit a few of our absolute favorite memories together.' },
    { title: 'Open on our anniversary', description: 'A celebratory message to mark our special milestone.' }
  ],
  friendship: [
    { title: 'Open when you need to laugh', description: 'Read this for an immediate inside joke or funny memory reveal.' },
    { title: 'Open when you feel alone', description: 'A reminder that no matter where you are, I am in your corner.' },
    { title: 'Open when you need motivation', description: 'A hype-letter to kickstart your focus and self-belief.' },
    { title: 'Open when you miss our friendship', description: 'A warm throwback to the crazy adventures we have shared.' },
    { title: 'Open when you need a reminder of how amazing you are', description: 'A list of reasons why you are an incredible human being.' }
  ],
  family: [
    { title: 'Open when you miss me', description: 'A loving message for moments when family feels far away.' },
    { title: 'Open when you need to smile', description: 'A sweet letter with a funny memory to brighten your day.' },
    { title: 'Open when you need encouragement', description: 'Read this when you need support or guidance.' },
    { title: 'Open on your birthday', description: 'A special family birthday wish card.' }
  ],
  birthday: [
    { title: 'Open on your birthday', description: 'The primary celebration message and digital candles surprise.' },
    { title: 'Open when you want a surprise', description: 'A fun game or gift code waiting inside.' },
    { title: 'Open when you want to remember this year', description: 'A reflection on all the highlights of the past year.' }
  ],
  ldr: [
    { title: 'Open when you miss me', description: 'For when the miles feel heavy.' },
    { title: 'Open when you wish I were there', description: 'A sweet note to close the distance.' },
    { title: 'Open when you feel lonely', description: 'A reminder that my heart is always right next to yours.' },
    { title: 'Open when we finally meet again', description: 'To read right before or after our airport reunion.' }
  ]
};
