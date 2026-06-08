import {
  CONTROL_KEYS,
  INPUT_CONFIG,
  isSupportedControlKey,
} from "../config/controls.js";

export class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.virtualKeys = new Set();
    this.debugKeyHoldTimer = null;
    this.handleKeyDown = (event) => this.handleKeyEvent(event, true);
    this.handleKeyUp = (event) => this.handleKeyEvent(event, false);
    this.handleWindowBlur = () => this.clearActiveKeys();

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleWindowBlur);
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

    if (isKeyDown) {
      this.handleOneShotAction(eventKey);
      this.addKey(eventKey);
      return;
    }

    this.removeKey(eventKey);
  }

  handleOneShotAction(eventKey) {
    if (this.keys.includes(eventKey)) {
      return;
    }

    if (CONTROL_KEYS.ACTION.includes(eventKey)) {
      this.game.handlePrimaryAction();
      return;
    }

    if (CONTROL_KEYS.PAUSE.includes(eventKey)) {
      this.game.togglePause();
      return;
    }

    if (CONTROL_KEYS.RESTART.includes(eventKey)) {
      this.game.restart();
      return;
    }

    if (CONTROL_KEYS.MUTE.includes(eventKey)) {
      this.game.toggleMute();
    }
  }

  handleDebugKey(isKeyDown) {
    if (isKeyDown) {
      if (!this.debugKeyHoldTimer) {
        this.debugKeyHoldTimer = setTimeout(() => {
          this.game.toggleDebug();
        }, INPUT_CONFIG.DEBUG_HOLD_TIME);
      }
      return;
    }

    clearTimeout(this.debugKeyHoldTimer);
    this.debugKeyHoldTimer = null;
  }

  addKey(eventKey) {
    if (!this.keys.includes(eventKey)) {
      this.keys.push(eventKey);
    }
  }

  removeKey(eventKey) {
    const index = this.keys.indexOf(eventKey);

    if (index !== -1) {
      this.keys.splice(index, 1);
    }
  }

  pressVirtualKey(eventKey) {
    if (isSupportedControlKey(eventKey)) {
      this.virtualKeys.add(eventKey);
    }
  }

  releaseVirtualKey(eventKey) {
    this.virtualKeys.delete(eventKey);
  }

  clearActiveKeys() {
    this.keys.length = 0;
    this.virtualKeys.clear();
  }

  destroy() {
    clearTimeout(this.debugKeyHoldTimer);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleWindowBlur);
  }

  get activeKeys() {
    return [...this.keys, ...this.virtualKeys];
  }
}
