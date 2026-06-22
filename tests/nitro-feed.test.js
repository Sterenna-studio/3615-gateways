import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeNitroFeed, validateNitroFeed } from '../server/lib/nitro-feed.js';

test('validates expected Nitro feed shape', () => {
  const feed = {
    network: {},
    agent: {},
    apps: [],
    signals: [],
    links: {},
  };

  const result = validateNitroFeed(feed);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('reports invalid Nitro feed shape', () => {
  const result = validateNitroFeed({ network: {}, apps: 'bad' });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(' | '), /agent must be an object/);
  assert.match(result.errors.join(' | '), /apps must be an array/);
});

test('normalizes unsafe or missing feed values', () => {
  const feed = normalizeNitroFeed({
    version: '2',
    network: {
      name: 'Gwen\nHa\tStar',
      domain: 'nitro.sterenna.fr',
      status: 'experimental',
      summary: 'A'.repeat(500),
    },
    agent: {},
    apps: [
      { name: 'TCG\nPower', status: 'draft', terminalLabel: 'cards' },
    ],
    signals: ['Signal\nclean'],
    links: {},
  });

  assert.equal(feed.version, 2);
  assert.equal(feed.network.name, 'Gwen Ha Star');
  assert.equal(feed.network.summary.length, 240);
  assert.equal(feed.apps[0].name, 'TCG Power');
  assert.equal(feed.signals[0], 'Signal clean');
});
