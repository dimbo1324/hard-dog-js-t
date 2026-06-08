import { PLAYER_STATE_CONFIG } from "../config/states.js";
import { State } from "./State.js";

export class SittingState extends State {
  constructor(game) {
    super(game, 0);
  }

  enter() {
    const { FRAME_X, MAX_FRAME, FRAME_Y } = PLAYER_STATE_CONFIG.FRAME.SITTING;
    this.game.player.frameX = FRAME_X;
    this.game.player.maxFrame = MAX_FRAME;
    this.game.player.frameY = FRAME_Y;
  }

  handleInput(input) {
    if (
      this.keys.LEFT.some((key) => input.includes(key)) ||
      this.keys.RIGHT.some((key) => input.includes(key))
    ) {
      this.game.player.setState(this.states.RUNNING, 1);
      return;
    }

    if (this.keys.ACTION.some((key) => input.includes(key)) && this.game.requestRoll()) {
      this.game.player.setState(this.states.ROLLING, 2);
    }
  }
}
