import {
  renderBzhChronicles,
  renderHelp,
  renderMainMenu,
  renderPlaceholder,
  renderServerMessage,
  renderSystemInfo,
} from './minitel.js';
import {
  renderGwenHaStarAgent,
  renderGwenHaStarApps,
  renderGwenHaStarCockpit,
  renderGwenHaStarHome,
  renderGwenHaStarSignal,
} from './gwen-ha-star.js';

export function createSession() {
  return {
    section: 'main',
    lastChoice: null,
  };
}

export function routeTerminalInput(input, { config = {}, feed = {}, stats = {}, session = createSession() } = {}) {
  const choice = normalizeChoice(input, session);
  let screen;
  let section = session.section || 'main';

  switch (choice) {
    case '0':
    case 'm':
    case 'menu':
    case 'accueil':
      section = 'main';
      screen = renderMainMenu(config);
      break;
    case '?':
    case 'h':
    case 'help':
    case 'aide':
      screen = renderHelp(config, section);
      break;
    case '1':
      section = 'main';
      screen = renderServerMessage(config);
      break;
    case '2':
      section = 'main';
      screen = renderBzhChronicles(config);
      break;
    case '3':
      section = 'main';
      screen = renderPlaceholder('BBS / Retro Services', config);
      break;
    case '4':
      section = 'main';
      screen = renderPlaceholder('Arcade', config);
      break;
    case '5':
      section = 'main';
      screen = renderPlaceholder('Terminal Test', config);
      break;
    case '6':
      section = 'main';
      screen = renderSystemInfo({
        ...config,
        clients: stats.wsClients ?? 0,
        telnetClients: stats.telnetClients ?? 0,
        nitroFeedVersion: feed.version ?? 'n/a',
      });
      break;
    case '7':
      section = 'gwen';
      screen = renderGwenHaStarHome(config, feed);
      break;
    case '71':
      section = 'gwen';
      screen = renderGwenHaStarAgent(config, feed);
      break;
    case '72':
      section = 'gwen';
      screen = renderGwenHaStarCockpit(config, feed);
      break;
    case '73':
      section = 'gwen';
      screen = renderGwenHaStarApps(config, feed);
      break;
    case '74':
      section = 'gwen';
      screen = renderGwenHaStarSignal(config, feed);
      break;
    default:
      screen = section === 'gwen'
        ? renderGwenHaStarHome(config, feed)
        : renderMainMenu(config);
      break;
  }

  session.section = section;
  session.lastChoice = choice;

  return {
    choice,
    section,
    screen,
  };
}

export function normalizeChoice(input, session = createSession()) {
  const raw = String(input ?? '').trim().toLowerCase();

  if (!raw) return session.section === 'gwen' ? '7' : '0';

  const directCommands = new Set(['m', 'menu', 'accueil', 'h', 'help', 'aide', '?']);
  if (directCommands.has(raw)) return raw;

  const digits = raw.replace(/\D/g, '');
  const choice = digits || raw.slice(-1);

  if (session.section === 'gwen' && ['1', '2', '3', '4'].includes(choice)) {
    return `7${choice}`;
  }

  return choice;
}
