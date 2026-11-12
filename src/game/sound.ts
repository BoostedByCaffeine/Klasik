/**
 * Procedural Gameboy Advance / Gameboy 8-Bit Mono Chiptune BGM Sequencer & SFX Engine
 * Uses native Web Audio API with a 1-channel mono ChannelMergerNode so zero external audio files are required.
 */

// 16-bar (64 eighth-note steps) Cozy Gameboy Town Melody at 76 BPM
// Frequencies in Hz (0 = rest)
const LEAD_MELODY: number[] = [
  // Bars 1-4: Warm C Major / A Minor / F Major7 / G7 town stroll
  523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 523.25,
  440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 587.33, 0,
  349.23, 440.0, 523.25, 659.25, 587.33, 523.25, 440.0, 523.25,
  392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 392.0, 0,
  // Bars 5-8: Playful garden variation
  523.25, 783.99, 1046.5, 783.99, 880.0, 783.99, 659.25, 523.25,
  440.0, 659.25, 880.0, 1046.5, 987.77, 880.0, 783.99, 0,
  698.46, 659.25, 587.33, 523.25, 659.25, 587.33, 523.25, 440.0,
  392.0, 523.25, 659.25, 587.33, 523.25, 0, 392.0, 0,
  // Bars 9-12: Dreamy bridge (Em7 -> Am7 -> Dm7 -> G7)
  659.25, 783.99, 987.77, 783.99, 659.25, 587.33, 523.25, 659.25,
  587.33, 523.25, 440.0, 523.25, 659.25, 783.99, 659.25, 0,
  587.33, 698.46, 880.0, 698.46, 659.25, 587.33, 523.25, 440.0,
  392.0, 440.0, 493.88, 587.33, 783.99, 659.25, 587.33, 0,
  // Bars 13-16: Cozy resolution back to C Major
  523.25, 659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 523.25,
  349.23, 440.0, 523.25, 698.46, 659.25, 587.33, 523.25, 440.0,
  392.0, 587.33, 493.88, 659.25, 523.25, 392.0, 440.0, 493.88,
  523.25, 392.0, 523.25, 659.25, 523.25, 0, 0, 0,
];

const BASS_LINE: number[] = [
  // Bars 1-4
  130.81, 0, 196.0, 0, 130.81, 0, 196.0, 0,
  110.0, 0, 164.81, 0, 110.0, 0, 164.81, 0,
  174.61, 0, 220.0, 0, 174.61, 0, 220.0, 0,
  196.0, 0, 246.94, 0, 196.0, 0, 146.83, 0,
  // Bars 5-8
  130.81, 0, 196.0, 0, 130.81, 0, 196.0, 0,
  110.0, 0, 164.81, 0, 110.0, 0, 164.81, 0,
  174.61, 0, 220.0, 0, 146.83, 0, 196.0, 0,
  130.81, 0, 196.0, 0, 130.81, 0, 130.81, 0,
  // Bars 9-12
  164.81, 0, 246.94, 0, 164.81, 0, 246.94, 0,
  110.0, 0, 164.81, 0, 110.0, 0, 164.81, 0,
  146.83, 0, 220.0, 0, 146.83, 0, 220.0, 0,
  196.0, 0, 246.94, 0, 196.0, 0, 146.83, 0,
  // Bars 13-16
  130.81, 0, 196.0, 0, 110.0, 0, 164.81, 0,
  174.61, 0, 220.0, 0, 174.61, 0, 220.0, 0,
  196.0, 0, 246.94, 0, 196.0, 0, 246.94, 0,
  130.81, 0, 196.0, 0, 130.81, 0, 0, 0,
];

class CozySoundEngine {
  private ctx: AudioContext | null = null;
  private monoMerger: ChannelMergerNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  public muted: boolean = false; // SFX mute state
  public bgmEnabled: boolean = false;
  private bgmAccumulator: number = 0;
  private bgmStepIndex: number = 0;

  private getOrCreateContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Create 1-channel mono ChannelMergerNode for authentic Gameboy mono output
        this.monoMerger = this.ctx.createChannelMerger(1);
        this.monoMerger.channelCount = 1;
        this.monoMerger.channelCountMode = 'explicit';
        this.monoMerger.connect(this.ctx.destination);

        // Pre-build white noise buffer for soft chiptune hi-hat ticks
        const sampleRate = this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, Math.floor(sampleRate * 0.05), sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buffer;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private ensureSfxContext(): AudioContext | null {
    if (this.muted) return null;
    return this.getOrCreateContext();
  }

