import { PLAYER_STATE_CONFIG } from "../config/states.js";
import { Fire } from "../entities/effects/Fire.js";
import { State } from "./State.js";

export class RollingState extends State {
  constructor(game) {
    super(game, 4);
  }

  enter() {
    const { FRAME_X, MAX_FRAME, FRAME_Y } = PLAYER_STATE_CONFIG.FRAME.ROLLING;
    this.game.player.frameX = FRAME_X;
    this.game.player.maxFrame = MAX_FRAME;
    this.game.player.frameY = FRAME_Y;
  }

  handleInput(input) {
    const { FIRE } = PLAYER_STATE_CONFIG.PARTICLE_OFFSETS;

    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * FIRE.X,
        this.game.player.y + this.game.player.height * FIRE.Y
      )
    );

    const actionPressed = this.keys.ACTION.some((key) => input.includes(key));

    if (!actionPressed && this.game.player.onGround()) {
      this.game.player.setState(this.states.RUNNING, 1);
      return;
    }

    if (!actionPressed && !this.game.player.onGround()) {
      this.game.player.setState(this.states.FALLING, 1);
      return;
    }

    if (
      actionPressed &&
      this.keys.UP.some((key) => input.includes(key)) &&
      this.game.player.onGround()
    ) {
      this.game.player.vy += PLAYER_STATE_CONFIG.JUMP_VELOCITY;
      return;
    }

    if (
      this.keys.DOWN.some((key) => input.includes(key)) &&
      !this.game.player.onGround()
    ) {
      this.game.player.setState(this.states.DIVING, 0);
    }
  }
}
