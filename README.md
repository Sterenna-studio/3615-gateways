# 3615 Gateways

**3615 Gateways** is a retro-modern gateway project for connecting a real **Minitel** to contemporary services through an **ESP32**, Telnet/WebSocket, and the Nitro/Sterenna ecosystem.

> Current active runtime: `MutenRock/Korigan/services/3615-gateways`.
>
> This repository remains the public standalone prototype, documentation base, and historical reference for the 3615 Gateways concept.

The goal is simple:

```txt
Minitel
  -> ESP32 / iodeo Minitel-ESP32 / Telnet Pro
  -> Wi-Fi
  -> Zyra, the local Pop!_OS server
  -> Korigan / Nitro / Sterenna services
```

Public project page target:

```txt
https://nitro.sterenna.fr/minitel/
```

Runtime service targets:

```txt
wss://nitro.sterenna.fr/minitel/ws
telnet nitro.sterenna.fr 3615
```

## Project status

Early MVP skeleton, now with stateful terminal navigation, a local Nitro terminal feed, and a first Avatar / Lemegeton terminal module.

The live development version is now integrated into Korigan:

```txt
Korigan
└── services/3615-gateways/
    ├── server/       # HTTP + WebSocket + Telnet runtime
    ├── data/         # terminal-safe Nitro/avatar feeds
    └── tests/        # router/feed/avatar tests
```

Current objective:

1. run a local 3615 Gateways server on **Zyra**;
2. connect the Minitel through the ESP32 using iodeo Telnet Pro;
3. display a stable 3615 Gateways menu;
4. expose Gwen Ha Star / Korigan as a terminal-native section;
5. expose the Avatar / Lemegeton state as a terminal-native section;
6. add services one by one: BBS, IA, Arcade, Terminal, BZH Chronicles.

## Current MVP features

```txt
- HTTP status endpoints
- WebSocket endpoint at /minitel/ws
- Telnet server on port 3615
- Stateful session per Telnet/WebSocket client
- Main 3615 Gateways menu
- Gwen Ha Star / Korigan / Nitro terminal section
- Avatar / Lemegeton terminal section
- Local terminal-safe Nitro feed
- Local terminal-safe avatar state feed
- Feed/state validation and normalization
- Runtime stats for WS/Telnet clients
- Basic security boundary: no system command execution
- Node.js tests for router and feed/state logic
```

## Repository layout

```txt
3615-gateways/
├── data/
│   ├── avatar-state.json       # Terminal-safe avatar state / expression data
│   └── nitro-feed.json         # Terminal-safe Gwen Ha Star / Nitro data
│
├── server/                     # Node.js MVP server for Zyra
│   ├── index.js                # HTTP + WebSocket + Telnet entrypoint
│   └── lib/
│       ├── avatar.js           # Avatar / Lemegeton terminal screens
│       ├── avatar-state.js     # Avatar state loader / normalizer
│       ├── gwen-ha-star.js     # Gwen Ha Star terminal screens
│       ├── minitel.js          # Minitel text rendering helpers
│       ├── nitro-feed.js       # Feed loader / validator / normalizer
│       └── router.js           # Stateful terminal routing
│
├── firmware/                   # ESP32 / Telnet Pro notes and presets
│   └── TELNET_PRO_PRESETS.md
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AVATAR_VDT_RESEARCH.md
│   ├── GWEN_HA_STAR_MINITEL.md
│   ├── SETUP_ZYRA_POPOS.md
│   ├── NITRO_INTEGRATION.md
│   └── SECURITY.md
│
├── tests/
│   ├── avatar-state.test.js
│   ├── nitro-feed.test.js
│   └── router.test.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Quick start on Zyra

For the current integrated runtime, prefer cloning Korigan and running the service from `services/3615-gateways`.

```bash
git clone git@github.com:MutenRock/Korigan.git
cd Korigan/services/3615-gateways
cp .env.example .env
npm install
npm run dev
```

Default local endpoints used in the current Korigan setup:

```txt
HTTP status:       http://localhost:8085/
Status detail:     http://localhost:8085/minitel/status
Nitro feed:        http://localhost:8085/minitel/nitro-feed
Avatar state:      http://localhost:8085/minitel/avatar-state
WebSocket:         ws://localhost:8085/minitel/ws
Telnet:            localhost:3615
```

The standalone version in this repository can still be used for experimentation, documentation, and public sharing, but the active local cockpit should point to Korigan.
