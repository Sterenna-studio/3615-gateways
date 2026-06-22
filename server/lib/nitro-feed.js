import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const fallbackFeed = {
  version: 0,
  updatedAt: null,
  network: {
    name: 'Gwen Ha Star',
    domain: 'nitro.sterenna.fr',
    status: 'fallback',
    summary: 'Nitro feed indisponible. Mode secours actif.',
  },
  agent: {
    displayName: 'Agent inconnu',
    rank: 'Non synchronise',
    crew: 'Aucun crew',
    status: 'offline',
    visibility: 'fallback',
  },
  apps: [],
  signals: ['Feed Nitro indisponible.'],
  links: {},
};

export function loadNitroFeed() {
  try {
    return require('../../data/nitro-feed.json');
  } catch (error) {
    console.warn(`[nitro-feed] fallback used: ${error.message}`);
    return fallbackFeed;
  }
}
