export class AudioManager {
  constructor({ isMuted = false } = {}) {
    this.isMuted = isMuted;
    this.context = null;
  }

  setMuted(isMuted) {
    this.isMuted = Boolean(isMuted);
  }

  async resume() {
    const audioContext = this.getContext();

    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }
  }

  playStart() {
    this.playSequence([523.25, 659.25, 783.99], 0.055, "triangle", 0.025);
  }

  playJump() {
    this.playTone(392, 0.07, "sine", 0.018);
  }

  playHit() {
    this.playSequence([140, 90], 0.075, "sawtooth", 0.035);
  }

  playDestroy() {
    this.playSequence([320, 470], 0.055, "square", 0.02);
  }

  playCollect() {
    this.playSequence([660, 880], 0.045, "triangle", 0.018);
  }

  playShield() {
    this.playSequence([260, 420, 620], 0.05, "sine", 0.018);
  }

  playWin() {
    this.playSequence([523.25, 659.25, 783.99, 1046.5], 0.09, "triangle", 0.025);
  }

  playLose() {
    this.playSequence([220, 180, 130], 0.11, "sawtooth", 0.028);
  }

  playTone(frequency, duration, type = "sine", volume = 0.02, delay = 0) {
    if (this.isMuted) {
      return;
    }

    const audioContext = this.getContext();

    if (!audioContext) {
      return;
    }

    const startAt = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  }

  playSequence(frequencies, duration, type, volume) {
    frequencies.forEach((frequency, index) => {
      this.playTone(frequency, duration, type, volume, index * duration * 0.92);
    });
  }

  getContext() {
    if (this.context) {
      return this.context;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return null;
    }

    this.context = new AudioContext();
    return this.context;
  }
}
