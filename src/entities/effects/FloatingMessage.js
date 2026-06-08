import { FLOATING_MESSAGE_CONFIG } from "../../config/game-config.js";

export class FloatingMessage {
  constructor(value, x, y, targetX, targetY) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.markedForDeletion = false;
    this.timer = 0;
  }

  update() {
    this.x +=
      (this.targetX - this.x) * FLOATING_MESSAGE_CONFIG.INTERPOLATION_FACTOR;
    this.y +=
      (this.targetY - this.y) * FLOATING_MESSAGE_CONFIG.INTERPOLATION_FACTOR;
    this.timer++;

    if (this.timer > FLOATING_MESSAGE_CONFIG.TIMER_LIMIT) {
      this.markedForDeletion = true;
    }
  }

  draw(context) {
    context.font = FLOATING_MESSAGE_CONFIG.FONT;
    context.fillStyle = FLOATING_MESSAGE_CONFIG.FILL_COLOR;
    context.fillText(this.value, this.x, this.y);
    context.fillStyle = FLOATING_MESSAGE_CONFIG.STROKE_COLOR;
    context.fillText(this.value, this.x - 2, this.y - 2);
  }
}
