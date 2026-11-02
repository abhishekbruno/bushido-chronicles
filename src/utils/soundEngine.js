// Web Audio API Procedural Sound Engine for "The Way of the Samurai"
// Zero external files, zero latency, pure synthesized Japanese acoustic ambience

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Start muted by default to respect browser autoplay policies
    this.ambientGain = null;
    this.ambientOsc = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbience();
    } else {
      this.playAmbience();
      this.playGong(); // Feedback on unmute
    }
    return this.isMuted;
  }

  // Deep resonant Taiko drum strike
  playTaiko() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch envelope: starts around 140Hz, drops rapidly to 45Hz
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);

    // Amplitude envelope
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.85);

    // Add wooden rim click
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(320, t);
    clickGain.gain.setValueAtTime(0.3, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    click.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    click.start(t);
    click.stop(t + 0.06);
  }

  // Katana steel slash / swoosh
  playSwordSlash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + 0.08);
    filter.frequency.exponentialRampToValueAtTime(600, t + 0.22);
    filter.Q.value = 4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.25);
  }

  // Sacred Temple Bell / Rin Gong
  playGong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Harmonic frequencies of a Japanese singing bowl
    const freqs = [216, 432, 648, 864, 1296];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      // Slight detune for rich metallic shimmer
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, t);

      gain.gain.setValueAtTime(gains[idx], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 3.0);
    });
  }

  // Anvil steel hammer strike with high harmonic ringing
  playHammerStrike() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Anvil high metallic ring
    [1250, 2400, 3600].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, t + 0.3);

      const peak = idx === 0 ? 0.35 : 0.15;
      gain.gain.setValueAtTime(peak, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });

    // Heavy low hammer impact thud
    const impact = this.ctx.createOscillator();
    const impactGain = this.ctx.createGain();
    impact.frequency.setValueAtTime(160, t);
    impact.frequency.exponentialRampToValueAtTime(45, t + 0.1);
    impactGain.gain.setValueAtTime(0.4, t);
    impactGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    impact.connect(impactGain);
    impactGain.connect(this.ctx.destination);
    impact.start(t);
    impact.stop(t + 0.16);
  }

  // Pure high-frequency steel blade glint / crystalline ring
  playBladeGlint() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [2400, 4800, 7200].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, t + 0.8);

      const peak = idx === 0 ? 0.2 : 0.08;
      gain.gain.setValueAtTime(peak, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.9);
    });
  }

  // Water quench sizzle / steam hiss
  playQuenchSteam() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(3800, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(1000, t + 0.55);
    filter.Q.value = 3.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.58);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.6);
  }

  // Wooden Hyoshigi (clacker) click for menu/virtue selection
  playWoodenClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.04);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // Subtle wind/zen drone background
  playAmbience() {
    if (this.isMuted || this.ambientGain) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.01, t);
    this.ambientGain.gain.linearRampToValueAtTime(0.07, t + 2);

    // Multi-oscillator harmonic drone
    const baseFreq = 108; // Sacred low D
    [baseFreq, baseFreq * 1.5, baseFreq * 2].forEach(f => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      osc.connect(this.ambientGain);
      osc.start();
    });

    this.ambientGain.connect(this.ctx.destination);
  }

  // Sword tip ground stone impact thud with vibrating steel ring
  playGroundImpact() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Heavy low stone thud
    const impact = this.ctx.createOscillator();
    const impactGain = this.ctx.createGain();
    impact.frequency.setValueAtTime(110, t);
    impact.frequency.exponentialRampToValueAtTime(32, t + 0.25);
    impactGain.gain.setValueAtTime(0.65, t);
    impactGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    impact.connect(impactGain);
    impactGain.connect(this.ctx.destination);
    impact.start(t);
    impact.stop(t + 0.38);

    // High sharp blade steel vibrate ring
    [1600, 3200, 4800].forEach((freq, idx) => {
      const ring = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      ring.type = 'triangle';
      ring.frequency.setValueAtTime(freq, t);
      ring.frequency.exponentialRampToValueAtTime(freq * 0.96, t + 0.5);

      const peak = idx === 0 ? 0.3 : 0.12;
      ringGain.gain.setValueAtTime(peak, t);
      ringGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

      ring.connect(ringGain);
      ringGain.connect(this.ctx.destination);
      ring.start(t);
      ring.stop(t + 0.6);
    });
  }

  // Gentle Japanese Suikinkutsu / Zen temple singing bowl chime
  playZenChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [528, 792, 1056, 1584].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const peak = 0.22 / (idx + 1);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2 + idx * 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.6 + idx * 0.4);
    });
  }

  stopAmbience() {
    if (this.ambientGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.001, t + 0.5);
      setTimeout(() => {
        if (this.ambientGain) {
          this.ambientGain.disconnect();
          this.ambientGain = null;
        }
      }, 500);
    }
  }
}

export const sound = new SoundEngine();

