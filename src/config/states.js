export const PLAYER_STATES = Object.freeze({
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
});

export const PLAYER_STATE_CONFIG = Object.freeze({
  FRAME: {
    SITTING: { FRAME_X: 0, MAX_FRAME: 4, FRAME_Y: 5 },
    RUNNING: { FRAME_X: 0, MAX_FRAME: 8, FRAME_Y: 3 },
    ROLLING: { FRAME_X: 0, MAX_FRAME: 6, FRAME_Y: 6 },
    JUMPING: { FRAME_X: 0, MAX_FRAME: 6, FRAME_Y: 1 },
    DIVING: { FRAME_X: 0, MAX_FRAME: 6, FRAME_Y: 6 },
    FALLING: { FRAME_X: 0, MAX_FRAME: 6, FRAME_Y: 2 },
    HIT: { FRAME_X: 0, MAX_FRAME: 10, FRAME_Y: 4 },
  },
  JUMP_VELOCITY: -27,
  DIVING_VELOCITY: 15,
  PARTICLE_OFFSETS: {
    DUST: { X: -40, Y: -10 },
    FIRE: { X: 0.5, Y: 0.5 },
    SPLASH: { X: 0.5, Y: 1 },
  },
  SPLASH_COUNT: 25,
});
