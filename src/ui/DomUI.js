import { CONTROL_KEYS } from "../config/controls.js";
import { GAME_STATUS } from "../config/game-status.js";
import { DIFFICULTY_SETTINGS } from "../config/settings.js";

const TOUCH_BUTTONS = Object.freeze([
  { label: "←", key: CONTROL_KEYS.LEFT[0], className: "touch-control--left" },
  { label: "→", key: CONTROL_KEYS.RIGHT[0], className: "touch-control--right" },
  { label: "↑", key: CONTROL_KEYS.UP[0], className: "touch-control--up" },
  { label: "↓", key: CONTROL_KEYS.DOWN[0], className: "touch-control--down" },
  { label: "ROLL", key: CONTROL_KEYS.ACTION[1], className: "touch-control--action" },
]);

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([name, value]) => {
      element.dataset[name] = value;
    });
  }

  return element;
}

function createButton(text, action, className = "") {
  const button = createElement("button", {
    className,
    text,
    dataset: { action },
    attributes: { type: "button" },
  });

  return button;
}

export class DomUI {
  constructor(game) {
    this.game = game;
    this.root = createElement("section", {
      className: "game-overlay",
      attributes: { "aria-live": "polite" },
    });
    this.touchControls = createElement("div", {
      className: "touch-controls",
      attributes: { "aria-label": "Сенсорное управление" },
    });

    this.renderStaticLayout();
    document.querySelector(".game-shell")?.append(this.root, this.touchControls);
    this.bindGameEvents();
    this.update(this.game.snapshot);
  }

  renderStaticLayout() {
    this.root.replaceChildren(
      this.createMenuPanel(),
      this.createPausePanel(),
      this.createFinalPanel(),
      this.createSettingsPanel()
    );
    this.renderTouchControls();
    this.bindDomEvents();
  }

  createMenuPanel() {
    const card = this.createCard("menu");
    card.append(
      createElement("p", { className: "eyebrow", text: "Vanilla JS Canvas Game" }),
      createElement("h1", { text: "Hard Dog" }),
      createElement("p", {
        className: "overlay-text",
        text: "Пройди 3 уровня, собирай бонусы, сбивай врагов в roll/dive-режиме и держи комбо.",
      }),
      this.createScoreRow("Рекорд", "high-score"),
      this.createActions([
        createButton("Start", "start", "primary-button"),
        createButton("Settings", "settings"),
      ]),
      createElement("p", {
        className: "controls-hint",
        text: "WASD / стрелки — движение · Space/Enter — roll/start · P/Esc — pause · M — mute · R — restart",
      })
    );
    return card;
  }

  createPausePanel() {
    const card = this.createCard("pause", "overlay-card overlay-card--compact");
    card.hidden = true;
    card.append(
      createElement("p", { className: "eyebrow", text: "Paused" }),
      createElement("h2", { text: "Пауза" }),
      createElement("p", {
        className: "overlay-text",
        text: "Игра остановлена. Можно продолжить или начать заново.",
      }),
      this.createActions([
        createButton("Resume", "resume", "primary-button"),
        createButton("Restart", "restart"),
        createButton("Settings", "settings"),
      ])
    );
    return card;
  }

  createFinalPanel() {
    const card = this.createCard("final", "overlay-card overlay-card--compact");
    card.hidden = true;
    card.append(
      createElement("p", {
        className: "eyebrow",
        text: "Game Over",
        dataset: { value: "final-kicker" },
      }),
      createElement("h2", {
        text: "Игра завершена",
        dataset: { value: "final-title" },
      }),
      createElement("p", {
        className: "overlay-text",
        text: "Попробуй ещё раз.",
        dataset: { value: "final-message" },
      }),
      this.createScoreRow("Счёт", "score"),
      this.createScoreRow("Рекорд", "final-high-score"),
      this.createActions([
        createButton("Restart", "restart", "primary-button"),
        createButton("Settings", "settings"),
      ])
    );
    return card;
  }

  createSettingsPanel() {
    const panel = createElement("div", {
      className: "settings-panel",
      dataset: { panel: "settings" },
    });
    panel.hidden = true;

    const card = createElement("div", { className: "settings-card" });
    const header = createElement("div", { className: "settings-header" });
    const titleBox = createElement("div");
    titleBox.append(
      createElement("p", { className: "eyebrow", text: "Game Settings" }),
      createElement("h2", { text: "Настройки" })
    );
    header.append(
      titleBox,
      createButton("×", "close-settings", "icon-button")
    );
    header.querySelector("button").setAttribute("aria-label", "Закрыть настройки");

    card.append(
      header,
      this.createDifficultyControl(),
      this.createCheckboxControl("muted", "Выключить звук"),
      this.createCheckboxControl("fps", "Показывать FPS / debug"),
      this.createCheckboxControl("touch", "Показывать touch-кнопки"),
      this.createActions([
        createButton("Reset high score", "reset-score"),
        createButton("Done", "close-settings", "primary-button"),
      ])
    );
    panel.append(card);
    return panel;
  }

  createDifficultyControl() {
    const label = createElement("label");
    const select = createElement("select", { dataset: { control: "difficulty" } });

    Object.entries(DIFFICULTY_SETTINGS).forEach(([value, item]) => {
      select.append(createElement("option", { text: item.label, attributes: { value } }));
    });

    label.append(createElement("span", { text: "Сложность" }), select);
    return label;
  }

