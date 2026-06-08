# Project Upgrade Report — Hard Dog v1.2.0

## Summary

The project was upgraded with a limited roll stamina mechanic while preserving the existing stack and the current game architecture:

- HTML;
- CSS;
- Vanilla JavaScript ES Modules;
- Canvas 2D API;
- Web Audio API.

No frameworks, bundlers or external runtime libraries were added.

## What changed

- Added roll stamina: holding `Space` / `Enter` no longer allows infinite roll.
- Roll stamina drains while the player is in rolling/diving states.
- Roll stamina recovers automatically after the player exits roll mode.
- Added a minimum stamina threshold before roll can start again.
- Added roll boost collectible.
- Roll boost restores stamina and temporarily reduces stamina drain.
- Added Canvas HUD bar for roll stamina.
- Added active roll boost timer badge.
- Added roll stamina information to the debug overlay.
- Updated documentation and QA checklist.
- Added tests for roll stamina and roll boost configuration.

## Added files

No new files were required for this feature. The change was implemented inside the existing project structure.

## Reworked files

- `src/config/game-config.js`
- `src/config/collectibles.js`
- `src/game/Game.js`
- `src/states/RunningState.js`
- `src/states/JumpingState.js`
- `src/states/SittingState.js`
- `src/states/RollingState.js`
- `src/states/DivingState.js`
- `src/entities/items/Collectible.js`
- `src/ui/CanvasUI.js`
- `src/ui/DomUI.js`
- `tests/feature-config.test.mjs`
- `README.md`
- `docs/FEATURES.md`
- `docs/MANUAL_QA.md`
- `package.json`

## Gameplay behaviour

Roll now works as a limited resource:

1. The player can start roll only when stamina is above the configured minimum.
2. Stamina drains while rolling or diving.
3. When stamina reaches zero, the player exits roll mode.
4. If the player keeps holding the action key without enough stamina, a short floating message is shown.
5. Stamina recovers after the player leaves roll mode.
6. The new roll boost collectible restores stamina and temporarily makes stamina drain slower.

## Security and quality notes

- No secrets were added.
- No external dependencies were added.
- No unsafe DOM rendering was introduced.
- The new collectible is generated through the existing weighted collectible system.
- Roll tuning values are centralized in `ROLL_STAMINA_CONFIG`.
- The basic security scan passes.

## Checks performed

```bash
npm run check
npm test
```

Additional smoke check:

```bash
node ./tools/dev-server.mjs
curl http://localhost:4173/
curl http://localhost:4173/src/main.js
```

## Check results

- Import validation: passed.
- Basic security scan: passed.
- Tests: 10 passed.
- HTTP smoke check: passed.

## How to run

```bash
npm start
```

Open:

```text
http://localhost:4173
```

## Remaining risks

- Exact stamina drain/recovery values may need tuning after real playtesting.
- Touch controls should be tested on real mobile devices.
- There are no browser automation tests yet.

## Future improvements

Recommended next steps:

1. Fine-tune roll stamina values after manual playtesting.
2. Add an asset preloader screen.
3. Add Playwright smoke tests.
4. Add more enemy types using the existing enemy config pattern.
5. Add more level themes.
6. Add a small achievements system.
