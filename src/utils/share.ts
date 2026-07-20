import { Creation } from '../types';

const IMAGE_ALIASES: { [alias: string]: string } = {
  '@b1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gKeuk37Re3mdRB03EhAasFmdGa0DI45HJGYcTWAkkZ9R7rW7n4sMua1N9pqJu9AAeHrWpfLiQqkulbCUjE6LfWl9I3yQNFh03cNmpQc-WZTKfyuLtsgcbc0zcWbxewMUhCgkVUPGmi2ha1XwHRMIDo5UF6fEbz3X1JoT8GWzOYkv2gR5ZcyZkOELPeTdbV09IbP3uGxiubxlSgDxQbfRVgRY8lwlnZKdHWY8Fh_NnE2qE5ptedy4uw',
  '@a1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrBpdoe62kpjzOXe3Z_ycB62AjevXEi-hVS6XvMbrk98iPzrq3R3a3W7m7VGJK9pSruhANqqcBiGh1AFMyh-GjnaBkJVDzcqDW43jL7Ymf5Y8eZrXriP7CYIwUrC9SgYEPVRyg7bYiNkSOsm09LgE-nrTx3jCbFtQzCo_oL3xAv107yrUu5VwbXN3nPE_faVPMQZcvUvPj8MBEO7haICV00l7mhIUjCLaKDvfBOJwlufnzs-6CogmPow',
  '@p1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkEPYzZgR3Lj9yGfZ2mte-B43nW2T9K2xkRxvj6NKFdKqtNolXoffs8ZHzhEglfNNIIz9eWrdDIEtDoXanzYsqsjCqE5lgw2_snUFcl0_7Rk7464D3V7gDY_aDSoA2PCY-nuXKPHlK_WtDSLzcNAbX2D7kkWWkYKKUNArmkCS306aKSb3mkXn7XuCQcv_mQPmRAqJAwPlGo8EU9LL3JB64t7wt0VJD96a1SlgyXRd6KsWv5-JLkXg7-g',
  '@pr1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuATDNiv2lg4T0PHhICts2h_dKmFFEfWuReW2Pu7vtLI8JYdrQfIbHdvEKSdpi8X-z0vLbtBiyMzAwDIB2elk0OUj4eI0CBNyyBj1XHEuFpOnSsIEh-z6-WooroxWNjYCxdjX_OaEG635aXKcPtLSkdkbkInExAx8vzhGWcx2dgfIIIsVhwZqq6uN2icP29LAoFNdZ-ZGR86k3-A-BMeW-OXmY6Yax4PJW4c9eueoMlyMfmuVT2LreLiyw',
  '@t1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNMJlj69BUL6mpzGf-hECa3wLwpyw6zMm6_eQKzqQEEcA_ODxI4_t9dBUGTbWK0RmnNuMEduPRsmASJdsW-wgt-1S2piRHRTeQsEW4d8LZKjim8jHaazWSWEQsZUEgPnDJBhUxVYq8q7Zml8sfUiV0ZGjbMewcwUaxCNcXzbbFW75aCe3-1nVpZChGG_N3CsSEJxLtfNWdq1F2zFSwD9AmgmxdkSd1jRfupYAxAwczCgGga4ybmrzDbg',
  '@g1': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDeis4xurkuDvw7heB3Sg_ocw2ZjY0tbwM3tWxpz4F-OpqGkDMn-hHdIF4IcPwiQ5LPkgcxoOX03PojfJa-eJ1BAwfqcL4NRCPcr6mCUTqoqy6WIeOaQ82F_lHTqkk-EpkeFhqSXMm_Q_RMXqOvzzzYZl9vlLL2yZWtFYx2S7baLRvA_y494EghYI5eP_ZsXXSdMfnP77uxAhgtvs0j0Q4NYmmYDHhXIjOMr9gfQM_sJu_mSnyBs-EIA',
  '@g2': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqFee02yy1lI_WruPT3mZBWxOo0s0udZMVpA-9NEWpnVfaI3t4shIZQfZ_wYBmtmW9x0qJ8RYOakw-V3AktYJIUXl3FGvyUNOMDv45X2qgGksCEugtmG5ksCgs5Y5IPVaAt8VeY3JKUUfdJejJnlfXFIWoRwpPA7MjCdWNdGFj-maeMW9d_phk3RU8LgHSC_1vI2YQyITyMEszmbUkCSA7Kv2Q0ldSBaGiArlAndLZYP7daKVOQOIHeA',
  '@g3': 'https://lh3.googleusercontent.com/aida-public/AB6AXuArR3ashizzHw_39rTPZTPeF7QeKNRT_l4E_aZ9x7JiMh94Gt3lpqLaH3cxALhgdZeN4TmOoMZ8ibgeuFk1XcN6rABWCWEAcfTkGlkoLHzazAoq-qSy5kTEGOoj0RDg5tm7enbec07NJ5V6PJtlwniQtUghYiaLKjqvwq0A-dsRwWiGZWuQiqjXzG4ckPJAS_RR-6rQHMRVwXVkWrUakEB1TyL2koXm8IwpQkAHaRDXFRzvEBGpjMFQVQ',
  '@u1': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
  '@u2': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
};

