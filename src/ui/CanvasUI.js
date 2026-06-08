import { assetManager } from "../assets/AssetManager.js";
import { GAME_CONFIG, UI_CONFIG } from "../config/game-config.js";

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
    this.drawLives(context);

    if (this.game.gameOver) {
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
    context.font = `${this.fontSize * UI_CONFIG.FONT.SMALL_MULTIPLIER}px ${
      this.fontFamily
    }`;
    context.fillStyle = UI_CONFIG.COLORS.TIME;
    context.fillText(
      `Время: ${(this.game.time * 0.001).toFixed(1)} / ${
        GAME_CONFIG.MAX_TIME_MINUTES * 60
      } секунд`,
      UI_CONFIG.POSITION.TIME_X,
      UI_CONFIG.POSITION.TIME_Y
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

  drawGameOver(context) {
    context.textAlign = "center";

    const didWin = this.game.score > 2;
    const message = didWin
      ? UI_CONFIG.GAME_OVER.WIN_MESSAGE.TEXT
      : UI_CONFIG.GAME_OVER.LOSE_MESSAGE.TEXT;
    const messageFont = didWin
      ? UI_CONFIG.GAME_OVER.WIN_MESSAGE.FONT_FAMILY
      : UI_CONFIG.GAME_OVER.LOSE_MESSAGE.FONT_FAMILY;
    const messageColor = didWin
      ? UI_CONFIG.COLORS.WIN_MESSAGE
      : UI_CONFIG.COLORS.LOSE_MESSAGE;

    context.font = `${this.fontSize * UI_CONFIG.FONT.GAME_OVER_MULTIPLIER}px ${
      messageFont
    }`;
    context.fillStyle = messageColor;
    context.fillText(
      message,
      this.game.width * 0.5,
      this.game.height * UI_CONFIG.POSITION.GAME_OVER_TEXT_Y
    );

    context.font = `${this.fontSize * UI_CONFIG.FONT.SMALL_MULTIPLIER}px ${
      UI_CONFIG.GAME_OVER.RESTART_PROMPT.FONT_FAMILY
    }`;
    context.fillStyle = UI_CONFIG.COLORS.RESTART_PROMPT;
    context.fillText(
      UI_CONFIG.GAME_OVER.RESTART_PROMPT.TEXT,
      this.game.width * 0.5,
      this.game.height * UI_CONFIG.POSITION.GAME_OVER_TEXT_Y +
        UI_CONFIG.POSITION.GAME_OVER_SUBTEXT_OFFSET
    );
  }
}
