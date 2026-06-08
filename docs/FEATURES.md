# Gameplay Features

## Added in v1.2.0

- Roll stamina resource: holding `Space` / `Enter` no longer gives unlimited roll.
- Roll stamina drains during rolling/diving and recovers after the player leaves roll mode.
- A minimum stamina threshold is required before roll can start again.
- New roll boost collectible restores stamina and temporarily reduces stamina drain.
- Canvas HUD now shows a roll stamina bar and active roll boost timer.
- Debug overlay now includes current roll stamina.

## Added in v1.1.0

- Start menu.
- Pause and resume flow.
- Restart flow.
- Win and game-over screens.
- Three levels with separate duration, speed and spawn settings.
- Difficulty settings.
- Collectibles:
  - bone: score bonus;
  - heart: life bonus;
  - clock: time bonus;
  - shield: temporary protection.
- Survival score.
- Combo score for destroying enemies in roll/dive mode.
- High score via `localStorage`.
- Procedural Web Audio feedback.
- Screen shake.
- Hit flash.
- Collect flash.
- Shield aura.
- FPS/debug overlay.
- Optional touch controls.

## Preserved behaviour

The player state machine, core movement model, sprite animation flow, enemy collision approach and Canvas-based rendering remain based on the original project.