  createCheckboxControl(controlName, text) {
    const label = createElement("label", { className: "checkbox-row" });
    label.append(
      createElement("input", {
        dataset: { control: controlName },
        attributes: { type: "checkbox" },
      }),
      createElement("span", { text })
    );
    return label;
  }

  createCard(panelName, className = "overlay-card") {
    return createElement("div", {
      className,
      dataset: { panel: panelName },
    });
  }

  createScoreRow(label, valueName) {
    const row = createElement("div", { className: "score-row" });
    row.append(
      createElement("span", { text: label }),
      createElement("strong", { text: "0", dataset: { value: valueName } })
    );
    return row;
  }

  createActions(buttons) {
    const actions = createElement("div", { className: "overlay-actions" });
    actions.append(...buttons);
    return actions;
  }

  renderTouchControls() {
    this.touchControls.replaceChildren(
      ...TOUCH_BUTTONS.map((button) =>
        createElement("button", {
          className: `touch-control ${button.className}`,
          text: button.label,
          dataset: { key: button.key },
          attributes: {
            type: "button",
            "aria-label": button.label,
          },
        })
      )
    );
  }

  bindDomEvents() {
    this.root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) {
        return;
      }

      this.handleAction(button.dataset.action);
    });

    this.root.addEventListener("change", (event) => {
      const control = event.target.closest("[data-control]");

      if (!control) {
        return;
      }

      this.handleSettingsChange(control);
    });

    this.touchControls.addEventListener("pointerdown", (event) => {
      const button = event.target.closest("[data-key]");

      if (!button) {
        return;
      }

      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      this.game.input.pressVirtualKey(button.dataset.key);
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
      this.touchControls.addEventListener(eventName, (event) => {
        const button = event.target.closest("[data-key]");

        if (button) {
          this.game.input.releaseVirtualKey(button.dataset.key);
        }
      });
    });
  }

  bindGameEvents() {
    this.game.addEventListener("statechange", (event) => {
      this.update(event.detail);
    });
  }

  handleAction(action) {
    if (action === "start") {
      this.game.start();
      return;
    }

    if (action === "resume") {
      this.game.resume();
      return;
    }

    if (action === "restart") {
      this.game.restart();
      return;
    }

    if (action === "settings") {
      this.showSettings();
      return;
    }

    if (action === "close-settings") {
      this.hideSettings();
      return;
    }

    if (action === "reset-score") {
      this.game.resetHighScore();
    }
  }

  handleSettingsChange(control) {
    const { settings } = this.game.snapshot;

    if (control.dataset.control === "difficulty") {
      this.game.updateSettings({ ...settings, difficulty: control.value });
      return;
    }

    if (control.dataset.control === "muted") {
      this.game.updateSettings({ ...settings, isMuted: control.checked });
      return;
    }

    if (control.dataset.control === "fps") {
      this.game.updateSettings({ ...settings, showFps: control.checked });
      return;
    }

    if (control.dataset.control === "touch") {
      this.game.updateSettings({ ...settings, showTouchControls: control.checked });
    }
  }

  showSettings() {
    this.getPanel("settings").hidden = false;
  }

  hideSettings() {
    this.getPanel("settings").hidden = true;
  }

  update(snapshot) {
    this.root.dataset.status = snapshot.status;
    this.setText("high-score", snapshot.highScore);
    this.setText("score", snapshot.score);
    this.setText("final-high-score", snapshot.highScore);
    this.syncSettings(snapshot.settings);
    this.syncPanels(snapshot.status);
    this.syncTouchControls(snapshot.settings.showTouchControls);

    if (snapshot.status === GAME_STATUS.WIN) {
      this.setText("final-kicker", "Victory");
      this.setText("final-title", "Победа!");
      this.setText("final-message", "Ты прошёл все уровни Hard Dog.");
      return;
    }

    if (snapshot.status === GAME_STATUS.GAME_OVER) {
      this.setText("final-kicker", "Game Over");
      this.setText("final-title", "Поражение");
      this.setText("final-message", "Жизни закончились. Перезапусти игру и попробуй собрать больше бонусов.");
    }
  }

  syncPanels(status) {
    this.getPanel("menu").hidden = status !== GAME_STATUS.MENU;
    this.getPanel("pause").hidden = status !== GAME_STATUS.PAUSED;
    this.getPanel("final").hidden = status !== GAME_STATUS.GAME_OVER && status !== GAME_STATUS.WIN;
    this.root.classList.toggle("is-passive", status === GAME_STATUS.PLAYING);
  }

  syncSettings(settings) {
    this.root.querySelector('[data-control="difficulty"]').value = settings.difficulty;
    this.root.querySelector('[data-control="muted"]').checked = settings.isMuted;
    this.root.querySelector('[data-control="fps"]').checked = settings.showFps;
    this.root.querySelector('[data-control="touch"]').checked = settings.showTouchControls;
  }

  syncTouchControls(isVisible) {
    this.touchControls.hidden = !isVisible;
  }

  getPanel(panelName) {
    return this.root.querySelector(`[data-panel="${panelName}"]`);
  }

  setText(name, value) {
    const element = this.root.querySelector(`[data-value="${name}"]`);

    if (element) {
      element.textContent = String(value);
    }
  }
}
