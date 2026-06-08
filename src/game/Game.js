import { AudioManager } from "../audio/AudioManager.js";
import {
  COLLECTIBLE_CONFIG,
  COLLECTIBLE_TYPES,
} from "../config/collectibles.js";
import {
  EFFECT_CONFIG,
  GAME_CONFIG,
  PLAYER_CONFIG,
  ROLL_STAMINA_CONFIG,
} from "../config/game-config.js";
import { GAME_STATUS } from "../config/game-status.js";
import { LEVEL_CONFIG, LEVELS } from "../config/levels.js";
import { DIFFICULTY_SETTINGS, normalizeSettings } from "../config/settings.js";
import { PLAYER_STATES } from "../config/states.js";
import { Collectible } from "../entities/items/Collectible.js";
import { ClimbingEnemy } from "../entities/enemies/ClimbingEnemy.js";
import { FlyingEnemy } from "../entities/enemies/FlyingEnemy.js";
import { GroundEnemy } from "../entities/enemies/GroundEnemy.js";
import { FloatingMessage } from "../entities/effects/FloatingMessage.js";
import { ScreenEffects } from "../entities/effects/ScreenEffects.js";
import { Player } from "../entities/player/Player.js";
import { InputHandler } from "../input/InputHandler.js";
import { Background } from "../rendering/background/Background.js";
import { gameStorage } from "../storage/GameStorage.js";
import { CanvasUI } from "../ui/CanvasUI.js";
import { clamp } from "../utils/clamp.js";

