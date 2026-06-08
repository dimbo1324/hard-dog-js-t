export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomArrayItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}
