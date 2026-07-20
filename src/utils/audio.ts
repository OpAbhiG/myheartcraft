// Web Audio API Ambient Synthesizer for high-end sensory background music
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private oscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private timeoutId: any = null;

  constructor() {}

  public start(type: string = 'romantic_piano') {
    if (this.isPlaying) return;
    
    try {
      // Lazy initialize AudioContext on user interaction
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2.0); // Smooth fade in

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(600, this.ctx.currentTime); // Soft, warm filter

      // Delay effect for space/ambiance
      const delay = this.ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.4, this.ctx.currentTime);
      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      // Connections: Synth Nodes -> Filter -> Delay -> Master -> Output
      this.filter.connect(this.masterGain);
      this.filter.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.isPlaying = true;
      this.playChordProgression(type);
    } catch (e) {
      console.warn('AudioContext failed to start:', e);
    }
  }

  private playChordProgression(type: string) {
    if (!this.isPlaying || !this.ctx || !this.filter) return;

    const chords: { [key: string]: number[][] } = {
      romantic_piano: [
        [130.81, 164.81, 196.00, 261.63], // C major (C3, E3, G3, C4)
        [146.83, 174.61, 220.00, 293.66], // D minor (D3, F3, A3, D4)
        [174.61, 220.00, 261.63, 349.23], // F major (F3, A3, C4, F4)
        [164.81, 196.00, 246.94, 329.63]  // E minor (E3, G3, B3, E4)
      ],
      acoustic_guitar: [
        [146.83, 220.00, 293.66, 369.99], // D major (D3, A3, D4, F#4)
        [164.81, 246.94, 329.63, 392.00], // E minor (E3, B3, E4, G4)
        [196.00, 246.94, 293.66, 392.00], // G major (G3, B3, D4, G4)
        [220.00, 277.18, 329.63, 440.00]  // A major (A3, C#4, E4, A4)
      ],
      cinematic_strings: [
        [110.00, 164.81, 220.00, 261.63], // A minor (A2, E3, A3, C4)
        [130.81, 196.00, 261.63, 329.63], // C major (C3, G3, C4, E4)
        [174.61, 261.63, 349.23, 440.00], // F major (F3, C4, F4, A4)
        [196.00, 293.66, 392.00, 493.88]  // G major (G3, D4, G4, B4)
      ]
    };

    const selectedChords = chords[type] || chords.romantic_piano;
    let chordIndex = 0;

    const triggerNextChord = () => {
      if (!this.isPlaying || !this.ctx || !this.filter) return;

      const now = this.ctx.currentTime;
      const notes = selectedChords[chordIndex];

      // Stop previous oscillators with soft fade out
      this.oscillators.forEach(({ osc, gain }) => {
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        setTimeout(() => {
          try {
            osc.stop();
          } catch (e) {}
        }, 1600);
      });
      this.oscillators = [];

      // Create new oscillators for the notes in the chord
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.filter) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Waveform based on instrument selection
        if (type === 'acoustic_guitar') {
          osc.type = 'triangle'; // Mellower guitar pluck harmonics
        } else if (type === 'cinematic_strings') {
          osc.type = 'sawtooth'; // Bowed string raspiness
        } else {
          osc.type = 'sine'; // Soft, pure piano-like tone
        }

        osc.frequency.setValueAtTime(freq, now);

        // Slightly detune to create beautiful lush chorus/ensemble effect
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

        // Slow cinematic swelling volume envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08 / notes.length, now + 1.5); // Warm attack

        osc.connect(gain);
        gain.connect(this.filter);
        osc.start(now);

        this.oscillators.push({ osc, gain });
      });

      // Gently modulate filter frequency for subtle movement
      this.filter.frequency.setValueAtTime(this.filter.frequency.value, now);
      this.filter.frequency.exponentialRampToValueAtTime(500 + Math.random() * 300, now + 4.0);

      chordIndex = (chordIndex + 1) % selectedChords.length;

      // Loop chord progression every 6 seconds
      this.timeoutId = setTimeout(triggerNextChord, 6000);
    };

    triggerNextChord();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const fadeTime = 1.5;
    const now = this.ctx ? this.ctx.currentTime : 0;

    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
      } catch (e) {}
    }

    setTimeout(() => {
      this.oscillators.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch (e) {}
      });
      this.oscillators = [];
      if (this.ctx) {
        try {
          this.ctx.close();
        } catch (e) {}
        this.ctx = null;
      }
    }, fadeTime * 1000 + 100);
  }
}

export const ambientMusic = new AmbientSynth();
export default ambientMusic;