export class Game extends EventTarget {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
    this.groundMargin = GAME_CONFIG.GROUND_MARGIN;
    this.settings = normalizeSettings(gameStorage.getSettings());
    this.audio = new AudioManager({ isMuted: this.settings.isMuted });
    this.input = new InputHandler(this);
    this.ui = new CanvasUI(this);
    this.screenEffects = new ScreenEffects();
    this.highScore = gameStorage.getHighScore();
    this.fontColor = GAME_CONFIG.FONT_COLOR;
    this.status = GAME_STATUS.MENU;
    this.debug = this.settings.showFps || GAME_CONFIG.DEBUG_MODE;
    this.lastFps = 0;
    this.frameCounter = 0;
    this.frameTimer = 0;
    this.resetSession();
    this.emitStateChange();
  }

  resetSession() {
    this.levelIndex = 0;
    this.score = GAME_CONFIG.INITIAL_SCORE;
    this.totalTime = 0;
    this.levelTime = 0;
    this.time = 0;
    this.lives = GAME_CONFIG.INITIAL_LIVES;
    this.gameOver = false;
    this.combo = 0;
    this.comboTimer = 0;
    this.scoreTimer = 0;
    this.invulnerabilityTimer = 0;
    this.shieldTimer = 0;
    this.rollStamina = ROLL_STAMINA_CONFIG.INITIAL_STAMINA;
    this.rollRecoveryDelayTimer = 0;
    this.rollBoostTimer = 0;
    this.rollBlockMessageTimer = 0;
    this.levelMessageTimer = 0;
    this.speed = 0;
    this.background = new Background(this);
    this.player = new Player(this);
    this.enemies = [];
    this.items = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];
    this.enemyTimer = 0;
    this.itemTimer = 0;
    this.maxParticles = GAME_CONFIG.MAX_PARTICLES;
    this.applyLevelSettings();
    this.player.setState(PLAYER_STATES.SITTING, 0);
  }

  applyLevelSettings() {
    const level = this.currentLevel;
    const difficulty = this.currentDifficulty;
    this.maxSpeed = level.maxSpeed * difficulty.speedMultiplier;
    this.enemyInterval = level.enemyInterval * difficulty.enemyIntervalMultiplier;
    this.itemInterval = level.itemInterval * difficulty.itemIntervalMultiplier;
  }

  update(deltaTime) {
    this.updateDiagnostics(deltaTime);
    this.screenEffects.update(deltaTime);

    if (this.status !== GAME_STATUS.PLAYING) {
      return;
    }

    this.levelTime += deltaTime;
    this.totalTime += deltaTime;
    this.time = this.levelTime;
    this.comboTimer = Math.max(0, this.comboTimer - deltaTime);
    this.invulnerabilityTimer = Math.max(0, this.invulnerabilityTimer - deltaTime);
    this.shieldTimer = Math.max(0, this.shieldTimer - deltaTime);
    this.rollRecoveryDelayTimer = Math.max(0, this.rollRecoveryDelayTimer - deltaTime);
    this.rollBoostTimer = Math.max(0, this.rollBoostTimer - deltaTime);
    this.rollBlockMessageTimer = Math.max(0, this.rollBlockMessageTimer - deltaTime);
    this.levelMessageTimer = Math.max(0, this.levelMessageTimer - deltaTime);

    if (this.comboTimer <= 0) {
      this.combo = 0;
    }

    this.updateRollStamina(deltaTime);
    this.updateSurvivalScore(deltaTime);
    this.background.update();
    this.player.update(this.input.activeKeys, deltaTime);
    this.updateEnemies(deltaTime);
    this.updateItems(deltaTime);
    this.updateFloatingMessages();
    this.updateParticles();
    this.limitParticles();
    this.removeDeletedEntities();
    this.checkLevelProgression();
  }

  draw(context) {
    context.save();
    this.screenEffects.applyShake(context);
    this.background.draw(context);
    this.items.forEach((item) => item.draw(context));
    this.player.draw(context);
    this.enemies.forEach((enemy) => enemy.draw(context));
    this.particles.forEach((particle) => particle.draw(context));
    this.collisions.forEach((collision) => collision.draw(context));
    this.floatingMessages.forEach((floatingMessage) =>
      floatingMessage.draw(context)
    );
    context.restore();

    this.screenEffects.drawFlash(context, this.width, this.height);
    this.ui.draw(context);
  }

  start() {
    if (this.status === GAME_STATUS.PLAYING) {
      return;
    }

    this.resetSession();
    this.status = GAME_STATUS.PLAYING;
    this.gameOver = false;
    this.audio.resume();
    this.audio.playStart();
    this.emitStateChange();
  }

  restart() {
    this.start();
  }

  handlePrimaryAction() {
    if (this.status === GAME_STATUS.MENU) {
      this.start();
      return;
    }

    if (this.status === GAME_STATUS.PAUSED) {
      this.resume();
      return;
    }

    if (this.status === GAME_STATUS.GAME_OVER || this.status === GAME_STATUS.WIN) {
      this.restart();
    }
  }

  togglePause() {
    if (this.status === GAME_STATUS.PLAYING) {
      this.pause();
      return;
    }

    if (this.status === GAME_STATUS.PAUSED) {
      this.resume();
    }
  }

  pause() {
    if (this.status !== GAME_STATUS.PLAYING) {
      return;
    }

    this.status = GAME_STATUS.PAUSED;
    this.input.clearActiveKeys();
    this.emitStateChange();
  }

  resume() {
    if (this.status !== GAME_STATUS.PAUSED) {
      return;
    }

    this.status = GAME_STATUS.PLAYING;
    this.audio.resume();
    this.emitStateChange();
  }

  finishGame(status) {
    if (this.status === status) {
      return;
    }

    this.status = status;
    this.gameOver = true;
    this.speed = 0;
    this.input.clearActiveKeys();
    this.saveHighScore();

    if (status === GAME_STATUS.WIN) {
      this.audio.playWin();
    } else {
      this.audio.playLose();
    }

    this.emitStateChange();
  }

  advanceLevel() {
    this.levelIndex++;
    this.levelTime = 0;
    this.time = 0;
    this.enemyTimer = 0;
    this.itemTimer = 0;
    this.enemies.length = 0;
    this.items.length = 0;
    this.score += LEVEL_CONFIG.SCORE_FOR_LEVEL_COMPLETE;
    this.levelMessageTimer = LEVEL_CONFIG.LEVEL_TRANSITION_MESSAGE_TIME;
    this.applyLevelSettings();
    this.addFloatingMessage(`Level ${this.currentLevel.id}`, this.width * 0.5, this.height * 0.42);
    this.screenEffects.flash("255, 255, 255", EFFECT_CONFIG.SCREEN.FLASH_COLLECT_ALPHA);
    this.audio.playStart();
    this.emitStateChange();
  }

  checkLevelProgression() {
    if (this.levelTime <= this.currentLevel.durationMs) {
      return;
    }

    if (this.levelIndex >= LEVELS.length - 1) {
      this.finishGame(GAME_STATUS.WIN);
      return;
    }

    this.advanceLevel();
  }

  addEnemy() {
    const { enemyMix } = this.currentLevel;

    if (this.speed > 0 && Math.random() < enemyMix.ground) {
      this.enemies.push(new GroundEnemy(this));
    } else if (this.speed > 0 && Math.random() < enemyMix.climbing) {
      this.enemies.push(new ClimbingEnemy(this));
    }

    if (enemyMix.flying > 0) {
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  updateEnemies(deltaTime) {
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }

    this.enemies.forEach((enemy) => enemy.update(deltaTime));
  }

  updateItems(deltaTime) {
    if (
      this.itemTimer > this.itemInterval &&
      this.items.length < COLLECTIBLE_CONFIG.MAX_ITEMS
    ) {
      this.items.push(new Collectible(this));
      this.itemTimer = 0;
    } else {
      this.itemTimer += deltaTime;
    }

    this.items.forEach((item) => item.update(deltaTime));
  }

  updateParticles() {
    this.particles.forEach((particle) => particle.update());
  }

  updateFloatingMessages() {
    this.floatingMessages.forEach((floatingMessage) => floatingMessage.update());
  }

  updateSurvivalScore(deltaTime) {
    this.scoreTimer += deltaTime;

    if (this.scoreTimer < 1000) {
      return;
    }

    this.score += Math.round(
      GAME_CONFIG.SCORE_PER_SECOND * this.currentDifficulty.scoreMultiplier
    );
    this.scoreTimer = 0;
  }

  updateRollStamina(deltaTime) {
    if (this.isRollStateActive) {
      const drainMultiplier = this.hasActiveRollBoost
        ? ROLL_STAMINA_CONFIG.BOOST_DRAIN_MULTIPLIER
        : 1;
      const drainAmount =
        ROLL_STAMINA_CONFIG.DRAIN_PER_SECOND * drainMultiplier * (deltaTime / 1000);

      this.rollStamina = clamp(
        this.rollStamina - drainAmount,
        0,
        ROLL_STAMINA_CONFIG.MAX_STAMINA
      );

      if (this.rollStamina <= 0) {
        this.rollRecoveryDelayTimer = ROLL_STAMINA_CONFIG.EXHAUSTED_RECOVERY_DELAY;
      }
      return;
    }

    if (this.rollRecoveryDelayTimer > 0) {
      return;
    }

    this.rollStamina = clamp(
      this.rollStamina + ROLL_STAMINA_CONFIG.RECOVERY_PER_SECOND * (deltaTime / 1000),
      0,
      ROLL_STAMINA_CONFIG.MAX_STAMINA
    );
  }

  requestRoll() {
    if (this.canStartRoll()) {
      return true;
    }

    this.notifyRollBlocked();
    return false;
  }

  canStartRoll() {
    return this.rollStamina >= ROLL_STAMINA_CONFIG.MIN_STAMINA_TO_START;
  }

  canSustainRoll() {
    return this.rollStamina > 0;
  }

  notifyRollBlocked() {
    if (this.rollBlockMessageTimer > 0 || !this.player) {
      return;
    }

    this.rollBlockMessageTimer = ROLL_STAMINA_CONFIG.BLOCKED_MESSAGE_COOLDOWN;
    this.addFloatingMessage("Need roll energy", this.player.x + this.player.width * 0.5, this.player.y);
  }

  activateRollBoost(config) {
    const staminaAmount = config.stamina ?? ROLL_STAMINA_CONFIG.BOOST_RECOVERY_AMOUNT;
    const boostDuration = config.boostMs ?? ROLL_STAMINA_CONFIG.BOOST_DURATION_MS;

    this.rollStamina = clamp(
      this.rollStamina + staminaAmount,
      0,
      ROLL_STAMINA_CONFIG.MAX_STAMINA
    );
    this.rollRecoveryDelayTimer = 0;
    this.rollBoostTimer = Math.max(this.rollBoostTimer, boostDuration);
  }

  updateDiagnostics(deltaTime) {
    this.frameCounter++;
    this.frameTimer += deltaTime;

    if (this.frameTimer >= 500) {
      this.lastFps = Math.round((this.frameCounter * 1000) / this.frameTimer);
      this.frameCounter = 0;
      this.frameTimer = 0;
    }
  }

  limitParticles() {
    if (this.particles.length > this.maxParticles) {
      this.particles.length = this.maxParticles;
    }
  }

  removeDeletedEntities() {
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.items = this.items.filter((item) => !item.markedForDeletion);
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
    this.collisions = this.collisions.filter((collision) => !collision.markedForDeletion);
    this.floatingMessages = this.floatingMessages.filter(
      (floatingMessage) => !floatingMessage.markedForDeletion
    );
  }

  registerEnemyDestroyed(enemy) {
    const comboBonus = Math.max(0, this.combo);
    const earnedScore = Math.round(
      (PLAYER_CONFIG.SCORE_INCREMENT + comboBonus) *
        this.currentDifficulty.scoreMultiplier
    );

    this.combo++;
    this.comboTimer = GAME_CONFIG.COMBO_RESET_TIME;
    this.score += earnedScore;
    this.addFloatingMessage(`+${earnedScore} x${this.combo}`, enemy.x, enemy.y);
    this.screenEffects.shake(
      EFFECT_CONFIG.SCREEN.SHAKE_INTENSITY_DESTROY,
      EFFECT_CONFIG.SCREEN.SHAKE_DURATION_DESTROY
    );
    this.audio.playDestroy();
  }

  registerPlayerHit() {
    if (this.hasActiveShield || this.invulnerabilityTimer > 0) {
      this.addFloatingMessage("Blocked", this.player.x, this.player.y);
      this.audio.playShield();
      return false;
    }

    this.lives -= PLAYER_CONFIG.LIVES_DECREMENT;
    this.combo = 0;
    this.invulnerabilityTimer = GAME_CONFIG.INVULNERABILITY_TIME;
    this.screenEffects.shake(
      EFFECT_CONFIG.SCREEN.SHAKE_INTENSITY_HIT,
      EFFECT_CONFIG.SCREEN.SHAKE_DURATION_HIT
    );
    this.screenEffects.flash("255, 30, 30", EFFECT_CONFIG.SCREEN.FLASH_HIT_ALPHA);
    this.audio.playHit();

    if (this.lives <= 0) {
      this.finishGame(GAME_STATUS.GAME_OVER);
    }

    return true;
  }

  collectItem(item) {
    const config = item.config;

    if (item.type === COLLECTIBLE_TYPES.BONE) {
      this.score += config.score;
    }

    if (item.type === COLLECTIBLE_TYPES.HEART) {
      this.lives = clamp(this.lives + config.lives, 0, GAME_CONFIG.MAX_LIVES);
    }

    if (item.type === COLLECTIBLE_TYPES.CLOCK) {
      this.levelTime = Math.max(0, this.levelTime - config.timeMs);
      this.time = this.levelTime;
    }

    if (item.type === COLLECTIBLE_TYPES.SHIELD) {
      this.shieldTimer = Math.max(this.shieldTimer, config.shieldMs);
    }

    if (item.type === COLLECTIBLE_TYPES.ROLL_BOOST) {
      this.activateRollBoost(config);
    }

    this.addFloatingMessage(config.message, item.x, item.y);
    this.screenEffects.flash("255, 255, 255", EFFECT_CONFIG.SCREEN.FLASH_COLLECT_ALPHA);
    this.audio.playCollect();
  }

  addFloatingMessage(value, x, y) {
    this.floatingMessages.push(
      new FloatingMessage(value, x, y, Math.floor(Math.random() * 360), 50)
    );
  }

  toggleDebug() {
    this.debug = !this.debug;
    this.updateSettings({ showFps: this.debug });
  }

  toggleMute() {
    this.updateSettings({ isMuted: !this.settings.isMuted });
  }

  updateSettings(partialSettings) {
    this.settings = normalizeSettings({ ...this.settings, ...partialSettings });
    this.audio.setMuted(this.settings.isMuted);
    this.debug = this.settings.showFps;
    gameStorage.saveSettings(this.settings);
    this.applyLevelSettings();
    this.emitStateChange();
  }

  resetHighScore() {
    gameStorage.resetHighScore();
    this.highScore = 0;
    this.emitStateChange();
  }

  saveHighScore() {
    gameStorage.saveHighScore(this.score);
    this.highScore = gameStorage.getHighScore();
  }

  emitStateChange() {
    this.dispatchEvent(new CustomEvent("statechange", { detail: this.snapshot }));
  }

  destroy() {
    this.input.destroy();
  }

  get currentLevel() {
    return LEVELS[this.levelIndex] || LEVELS[0];
  }

  get currentDifficulty() {
    return DIFFICULTY_SETTINGS[this.settings.difficulty];
  }

  get hasActiveShield() {
    return this.shieldTimer > 0;
  }

  get hasActiveRollBoost() {
    return this.rollBoostTimer > 0;
  }

  get isRollStateActive() {
    return (
      this.player?.currentState === this.player?.states[PLAYER_STATES.ROLLING] ||
      this.player?.currentState === this.player?.states[PLAYER_STATES.DIVING]
    );
  }

  get snapshot() {
    return {
      status: this.status,
      score: this.score,
      highScore: this.highScore,
      level: this.currentLevel,
      levelIndex: this.levelIndex,
      levelCount: LEVELS.length,
      lives: this.lives,
      settings: this.settings,
      isShieldActive: this.hasActiveShield,
      isRollBoostActive: this.hasActiveRollBoost,
      rollStamina: this.rollStamina,
      rollStaminaMax: ROLL_STAMINA_CONFIG.MAX_STAMINA,
    };
  }
}
