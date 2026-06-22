const CRLF = '\r\n';

export function clearScreen() {
  // Plain ANSI clear is useful for modern telnet clients.
  // Real Minitel-specific Videotex sequences will be added after hardware tests.
  return '\x1b[2J\x1b[H';
}

export function frame(lines = []) {
  return `${lines.join(CRLF)}${CRLF}`;
}

export function renderHeader({ name = '3615 GATEWAYS', node = 'ZYRA' } = {}) {
  return [
    '========================================',
    center(name, 40),
    center(`NODE: ${node}`, 40),
    '========================================',
  ];
}

export function renderMainMenu(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    '  [1] MESSAGE DU SERVEUR',
    '  [2] BZH CHRONICLES',
    '  [3] BBS / RETRO SERVICES',
    '  [4] ARCADE',
    '  [5] TERMINAL TEST',
    '  [6] INFOS SYSTEME',
    '  [7] GWEN HA STAR / NITRO',
    '  [8] AVATAR / LEMEGETON',
    '',
    '  [?] AIDE',
    '  [0] ACCUEIL / RAFRAICHIR',
    '',
    'CHOIX > ',
  ]);
}

export function renderHelp(config = {}, section = 'main') {
  const context = section === 'gwen'
    ? 'Dans Gwen: 1,2,3,4 = 71,72,73,74'
    : section === 'avatar'
      ? 'Dans Avatar: 1,2,3,4 = 81,82,83,84'
      : 'Depuis accueil: tape un numero.';

  return frame([
    ...renderHeader(config),
    '',
    'AIDE TERMINAL',
    '',
    'Commandes globales:',
    '  0 ou MENU : accueil principal',
    '  ? ou AIDE : cette page',
    '  ENTREE    : retour contextuel',
    '',
    context,
    '',
    'Le serveur ne lance aucune commande',
    'systeme depuis le Minitel.',
    '',
    'Tape 0 pour revenir a l accueil.',
  ]);
}

export function renderServerMessage(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    'MESSAGE DU SERVEUR',
    '',
    'Bienvenue sur 3615 Gateways.',
    'Le portail Minitel de Sterenna est en',
    'cours de synchronisation avec Zyra.',
    '',
    'Objectif MVP:',
    '- connexion ESP32 stable',
    '- menu Minitel navigable',
    '- passerelle Telnet/WebSocket',
    '',
    'Appuie sur ENTREE pour revenir.',
  ]);
}

export function renderBzhChronicles(config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    'BZH CHRONICLES',
    '',
    'Signal cyber-breton detecte.',
    'Les mondes du Code ne sont pas encore',
    'ouverts depuis ce terminal.',
    '',
    'Phase suivante:',
    '- lore court',
    '- jukebox texte',
    '- liens vers modules Nitro',
    '',
    'Appuie sur ENTREE pour revenir.',
  ]);
}

export function renderPlaceholder(title, config = {}) {
  return frame([
    ...renderHeader(config),
    '',
    title.toUpperCase(),
    '',
    'Module en construction.',
    '',
    'Cette passerelle sera activee dans une',
    'phase ulterieure du projet.',
    '',
    'Appuie sur ENTREE pour revenir.',
  ]);
}

export function renderSystemInfo({ name, node, publicOrigin, wsPath, telnetPort, clients, telnetClients, nitroFeedVersion, avatarStateVersion } = {}) {
  return frame([
    ...renderHeader({ name, node }),
    '',
    'INFOS SYSTEME',
    '',
    `HTTP ORIGIN : ${publicOrigin || 'local'}`,
    `WS PATH     : ${wsPath || '/minitel/ws'}`,
    `TELNET PORT : ${telnetPort || 3615}`,
    `CLIENTS WS  : ${clients ?? 0}`,
    `CLIENTS TEL : ${telnetClients ?? 0}`,
    `NITRO FEED  : v${nitroFeedVersion ?? 'n/a'}`,
    `AVATAR      : v${avatarStateVersion ?? 'n/a'}`,
    '',
    'Aucune commande systeme exposee.',
    '',
    'Appuie sur ENTREE pour revenir.',
  ]);
}

function center(text, width) {
  const value = String(text).slice(0, width);
  const padding = Math.max(0, width - value.length);
  const left = Math.floor(padding / 2);
  const right = padding - left;
  return `${' '.repeat(left)}${value}${' '.repeat(right)}`;
}
