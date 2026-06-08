import assert from "node:assert/strict";
import test from "node:test";
import { getImageSource, IMAGE_SOURCES } from "../src/config/assets.js";
import { GAME_CONFIG } from "../src/config/game-config.js";
import { isSupportedControlKey } from "../src/config/controls.js";

const expectedGameDurationMs = 18_000;

test("game duration preserves the existing 18-second business rule", () => {
  assert.equal(GAME_CONFIG.MAX_TIME_MINUTES * 60 * 1000, expectedGameDurationMs);
});

test("existing game controls remain supported", () => {
  ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "ц", "ф", "ы", "в", "Enter", " ", "u"].forEach((key) => {
    assert.equal(isSupportedControlKey(key), true);
  });
});

test("known image assets resolve to public asset paths", () => {
  Object.keys(IMAGE_SOURCES).forEach((imageName) => {
    assert.match(getImageSource(imageName), /^\.\/assets\/images\//);
  });
});

test("unknown image asset names fail explicitly", () => {
  assert.throws(() => getImageSource("missing-image"), /Unknown image asset/);
});
