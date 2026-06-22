# 3615 Gateways

**3615 Gateways** is a retro-modern gateway project for connecting a real **Minitel** to contemporary services through an **ESP32**, Telnet/WebSocket, and the Nitro/Sterenna ecosystem.

The goal is simple:

```txt
Minitel
  -> ESP32 / iodeo Minitel-ESP32 / Telnet Pro
  -> Wi-Fi
  -> Zyra, the local Pop!_OS server
  -> Nitro / Sterenna services
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

Early MVP skeleton, now with stateful terminal navigation and a local Nitro terminal feed.

Current objective:

1. run a local 3615 Gateways server on **Zyra**;
2. connect the Minitel through the ESP32 using iodeo Telnet Pro;
3. display a stable 3615 Gateways menu;
4. expose Gwen Ha Star as a terminal-native section;
5. add services one by one: BBS, IA, Arcade, Terminal, BZH Chronicles.

## Current MVP features

```txt
- HTTP status endpoints
- WebSocket endpoint at /minitel/ws
- Telnet server on port 3615
- Stateful session per Telnet/WebSocket client
- Main 3615 Gateways menu
- Gwen Ha Star / Nitro terminal section
- Local terminal-safe Nitro feed
- Feed validation and normalization
- Runtime stats for WS/Telnet clients
- Basic security boundary: no system command execution
- Node.js tests for router and feed logic
```

## Repository layout

```txt
3615-gateways/
├── data/
│   └── nitro-feed.json         # Terminal-safe Gwen Ha Star / Nitro data
│
├── server/                     # Node.js MVP server for Zyra
│   ├── index.js                # HTTP + WebSocket + Telnet entrypoint
│   └── lib/
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
│   ├── GWEN_HA_STAR_MINITEL.md
│   ├── SETUP_ZYRA_POPOS.md
│   ├── NITRO_INTEGRATION.md
│   └── SECURITY.md
│
├── tests/
│   ├── nitro-feed.test.js
│   └── router.test.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Quick start on Zyra

Requirements:

- Node.js 20+
- npm
- access to the Minitel ESP32 device through the same network

```bash
git clone https://github.com/Sterenna-studio/3615-gateways.git
cd 3615-gateways
cp .env.example .env
npm install
npm run dev
```

Default local endpoints:

```txt
HTTP status:       http://localhost:8080/
Status detail:     http://localhost:8080/minitel/status
Nitro feed:        http://localhost:8080/minitel/nitro-feed
WebSocket:         ws://localhost:8080/minitel/ws
Telnet:            localhost:3615
```

From another machine on the LAN:

```txt
telnet <ZYRA_LOCAL_IP> 3615
```

## Tests

```bash
npm test
```

## Minitel navigation

Main menu:

```txt
[1] MESSAGE DU SERVEUR
[2] BZH CHRONICLES
[3] BBS / RETRO SERVICES
[4] ARCADE
[5] TERMINAL TEST
[6] INFOS SYSTEME
[7] GWEN HA STAR / NITRO
[?] AIDE
[0] ACCUEIL / RAFRAICHIR
```

Inside Gwen Ha Star:

```txt
[71] CARTE AGENT / CIG
[72] STAR COCKPIT
[73] APPS NITRO
[74] SIGNAL DU RESEAU
```

The router is contextual: once inside Gwen Ha Star, `1`, `2`, `3`, `4` are interpreted as `71`, `72`, `73`, `74`.

## ESP32 / Telnet Pro preset

Recommended first preset:

```txt
Name: 3615 Gateways Local
Type: Telnet
Host: <ZYRA_LOCAL_IP>
Port: 3615
Scroll: true
Echo: false
```

Then, once `nitro.sterenna.fr` is proxied to Zyra:

```txt
Name: 3615 Gateways Nitro
Type: Telnet
Host: nitro.sterenna.fr
Port: 3615
Scroll: true
Echo: false
```

For WebSocket mode:

```txt
Name: 3615 Gateways WS
Type: WebSocket
URL: wss://nitro.sterenna.fr/minitel/ws
Ping: 30000
Scroll: true
Echo: false
```

## Design principle

Do not make the Minitel pretend to be a modern web browser.

The public web page and the Minitel service are separate:

```txt
https://nitro.sterenna.fr/minitel/
  = public project page for modern browsers

wss://nitro.sterenna.fr/minitel/ws
  = WebSocket channel for ESP32 / tools

telnet nitro.sterenna.fr 3615
  = retro terminal / BBS entrypoint
```

## Security principle

3615 Gateways must never expose raw shell access, private tokens, Home Assistant admin APIs, or system commands directly to public clients.

Expose one controlled gateway, log connections, add authentication when moving from LAN to public access, and isolate Zyra services behind a reverse proxy or tunnel.

## Related projects

- iodeo Minitel-ESP32
- iodeo Socketel
- iodeo Minitel-Play
- sblendorio PETSCII-BBS
- Sterenna Nitro / Gwen Ha Star static hub

## License

To be defined.
