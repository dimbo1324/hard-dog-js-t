import { assetManager } from "../../assets/AssetManager.js";
import { ENEMY_CONFIG } from "../../config/game-config.js";
import { Enemy } from "../base/Enemy.js";

export class GroundEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;

    const { WIDTH, HEIGHT, SPEED_X, SPEED_Y, MAX_FRAME, IMAGE } =
      ENEMY_CONFIG.GROUND;

    this.width = WIDTH;
    this.height = HEIGHT;
    this.x = this.game.width;
    this.y = this.game.height - HEIGHT - this.game.groundMargin;
    this.speedX = SPEED_X;
    this.speedY = SPEED_Y;
    this.maxFrame = MAX_FRAME;
    this.image = assetManager.getImage(IMAGE);
  }
}
