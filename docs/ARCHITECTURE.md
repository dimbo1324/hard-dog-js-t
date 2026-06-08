# Architecture

Hard Dog is a framework-free Canvas 2D game using ES Modules.

## Runtime layers

```text
main.js
  -> createCanvasContext()
  -> GameLoop
  -> Game
      -> Player
      -> Enemies
      -> Collectibles
      -> Background
      -> CanvasUI
      -> InputHandler
      -> AudioManager
      -> GameStorage
  -> DomUI
```

## Main responsibilities

### `src/game/Game.js`

Owns runtime gameplay state:

- current status;
- current level;
- score;
- lives;
- timers;
- enemies;
- collectibles;
- particles;
- collisions;
- high score;
- settings;
- game transitions.

### `src/core/GameLoop.js`

Runs `requestAnimationFrame`, caps large frame gaps and keeps rendering alive for menu, pause and final screens.

### `src/input/InputHandler.js`

Handles keyboard input and virtual touch input. It also maps one-shot actions such as pause, restart and mute.

### `src/ui/DomUI.js`

Owns DOM overlays:

- menu;
- pause;
- final result;
- settings;
- touch controls.

DOM is created through safe DOM APIs, not string-based `innerHTML` rendering.

### `src/ui/CanvasUI.js`

Renders in-game HUD on Canvas:

- score;
- timer;
- level;
- high score;
- lives;
- combo;
- shield;
- debug info.

### `src/config/*`

Contains gameplay constants and tunable rules:

- canvas size;
- player settings;
- enemy settings;
- levels;
- collectibles;
- controls;
- statuses;
- settings.

## Extension points

Add new features by extending the relevant layer:

- new enemy: `src/entities/enemies` + config;
- new collectible: `src/entities/items` + `collectibles.js`;
- new player behaviour: `src/states`;
- new overlay: `src/ui/DomUI.js`;
- new HUD element: `src/ui/CanvasUI.js`;
- new persistent preference: `src/storage/GameStorage.js` + `settings.js`.
