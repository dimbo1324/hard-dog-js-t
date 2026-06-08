import { assetManager } from "../../assets/AssetManager.js";
import { BACKGROUND_CONFIG } from "../../config/game-config.js";
import { Layer } from "./Layer.js";

export class Background {
  constructor(game) {
    this.game = game;
    this.width = BACKGROUND_CONFIG.WIDTH;
    this.height = BACKGROUND_CONFIG.HEIGHT;
    this.layers = BACKGROUND_CONFIG.LAYERS.map(
      ({ image, speedModifier }) =>
        new Layer(this.game, {
          width: this.width,
          height: this.height,
          speedModifier,
          image: assetManager.getImage(image),
        })
    );
  }

  update() {
    this.layers.forEach((layer) => layer.update());
  }

  draw(context) {
    this.layers.forEach((layer) => layer.draw(context));
  }
}
