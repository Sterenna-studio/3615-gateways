import { frame, renderHeader } from './minitel.js';

export function renderGwenHaStarHome(config = {}, feed = {}) {
  const network = feed.network || {};

  return frame([
    ...renderHeader(config),
    '',
    'GWEN HA STAR / NITRO',
    '',
    line(`RESEAU : ${network.name || 'Gwen Ha Star'}`),
    line(`DOMAINE: ${network.domain || 'nitro.sterenna.fr'}`),
    line(`STATUT : ${network.status || 'experimental'}`),
    '',
    ...wrap(network.summary || 'Version Minitel adaptee du portail Gwen Ha Star.', 40),
    '',
    '  [71] CARTE AGENT / CIG',
    '  [72] STAR COCKPIT',
    '  [73] APPS NITRO',
    '  [74] SIGNAL DU RESEAU',
    '',
    '  [0] RETOUR ACCUEIL',
    '',
    'CHOIX > ',
  ]);
}

export function renderGwenHaStarAgent(config = {}, feed = {}) {
  const agent = feed.agent || {};

  return frame([
    ...renderHeader(config),
    '',
    'CARTE AGENT / CIG',
    '',
    line(`NOM  : ${agent.displayName || 'Agent inconnu'}`),
    line(`RANG : ${agent.rank || 'Non synchronise'}`),
    line(`CREW : ${agent.crew || 'Aucun crew'}`),
    line(`ETAT : ${agent.status || 'offline'}`),
    '',
    'VISIBILITE',
    line(agent.visibility || 'demo'),
    '',
    'Note: aucune session Supabase privee',
    'n est lue depuis le Minitel en MVP.',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}

export function renderGwenHaStarCockpit(config = {}, feed = {}) {
  const links = feed.links || {};

  return frame([
    ...renderHeader(config),
    '',
    'STAR COCKPIT',
    '',
    'Adaptation texte du cockpit /star/.',
    '',
    'POINTS D ACCES',
    line(`WEB : ${links.publicPage || 'nitro/minitel'}`),
    line(`WS  : ${links.websocket || 'local ws'}`),
    line(`TEL : ${links.telnet || 'local 3615'}`),
    '',
    'Modules futurs:',
    '- notifications Nitro',
    '- raccourcis projets',
    '- messages du reseau',
    '- apps compatibles',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}

export function renderGwenHaStarApps(config = {}, feed = {}) {
  const apps = Array.isArray(feed.apps) ? feed.apps : [];
  const appLines = apps.length
    ? apps.flatMap((app, index) => [
        line(`${index + 1}. ${app.name || app.id || 'App Nitro'}`),
        line(`   ${app.status || 'unknown'} / ${app.terminalLabel || 'terminal'}`),
      ])
    : ['Aucune app Nitro declaree.'];

  return frame([
    ...renderHeader(config),
    '',
    'APPS NITRO',
    '',
    ...appLines.slice(0, 12),
    '',
    'Chaque app doit fournir un resume court',
    'ou un endpoint adapte au terminal.',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}

export function renderGwenHaStarSignal(config = {}, feed = {}) {
  const signals = Array.isArray(feed.signals) ? feed.signals : [];

  return frame([
    ...renderHeader(config),
    '',
    'SIGNAL DU RESEAU',
    '',
    `FEED VERSION : ${feed.version ?? 'n/a'}`,
    `MAJ          : ${feed.updatedAt || 'inconnue'}`,
    '',
    ...(signals.length ? signals.flatMap((signal) => wrap(`- ${signal}`, 40)) : ['- Aucun signal.']),
    '',
    'Version Minitel:',
    '- pas de CSS',
    '- pas de SPA moderne',
    '- donnees choisies et securisees',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}

function line(value, width = 40) {
  return String(value).slice(0, width);
}

function wrap(value, width = 40) {
  const words = String(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if (`${current} ${word}`.length <= width) {
      current += ` ${word}`;
    } else {
      lines.push(current.slice(0, width));
      current = word;
    }
  }

  if (current) lines.push(current.slice(0, width));
  return lines.length ? lines : [''];
}
