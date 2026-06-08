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

  const pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    CANVAS_CONFIG.MAX_DEVICE_PIXEL_RATIO
  );

  canvas.width = CANVAS_CONFIG.WIDTH * pixelRatio;
  canvas.height = CANVAS_CONFIG.HEIGHT * pixelRatio;
  canvas.style.aspectRatio = `${CANVAS_CONFIG.WIDTH} / ${CANVAS_CONFIG.HEIGHT}`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return {
    canvas,
    context,
    width: CANVAS_CONFIG.WIDTH,
    height: CANVAS_CONFIG.HEIGHT,
  };
}
