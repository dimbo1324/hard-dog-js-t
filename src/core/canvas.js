import { CANVAS_CONFIG } from "../config/game-config.js";

export function createCanvasContext(canvasId) {
  const canvas = document.getElementById(canvasId);

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Canvas element not found: #${canvasId}`);
  }

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("2D canvas context is not available.");
  }

  canvas.width = CANVAS_CONFIG.WIDTH;
  canvas.height = CANVAS_CONFIG.HEIGHT;

  return {
    canvas,
    context,
    width: CANVAS_CONFIG.WIDTH,
    height: CANVAS_CONFIG.HEIGHT,
  };
}
