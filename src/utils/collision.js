export function rectanglesIntersect(first, second) {
  return (
    second.x < first.x + first.width &&
    second.x + second.width > first.x &&
    second.y < first.y + first.height &&
    second.y + second.height > first.y
  );
}
