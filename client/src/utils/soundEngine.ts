// Web Audio API Procedural Sound Engine
// Zero external mp3 dependencies - 100% reliable, zero network latency

class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private isDroneActive = false;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  public volume = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // Eerie Binaural Atmospheric Drone
  public startDrone() {
    if (this.isDroneActive) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      // Smooth fade in over 2.5 seconds
      this.droneGain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 2.5);

      // Low Pass Filter for deep, warm, mysterious resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      // LFO to slowly sweep the filter cutoff (breathing darkness)
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(45, this.ctx.currentTime);
      this.lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      this.lfo.start();

      // Deep Binaural Frequencies: 54Hz & 57.5Hz (Creates a 3.5Hz Delta/Theta trance beat)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(54.0, this.ctx.currentTime);

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(57.5, this.ctx.currentTime);

      // Sub-bass fundamental (subtle 27Hz vibration)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(27.0, this.ctx.currentTime);
      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(filter);
      subOsc.start();

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDroneActive = true;
    } catch (e) {
      console.warn('Drone start failed:', e);
    }
  }

  public stopDrone() {
    if (!this.isDroneActive || !this.droneGain || !this.ctx) return;
    try {
      const stopTime = this.ctx.currentTime + 1.2;
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.lfo?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.lfo?.disconnect();
          this.droneGain?.disconnect();
        } catch (_) {}
        this.isDroneActive = false;
      }, 1300);
    } catch (_) {
      this.isDroneActive = false;
    }
  }

  // Tactile Mechanical Click Sound (for Theme Switcher & Buttons)
  public playMechanicalClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      // High-pass filtered impulse snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.035);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.Q.setValueAtTime(4.0, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) {
      // Ignore audio policy errors
    }
  }

  // Arcane Telepathic Chime (Mystic confirmation / card hover)
  public playMysticChime(pitchMultiplier = 1) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      const freqs = [432 * pitchMultiplier, 648 * pitchMultiplier, 864 * pitchMultiplier];
      
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.02);

        gain.gain.setValueAtTime(0.08 / (idx + 1), t + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8 + idx * 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t + idx * 0.02);
        osc.stop(t + 0.9 + idx * 0.1);
      });
    } catch (_) {}
  }

  // Card flutter sound
  public playCardShuffle() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const t = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240 + Math.random() * 80, t + i * 0.03);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, t + i * 0.03);

        gain.gain.setValueAtTime(0.05, t + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.04);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t + i * 0.03);
        osc.stop(t + i * 0.03 + 0.05);
      }
    } catch (_) {}
  }
}

export const soundEngine = new ProceduralSoundEngine();
