import { EFFECT_CONFIG } from "../../config/game-config.js";
import { randomBetween } from "../../utils/random.js";
import { Particle } from "../base/Particle.js";

export class Dust extends Particle {
  constructor(game, x, y) {
    super(game);

    const {
      SIZE_MIN,
      SIZE_MAX,
      SPEED_X_MIN,
      SPEED_X_MAX,
      SPEED_Y_MIN,
      SPEED_Y_MAX,
      COLOR,
    } = EFFECT_CONFIG.DUST;

    this.size = randomBetween(SIZE_MIN, SIZE_MAX);
    this.x = x;
    this.y = y;
    this.speedX = randomBetween(SPEED_X_MIN, SPEED_X_MAX);
    this.speedY = randomBetween(SPEED_Y_MIN, SPEED_Y_MAX);
    this.color = COLOR;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}
