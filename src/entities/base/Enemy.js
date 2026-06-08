import { BASE_CONFIG } from "../../config/game-config.js";

export class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = BASE_CONFIG.ENEMY.FPS;
    this.frameInterval = BASE_CONFIG.ENEMY.FRAME_INTERVAL;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    this.move(deltaTime);
    this.markIfOutsideScreen();
  }

  draw(context) {
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  move(deltaTime) {
    this.x -= this.speedX + this.game.speed * BASE_CONFIG.ENEMY.MOVEMENT_SPEED;
    this.y += this.speedY;
    this.updateAnimationFrame(deltaTime);
  }

  updateAnimationFrame(deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
      return;
    }

    this.frameTimer += deltaTime;
  }

  markIfOutsideScreen() {
    if (this.x < -this.width) {
      this.markedForDeletion = true;
    }
  }
}