  private getDestination(ctx: AudioContext): AudioNode {
    return this.monoMerger ?? ctx.destination;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public toggleBgm(): boolean {
    if (this.bgmEnabled) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.bgmEnabled;
  }

  public startBgm() {
    const ctx = this.getOrCreateContext();
    if (!ctx) return;
    this.bgmEnabled = true;
    this.bgmAccumulator = 0;
    this.playBgmTick();
  }

  public stopBgm() {
    this.bgmEnabled = false;
    this.bgmAccumulator = 0;
  }

  public updateBgm(dt: number) {
    if (!this.bgmEnabled) return;
    // 76 BPM eighth-note step = 0.3947 seconds
    const stepDuration = 60 / 76 / 2;
    this.bgmAccumulator += dt;
    if (this.bgmAccumulator >= stepDuration) {
      this.bgmAccumulator -= stepDuration;
      this.playBgmTick();
    }
  }

  private playBgmTick() {
    if (!this.bgmEnabled) return;
    const ctx = this.getOrCreateContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const step = this.bgmStepIndex % LEAD_MELODY.length;
    this.bgmStepIndex = (this.bgmStepIndex + 1) % LEAD_MELODY.length;

    const leadFreq = LEAD_MELODY[step];
    const bassFreq = BASS_LINE[step];

    // 1. 8-bit Square/Pulse Lead Channel (Mono)
    if (leadFreq > 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(leadFreq, now);
      gain.gain.setValueAtTime(0.022, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.36);
    }

    // 2. 8-bit Triangle Bass Channel (Mono)
    if (bassFreq > 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, now);
      bassGain.gain.setValueAtTime(0.036, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      bassOsc.connect(bassGain);
      bassGain.connect(dest);
      bassOsc.start(now);
      bassOsc.stop(now + 0.38);
    }

    // 3. Soft Noise Hi-Hat Tick on off-beats (steps 2, 6, 10, 14...)
    if (this.noiseBuffer && step % 2 === 1) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(5200, now);
      const hatGain = ctx.createGain();
      hatGain.gain.setValueAtTime(step % 4 === 3 ? 0.014 : 0.007, now);
      hatGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.04);
      noise.connect(filter);
      filter.connect(hatGain);
      hatGain.connect(dest);
      noise.start(now);
      noise.stop(now + 0.045);
    }
  }

  public playStep() {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const pitchVar = 0.92 + Math.random() * 0.16;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190 * pitchVar, now);
    osc.frequency.exponentialRampToValueAtTime(95 * pitchVar, now + 0.045);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playStationStart(stationType: string) {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const pitchVar = 0.94 + Math.random() * 0.12;

    if (stationType === 'grinder') {
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime((140 + i * 18) * pitchVar, now + i * 0.065);
        gain.gain.setValueAtTime(0.06, now + i * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.002, now + i * 0.065 + 0.05);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + i * 0.065);
        osc.stop(now + i * 0.065 + 0.055);
      }
    } else if (
      stationType === 'kettle' ||
      stationType === 'espresso' ||
      stationType === 'milk_frother'
    ) {
      const notes = [330, 440, 554.37];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * pitchVar, now + idx * 0.05);
        gain.gain.setValueAtTime(0.05, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.16);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.17);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660 * pitchVar, now);
      osc.frequency.exponentialRampToValueAtTime(880 * pitchVar, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  public playStepReady() {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const notes = [523.25, 659.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.065);
      gain.gain.setValueAtTime(0.05, now + i * 0.065);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.14);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + i * 0.065);
      osc.stop(now + i * 0.065 + 0.15);
    });
  }

  public playServeSuccess() {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.055, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.22);
    });
  }

  public playWaterDaisies() {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const notes = [392.0, 493.88, 587.33, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.12, now + i * 0.05 + 0.12);
      gain.gain.setValueAtTime(0.07, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.13);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.14);
    });
  }

  public playCustomerBell() {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const notes = [659.25, 523.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.06, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.24);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.25);
    });
  }

  /** Cozy cat purr + meow trill when petting Lilo or Champy */
  public playCatPurr() {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const purrOsc = ctx.createOscillator();
    const purrGain = ctx.createGain();
    purrOsc.type = 'triangle';
    purrOsc.frequency.setValueAtTime(95, now);
    purrOsc.frequency.linearRampToValueAtTime(125, now + 0.15);
    purrOsc.frequency.linearRampToValueAtTime(90, now + 0.3);
    purrGain.gain.setValueAtTime(0.06, now);
    purrGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    purrOsc.connect(purrGain);
    purrGain.connect(dest);
    purrOsc.start(now);
    purrOsc.stop(now + 0.34);

    const chirpOsc = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirpOsc.type = 'sine';
    chirpOsc.frequency.setValueAtTime(587.33, now + 0.08);
    chirpOsc.frequency.exponentialRampToValueAtTime(880, now + 0.24);
    chirpGain.gain.setValueAtTime(0.055, now + 0.08);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    chirpOsc.connect(chirpGain);
    chirpGain.connect(dest);
    chirpOsc.start(now + 0.08);
    chirpOsc.stop(now + 0.28);
  }

  /** 1990 Mazda Miata MX-5 pop-up headlight mechanical relay servo sound */
  public playHeadlightFlip(isUp: boolean) {
    const ctx = this.ensureSfxContext();
    if (!ctx) return;
    const dest = this.getDestination(ctx);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    const startFreq = isUp ? 220 : 380;
    const endFreq = isUp ? 440 : 190;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.11);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const soundEngine = new CozySoundEngine();
