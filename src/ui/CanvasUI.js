import { assetManager } from "../assets/AssetManager.js";
import { UI_CONFIG } from "../config/game-config.js";
import { GAME_STATUS } from "../config/game-status.js";

export class CanvasUI {
  constructor(game) {
    this.game = game;
    this.fontSize = UI_CONFIG.FONT.SIZE;
    this.fontFamily = UI_CONFIG.FONT.FAMILY;
    this.lifeImage = assetManager.getImage("lives");
  }

  draw(context) {
    context.save();
    this.applyTextShadow(context);
    this.drawScore(context);
    this.drawTimer(context);
    this.drawLevel(context);
    this.drawHighScore(context);
    this.drawLives(context);
    this.drawStatusBadges(context);

    if (this.game.debug) {
      this.drawDebug(context);
    }

    if (this.game.status === GAME_STATUS.GAME_OVER || this.game.status === GAME_STATUS.WIN) {
      this.drawGameOver(context);
    }

    context.restore();
  }

  applyTextShadow(context) {
    context.shadowOffsetX = UI_CONFIG.SHADOW.OFFSET_X;
    context.shadowOffsetY = UI_CONFIG.SHADOW.OFFSET_Y;
    context.shadowColor = UI_CONFIG.SHADOW.COLOR;
    context.shadowBlur = UI_CONFIG.SHADOW.BLUR;
  }

  drawScore(context) {
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "left";
    context.fillStyle = UI_CONFIG.COLORS.SCORE;
    context.fillText(
      `Счёт: ${this.game.score}`,
      UI_CONFIG.POSITION.SCORE_X,
      UI_CONFIG.POSITION.SCORE_Y
    );
  }

  drawTimer(context) {
    context.font = `${this.fontSize * UI_CONFIG.FONT.SMALL_MULTIPLIER}px ${this.fontFamily}`;
    context.fillStyle = UI_CONFIG.COLORS.TIME;
    context.fillText(
      `Время: ${(this.game.levelTime * 0.001).toFixed(1)} / ${(
        this.game.currentLevel.durationMs * 0.001
      ).toFixed(0)} секунд`,
      UI_CONFIG.POSITION.TIME_X,
      UI_CONFIG.POSITION.TIME_Y
    );
  }

  drawLevel(context) {
    context.font = `${this.fontSize * UI_CONFIG.FONT.SMALL_MULTIPLIER}px ${this.fontFamily}`;
    context.fillStyle = UI_CONFIG.COLORS.LEVEL;
    context.fillText(
      `Уровень: ${this.game.currentLevel.id}/${this.game.snapshot.levelCount} — ${this.game.currentLevel.name}`,
      UI_CONFIG.POSITION.LEVEL_X,
      UI_CONFIG.POSITION.LEVEL_Y
    );
  }

  drawHighScore(context) {
    context.font = `${this.fontSize * 0.6}px ${this.fontFamily}`;
    context.fillStyle = UI_CONFIG.COLORS.HIGHSCORE;
    context.fillText(
      `Рекорд: ${this.game.highScore}`,
      UI_CONFIG.POSITION.HIGHSCORE_X,
      UI_CONFIG.POSITION.HIGHSCORE_Y
    );
  }

  drawLives(context) {
    context.fillStyle = UI_CONFIG.COLORS.LIVES;

    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(
        this.lifeImage,
        UI_CONFIG.POSITION.LIVES_START_X + UI_CONFIG.POSITION.LIVES_SPACING * i,
        UI_CONFIG.POSITION.LIVES_Y,
        UI_CONFIG.POSITION.LIVES_SIZE,
        UI_CONFIG.POSITION.LIVES_SIZE
      );
    }
  }

  drawStatusBadges(context) {
    const badges = [];

    if (this.game.combo > 1) {
      badges.push(`Combo x${this.game.combo}`);
    }

    if (this.game.hasActiveShield) {
      badges.push(`Shield ${(this.game.shieldTimer * 0.001).toFixed(1)}s`);
    }

    if (!badges.length) {
      return;
    }

    context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
    context.textAlign = "right";
    context.fillStyle = "black";
    badges.forEach((badge, index) => {
      context.fillText(badge, this.game.width - 25, 50 + index * 28);
    });
  }

  drawDebug(context) {
    const lines = [
      `FPS: ${this.game.lastFps}`,
      `State: ${this.game.player.currentState?.state || "unknown"}`,
      `Enemies: ${this.game.enemies.length}`,
      `Items: ${this.game.items.length}`,
      `x:${Math.round(this.game.player.x)} y:${Math.round(this.game.player.y)}`,
    ];

    context.font = `16px monospace`;
    context.textAlign = "left";
    context.fillStyle = UI_CONFIG.COLORS.DEBUG;
    lines.forEach((line, index) => {
      context.fillText(
        line,
        UI_CONFIG.POSITION.DEBUG_X,
        UI_CONFIG.POSITION.DEBUG_Y + index * 20
      );
    });
  }

  drawGameOver(context) {
    context.textAlign = "center";

    const didWin = this.game.status === GAME_STATUS.WIN;
    const message = didWin
      ? UI_CONFIG.GAME_OVER.WIN_MESSAGE.TEXT
      : UI_CONFIG.GAME_OVER.LOSE_MESSAGE.TEXT;
    const messageFont = didWin
      ? UI_CONFIG.GAME_OVER.WIN_MESSAGE.FONT_FAMILY
      : UI_CONFIG.GAME_OVER.LOSE_MESSAGE.FONT_FAMILY;
    const messageColor = didWin
      ? UI_CONFIG.COLORS.WIN_MESSAGE
      : UI_CONFIG.COLORS.LOSE_MESSAGE;

    context.font = `${this.fontSize * UI_CONFIG.FONT.GAME_OVER_MULTIPLIER}px ${messageFont}`;
    context.fillStyle = messageColor;
    context.fillText(
      message,
      this.game.width * 0.5,
      this.game.height * UI_CONFIG.POSITION.GAME_OVER_TEXT_Y
    );

    context.font = `${this.fontSize * UI_CONFIG.FONT.SMALL_MULTIPLIER}px ${UI_CONFIG.GAME_OVER.RESTART_PROMPT.FONT_FAMILY}`;
    context.fillStyle = UI_CONFIG.COLORS.RESTART_PROMPT;
    context.fillText(
      UI_CONFIG.GAME_OVER.RESTART_PROMPT.TEXT,
      this.game.width * 0.5,
      this.game.height * UI_CONFIG.POSITION.GAME_OVER_TEXT_Y +
        UI_CONFIG.POSITION.GAME_OVER_SUBTEXT_OFFSET
    );
  }
}
