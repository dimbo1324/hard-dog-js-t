export const CONTROL_KEYS = Object.freeze({
  UP: ["ArrowUp", "w", "ц"],
  DOWN: ["ArrowDown", "s", "ы"],
  RIGHT: ["ArrowRight", "d", "в"],
  LEFT: ["ArrowLeft", "a", "ф"],
  ACTION: ["Enter", " "],
  DEBUG: "u",
});

export const INPUT_CONFIG = Object.freeze({
  DEBUG_HOLD_TIME: 3000,
});

export function isSupportedControlKey(key) {
  return (
    CONTROL_KEYS.UP.includes(key) ||
    CONTROL_KEYS.DOWN.includes(key) ||
    CONTROL_KEYS.RIGHT.includes(key) ||
    CONTROL_KEYS.LEFT.includes(key) ||
    CONTROL_KEYS.ACTION.includes(key) ||
    key === CONTROL_KEYS.DEBUG
  );
}
