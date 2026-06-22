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

Early MVP skeleton.

Current objective:

1. run a local 3615 Gateways server on **Zyra**;
2. connect the Minitel through the ESP32 using iodeo Telnet Pro;
3. display a stable 3615 Gateways menu;
4. expose a public static page under `nitro.sterenna.fr/minitel/`;
5. add services one by one: BBS, IA, Arcade, Terminal, BZH Chronicles.

## Repository layout

```txt
3615-gateways/
├── server/                     # Node.js MVP server for Zyra
│   ├── index.js                # HTTP + WebSocket + Telnet entrypoint
│   └── lib/
│       └── minitel.js          # Minitel text rendering helpers
│
├── firmware/                   # ESP32 / Telnet Pro notes and presets
│   └── TELNET_PRO_PRESETS.md
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SETUP_ZYRA_POPOS.md
│   ├── NITRO_INTEGRATION.md
│   └── SECURITY.md
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
WebSocket:         ws://localhost:8080/minitel/ws
Telnet:            localhost:3615
```

From another machine on the LAN:

```txt
telnet <ZYRA_LOCAL_IP> 3615
```

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
