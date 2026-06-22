import assert from 'node:assert/strict';
import test from 'node:test';
import { createSession, normalizeChoice, routeTerminalInput } from '../server/lib/router.js';

const config = {
  name: '3615 GATEWAYS',
  node: 'TEST',
  publicOrigin: 'http://localhost:8080',
  wsPath: '/minitel/ws',
  telnetPort: 3615,
};

const feed = {
  version: 1,
  updatedAt: '2026-06-22T00:00:00Z',
  network: {
    name: 'Gwen Ha Star',
    domain: 'nitro.sterenna.fr',
    status: 'experimental',
    summary: 'Test feed',
  },
  agent: {
    displayName: 'MutenRock',
    rank: 'Agent des Chronicles',
    crew: 'BZH Chronicles',
    status: 'test',
    visibility: 'demo',
  },
  apps: [],
  signals: [],
  links: {},
};

const avatarState = {
  version: 1,
  updatedAt: '2026-06-22T00:00:00Z',
  avatar: {
    name: 'LEMEGETON',
    status: 'prototype',
    mode: 'idle',
    mood: 'neutral',
    eyes: 'open',
    mouth: 'closed',
    intensity: 0.2,
    renderer: 'text-vdt-mvp',
  },
  expressions: [],
  pipeline: [],
};

test('normalizes Gwen contextual choices', () => {
  const session = createSession();
  session.section = 'gwen';

  assert.equal(normalizeChoice('1', session), '71');
  assert.equal(normalizeChoice('2', session), '72');
  assert.equal(normalizeChoice('3', session), '73');
  assert.equal(normalizeChoice('4', session), '74');
});

test('normalizes Avatar contextual choices', () => {
  const session = createSession();
  session.section = 'avatar';

  assert.equal(normalizeChoice('1', session), '81');
  assert.equal(normalizeChoice('2', session), '82');
  assert.equal(normalizeChoice('3', session), '83');
  assert.equal(normalizeChoice('4', session), '84');
});

test('routes to Gwen Ha Star and keeps session section', () => {
  const session = createSession();

  const home = routeTerminalInput('7', { config, feed, avatarState, session });
  assert.equal(home.choice, '7');
  assert.equal(home.section, 'gwen');
  assert.match(home.screen, /GWEN HA STAR/);

  const agent = routeTerminalInput('1', { config, feed, avatarState, session });
  assert.equal(agent.choice, '71');
  assert.equal(agent.section, 'gwen');
  assert.match(agent.screen, /CARTE AGENT/);
  assert.match(agent.screen, /MutenRock/);
});

test('routes to Avatar and keeps session section', () => {
  const session = createSession();

  const home = routeTerminalInput('8', { config, feed, avatarState, session });
  assert.equal(home.choice, '8');
  assert.equal(home.section, 'avatar');
  assert.match(home.screen, /AVATAR \/ LEMEGETON/);

  const state = routeTerminalInput('1', { config, feed, avatarState, session });
  assert.equal(state.choice, '81');
  assert.equal(state.section, 'avatar');
  assert.match(state.screen, /ETAT AVATAR/);
  assert.match(state.screen, /LEMEGETON/);
});

test('global menu command returns to main section', () => {
  const session = createSession();
  session.section = 'gwen';

  const result = routeTerminalInput('menu', { config, feed, avatarState, session });
  assert.equal(result.section, 'main');
  assert.match(result.screen, /MESSAGE DU SERVEUR/);
});

test('system info includes runtime stats', () => {
  const session = createSession();
  const result = routeTerminalInput('6', {
    config,
    feed,
    avatarState,
    stats: { wsClients: 2, telnetClients: 1 },
    session,
  });

  assert.match(result.screen, /CLIENTS WS  : 2/);
  assert.match(result.screen, /CLIENTS TEL : 1/);
  assert.match(result.screen, /NITRO FEED  : v1/);
  assert.match(result.screen, /AVATAR      : v1/);
});
