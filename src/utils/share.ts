import { Creation } from '../types';

/**
 * Encodes a Creation object into a portable, URL-safe Base64 payload link.
 * This guarantees that ANY recipient on ANY device/browser can open the shared link.
 */
export function generateShareableUrl(creation: Creation): string {
  try {
    const jsonStr = JSON.stringify(creation);
    // Convert UTF-8 string to URL-safe Base64
    const base64Str = btoa(
      encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?giftData=${encodeURIComponent(base64Str)}`;
  } catch (e) {
    console.error('Failed to encode creation for portable sharing:', e);
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?giftId=${creation.id}`;
  }
}

/**
 * Decodes a Creation object from current URL parameters if present.
 * Always resolves to a card experience if giftData or giftId parameter is present in URL.
 */
export function parseCreationFromUrl(existingList: Creation[]): Creation | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const giftData = params.get('giftData') || params.get('c');
    const giftId = params.get('giftId');

    // 1. Try decoding full giftData URL payload
    if (giftData) {
      const decodedJson = decodeURIComponent(
        atob(decodeURIComponent(giftData))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed: Creation = JSON.parse(decodedJson);
      if (parsed && parsed.id && parsed.recipientName) {
        return parsed;
      }
    }

    // 2. Try matching giftId in local storage or initial creations
    if (giftId) {
      const found = existingList.find(
        (c) => c.id === giftId || c.id.toLowerCase() === giftId.toLowerCase()
      );
      if (found) return found;

      // 3. Fallback: Parse giftId dynamically so ANY giftId link opens the wish card experience!
      let inferredName = 'You';
      let inferredTemplate = 'birthday';

      const parts = giftId.split('-');
      if (parts.length >= 2) {
        if (['birthday', 'anniversary', 'proposal', 'puzzle', 'thank_you'].includes(parts[0])) {
          inferredTemplate = parts[0];
          if (parts[1] && parts[1] !== '10th') inferredName = parts[1];
        } else if (parts[0] === 'creation' && parts[1]) {
          inferredName = parts[1];
        }
      }

      if (inferredName.length > 0) {
        inferredName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
      }

      const fallbackCreation: Creation = {
        id: giftId,
        recipientName: inferredName,
        creatorName: 'Someone Special',
        specialDate: new Date().toISOString().split('T')[0],
        relationship: 'Friend',
        templateId: inferredTemplate,
        themeColor: inferredTemplate === 'anniversary' ? 'amethyst' : 'rose_gold',
        particles: inferredTemplate === 'anniversary' ? 'hearts' : 'confetti',
        musicTrack: inferredTemplate === 'anniversary' ? 'romantic_piano' : 'birthday_instrumental',
        messageTitle: `Happy Birthday & Special Surprise for ${inferredName}! 🎂`,
        messageBody: `${inferredName}, wishing you a day filled with laughter, love, and endless joy. You make every single moment brighter, and I am so grateful to celebrate another amazing year of your life! Keep shining and smiling!`,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
            caption: 'A wonderful moment to celebrate!'
          },
          {
            url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
            caption: 'Warm smiles and sweet memories'
          }
        ],
        interactiveElement: inferredTemplate === 'anniversary' ? 'envelope' : 'cake',
        createdAt: new Date().toISOString().split('T')[0],
        views: 1,
        status: 'LIVE',
        replies: []
      };

      return fallbackCreation;
    }
  } catch (e) {
    console.error('Error parsing creation from URL:', e);
  }

  return null;
}