/**
 * Encodes a Creation object into an ultra-compact, short URL payload string.
 */
export function generateShareableUrl(creation: Creation): string {
  try {
    // 1. Map images to aliases if matched
    const compactImgs = creation.images.map((img) => {
      let u = img.url;
      for (const [alias, fullUrl] of Object.entries(IMAGE_ALIASES)) {
        if (fullUrl === u) {
          u = alias;
          break;
        }
      }
      return { u, c: img.caption };
    });

    // 2. Compact key mapping
    const compactObj = {
      i: creation.id,
      r: creation.recipientName,
      c: creation.creatorName,
      d: creation.specialDate,
      l: creation.relationship,
      t: creation.templateId,
      tc: creation.themeColor,
      p: creation.particles,
      m: creation.musicTrack,
      mt: creation.messageTitle,
      mb: creation.messageBody,
      ie: creation.interactiveElement,
      imgs: compactImgs
    };

    const jsonStr = JSON.stringify(compactObj);
    const base64Str = btoa(
      encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );

    const origin = window.location.origin + window.location.pathname;
    return `${origin}?g=${encodeURIComponent(base64Str)}`;
  } catch (e) {
    console.error('Failed to encode short URL:', e);
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?giftId=${creation.id}`;
  }
}

/**
 * Decodes a Creation object from current URL parameters if present.
 * Supports short ?g=..., legacy ?giftData=..., and ?giftId=...
 */
export function parseCreationFromUrl(existingList: Creation[]): Creation | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const shortData = params.get('g');
    const giftData = params.get('giftData') || params.get('c');
    const giftId = params.get('giftId');

    // 1. Try decoding short ?g= payload
    if (shortData) {
      const decodedJson = decodeURIComponent(
        atob(decodeURIComponent(shortData))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const cObj = JSON.parse(decodedJson);

      if (cObj && (cObj.r || cObj.i)) {
        // Expand image aliases back to full URLs
        const expandedImgs = (cObj.imgs || []).map((img: any) => {
          let u = img.u || '';
          if (IMAGE_ALIASES[u]) {
            u = IMAGE_ALIASES[u];
          }
          return { url: u, caption: img.c || '' };
        });

        const creation: Creation = {
          id: cObj.i || `creation-${Date.now()}`,
          recipientName: cObj.r || 'Friend',
          creatorName: cObj.c || 'Someone Special',
          specialDate: cObj.d || new Date().toISOString().split('T')[0],
          relationship: cObj.l || 'Friend',
          templateId: cObj.t || 'birthday',
          themeColor: cObj.tc || 'rose_gold',
          particles: cObj.p || 'confetti',
          musicTrack: cObj.m || 'birthday_instrumental',
          messageTitle: cObj.mt || `Happy Birthday to my Favorite Person! 🎂`,
          messageBody: cObj.mb || `Wishing you a day filled with laughter and endless joy!`,
          interactiveElement: cObj.ie || 'cake',
          images: expandedImgs.length > 0 ? expandedImgs : [
            {
              url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
              caption: 'A wonderful memory'
            }
          ],
          createdAt: new Date().toISOString().split('T')[0],
          views: 1,
          status: 'LIVE',
          replies: []
        };

        return creation;
      }
    }

    // 2. Try decoding legacy full ?giftData= payload
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

    // 3. Try matching giftId in local storage or initial creations
    if (giftId) {
      const found = existingList.find(
        (c) => c.id === giftId || c.id.toLowerCase() === giftId.toLowerCase()
      );
      if (found) return found;

      // Dynamic fallback for any giftId link
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
