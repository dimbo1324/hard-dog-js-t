export const LEVELS = Object.freeze([
  {
    id: 1,
    name: "Backyard Sprint",
    durationMs: 18_000,
    maxSpeed: 6,
    enemyInterval: 1_000,
    itemInterval: 2_700,
    enemyMix: { ground: 0.5, climbing: 0.5, flying: 1 },
  },
  {
    id: 2,
    name: "Night Chase",
    durationMs: 20_000,
    maxSpeed: 7,
    enemyInterval: 850,
    itemInterval: 2_500,
    enemyMix: { ground: 0.58, climbing: 0.42, flying: 1 },
  },
  {
    id: 3,
    name: "Final Run",
    durationMs: 22_000,
    maxSpeed: 8,
    enemyInterval: 720,
    itemInterval: 2_200,
    enemyMix: { ground: 0.65, climbing: 0.35, flying: 1 },
  },
]);

export const LEVEL_CONFIG = Object.freeze({
  SCORE_FOR_LEVEL_COMPLETE: 5,
  LEVEL_TRANSITION_MESSAGE_TIME: 1_200,
});
