import { PLAYER_STATE_CONFIG } from "../config/states.js";
import { State } from "./State.js";

export class HitState extends State {
  constructor(game) {
    super(game, 6);
  }

  enter() {
    const { FRAME_X, MAX_FRAME, FRAME_Y } = PLAYER_STATE_CONFIG.FRAME.HIT;
    this.game.player.frameX = FRAME_X;
    this.game.player.maxFrame = MAX_FRAME;
    this.game.player.frameY = FRAME_Y;
  }

  handleInput() {
    const hitAnimationFinished =
      this.game.player.frameX >= PLAYER_STATE_CONFIG.FRAME.HIT.MAX_FRAME;

    if (hitAnimationFinished && this.game.player.onGround()) {
      this.game.player.setState(this.states.RUNNING, 1);
      return;
    }

    if (hitAnimationFinished && !this.game.player.onGround()) {
      this.game.player.setState(this.states.FALLING, 1);
    }
  }
}
