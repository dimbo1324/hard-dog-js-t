export const IMAGE_SOURCES = Object.freeze({
  player: "./assets/images/player.png",
  layer1: "./assets/images/backgroundLayers/layer-1.png",
  layer2: "./assets/images/backgroundLayers/layer-2.png",
  layer3: "./assets/images/backgroundLayers/layer-3.png",
  layer4: "./assets/images/backgroundLayers/layer-4.png",
  layer5: "./assets/images/backgroundLayers/layer-5.png",
  enemyFly: "./assets/images/enemy_fly.png",
  enemyPlant: "./assets/images/enemy_plant.png",
  enemyBigSpider: "./assets/images/enemy_spider_big.png",
  fire: "./assets/images/fire.png",
  boom: "./assets/images/boom.png",
  lives: "./assets/images/lives.png",
});

export function getImageSource(imageName) {
  const source = IMAGE_SOURCES[imageName];

  if (!source) {
    throw new Error(`Unknown image asset: ${imageName}`);
  }

  return source;
}
