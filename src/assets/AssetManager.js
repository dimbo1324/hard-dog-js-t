import { getImageSource } from "../config/assets.js";

export class AssetManager {
  #images = new Map();

  getImage(imageName) {
    if (!this.#images.has(imageName)) {
      this.#images.set(imageName, this.#createImage(imageName));
    }

    return this.#images.get(imageName);
  }

  #createImage(imageName) {
    const image = new window.Image();
    const source = getImageSource(imageName);

    image.src = source;
    image.onerror = () => {
      console.error(`Не удалось загрузить изображение: ${source}`);
    };

    return image;
  }
}

export const assetManager = new AssetManager();
