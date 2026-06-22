import { frame, renderHeader } from './minitel.js';

export function renderGwenHaStarHome(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    'GWEN HA STAR / NITRO',
    '',
    'Version Minitel adaptee du portail',
    'Gwen Ha Star. Ici, on ne charge pas le',
    'site web moderne: on le traduit en pages',
    'courtes, lisibles et navigables.',
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

export function renderGwenHaStarAgent(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    'CARTE AGENT / CIG',
    '',
    'Acces futur a une version texte de la',
    'Carte d Identification Galactique.',
    '',
    'Objectif:',
    '- pseudo agent',
    '- rang Nitro',
    '- crew / faction',
    '- statut de synchronisation',
    '',
    'Note: aucune session Supabase n est lue',
    'pour le moment depuis le Minitel.',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}

export function renderGwenHaStarCockpit(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    'STAR COCKPIT',
    '',
    'Adaptation texte du cockpit /star/.',
    '',
    'Modules candidats:',
    '- statut agent',
    '- notifications Nitro',
    '- raccourcis projets',
    '- messages du reseau',
    '- acces aux apps compatibles',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}

export function renderGwenHaStarApps(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    'APPS NITRO',
    '',
    'Selection d applications pouvant avoir',
    'une facade texte Minitel:',
    '',
    '- BZH Chronicles',
    '- TCG / Power Your Hand',
    '- Jukebox / Chronicles FM',
    '- Botanica',
    '- Goetia / demons mapping',
    '',
    'Chaque app doit fournir un resume court',
    'ou un endpoint adapte au terminal.',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}

export function renderGwenHaStarSignal(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    'SIGNAL DU RESEAU',
    '',
    'Nitro n est pas seulement un site:',
    'c est une couche d identite pour les',
    'projets Sterenna et les Chronicles.',
    '',
    'Version Minitel:',
    '- pas de CSS',
    '- pas de SPA moderne',
    '- juste des ecrans courts',
    '- navigation au clavier',
    '- donnees choisies et securisees',
    '',
    'Tape 7 pour revenir au portail Gwen.',
  ]);
}
