import { PLAYER_STATE_CONFIG } from "../config/states.js";
import { Dust } from "../entities/effects/Dust.js";
import { State } from "./State.js";

export class RunningState extends State {
  constructor(game) {
    super(game, 1);
  }

  enter() {
    const { FRAME_X, MAX_FRAME, FRAME_Y } = PLAYER_STATE_CONFIG.FRAME.RUNNING;
    this.game.player.frameX = FRAME_X;
    this.game.player.maxFrame = MAX_FRAME;
    this.game.player.frameY = FRAME_Y;
  }

  handleInput(input) {
    const { DUST } = PLAYER_STATE_CONFIG.PARTICLE_OFFSETS;

    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.5 + DUST.X,
        this.game.player.y + this.game.player.height + DUST.Y
      )
    );

    if (this.keys.DOWN.some((key) => input.includes(key))) {
      this.game.player.setState(this.states.SITTING, 0);
      return;
    }

    if (this.keys.UP.some((key) => input.includes(key))) {
      this.game.player.setState(this.states.JUMPING, 1);
      return;
    }

    if (this.keys.ACTION.some((key) => input.includes(key))) {
      this.game.player.setState(this.states.ROLLING, 2);
    }
  }
}
