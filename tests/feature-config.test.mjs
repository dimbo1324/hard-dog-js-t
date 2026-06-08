import assert from "node:assert/strict";
import test from "node:test";
import { COLLECTIBLE_CONFIG, COLLECTIBLE_TYPES } from "../src/config/collectibles.js";
import { ROLL_STAMINA_CONFIG } from "../src/config/game-config.js";
import { GAME_STATUS, isFinalGameStatus } from "../src/config/game-status.js";
import { LEVELS } from "../src/config/levels.js";
import { DIFFICULTY_SETTINGS, normalizeSettings } from "../src/config/settings.js";

test("game status model supports menu, gameplay and final screens", () => {
  assert.equal(GAME_STATUS.MENU, "menu");
  assert.equal(isFinalGameStatus(GAME_STATUS.GAME_OVER), true);
  assert.equal(isFinalGameStatus(GAME_STATUS.WIN), true);
  assert.equal(isFinalGameStatus(GAME_STATUS.PLAYING), false);
});

test("level configuration provides a three-stage progression", () => {
  assert.equal(LEVELS.length, 3);
  assert.equal(LEVELS[0].durationMs, 18_000);
  LEVELS.forEach((level) => {
    assert.equal(typeof level.name, "string");
    assert.ok(level.enemyInterval > 0);
    assert.ok(level.itemInterval > 0);
  });
});

test("collectible configuration contains all gameplay bonus types", () => {
  Object.values(COLLECTIBLE_TYPES).forEach((type) => {
    assert.ok(COLLECTIBLE_CONFIG.TYPES[type]);
  });
});

test("settings normalization rejects unsupported difficulty values", () => {
  assert.deepEqual(normalizeSettings({ difficulty: "impossible" }).difficulty, "normal");
  assert.ok(DIFFICULTY_SETTINGS.hard.speedMultiplier > DIFFICULTY_SETTINGS.normal.speedMultiplier);
});


test("roll stamina configuration prevents unlimited roll usage", () => {
  assert.ok(ROLL_STAMINA_CONFIG.MAX_STAMINA > ROLL_STAMINA_CONFIG.MIN_STAMINA_TO_START);
  assert.ok(ROLL_STAMINA_CONFIG.DRAIN_PER_SECOND > 0);
  assert.ok(ROLL_STAMINA_CONFIG.RECOVERY_PER_SECOND > 0);
  assert.ok(ROLL_STAMINA_CONFIG.BOOST_DRAIN_MULTIPLIER > 0);
  assert.ok(ROLL_STAMINA_CONFIG.BOOST_DRAIN_MULTIPLIER < 1);
});

test("roll boost collectible restores stamina and extends roll duration", () => {
  const rollBoost = COLLECTIBLE_CONFIG.TYPES[COLLECTIBLE_TYPES.ROLL_BOOST];

  assert.ok(rollBoost);
  assert.ok(rollBoost.stamina > 0);
  assert.ok(rollBoost.boostMs > 0);
  assert.equal(typeof rollBoost.message, "string");
});
