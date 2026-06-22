import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const fallbackFeed = {
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
    const feed = require('../../data/nitro-feed.json');
    return normalizeNitroFeed(feed);
  } catch (error) {
    console.warn(`[nitro-feed] fallback used: ${error.message}`);
    return fallbackFeed;
  }
}

export function validateNitroFeed(feed) {
  const errors = [];

  if (!feed || typeof feed !== 'object') errors.push('feed must be an object');
  if (!feed?.network || typeof feed.network !== 'object') errors.push('network must be an object');
  if (!feed?.agent || typeof feed.agent !== 'object') errors.push('agent must be an object');
  if (!Array.isArray(feed?.apps)) errors.push('apps must be an array');
  if (!Array.isArray(feed?.signals)) errors.push('signals must be an array');
  if (!feed?.links || typeof feed.links !== 'object') errors.push('links must be an object');

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function normalizeNitroFeed(feed) {
  const validation = validateNitroFeed(feed);
  if (!validation.ok) {
    console.warn(`[nitro-feed] invalid feed: ${validation.errors.join(', ')}`);
  }

  return {
    version: toSafeNumber(feed?.version, fallbackFeed.version),
    updatedAt: toSafeString(feed?.updatedAt, fallbackFeed.updatedAt),
    network: {
      name: toSafeString(feed?.network?.name, fallbackFeed.network.name),
      domain: toSafeString(feed?.network?.domain, fallbackFeed.network.domain),
      status: toSafeString(feed?.network?.status, fallbackFeed.network.status),
      summary: toSafeString(feed?.network?.summary, fallbackFeed.network.summary, 240),
    },
    agent: {
      displayName: toSafeString(feed?.agent?.displayName, fallbackFeed.agent.displayName),
      rank: toSafeString(feed?.agent?.rank, fallbackFeed.agent.rank),
      crew: toSafeString(feed?.agent?.crew, fallbackFeed.agent.crew),
      status: toSafeString(feed?.agent?.status, fallbackFeed.agent.status),
      visibility: toSafeString(feed?.agent?.visibility, fallbackFeed.agent.visibility),
    },
    apps: Array.isArray(feed?.apps) ? feed.apps.slice(0, 12).map(normalizeApp) : [],
    signals: Array.isArray(feed?.signals)
      ? feed.signals.slice(0, 12).map((signal) => toSafeString(signal, '', 120)).filter(Boolean)
      : fallbackFeed.signals,
    links: {
      publicPage: toSafeString(feed?.links?.publicPage, ''),
      websocket: toSafeString(feed?.links?.websocket, ''),
      telnet: toSafeString(feed?.links?.telnet, ''),
    },
  };
}

function normalizeApp(app) {
  return {
    id: toSafeString(app?.id, 'app'),
    name: toSafeString(app?.name, 'App Nitro'),
    status: toSafeString(app?.status, 'unknown'),
    terminalLabel: toSafeString(app?.terminalLabel, 'terminal'),
  };
}

function toSafeString(value, fallback = '', maxLength = 80) {
  if (value === null || value === undefined) return fallback;
  return String(value)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function toSafeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
