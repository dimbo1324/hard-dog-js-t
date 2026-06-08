import { CONTROL_KEYS } from "../config/controls.js";
import { PLAYER_STATES } from "../config/states.js";

export class State {
  constructor(game, index) {
    this.game = game;
    this.state = Object.keys(PLAYER_STATES)[index];
  }

  get keys() {
    return CONTROL_KEYS;
  }

  get states() {
    return PLAYER_STATES;
  }
}
