export const GAME_STATUS = Object.freeze({
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "game-over",
  WIN: "win",
});

export function isFinalGameStatus(status) {
  return status === GAME_STATUS.GAME_OVER || status === GAME_STATUS.WIN;
}
