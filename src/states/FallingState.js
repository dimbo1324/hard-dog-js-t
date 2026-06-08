import { PLAYER_STATE_CONFIG } from "../config/states.js";
import { State } from "./State.js";

export class FallingState extends State {
  constructor(game) {
    super(game, 3);
  }

  enter() {
    const { FRAME_X, MAX_FRAME, FRAME_Y } = PLAYER_STATE_CONFIG.FRAME.FALLING;
    this.game.player.frameX = FRAME_X;
    this.game.player.maxFrame = MAX_FRAME;
    this.game.player.frameY = FRAME_Y;
  }

  handleInput(input) {
    if (this.game.player.onGround(input)) {
      this.game.player.setState(this.states.RUNNING, 1);
      return;
    }

    if (this.keys.DOWN.some((key) => input.includes(key))) {
      this.game.player.setState(this.states.DIVING, 0);
    }
  }
}
