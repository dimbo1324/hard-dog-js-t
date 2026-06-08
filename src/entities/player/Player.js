import { assetManager } from "../../assets/AssetManager.js";
import { CONTROL_KEYS } from "../../config/controls.js";
import { PLAYER_CONFIG } from "../../config/game-config.js";
import { PLAYER_STATES } from "../../config/states.js";
import { rectanglesIntersect } from "../../utils/collision.js";
import { CollisionAnimation } from "../effects/CollisionAnimation.js";
import { DivingState } from "../../states/DivingState.js";
import { FallingState } from "../../states/FallingState.js";
import { HitState } from "../../states/HitState.js";
import { JumpingState } from "../../states/JumpingState.js";
import { RollingState } from "../../states/RollingState.js";
import { RunningState } from "../../states/RunningState.js";
import { SittingState } from "../../states/SittingState.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.speed = PLAYER_CONFIG.INITIAL_SPEED;
    this.maxSpeed = PLAYER_CONFIG.MAX_SPEED;
    this.width = PLAYER_CONFIG.WIDTH;
    this.height = PLAYER_CONFIG.HEIGHT;
    this.image = assetManager.getImage("player");
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 0;
    this.vy = 0;
    this.weight = PLAYER_CONFIG.WEIGHT;
    this.fps = PLAYER_CONFIG.FPS;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [
      new SittingState(this.game),
      new RunningState(this.game),
      new JumpingState(this.game),
      new FallingState(this.game),
      new RollingState(this.game),
      new DivingState(this.game),
      new HitState(this.game),
    ];
    this.currentState = null;
  }

  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);
    this.updateHorizontalMovement(input);
    this.updateVerticalMovement();
    this.keepInsideVerticalBounds();
    this.updateSpriteAnimation(deltaTime);
    this.updateCollisionSprites(deltaTime);
  }

  draw(context) {
    if (this.game.hasActiveShield) {
      this.drawShieldAura(context);
    }

    if (this.game.invulnerabilityTimer > 0 && Math.floor(this.game.invulnerabilityTimer / 90) % 2 === 0) {
      context.globalAlpha = 0.58;
    }

    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.globalAlpha = 1;
  }

  drawShieldAura(context) {
    context.save();
    context.strokeStyle = "rgba(138, 201, 38, 0.9)";
    context.fillStyle = "rgba(138, 201, 38, 0.14)";
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(
      this.x + this.width * 0.5,
      this.y + this.height * 0.5,
      this.width * 0.64,
      this.height * 0.7,
      0,
      0,
      Math.PI * 2
    );
    context.fill();
    context.stroke();
    context.restore();
  }

  setState(state, speedModifier) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speedModifier;
    this.currentState.enter();
  }

  updateHorizontalMovement(input) {
    this.x += this.speed;

    if (
      CONTROL_KEYS.RIGHT.some((key) => input.includes(key)) &&
      this.currentState !== this.states[PLAYER_STATES.HIT]
    ) {
      this.speed = this.maxSpeed;
    } else if (
      CONTROL_KEYS.LEFT.some((key) => input.includes(key)) &&
      this.currentState !== this.states[PLAYER_STATES.HIT]
    ) {
      this.speed = -this.maxSpeed;
    } else {
      this.speed = 0;
    }

    this.keepInsideHorizontalBounds();
  }

  keepInsideHorizontalBounds() {
    if (this.x < 0) {
      this.x = 0;
    }

    if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }
  }

  updateVerticalMovement() {
    this.y += this.vy;

    if (!this.onGround()) {
      this.vy += this.weight;
      return;
    }

    this.vy = 0;
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  updateSpriteAnimation(deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
      return;
    }

    this.frameTimer += deltaTime;
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (!rectanglesIntersect(enemy, this)) {
        return;
      }

      enemy.markedForDeletion = true;
      this.game.collisions.push(
        new CollisionAnimation(
          this.game,
          enemy.x + enemy.width * PLAYER_CONFIG.COLLISION_RADIUS,
          enemy.y + enemy.height * PLAYER_CONFIG.COLLISION_RADIUS
        )
      );

      if (
        this.currentState === this.states[PLAYER_STATES.ROLLING] ||
        this.currentState === this.states[PLAYER_STATES.DIVING]
      ) {
        this.handleEnemyDestroyed(enemy);
        return;
      }

      this.handlePlayerHit();
    });
  }

  handleEnemyDestroyed(enemy) {
    this.game.registerEnemyDestroyed(enemy);
  }

  handlePlayerHit() {
    const didTakeDamage = this.game.registerPlayerHit();

    if (didTakeDamage) {
      this.setState(PLAYER_STATES.HIT, 0);
    }
  }

  keepInsideVerticalBounds() {
    const groundY = this.game.height - this.height - this.game.groundMargin;

    if (this.y > groundY) {
      this.y = groundY;
    }
  }

  updateCollisionSprites(deltaTime) {
    this.game.collisions.forEach((collision, index) => {
      collision.update(deltaTime);

      if (collision.markedForDeletion) {
        this.game.collisions.splice(index, 1);
      }
    });
  }
}
