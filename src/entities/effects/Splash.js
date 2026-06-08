import { assetManager } from "../../assets/AssetManager.js";
import { EFFECT_CONFIG } from "../../config/game-config.js";
import { randomBetween } from "../../utils/random.js";
import { Particle } from "../base/Particle.js";

export class Splash extends Particle {
  constructor(game, x, y) {
    super(game);

    const {
      SIZE_MIN,
      SIZE_MAX,
      SPEED_X_MIN,
      SPEED_X_MAX,
      SPEED_Y_MIN,
      SPEED_Y_MAX,
      GRAVITY_INCREMENT,
      IMAGE,
    } = EFFECT_CONFIG.SPLASH;

    this.size = randomBetween(SIZE_MIN, SIZE_MAX);
    this.x = x - this.size * 0.4;
    this.y = y - this.size * 0.5;
    this.speedX = randomBetween(SPEED_X_MIN, SPEED_X_MAX);
    this.speedY = randomBetween(SPEED_Y_MIN, SPEED_Y_MAX);
    this.gravity = 0;
    this.gravityIncrement = GRAVITY_INCREMENT;
    this.image = assetManager.getImage(IMAGE);
  }

  update() {
    super.update();
    this.gravity += this.gravityIncrement;
    this.y += this.gravity;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}
