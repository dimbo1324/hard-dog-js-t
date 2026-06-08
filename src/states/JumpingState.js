import { PLAYER_STATE_CONFIG } from "../config/states.js";
import { State } from "./State.js";

export class JumpingState extends State {
  constructor(game) {
    super(game, 2);
  }

  enter() {
    if (this.game.player.onGround()) {
      this.game.player.vy = PLAYER_STATE_CONFIG.JUMP_VELOCITY;
      this.game.audio.playJump();
    }

    const { FRAME_X, MAX_FRAME, FRAME_Y } = PLAYER_STATE_CONFIG.FRAME.JUMPING;
    this.game.player.frameX = FRAME_X;
    this.game.player.maxFrame = MAX_FRAME;
    this.game.player.frameY = FRAME_Y;
  }

  handleInput(input) {
    if (this.game.player.vy > this.game.player.weight) {
      this.game.player.setState(this.states.FALLING, 1);
      return;
    }

    if (this.keys.ACTION.some((key) => input.includes(key))) {
      this.game.player.setState(this.states.ROLLING, 2);
      return;
    }

    if (this.keys.DOWN.some((key) => input.includes(key))) {
      this.game.player.setState(this.states.DIVING, 0);
    }
  }
}
