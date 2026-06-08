# Hard Dog — Vanilla JavaScript Canvas Game

Hard Dog is a browser-based 2D side-scroller game built without frameworks, bundlers or third-party runtime libraries.

Stack:

- HTML5
- CSS3
- Vanilla JavaScript ES Modules
- Canvas 2D API
- Web Audio API
- `localStorage` for non-critical local settings and high score

## Current gameplay

The game now includes:

- start menu;
- pause / resume;
- restart flow;
- win and game-over screens;
- three-level progression;
- enemies with preserved core collision behaviour;
- collectibles: bone, heart, clock, shield and roll boost;
- roll stamina with recovery and boost extension;
- survival score and combo score;
- local high score;
- difficulty settings: Easy, Normal, Hard;
- mute setting;
- FPS / debug mode;
- keyboard controls;
- optional touch controls;
- screen shake, hit flash, collect flash, shield aura and roll stamina HUD;
- simple procedural Web Audio feedback.

## Run locally

```bash
npm start
```

Open:

```text
http://localhost:4173
```

No build step is required.

## Checks

```bash
npm run check
npm test
```

`npm run check` validates local ES module imports and runs a basic security scan.

`npm test` runs Node.js tests for configuration, controls, levels, statuses and collectible rules.

## Controls

| Action | Keyboard |
| --- | --- |
| Move | Arrow keys / WASD |
| Roll / primary action | Space / Enter |
| Roll stamina | Drains while rolling/diving; recovers after release; roll boost collectible restores and extends it |
| Jump | ArrowUp / W |
| Dive | ArrowDown / S while airborne |
| Pause | Esc / P |
| Restart | R |
| Mute | M |
| Debug / FPS | Hold U for 3 seconds or enable in Settings |

Russian keyboard equivalents are also preserved for movement and common actions.

## Project structure

```text
assets/                 Static game images
src/
  assets/               Asset loading
  audio/                Web Audio manager
  config/               Game constants, controls, levels, settings
  core/                 Canvas bootstrap, game loop, error boundary
  entities/             Player, enemies, particles, items, visual effects
  game/                 Main Game orchestration
  input/                Keyboard and virtual touch input
  rendering/            Background rendering
  states/               Player finite states
  storage/              localStorage wrapper
  styles/               CSS
  ui/                   Canvas UI and DOM overlay UI
  utils/                Shared helpers
docs/                   Engineering documentation
tests/                  Node.js tests
tools/                  Dev server and validation scripts
```

## Architecture notes

The project remains intentionally simple:

- no framework;
- no build pipeline;
- no external runtime dependencies;
- no server-side game state;
- no remote API;
- no secrets.

`Game` owns the runtime state and orchestrates entities, levels, score, items and status transitions.

`DomUI` owns accessible overlay screens: menu, pause, final result, settings and touch controls.

`CanvasUI` owns in-game HUD rendering: score, timer, level, lives, roll stamina, combo, shield, roll boost and debug information.

Business constants are kept in `src/config/*`, so gameplay tuning does not require searching across the whole codebase.

## Development rules

When changing the game:

1. Keep the stack unchanged unless explicitly required.
2. Keep gameplay constants in `src/config`.
3. Keep DOM UI in `src/ui/DomUI.js`.
4. Keep Canvas HUD in `src/ui/CanvasUI.js`.
5. Keep runtime orchestration in `src/game/Game.js`.
6. Add tests for new rules or configuration.
7. Run `npm run check` and `npm test` before committing.

## Known limitations

- Audio is procedural and minimal; no external audio assets are included.
- High score and settings are local to the browser.
- Touch controls are intentionally simple and should be manually tested on real mobile devices.
- The game does not include a full asset preloader screen yet.
