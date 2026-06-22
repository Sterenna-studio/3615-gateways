# Avatar VDT research — living face on Minitel

This note summarizes the current research direction for a living face / animated avatar on Minitel, based on the project notes gathered in the uploaded markdown research document.

## Core constraint

A Minitel is not a free-pixel video display.

The avatar must be designed as a terminal-native puppet:

```txt
40 columns x 25 rows
character cells
mosaic blocks
slow output
small diffs instead of full redraws
```

The right mental model is not:

```txt
video frame -> Minitel
```

It is:

```txt
avatar state -> small terminal updates -> expressive illusion
```

## Recommended architecture

Use one common avatar state, then multiple renderers.

```txt
Avatar state
  -> Web/Canvas renderer for modern preview
  -> VDT/Minitel renderer for real terminal output
  -> Optional ESP32/OLED renderer later
```

Suggested state shape:

```txt
mode: idle | speaking | listening | thinking | error | boot
mood: neutral | happy | angry | tired | glitch
eyes: open | blink | closed | left | right
mouth: closed | small | medium | wide | smile
intensity: 0.0 -> 1.0
```

## Rendering principle

Do not redraw the whole page for every expression.

Better strategy:

```txt
1. Draw the full face frame once.
2. Move cursor to eyes area.
3. Replace only eyes rows.
4. Move cursor to mouth area.
5. Replace only mouth rows.
6. Keep text/status area separate.
```

This keeps the terminal responsive and respects the slow nature of the display.

## Tooling candidates

### Strong candidates

```txt
MiEdit
  Create and preview Minitel / Videotex screens.

Minitel-Canvas
  Build static mockups in Inkscape.

iodeo/Minitel-ESP32 + Telnet Pro
  Real ESP32 gateway to the Minitel.

PyMinitel / websocket2minitel
  Useful PC-side bridge and experiments.

RoboEyes / esp32-eyes
  Behavior inspiration for expressive eyes.
```

### Useful inspiration

```txt
Canvas 2D
  Modern preview, editor and simulator.

Web Speech API
  Prototype speech and rough mouth animation.

Chafa / libcaca / aalib.js
  Terminal image experiments, not final Minitel output.

PETSCII-BBS / Teletext editors
  Inspiration for terminal-native UX.
```

### Avoid as main base

```txt
Talking-head AI video
  Too rich, too heavy, then destroyed by Minitel constraints.

Direct web page rendering
  The Minitel is not a browser.

Full-screen animation at video FPS
  Too slow and unreadable on real hardware.
```

## Proposed integration in 3615 Gateways

Add a terminal service dedicated to the avatar:

```txt
[8] AVATAR / LEMEGETON
```

MVP screens:

```txt
[81] ETAT AVATAR
[82] PRESETS EXPRESSIONS
[83] PIPELINE VDT
[84] TEST BOUCHE / YEUX
```

This should remain a controlled renderer, not a command execution system.

## Future VDT frame plan

```txt
frames/avatar/
  idle_0.vdt
  idle_1.vdt
  blink_0.vdt
  blink_1.vdt
  blink_2.vdt
  talk_a.vdt
  talk_b.vdt
  talk_c.vdt
  listen_0.vdt
  think_0.vdt
  glitch_0.vdt
```

The first runtime does not need real `.vdt` files. It can start with text/mosaic placeholders, then move toward real Videotex sequences after hardware tests.

## First implementation target

For the current repo:

1. Add an avatar state feed.
2. Add a Minitel menu entry.
3. Render state / expressions / pipeline screens.
4. Keep the output 40-column friendly.
5. Add tests for routing.
6. Later: convert state into VDT diffs.

## Design decision

3615 Gateways should treat the avatar as another terminal service:

```txt
Zyra holds state.
Minitel displays state.
ESP32 transports state.
Nitro can eventually update state.
```

The avatar engine should not depend on the modern Gwen Ha Star front-end. It can share data and identity, but must stay terminal-native.
