import { createCanvasContext } from "./core/canvas.js";
import {
  installGlobalErrorHandler,
  showFatalError,
} from "./core/error-boundary.js";
import { GameLoop } from "./core/game-loop.js";

installGlobalErrorHandler();

window.addEventListener("DOMContentLoaded", () => {
  try {
    const canvasContext = createCanvasContext("game-canvas");
    const gameLoop = new GameLoop(canvasContext);
    gameLoop.start();
  } catch (error) {
    showFatalError("Не удалось запустить игру. Проверьте консоль браузера.");
    console.error(error);
  }
});
