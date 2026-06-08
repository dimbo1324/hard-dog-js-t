import { assetManager } from "../../assets/AssetManager.js";
import { ENEMY_CONFIG } from "../../config/game-config.js";
import { randomArrayItem } from "../../utils/random.js";
import { Enemy } from "../base/Enemy.js";

export class ClimbingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;

    const { WIDTH, HEIGHT, SPEED_Y_OPTIONS, MAX_FRAME, IMAGE } =
      ENEMY_CONFIG.CLIMBING;

    this.width = WIDTH;
    this.height = HEIGHT;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = 0;
    this.speedY = randomArrayItem(SPEED_Y_OPTIONS);
    this.maxFrame = MAX_FRAME;
    this.image = assetManager.getImage(IMAGE);
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.y = this.game.height - this.height - this.game.groundMargin;
      this.speedY *= -1;
    }

    if (this.y < -this.height) {
      this.markedForDeletion = true;
    }
  }

  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(
      this.x + this.width / 2,
      this.y + ENEMY_CONFIG.CLIMBING.DRAW_LINE_OFFSET
    );
    context.stroke();
  }
}
