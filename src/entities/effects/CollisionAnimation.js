import { assetManager } from "../../assets/AssetManager.js";
import { COLLISION_ANIMATION_CONFIG } from "../../config/game-config.js";
import { randomBetween } from "../../utils/random.js";

export class CollisionAnimation {
  constructor(game, x, y) {
    this.game = game;
    this.image = assetManager.getImage("boom");
    this.spriteWidth = COLLISION_ANIMATION_CONFIG.SPRITE_WIDTH;
    this.spriteHeight = COLLISION_ANIMATION_CONFIG.SPRITE_HEIGHT;
    this.sizeModifier = randomBetween(
      COLLISION_ANIMATION_CONFIG.MIN_SIZE_MODIFIER,
      COLLISION_ANIMATION_CONFIG.MAX_SIZE_MODIFIER
    );
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.frameX = 0;
    this.maxFrame = COLLISION_ANIMATION_CONFIG.MAX_FRAME;
    this.markedForDeletion = false;
    this.fps = randomBetween(
      COLLISION_ANIMATION_CONFIG.MIN_FPS,
      COLLISION_ANIMATION_CONFIG.MAX_FPS
    );
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(deltaTime) {
    this.x -= this.game.speed;

    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    if (this.frameX >= this.maxFrame) {
      this.markedForDeletion = true;
    }
  }
}
