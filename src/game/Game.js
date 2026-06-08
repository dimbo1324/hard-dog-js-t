import { GAME_CONFIG } from "../config/game-config.js";
import { PLAYER_STATES } from "../config/states.js";
import { GroundEnemy } from "../entities/enemies/GroundEnemy.js";
import { FlyingEnemy } from "../entities/enemies/FlyingEnemy.js";
import { ClimbingEnemy } from "../entities/enemies/ClimbingEnemy.js";
import { Player } from "../entities/player/Player.js";
import { InputHandler } from "../input/InputHandler.js";
import { Background } from "../rendering/background/Background.js";
import { CanvasUI } from "../ui/CanvasUI.js";

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundMargin = GAME_CONFIG.GROUND_MARGIN;
    this.speed = 0;
    this.maxSpeed = GAME_CONFIG.MAX_SPEED;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.ui = new CanvasUI(this);
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.floatingMessages = [];
    this.enemyTimer = 0;
    this.enemyInterval = GAME_CONFIG.ENEMY_INTERVAL;
    this.maxParticles = GAME_CONFIG.MAX_PARTICLES;
    this.debug = GAME_CONFIG.DEBUG_MODE;
    this.score = GAME_CONFIG.INITIAL_SCORE;
    this.fontColor = GAME_CONFIG.FONT_COLOR;
    this.time = 0;
    this.maxTime = GAME_CONFIG.MAX_TIME_MINUTES * 60 * 1000;
    this.lives = GAME_CONFIG.INITIAL_LIVES;
    this.gameOver = false;

    this.player.setState(PLAYER_STATES.SITTING, 0);
  }

  update(deltaTime) {
    this.time += deltaTime;

    if (this.time > this.maxTime) {
      this.gameOver = true;
    }

    this.background.update();
    this.player.update(this.input.activeKeys, deltaTime);
    this.updateEnemies(deltaTime);
    this.updateFloatingMessages();
    this.updateParticles();
    this.limitParticles();
    this.removeDeletedEntities();
  }

  draw(context) {
    this.background.draw(context);
    this.player.draw(context);
    this.enemies.forEach((enemy) => enemy.draw(context));
    this.particles.forEach((particle) => particle.draw(context));
    this.collisions.forEach((collision) => collision.draw(context));
    this.floatingMessages.forEach((floatingMessage) =>
      floatingMessage.draw(context),
    );
    this.ui.draw(context);
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < 0.5) {
      this.enemies.push(new GroundEnemy(this));
    } else if (this.speed > 0) {
      this.enemies.push(new ClimbingEnemy(this));
    }

    this.enemies.push(new FlyingEnemy(this));
  }

  updateEnemies(deltaTime) {
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }

    this.enemies.forEach((enemy) => enemy.update(deltaTime));
  }

  updateParticles() {
    this.particles.forEach((particle) => particle.update());
  }

  updateFloatingMessages() {
    this.floatingMessages.forEach((floatingMessage) =>
      floatingMessage.update(),
    );
  }

  limitParticles() {
    if (this.particles.length > this.maxParticles) {
      this.particles.length = this.maxParticles;
    }
  }

  removeDeletedEntities() {
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion,
    );
    this.collisions = this.collisions.filter(
      (collision) => !collision.markedForDeletion,
    );
    this.floatingMessages = this.floatingMessages.filter(
      (floatingMessage) => !floatingMessage.markedForDeletion,
    );
  }

  destroy() {
    this.input.destroy();
  }
}
