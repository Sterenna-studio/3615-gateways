# Security notes

3615 Gateways is a fun retro gateway, but it can sit in front of a real personal computer: Zyra.

Treat every public endpoint as hostile.

## Do not expose

Never expose directly from the Minitel interface:

- raw shell commands;
- SSH credentials;
- Supabase service-role keys;
- private API tokens;
- Home Assistant admin actions;
- filesystem write/delete operations;
- arbitrary URL fetching without filtering.

## MVP rule

Local LAN first.

```txt
Minitel -> ESP32 -> Zyra local IP
```

Do not make the public internet path the first test.

## Public access rule

When exposing through `nitro.sterenna.fr`, prefer:

```txt
Internet
  -> reverse proxy / tunnel
  -> only selected 3615 Gateways endpoints
  -> Zyra service user
```

Avoid:

```txt
Internet
  -> full Zyra host
```

## Authentication

For WebSocket, use `GATEWAY_TOKEN` when public:

```txt
wss://nitro.sterenna.fr/minitel/ws?token=<TOKEN>
```

This is not perfect security, but it is better than an open experimental socket.

For stronger protection later:

- short-lived tokens;
- Nitro/Supabase account binding;
- per-device keys;
- allowlist of known ESP32 device IDs;
- rate limiting;
- logging with alerting.

## Telnet warning

Telnet is plain text. It is authentic retro energy, but not secure.

Use it for LAN and experiments. For public exposure, prefer WebSocket over TLS first.

## Command execution policy

No feature should run OS commands directly from user input.

If a terminal-like module is added later, it must be:

- isolated;
- explicitly authenticated;
- limited to safe actions;
- logged;
- disabled by default.

## Logs

Log:

- connection time;
- remote address;
- transport type;
- selected menu item;
- errors.

Do not log:

- passwords;
- API tokens;
- Supabase tokens;
- private messages unless explicitly needed for debugging.
