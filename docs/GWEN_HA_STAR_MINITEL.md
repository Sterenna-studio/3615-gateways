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

The main 3615 Gateways menu exposes:

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

These screens are now rendered from the local terminal-safe feed:

```txt
data/nitro-feed.json
```

The server exposes this feed as read-only JSON:

```txt
GET /minitel/nitro-feed
```

## Feed shape

The MVP feed contains:

```json
{
  "network": {
    "name": "Gwen Ha Star",
    "domain": "nitro.sterenna.fr",
    "status": "experimental"
  },
  "agent": {
    "displayName": "MutenRock",
    "rank": "Agent des Chronicles",
    "crew": "BZH Chronicles"
  },
  "apps": [],
  "signals": [],
  "links": {}
}
```

Only safe, curated fields should be added here.

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
https://nitro.sterenna.fr/nitro-terminal/feed.json
```

The gateway can then import that feed or sync it locally into:

```txt
data/nitro-feed.json
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
3. Add remote feed sync from Nitro.
4. Add read-only Nitro status endpoint.
5. Add device authentication before personal account data.
