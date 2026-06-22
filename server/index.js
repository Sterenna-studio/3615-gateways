import 'dotenv/config';
import express from 'express';
import http from 'node:http';
import net from 'node:net';
import { WebSocketServer } from 'ws';
import { clearScreen, renderMainMenu } from './lib/minitel.js';
import { loadNitroFeed } from './lib/nitro-feed.js';
import { createSession, routeTerminalInput } from './lib/router.js';

const config = {
  httpHost: process.env.HTTP_HOST || '0.0.0.0',
  httpPort: Number(process.env.HTTP_PORT || 8080),
  telnetHost: process.env.TELNET_HOST || '0.0.0.0',
  telnetPort: Number(process.env.TELNET_PORT || 3615),
  wsPath: process.env.WS_PATH || '/minitel/ws',
  publicOrigin: process.env.PUBLIC_ORIGIN || 'http://localhost:8080',
  token: process.env.GATEWAY_TOKEN || '',
  name: process.env.GATEWAY_NAME || '3615 GATEWAYS',
  node: process.env.GATEWAY_NODE || 'ZYRA',
};

const nitroFeed = loadNitroFeed();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
const wsClients = new Set();
const telnetClients = new Set();

app.disable('x-powered-by');

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: config.name,
    node: config.node,
    publicOrigin: config.publicOrigin,
    websocket: config.wsPath,
    telnetPort: config.telnetPort,
    nitroFeedVersion: nitroFeed.version,
    ...getRuntimeStats(),
  });
});

app.get('/minitel/status', (_req, res) => {
  res.json({
    ok: true,
    gateway: config.name,
    node: config.node,
    mode: 'mvp',
    transports: ['telnet', 'websocket', 'http'],
    nitroFeedVersion: nitroFeed.version,
    ...getRuntimeStats(),
  });
});

app.get('/minitel/nitro-feed', (_req, res) => {
  res.json({
    ok: true,
    feed: nitroFeed,
  });
});

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (url.pathname !== config.wsPath) {
    socket.destroy();
    return;
  }

  if (config.token && url.searchParams.get('token') !== config.token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws, request) => {
  const session = createSession();
  wsClients.add(ws);
  const remote = request.socket.remoteAddress || 'unknown';
  console.log(`[ws] connected ${remote}`);

  ws.send(JSON.stringify({
    type: 'welcome',
    service: config.name,
    node: config.node,
    menu: renderMainMenu(config),
    session,
    nitroFeedVersion: nitroFeed.version,
  }));

  ws.on('message', (payload) => {
    const message = payload.toString().trim();
    console.log(`[ws] ${remote}: ${message}`);

    const result = routeTerminalInput(message, {
      config,
      feed: nitroFeed,
      stats: getRuntimeStats(),
      session,
    });

    ws.send(JSON.stringify({
      type: 'screen',
      received: message,
      choice: result.choice,
      section: result.section,
      response: result.screen,
    }));
  });

  ws.on('close', () => {
    wsClients.delete(ws);
    console.log(`[ws] disconnected ${remote}`);
  });
});

const telnetServer = net.createServer((socket) => {
  const session = createSession();
  telnetClients.add(socket);
  socket.setEncoding('utf8');
  socket.write(clearScreen());
  socket.write(renderMainMenu(config));

  const remote = `${socket.remoteAddress || 'unknown'}:${socket.remotePort || '?'}`;
  console.log(`[telnet] connected ${remote}`);

  socket.on('data', (data) => {
    const input = data.toString().replace(/[\r\n]/g, '').trim();

    const result = routeTerminalInput(input, {
      config,
      feed: nitroFeed,
      stats: getRuntimeStats(),
      session,
    });

    socket.write(clearScreen());
    socket.write(result.screen);
  });

  socket.on('close', () => {
    telnetClients.delete(socket);
    console.log(`[telnet] disconnected ${remote}`);
  });
  socket.on('error', (err) => console.warn(`[telnet] ${remote} error: ${err.message}`));
});

function getRuntimeStats() {
  return {
    wsClients: wsClients.size,
    telnetClients: telnetClients.size,
  };
}

server.listen(config.httpPort, config.httpHost, () => {
  console.log(`[http] ${config.name} listening on http://${config.httpHost}:${config.httpPort}`);
  console.log(`[ws] path ${config.wsPath}`);
  console.log(`[nitro-feed] version ${nitroFeed.version ?? 'n/a'}`);
});

telnetServer.listen(config.telnetPort, config.telnetHost, () => {
  console.log(`[telnet] listening on ${config.telnetHost}:${config.telnetPort}`);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('\n[system] shutting down 3615 Gateways');
  for (const ws of wsClients) ws.close();
  for (const socket of telnetClients) socket.destroy();
  telnetServer.close();
  server.close(() => process.exit(0));
}
