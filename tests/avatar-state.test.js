import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeAvatarState } from '../server/lib/avatar-state.js';

test('normalizes avatar state values', () => {
  const state = normalizeAvatarState({
    version: '3',
    updatedAt: '2026-06-22T00:00:00Z',
    avatar: {
      name: 'LEM\nEGE\tTON',
      status: 'prototype',
      mode: 'speaking',
      mood: 'glitch',
      eyes: 'offset',
      mouth: 'wide',
      intensity: 2,
      renderer: 'text-vdt-mvp',
    },
    expressions: [
      { id: 'glitch', label: 'Glitch\nMode', eyes: 'offset', mouth: 'wide', note: 'A'.repeat(500) },
    ],
    pipeline: ['State\nJSON'],
  });

  assert.equal(state.version, 3);
  assert.equal(state.avatar.name, 'LEM EGE TON');
  assert.equal(state.avatar.intensity, 1);
  assert.equal(state.expressions[0].label, 'Glitch Mode');
  assert.equal(state.expressions[0].note.length, 120);
  assert.equal(state.pipeline[0], 'State JSON');
});

test('falls back when avatar state is missing fields', () => {
  const state = normalizeAvatarState({});

  assert.equal(state.avatar.name, 'LEMEGETON');
  assert.equal(state.avatar.mode, 'idle');
  assert.equal(state.avatar.mouth, 'closed');
  assert.deepEqual(state.expressions, []);
});
