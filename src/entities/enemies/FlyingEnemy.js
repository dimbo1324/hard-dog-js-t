import { assetManager } from "../../assets/AssetManager.js";
import { ENEMY_CONFIG } from "../../config/game-config.js";
import { randomBetween } from "../../utils/random.js";
import { Enemy } from "../base/Enemy.js";

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;

    const {
      WIDTH,
      HEIGHT,
      SPEED_X,
      ANGLE_VELOCITY_MIN,
      ANGLE_VELOCITY_MAX,
      MAX_FRAME,
      IMAGE,
    } = ENEMY_CONFIG.FLYING;

    this.width = WIDTH;
    this.height = HEIGHT;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = SPEED_X;
    this.speedY = 0;
    this.maxFrame = MAX_FRAME;
    this.image = assetManager.getImage(IMAGE);
    this.angle = 0;
    this.angleVelocity = randomBetween(ANGLE_VELOCITY_MIN, ANGLE_VELOCITY_MAX);
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.angleVelocity;
    this.y += Math.sin(this.angle);
  }
}
