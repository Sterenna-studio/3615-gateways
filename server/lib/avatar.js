import { frame, renderHeader } from './minitel.js';

export function renderAvatarHome(config = {}, state = {}) {
  const avatar = state.avatar || {};

  return frame([
    ...renderHeader(config),
    '',
    'AVATAR / LEMEGETON',
    '',
    line(`NOM    : ${avatar.name || 'LEMEGETON'}`),
    line(`STATUT : ${avatar.status || 'prototype'}`),
    line(`MODE   : ${avatar.mode || 'idle'}`),
    line(`MOOD   : ${avatar.mood || 'neutral'}`),
    '',
    '  [81] ETAT AVATAR',
    '  [82] EXPRESSIONS',
    '  [83] PIPELINE VDT',
    '  [84] TEST YEUX/BOUCHE',
    '',
    '  [0] RETOUR ACCUEIL',
    '',
    'CHOIX > ',
  ]);
}

export function renderAvatarState(config = {}, state = {}) {
  const avatar = state.avatar || {};

  return frame([
    ...renderHeader(config),
    '',
    'ETAT AVATAR',
    '',
    line(`NOM       : ${avatar.name || 'LEMEGETON'}`),
    line(`MODE      : ${avatar.mode || 'idle'}`),
    line(`HUMEUR    : ${avatar.mood || 'neutral'}`),
    line(`YEUX      : ${avatar.eyes || 'open'}`),
    line(`BOUCHE    : ${avatar.mouth || 'closed'}`),
    line(`INTENSITE : ${avatar.intensity ?? 0}`),
    line(`RENDERER  : ${avatar.renderer || 'text'}`),
    '',
    `FEED      : v${state.version ?? 'n/a'}`,
    line(`MAJ       : ${state.updatedAt || 'inconnue'}`),
    '',
    'Tape 8 pour revenir a Avatar.',
  ]);
}

export function renderAvatarExpressions(config = {}, state = {}) {
  const expressions = Array.isArray(state.expressions) ? state.expressions : [];
  const lines = expressions.length
    ? expressions.flatMap((expression, index) => [
        line(`${index + 1}. ${expression.label || expression.id}`),
        line(`   yeux:${expression.eyes} bouche:${expression.mouth}`),
      ])
    : ['Aucune expression declaree.'];

  return frame([
    ...renderHeader(config),
    '',
    'EXPRESSIONS AVATAR',
    '',
    ...lines.slice(0, 14),
    '',
    'Tape 8 pour revenir a Avatar.',
  ]);
}

export function renderAvatarPipeline(config = {}, state = {}) {
  const pipeline = Array.isArray(state.pipeline) ? state.pipeline : [];
  const lines = pipeline.length
    ? pipeline.flatMap((step, index) => wrap(`${index + 1}. ${step}`, 40))
    : ['Pipeline non declare.'];

  return frame([
    ...renderHeader(config),
    '',
    'PIPELINE VDT',
    '',
    ...lines.slice(0, 14),
    '',
    'Principe: modifier les zones utiles',
    'plutot que redessiner tout l ecran.',
    '',
    'Tape 8 pour revenir a Avatar.',
  ]);
}

export function renderAvatarMouthEyesTest(config = {}, state = {}) {
  const avatar = state.avatar || {};

  return frame([
    ...renderHeader(config),
    '',
    'TEST YEUX / BOUCHE',
    '',
    '        .----------------.',
    `        |  ${eyeGlyph(avatar.eyes)}        ${eyeGlyph(avatar.eyes)}  |`,
    '        |                |',
    `        |      ${mouthGlyph(avatar.mouth)}       |`,
    '        `----------------\'',
    '',
    line(`YEUX   : ${avatar.eyes || 'open'}`),
    line(`BOUCHE : ${avatar.mouth || 'closed'}`),
    '',
    'MVP texte. Les vraies mosaiques VDT',
    'arriveront apres test sur materiel.',
    '',
    'Tape 8 pour revenir a Avatar.',
  ]);
}

function eyeGlyph(eyes) {
  switch (eyes) {
    case 'closed': return '--';
    case 'focused': return '><';
    case 'up': return '^^';
    case 'offset': return 'oO';
    default: return 'oo';
  }
}

function mouthGlyph(mouth) {
  switch (mouth) {
    case 'small': return '.--.';
    case 'medium': return '.==.';
    case 'wide': return '.OO.';
    case 'smile': return '\__/';
    case 'flat': return '----';
    default: return '....';
  }
}

function line(value, width = 40) {
  return String(value).slice(0, width);
}

function wrap(value, width = 40) {
  const words = String(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    if (!current) current = word;
    else if (`${current} ${word}`.length <= width) current += ` ${word}`;
    else {
      lines.push(current.slice(0, width));
      current = word;
    }
  }

  if (current) lines.push(current.slice(0, width));
  return lines.length ? lines : [''];
}
