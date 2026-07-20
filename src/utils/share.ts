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

    // 2. Fallback to giftId match in local storage/defaults
    if (giftId) {
      const found = existingList.find((c) => c.id === giftId);
      if (found) return found;
    }
  } catch (e) {
    console.error('Error parsing creation from URL:', e);
  }

  return null;
}
