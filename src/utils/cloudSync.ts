import { Creation, INITIAL_CREATIONS } from '../types';

const CLOUD_OBJECT_ID = 'ff8081819f7e10ae019f7ec5a940010f';
const API_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

/**
 * Fetches all global creations created by all users from the cloud store.
 */
export async function fetchGlobalCreationsFromCloud(): Promise<Creation[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return [];
    const json = await res.json();
    if (json && json.data && Array.isArray(json.data.creations)) {
      return json.data.creations;
    }
  } catch (e) {
    console.warn('Could not fetch global creations from cloud:', e);
  }
  return [];
}

/**
 * Syncs a single new or updated Creation to the global cloud store.
 */
export async function syncCreationToCloud(creation: Creation): Promise<void> {
  try {
    // 1. Fetch current cloud cards
    const currentCloudCards = await fetchGlobalCreationsFromCloud();

    // 2. Merge current creation
    const existsIndex = currentCloudCards.findIndex(c => c.id === creation.id);
    let updatedList: Creation[];
    if (existsIndex >= 0) {
      updatedList = [...currentCloudCards];
      updatedList[existsIndex] = creation;
    } else {
      updatedList = [creation, ...currentCloudCards];
    }

    // 3. Push back to cloud
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MyHeartCraft Cloud Store',
        data: { creations: updatedList }
      })
    });
  } catch (e) {
    console.warn('Could not sync creation to cloud:', e);
  }
}

/**
 * Syncs an entire list of creations to the global cloud store.
 */
export async function syncAllCreationsToCloud(creations: Creation[]): Promise<void> {
  try {
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MyHeartCraft Cloud Store',
        data: { creations }
      })
    });
  } catch (e) {
    console.warn('Could not sync creations list to cloud:', e);
  }
}
