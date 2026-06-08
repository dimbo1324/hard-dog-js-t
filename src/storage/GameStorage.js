import { DEFAULT_SETTINGS, normalizeSettings } from "../config/settings.js";

const STORAGE_KEYS = Object.freeze({
  HIGH_SCORE: "hardDog.highScore",
  SETTINGS: "hardDog.settings",
});

function canUseLocalStorage() {
  try {
    const testKey = "hardDog.storageTest";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export class GameStorage {
  constructor(storage = window.localStorage) {
    this.storage = storage;
    this.isAvailable = canUseLocalStorage();
  }

  getHighScore() {
    if (!this.isAvailable) {
      return 0;
    }

    const value = Number.parseInt(this.storage.getItem(STORAGE_KEYS.HIGH_SCORE), 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  saveHighScore(score) {
    if (!this.isAvailable || !Number.isFinite(score)) {
      return;
    }

    const normalizedScore = Math.max(0, Math.floor(score));
    const currentHighScore = this.getHighScore();

    if (normalizedScore > currentHighScore) {
      this.storage.setItem(STORAGE_KEYS.HIGH_SCORE, String(normalizedScore));
    }
  }

  resetHighScore() {
    if (this.isAvailable) {
      this.storage.removeItem(STORAGE_KEYS.HIGH_SCORE);
    }
  }

  getSettings() {
    if (!this.isAvailable) {
      return { ...DEFAULT_SETTINGS };
    }

    try {
      return normalizeSettings(
        JSON.parse(this.storage.getItem(STORAGE_KEYS.SETTINGS) || "null")
      );
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings(settings) {
    if (!this.isAvailable) {
      return;
    }

    this.storage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(normalizeSettings(settings))
    );
  }
}

export const gameStorage = new GameStorage();
