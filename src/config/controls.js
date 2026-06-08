export const CONTROL_KEYS = Object.freeze({
  UP: ["ArrowUp", "w", "W", "ц", "Ц"],
  DOWN: ["ArrowDown", "s", "S", "ы", "Ы"],
  RIGHT: ["ArrowRight", "d", "D", "в", "В"],
  LEFT: ["ArrowLeft", "a", "A", "ф", "Ф"],
  ACTION: ["Enter", " "],
  PAUSE: ["Escape", "p", "P", "з", "З"],
  RESTART: ["r", "R", "к", "К"],
  MUTE: ["m", "M", "ь", "Ь"],
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
    CONTROL_KEYS.PAUSE.includes(key) ||
    CONTROL_KEYS.RESTART.includes(key) ||
    CONTROL_KEYS.MUTE.includes(key) ||
    key === CONTROL_KEYS.DEBUG
  );
}
