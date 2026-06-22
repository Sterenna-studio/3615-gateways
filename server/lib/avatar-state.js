import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const fallbackAvatarState = {
  version: 0,
  updatedAt: null,
  avatar: {
    name: 'LEMEGETON',
    status: 'fallback',
    mode: 'idle',
    mood: 'neutral',
    eyes: 'open',
    mouth: 'closed',
    intensity: 0,
    renderer: 'fallback',
  },
  expressions: [],
  pipeline: ['Avatar state indisponible.'],
};

export function loadAvatarState() {
  try {
    return normalizeAvatarState(require('../../data/avatar-state.json'));
  } catch (error) {
    console.warn(`[avatar-state] fallback used: ${error.message}`);
    return fallbackAvatarState;
  }
}

export function normalizeAvatarState(state) {
  return {
    version: toSafeNumber(state?.version, fallbackAvatarState.version),
    updatedAt: toSafeString(state?.updatedAt, fallbackAvatarState.updatedAt),
    avatar: {
      name: toSafeString(state?.avatar?.name, fallbackAvatarState.avatar.name),
      status: toSafeString(state?.avatar?.status, fallbackAvatarState.avatar.status),
      mode: toSafeString(state?.avatar?.mode, fallbackAvatarState.avatar.mode),
      mood: toSafeString(state?.avatar?.mood, fallbackAvatarState.avatar.mood),
      eyes: toSafeString(state?.avatar?.eyes, fallbackAvatarState.avatar.eyes),
      mouth: toSafeString(state?.avatar?.mouth, fallbackAvatarState.avatar.mouth),
      intensity: clampNumber(state?.avatar?.intensity, 0, 1, fallbackAvatarState.avatar.intensity),
      renderer: toSafeString(state?.avatar?.renderer, fallbackAvatarState.avatar.renderer),
    },
    expressions: Array.isArray(state?.expressions)
      ? state.expressions.slice(0, 12).map(normalizeExpression)
      : fallbackAvatarState.expressions,
    pipeline: Array.isArray(state?.pipeline)
      ? state.pipeline.slice(0, 12).map((step) => toSafeString(step, '', 120)).filter(Boolean)
      : fallbackAvatarState.pipeline,
  };
}

function normalizeExpression(expression) {
  return {
    id: toSafeString(expression?.id, 'expression'),
    label: toSafeString(expression?.label, 'Expression'),
    eyes: toSafeString(expression?.eyes, 'open'),
    mouth: toSafeString(expression?.mouth, 'closed'),
    note: toSafeString(expression?.note, '', 120),
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

function clampNumber(value, min, max, fallback = 0) {
  const number = toSafeNumber(value, fallback);
  return Math.min(max, Math.max(min, number));
}
