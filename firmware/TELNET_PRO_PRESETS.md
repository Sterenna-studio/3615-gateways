# ESP32 Telnet Pro presets

These notes target iodeo's Minitel ESP32 board and the `Minitel1B_Telnet_Pro` firmware.

## Local LAN MVP

Use this first. It avoids public DNS, tunnels and proxy issues.

```txt
Preset name: 3615 Gateways Local
Connection:  Telnet
Host:        <ZYRA_LOCAL_IP>
Port:        3615
Scroll:      enabled
Echo:        disabled
80 columns:  disabled for first tests
Prestel:     disabled for first tests
Alt charset: test both if accents render badly
```

## Nitro WebSocket target

Use this once `nitro.sterenna.fr` is proxied to Zyra.

```txt
Preset name: 3615 Gateways WS
Connection:  WebSocket
URL:         wss://nitro.sterenna.fr/minitel/ws
Ping:        30000
Scroll:      enabled
Echo:        disabled
```

If a token is configured in `.env` on Zyra:

```txt
wss://nitro.sterenna.fr/minitel/ws?token=<TOKEN>
```

Do not commit that token in this repo.

## Nitro Telnet target

Only expose this once the server is isolated and logging is working.

```txt
Preset name: 3615 Gateways Telnet
Connection:  Telnet
Host:        nitro.sterenna.fr
Port:        3615
Scroll:      enabled
Echo:        disabled
```

## First test checklist

1. Power the Minitel and ESP32.
2. Confirm Wi-Fi connection from Telnet Pro.
3. Use local Zyra IP first.
4. Connect to port `3615`.
5. Confirm the menu appears.
6. Test keys `1`, `2`, `6`, then `0`.
7. Only after local success, test Nitro/WebSocket.

## Known limitation

The MVP server currently sends plain ASCII/ANSI-friendly text. Real Minitel Videotex control sequences should be introduced after hardware testing, not before.
