# Gwen Ha Star Minitel adaptation

This project does not try to render the modern Gwen Ha Star website on a Minitel.

Instead, it creates a terminal-native adaptation:

```txt
Gwen Ha Star web app
  -> selected concepts and data
  -> short 40-column text screens
  -> Minitel navigation through 3615 Gateways
```

## Current MVP

The main 3615 Gateways menu now exposes:

```txt
[7] GWEN HA STAR / NITRO
```

Inside that section:

```txt
[71] CARTE AGENT / CIG
[72] STAR COCKPIT
[73] APPS NITRO
[74] SIGNAL DU RESEAU
```

These are static text screens for now.

## Why this approach

A Minitel should not load the browser version of Nitro.

Problems with direct web rendering:

- no HTML/CSS/JS browser runtime;
- very limited display size;
- keyboard-first navigation;
- slow terminal-oriented output;
- accent and encoding constraints;
- authentication must be simplified and secured.

The adapted version must behave like a real Minitel service, not like a downgraded web page.

## Future data bridge

Later, Gwen Ha Star can expose terminal-safe data through a small JSON source, for example:

```txt
/nitro-terminal/feed.json
```

The gateway would then render selected fields only:

```json
{
  "agent": {
    "displayName": "MutenRock",
    "rank": "Agent des Chronicles",
    "crew": "BZH Chronicles"
  },
  "apps": [
    { "name": "BZH Chronicles", "status": "online" },
    { "name": "TCG", "status": "draft" }
  ],
  "signals": [
    "Nitro sync active",
    "New Chronicles module soon"
  ]
}
```

## Security boundary

The Minitel version must not receive raw Supabase session tokens.

Safer future options:

- read-only public feed;
- server-side token exchange;
- device-specific key for the ESP32;
- Nitro account linking later;
- no private profile data unless authenticated.

## Next useful features

1. Add per-client navigation state, so `1`, `2`, `3` can mean different things inside Gwen Ha Star.
2. Add real Minitel Videotex control sequences.
3. Add terminal-safe JSON import from a local file or HTTP endpoint.
4. Add read-only Nitro status endpoint.
5. Add device authentication before personal account data.
