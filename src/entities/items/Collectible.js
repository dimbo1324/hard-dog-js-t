import {
  COLLECTIBLE_CONFIG,
  COLLECTIBLE_TYPES,
} from "../../config/collectibles.js";
import { rectanglesIntersect } from "../../utils/collision.js";
import { randomArrayItem, randomBetween } from "../../utils/random.js";

const weightedTypes = Object.entries(COLLECTIBLE_CONFIG.TYPES).flatMap(
  ([type, config]) => Array(Math.max(1, Math.round(config.weight * 100))).fill(type)
);

export class Collectible {
  constructor(game) {
    this.game = game;
    this.type = randomArrayItem(weightedTypes);
    this.config = COLLECTIBLE_CONFIG.TYPES[this.type];
    this.width = COLLECTIBLE_CONFIG.WIDTH;
    this.height = COLLECTIBLE_CONFIG.HEIGHT;
    this.x = this.game.width + Math.random() * 180;
    this.baseY = randomBetween(
      COLLECTIBLE_CONFIG.SPAWN_Y_MIN,
      this.game.height * COLLECTIBLE_CONFIG.SPAWN_Y_MAX_RATIO
    );
    this.y = this.baseY;
    this.angle = Math.random() * Math.PI * 2;
    this.markedForDeletion = false;
  }

  update() {
    this.x -= COLLECTIBLE_CONFIG.SPEED_X + this.game.speed;
    this.angle += COLLECTIBLE_CONFIG.FLOATING_SPEED;
    this.y =
      this.baseY + Math.sin(this.angle) * COLLECTIBLE_CONFIG.FLOATING_AMPLITUDE;

    if (rectanglesIntersect(this, this.game.player)) {
      this.markedForDeletion = true;
      this.game.collectItem(this);
      return;
    }

    if (this.x < -this.width) {
      this.markedForDeletion = true;
    }
  }

  draw(context) {
    context.save();
    context.translate(this.x + this.width * 0.5, this.y + this.height * 0.5);
    context.rotate(Math.sin(this.angle) * 0.12);
    this.drawByType(context);
    context.restore();

    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  drawByType(context) {
    if (this.type === COLLECTIBLE_TYPES.HEART) {
      this.drawHeart(context);
      return;
    }

    if (this.type === COLLECTIBLE_TYPES.CLOCK) {
      this.drawClock(context);
      return;
    }

    if (this.type === COLLECTIBLE_TYPES.SHIELD) {
      this.drawShield(context);
      return;
    }

    this.drawBone(context);
  }

  drawBone(context) {
    context.fillStyle = this.config.color;
    context.strokeStyle = this.config.strokeColor;
    context.lineWidth = 3;
    this.drawRoundedRect(context, -16, -6, 32, 12, 6);
    context.fill();
    context.stroke();
    [-16, 16].forEach((x) => {
      [-8, 8].forEach((y) => {
        context.beginPath();
        context.arc(x, y, 7, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      });
    });
  }

  drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  drawHeart(context) {
    context.fillStyle = this.config.color;
    context.strokeStyle = this.config.strokeColor;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, 15);
    context.bezierCurveTo(-24, 0, -18, -18, 0, -7);
    context.bezierCurveTo(18, -18, 24, 0, 0, 15);
    context.fill();
    context.stroke();
  }

  drawClock(context) {
    context.fillStyle = "#ffffff";
    context.strokeStyle = this.config.strokeColor;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(0, 0, 17, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.strokeStyle = this.config.color;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, -10);
    context.moveTo(0, 0);
    context.lineTo(8, 5);
    context.stroke();
  }

  drawShield(context) {
    context.fillStyle = this.config.color;
    context.strokeStyle = this.config.strokeColor;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, -18);
    context.lineTo(17, -10);
    context.lineTo(12, 10);
    context.lineTo(0, 19);
    context.lineTo(-12, 10);
    context.lineTo(-17, -10);
    context.closePath();
    context.fill();
    context.stroke();
  }
}
