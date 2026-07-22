import { Creation } from '../types';

const PRIMARY_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019f8884-e333-7b41-9ab0-dd4db87a8c5d';
const SECONDARY_CLOUD_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019f7ec5a940010f';
const LOCAL_VAULT_KEY = 'memora_global_admin_vault';

/**
 * Robust fetch utility with exponential backoff retries.
 */
async function fetchWithRetry(url: string, options?: RequestInit, retries = 3, delay = 500): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok && retries > 0) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return res;
  } catch (e) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw e;
  }
}

/**
 * Fetches all global creations created by all users from the cloud store & local admin cache.
 */
export async function fetchGlobalCreationsFromCloud(): Promise<Creation[]> {
  let cloudCards: Creation[] = [];

  // 1. Try Primary Unlimited Store (JSONBlob) with retries
  try {
    const res = await fetchWithRetry(PRIMARY_CLOUD_URL, { cache: 'no-cache' }, 3, 500);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.creations)) {
        cloudCards = json.creations;
      }
    }
  } catch (e) {
    console.warn('Primary cloud store warning:', e);
  }

  // 2. If Primary was empty/failed, try Secondary Backup Store
  if (cloudCards.length === 0) {
    try {
      const res2 = await fetchWithRetry(SECONDARY_CLOUD_URL, { cache: 'no-cache' }, 2, 500);
      if (res2.ok) {
        const json2 = await res2.json();
        if (json2 && json2.data && Array.isArray(json2.data.creations)) {
          cloudCards = json2.data.creations;
        }
      }
    } catch (e) {
      console.warn('Secondary cloud store warning:', e);
    }
  }

  // 3. Read local admin vault cache to ensure zero data loss
  let localVault: Creation[] = [];
  try {
    const savedVault = localStorage.getItem(LOCAL_VAULT_KEY) || localStorage.getItem('wishora_global_admin_vault') || localStorage.getItem('myheartcraft_global_admin_vault');
    if (savedVault) {
      localVault = JSON.parse(savedVault);
    }
  } catch (e) {}

  // 4. Merge cloud cards and local vault cards (cloud cards take priority)
  const mergedMap = new Map<string, Creation>();
  localVault.forEach(c => {
    if (c && c.id) mergedMap.set(c.id, c);
  });
  
  cloudCards.forEach(c => {
    if (c && c.id && c.recipientName) {
      const existing = mergedMap.get(c.id);
      const views = Math.max(c.views || 0, existing?.views || 0);
      const replies = (c.replies?.length || 0) >= (existing?.replies?.length || 0) ? (c.replies || []) : (existing?.replies || []);
      mergedMap.set(c.id, { ...existing, ...c, views, replies });
    }
  });

  const finalCards = Array.from(mergedMap.values());
  if (finalCards.length > 0) {
    localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(finalCards));
  }

  return finalCards;
}

/**
 * Syncs a single new or updated Creation (with recipient views & replies) to global cloud store.
 */
export async function syncCreationToCloud(creation: Creation): Promise<void> {
  if (!creation || !creation.id) return;

  try {
    // 1. Update local admin vault immediately
    let currentVault: Creation[] = [];
    try {
      const savedVault = localStorage.getItem(LOCAL_VAULT_KEY);
      if (savedVault) currentVault = JSON.parse(savedVault);
    } catch (e) {}

    const vIdx = currentVault.findIndex(c => c.id === creation.id);
    if (vIdx >= 0) {
      currentVault[vIdx] = creation;
    } else {
      currentVault = [creation, ...currentVault];
    }
    localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(currentVault));

    // 2. Fetch latest cloud cards and merge
    const currentCloudCards = await fetchGlobalCreationsFromCloud();
    const existsIndex = currentCloudCards.findIndex(c => c.id === creation.id);
    let updatedList: Creation[];
    if (existsIndex >= 0) {
      updatedList = [...currentCloudCards];
      updatedList[existsIndex] = creation;
    } else {
      updatedList = [creation, ...currentCloudCards];
    }

    // 3. Push to Primary Unlimited Cloud Database with retries
    await fetchWithRetry(PRIMARY_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Memora Cloud Store',
        creations: updatedList
      })
    }, 3, 500);
  } catch (e) {
    console.warn('Cloud sync error:', e);
  }
}

/**
 * Syncs an entire list of creations to the global cloud store.
 */
export async function syncAllCreationsToCloud(creations: Creation[]): Promise<void> {
  try {
    localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(creations));
    await fetchWithRetry(PRIMARY_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Memora Cloud Store',
        creations
      })
    }, 3, 500);
  } catch (e) {
    console.warn('Sync all creations error:', e);
  }
}
