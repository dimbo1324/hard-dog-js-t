import { EFFECT_CONFIG } from "../../config/game-config.js";

export class ScreenEffects {
  constructor() {
    this.shakeTimer = 0;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.flashAlpha = 0;
    this.flashColor = "255, 255, 255";
  }

  update(deltaTime) {
    this.shakeTimer = Math.max(0, this.shakeTimer - deltaTime);
    this.flashAlpha *= EFFECT_CONFIG.SCREEN.FLASH_FADE_RATE;

    if (this.flashAlpha < 0.01) {
      this.flashAlpha = 0;
    }
  }

  shake(intensity, duration) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = duration;
    this.shakeTimer = Math.max(this.shakeTimer, duration);
  }

  flash(color, alpha) {
    this.flashColor = color;
    this.flashAlpha = Math.max(this.flashAlpha, alpha);
  }

  applyShake(context) {
    if (this.shakeTimer <= 0 || this.shakeDuration <= 0) {
      return;
    }

    const progress = this.shakeTimer / this.shakeDuration;
    const offsetX = (Math.random() - 0.5) * this.shakeIntensity * progress;
    const offsetY = (Math.random() - 0.5) * this.shakeIntensity * progress;
    context.translate(offsetX, offsetY);
  }

  drawFlash(context, width, height) {
    if (this.flashAlpha <= 0) {
      return;
    }

    context.save();
    context.fillStyle = `rgba(${this.flashColor}, ${this.flashAlpha})`;
    context.fillRect(0, 0, width, height);
    context.restore();
  }
}
