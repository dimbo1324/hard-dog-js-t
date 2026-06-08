import { Game } from "../game/Game.js";

export class GameLoop {
  constructor({ context, width, height }) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.game = new Game(width, height);
    this.lastTime = 0;
    this.animationFrameId = null;
    this.animate = this.animate.bind(this);
  }

  start() {
    this.animate(0);
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    this.context.clearRect(0, 0, this.width, this.height);
    this.game.update(deltaTime);
    this.game.draw(this.context);

    if (!this.game.gameOver) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  }
}
