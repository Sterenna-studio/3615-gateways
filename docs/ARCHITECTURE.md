# Architecture — 3615 Gateways

## Core idea

3615 Gateways separates three concerns:

```txt
1. Physical terminal
   Minitel + ESP32 + iodeo Telnet Pro

2. Live gateway
   Zyra under Pop!_OS running the 3615 Gateways server

3. Public Nitro facade
   https://nitro.sterenna.fr/minitel/
```

The Minitel is not a web browser. The public web page and the terminal runtime are separate.

## Target flows

### Local MVP

```txt
Minitel
  -> DIN / serial
ESP32 Telnet Pro
  -> Wi-Fi LAN
Zyra:3615
  -> 3615 Gateways Telnet menu
```

### Public Nitro flow

```txt
Minitel
  -> ESP32
  -> Wi-Fi
  -> nitro.sterenna.fr:3615 or wss://nitro.sterenna.fr/minitel/ws
  -> reverse proxy / tunnel
  -> Zyra
  -> 3615 Gateways server
```

### Web page flow

```txt
Browser
  -> https://nitro.sterenna.fr/minitel/
  -> static project page from gwen-ha-star-static
```

## Runtime services

Initial services:

```txt
[1] Message du serveur
[2] BZH Chronicles
[3] BBS / Retro services
[4] Arcade
[5] Terminal test
[6] Infos systeme
```

Future services:

```txt
- IA text gateway
- BBS inspired by PETSCII-BBS / ASCII / Videotex
- Minitel arcade experiments
- Home Assistant read-only status
- Nitro account bridge
- BZH Chronicles lore terminal
```

## Recommended deployment model

### Phase 1: LAN only

Run the server on Zyra and connect the ESP32 with local IP.

```txt
Host: <ZYRA_LOCAL_IP>
Port: 3615
```

### Phase 2: public static page

Add `/minitel/` to `Sterenna-studio/gwen-ha-star-static`.

```txt
https://nitro.sterenna.fr/minitel/
```

### Phase 3: controlled public access

Expose only the required runtime endpoints through a reverse proxy or tunnel.

```txt
/minitel/ws -> Zyra:8080/minitel/ws
:3615      -> Zyra:3615, only if explicitly wanted
```

Prefer a tunnel or reverse proxy to direct wide-open port forwarding.

## Boundaries

3615 Gateways should not expose raw shell commands, SSH credentials, private Supabase keys, or Home Assistant admin actions.

The Minitel UI must call controlled services, not the host operating system directly.
