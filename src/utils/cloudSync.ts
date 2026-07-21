import { Creation, INITIAL_CREATIONS } from '../types';

const CLOUD_OBJECT_ID = 'ff8081819f7e10ae019f7ec5a940010f';
const API_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;
const LOCAL_VAULT_KEY = 'myheartcraft_global_admin_vault';

/**
 * Fetches all global creations created by all users from the cloud store & local admin cache.
 */
export async function fetchGlobalCreationsFromCloud(): Promise<Creation[]> {
  let cloudCards: Creation[] = [];

  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.creations)) {
        cloudCards = json.data.creations;
      }
    }
  } catch (e) {
    console.warn('Cloud fetch warning:', e);
  }

  // Read local admin vault cache to ensure zero data loss
  let localVault: Creation[] = [];
  try {
    const savedVault = localStorage.getItem(LOCAL_VAULT_KEY);
    if (savedVault) {
      localVault = JSON.parse(savedVault);
    }
  } catch (e) {}

  // Merge cloud cards and local vault cards (cloud cards take priority)
  const mergedMap = new Map<string, Creation>();
  localVault.forEach(c => mergedMap.set(c.id, c));
  cloudCards.forEach(c => {
    if (c.id && c.recipientName) {
      const existing = mergedMap.get(c.id);
      // Keep highest views and longest replies list
      const views = Math.max(c.views || 0, existing?.views || 0);
      const replies = (c.replies?.length || 0) >= (existing?.replies?.length || 0) ? (c.replies || []) : (existing?.replies || []);
      mergedMap.set(c.id, { ...c, views, replies });
    }
  });

  const finalCards = Array.from(mergedMap.values());
  if (finalCards.length > 0) {
    localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(finalCards));
  }

  return finalCards.length > 0 ? finalCards : INITIAL_CREATIONS;
}

/**
 * Syncs a single new or updated Creation (with recipient views & replies) to global cloud store.
 */
export async function syncCreationToCloud(creation: Creation): Promise<void> {
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

    // 3. Push to cloud database
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MyHeartCraft Cloud Store',
        data: { creations: updatedList }
      })
    });
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
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MyHeartCraft Cloud Store',
        data: { creations }
      })
    });
  } catch (e) {
    console.warn('Sync all creations error:', e);
  }
}
