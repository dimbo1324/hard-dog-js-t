import { assetManager } from "../../assets/AssetManager.js";
import { EFFECT_CONFIG } from "../../config/game-config.js";
import { randomBetween } from "../../utils/random.js";
import { Particle } from "../base/Particle.js";

export class Fire extends Particle {
  constructor(game, x, y) {
    super(game);

    const {
      SIZE_MIN,
      SIZE_MAX,
      SPEED_X,
      SPEED_Y,
      ANGLE_VELOCITY_MIN,
      ANGLE_VELOCITY_MAX,
      IMAGE,
    } = EFFECT_CONFIG.FIRE;

    this.image = assetManager.getImage(IMAGE);
    this.size = randomBetween(SIZE_MIN, SIZE_MAX);
    this.x = x;
    this.y = y;
    this.speedX = SPEED_X;
    this.speedY = SPEED_Y;
    this.angle = 0;
    this.angleVelocity = randomBetween(ANGLE_VELOCITY_MIN, ANGLE_VELOCITY_MAX);
  }

  update() {
    super.update();
    this.angle += this.angleVelocity;
    this.x += Math.sin(this.angle * 5);
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    context.restore();
  }
}
