import {
  CONTROL_KEYS,
  INPUT_CONFIG,
  isSupportedControlKey,
} from "../config/controls.js";

export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.debugKeyHoldTimer = null;
    this.handleKeyDown = (event) => this.handleKeyEvent(event, true);
    this.handleKeyUp = (event) => this.handleKeyEvent(event, false);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  handleKeyEvent(event, isKeyDown) {
    const eventKey = event.key;

    if (!isSupportedControlKey(eventKey)) {
      return;
    }

    event.preventDefault();

    if (eventKey === CONTROL_KEYS.DEBUG) {
      this.handleDebugKey(isKeyDown);
      return;
    }

    if (isKeyDown && !this.keys.includes(eventKey)) {
      this.keys.push(eventKey);
      return;
    }

    if (!isKeyDown) {
      this.removeKey(eventKey);
    }
  }

  handleDebugKey(isKeyDown) {
    if (isKeyDown) {
      if (!this.debugKeyHoldTimer) {
        this.debugKeyHoldTimer = setTimeout(() => {
          this.game.debug = !this.game.debug;
        }, INPUT_CONFIG.DEBUG_HOLD_TIME);
      }
      return;
    }

    clearTimeout(this.debugKeyHoldTimer);
    this.debugKeyHoldTimer = null;
  }

  removeKey(eventKey) {
    const index = this.keys.indexOf(eventKey);

    if (index !== -1) {
      this.keys.splice(index, 1);
    }
  }

  destroy() {
    clearTimeout(this.debugKeyHoldTimer);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  get activeKeys() {
    return this.keys;
  }
}
