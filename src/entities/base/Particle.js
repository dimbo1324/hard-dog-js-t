import { BASE_CONFIG } from "../../config/game-config.js";

export class Particle {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
  }

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= BASE_CONFIG.PARTICLE.SIZE_DECREASE_RATE;

    if (this.size < BASE_CONFIG.PARTICLE.MIN_SIZE) {
      this.markedForDeletion = true;
    }
  }
}
