export const DEFAULT_SETTINGS = Object.freeze({
  difficulty: "normal",
  isMuted: false,
  showFps: false,
  showTouchControls: true,
});

export const DIFFICULTY_SETTINGS = Object.freeze({
  easy: {
    label: "Easy",
    enemyIntervalMultiplier: 1.25,
    speedMultiplier: 0.9,
    itemIntervalMultiplier: 0.85,
    scoreMultiplier: 1,
  },
  normal: {
    label: "Normal",
    enemyIntervalMultiplier: 1,
    speedMultiplier: 1,
    itemIntervalMultiplier: 1,
    scoreMultiplier: 1,
  },
  hard: {
    label: "Hard",
    enemyIntervalMultiplier: 0.75,
    speedMultiplier: 1.15,
    itemIntervalMultiplier: 1.15,
    scoreMultiplier: 1.35,
  },
});

export function normalizeSettings(settings) {
  const safeSettings = settings && typeof settings === "object" ? settings : {};
  const difficulty = Object.hasOwn(DIFFICULTY_SETTINGS, safeSettings.difficulty)
    ? safeSettings.difficulty
    : DEFAULT_SETTINGS.difficulty;

  return {
    difficulty,
    isMuted: Boolean(safeSettings.isMuted),
    showFps: Boolean(safeSettings.showFps),
    showTouchControls:
      typeof safeSettings.showTouchControls === "boolean"
        ? safeSettings.showTouchControls
        : DEFAULT_SETTINGS.showTouchControls,
  };
}
