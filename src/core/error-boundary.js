export function installGlobalErrorHandler() {
  window.addEventListener("error", (event) => {
    showFatalError("Произошла ошибка при запуске игры.");
    console.error(event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    showFatalError("Произошла непредвиденная ошибка игры.");
    console.error(event.reason);
  });
}

export function showFatalError(message) {
  const shell = document.querySelector(".game-shell");

  if (!shell || shell.querySelector(".game-error")) {
    return;
  }

  const error = document.createElement("p");
  error.className = "game-error";
  error.textContent = message;
  shell.append(error);
}
