export const CANVAS_CONFIG = Object.freeze({
  WIDTH: 1500,
  HEIGHT: 500,
  MAX_DEVICE_PIXEL_RATIO: 2,
});

export const GAME_CONFIG = Object.freeze({
  GROUND_MARGIN: 80,
  MAX_SPEED: 6,
  ENEMY_INTERVAL: 1000,
  MAX_PARTICLES: 200,
  MAX_TIME_MINUTES: 0.3,
  INITIAL_LIVES: 10,
  MAX_LIVES: 12,
  INITIAL_SCORE: 0,
  FONT_COLOR: "black",
  DEBUG_MODE: false,
  SCORE_PER_SECOND: 1,
  COMBO_RESET_TIME: 1800,
  INVULNERABILITY_TIME: 900,
});

export const PLAYER_CONFIG = Object.freeze({
  INITIAL_SPEED: 0,
  MAX_SPEED: 10,
  WIDTH: 100,
  HEIGHT: 91.3,
  WEIGHT: 1,
  FPS: 60,
  SCORE_INCREMENT: 1,
  COLLISION_RADIUS: 0.5,
  LIVES_DECREMENT: 1,
});

export const BACKGROUND_CONFIG = Object.freeze({
  WIDTH: 1667,
  HEIGHT: 500,
  LAYERS: [
    { image: "layer1", speedModifier: 0 },
    { image: "layer2", speedModifier: 0.2 },
    { image: "layer3", speedModifier: 0.4 },
    { image: "layer4", speedModifier: 0.8 },
    { image: "layer5", speedModifier: 2 },
  ],
});

export const BASE_CONFIG = Object.freeze({
  PARTICLE: {
    SIZE_DECREASE_RATE: 0.97,
    MIN_SIZE: 0.5,
  },
  ENEMY: {
    FPS: 20,
    FRAME_INTERVAL: 1000 / 20,
    MOVEMENT_SPEED: 1,
  },
});

export const ENEMY_CONFIG = Object.freeze({
  CLIMBING: {
    WIDTH: 120,
    HEIGHT: 144,
    SPEED_Y_OPTIONS: [1, -1],
    MAX_FRAME: 5,
    IMAGE: "enemyBigSpider",
    DRAW_LINE_OFFSET: 50,
  },
  FLYING: {
    WIDTH: 60,
    HEIGHT: 44,
    SPEED_X: 2,
    ANGLE_VELOCITY_MIN: 0.1,
    ANGLE_VELOCITY_MAX: 0.2,
    MAX_FRAME: 5,
    IMAGE: "enemyFly",
  },
  GROUND: {
    WIDTH: 60,
    HEIGHT: 87,
    SPEED_X: 0,
    SPEED_Y: 0,
    MAX_FRAME: 1,
    IMAGE: "enemyPlant",
  },
});

export const EFFECT_CONFIG = Object.freeze({
  DUST: {
    SIZE_MIN: 15,
    SIZE_MAX: 25,
    SPEED_X_MIN: 0,
    SPEED_X_MAX: 1,
    SPEED_Y_MIN: 0,
    SPEED_Y_MAX: 1,
    COLOR: "rgba(0, 0, 0, 0.2)",
  },
  FIRE: {
    SIZE_MIN: 50,
    SIZE_MAX: 150,
    SPEED_X: 1,
    SPEED_Y: 1,
    ANGLE_VELOCITY_MIN: -0.1,
    ANGLE_VELOCITY_MAX: 0.1,
    IMAGE: "fire",
  },
  SPLASH: {
    SIZE_MIN: 100,
    SIZE_MAX: 200,
    SPEED_X_MIN: -4,
    SPEED_X_MAX: 2,
    SPEED_Y_MIN: 2,
    SPEED_Y_MAX: 4,
    GRAVITY_INCREMENT: 0.1,
    IMAGE: "fire",
  },
  SCREEN: {
    SHAKE_INTENSITY_HIT: 10,
    SHAKE_INTENSITY_DESTROY: 5,
    SHAKE_DURATION_HIT: 220,
    SHAKE_DURATION_DESTROY: 120,
    FLASH_HIT_ALPHA: 0.32,
    FLASH_COLLECT_ALPHA: 0.18,
    FLASH_FADE_RATE: 0.92,
  },
});

export const UI_CONFIG = Object.freeze({
  FONT: {
    SIZE: 30,
    FAMILY: "Rubik Wet Paint, fantasy",
    SMALL_MULTIPLIER: 0.75,
    GAME_OVER_MULTIPLIER: 5,
  },
  SHADOW: {
    OFFSET_X: 2,
    OFFSET_Y: 2,
    COLOR: "white",
    BLUR: 0,
  },
  POSITION: {
    SCORE_X: 20,
    SCORE_Y: 50,
    TIME_X: 20,
    TIME_Y: 80,
    LEVEL_X: 20,
    LEVEL_Y: 110,
    HIGHSCORE_X: 20,
    HIGHSCORE_Y: 140,
    LIVES_START_X: 20,
    LIVES_Y: 150,
    LIVES_SIZE: 25,
    LIVES_SPACING: 25,
    GAME_OVER_TEXT_Y: 0.5,
    GAME_OVER_SUBTEXT_OFFSET: 40,
    DEBUG_X: 20,
    DEBUG_Y: 220,
  },
  COLORS: {
    SCORE: "black",
    TIME: "black",
    LEVEL: "black",
    HIGHSCORE: "black",
    LIVES: "black",
    WIN_MESSAGE: "black",
    LOSE_MESSAGE: "black",
    RESTART_PROMPT: "black",
    DEBUG: "black",
  },
  GAME_OVER: {
    WIN_MESSAGE: {
      TEXT: "ВЫ ПОБЕДИЛИ!",
      FONT_FAMILY: "Rubik Wet Paint, fantasy",
    },
    LOSE_MESSAGE: {
      TEXT: "ВЫ ПРОИГРАЛИ!",
      FONT_FAMILY: "Press Start 2P, monospace",
    },
    RESTART_PROMPT: {
      TEXT: "Нажмите Enter чтобы начать заново",
      FONT_FAMILY: "Rubik Wet Paint, fantasy",
    },
  },
});

export const COLLISION_ANIMATION_CONFIG = Object.freeze({
  SPRITE_WIDTH: 100,
  SPRITE_HEIGHT: 90,
  MIN_SIZE_MODIFIER: 0.5,
  MAX_SIZE_MODIFIER: 1.5,
  MAX_FRAME: 4,
  MIN_FPS: 5,
  MAX_FPS: 15,
});

export const FLOATING_MESSAGE_CONFIG = Object.freeze({
  FONT: "20px Creepsster, fantasy",
  FILL_COLOR: "white",
  STROKE_COLOR: "black",
  TIMER_LIMIT: 100,
  INTERPOLATION_FACTOR: 0.03,
});
