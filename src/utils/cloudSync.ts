import { Creation } from '../types';

const PRIMARY_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019f8309-7738-7b6a-b7ba-e534f314f687';
const SECONDARY_CLOUD_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019f7ec5a940010f';
const LOCAL_VAULT_KEY = 'myheartcraft_global_admin_vault';

/**
 * Fetches all global creations created by all users from the cloud store & local admin cache.
 */
export async function fetchGlobalCreationsFromCloud(): Promise<Creation[]> {
  let cloudCards: Creation[] = [];

  // 1. Try Primary Unlimited Store (JSONBlob)
  try {
    const res = await fetch(PRIMARY_CLOUD_URL, { cache: 'no-cache' });
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
      const res2 = await fetch(SECONDARY_CLOUD_URL, { cache: 'no-cache' });
      if (res2.ok) {
        const json2 = await res2.json();
        if (json2 && json2.data && Array.isArray(json2.data.creations)) {
          cloudCards = json2.data.creations;
        }
      }
    } catch (e) {}
  }

  // 3. Read local admin vault cache to ensure zero data loss
  let localVault: Creation[] = [];
  try {
    const savedVault = localStorage.getItem(LOCAL_VAULT_KEY);
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

    // 3. Push to Primary Unlimited Cloud Database
    await fetch(PRIMARY_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MyHeartCraft Cloud Store',
        creations: updatedList
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
    await fetch(PRIMARY_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MyHeartCraft Cloud Store',
        creations
      })
    });
  } catch (e) {
    console.warn('Sync all creations error:', e);
  }
}
