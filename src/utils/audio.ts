// Web Audio API Ambient Synthesizer for high-end sensory background music
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private oscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private timeoutId: any = null;

  constructor() {}

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start(type: string = 'birthday_instrumental') {
    if (this.isPlaying) {
      this.stop(0.05);
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.isPlaying = false;
    }
    
    try {
      // Lazy initialize AudioContext on user interaction
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.2); // Smooth fade in

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(900, this.ctx.currentTime); // Crisp, warm filter

      // Delay effect for space/ambiance
      const delay = this.ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.35, this.ctx.currentTime);
      const delayGain = this.ctx.createGain();
      delayGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      // Connections: Synth Nodes -> Filter -> Delay -> Master -> Output
      this.filter.connect(this.masterGain);
      this.filter.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.isPlaying = true;

      if (type === 'birthday_instrumental') {
        this.playBirthdayMelody();
      } else {
        this.playChordProgression(type);
      }
    } catch (e) {
      console.warn('AudioContext failed to start:', e);
    }
  }

  private playBirthdayMelody() {
    if (!this.isPlaying || !this.ctx || !this.filter) return;

    // Frequencies (Hz)
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;

    // Happy Birthday melody notes: [frequency, durationInBeats, backgroundChordFrequencies]
    const melody: [number, number, number[]][] = [
      // Line 1: "Hap-py Birth-day to you"
      [C4, 0.75, [130.81, 196.00]],
      [C4, 0.25, []],
      [D4, 1.0,  [130.81, 164.81]],
      [C4, 1.0,  [130.81, 196.00]],
      [F4, 1.0,  [174.61, 220.00]],
      [E4, 2.0,  [130.81, 164.81, 196.00]],

      // Line 2: "Hap-py Birth-day to you"
      [C4, 0.75, [130.81, 196.00]],
      [C4, 0.25, []],
      [D4, 1.0,  [130.81, 164.81]],
      [C4, 1.0,  [130.81, 196.00]],
      [G4, 1.0,  [196.00, 246.94]],
      [F4, 2.0,  [174.61, 220.00, 261.63]],

      // Line 3: "Hap-py Birth-day dear friend..."
      [C4, 0.75, [130.81, 196.00]],
      [C4, 0.25, []],
      [C5, 1.0,  [130.81, 164.81, 261.63]],
      [A4, 1.0,  [174.61, 220.00]],
      [F4, 1.0,  [174.61, 220.00]],
      [E4, 1.0,  [130.81, 164.81]],
      [D4, 2.0,  [146.83, 174.61, 220.00]],

      // Line 4: "Hap-py Birth-day to you!"
      [Bb4, 0.75, [174.61, 233.08]],
      [Bb4, 0.25, []],
      [A4,  1.0,  [174.61, 220.00]],
      [F4,  1.0,  [130.81, 164.81, 196.00]],
      [G4,  1.0,  [196.00, 246.94]],
      [F4,  2.5,  [130.81, 164.81, 196.00, 261.63]]
    ];

    const tempoSeconds = 0.52; // 1 beat = 0.52s (~115 BPM)
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx || !this.filter) return;

      const [freq, durationBeats, bassChord] = melody[noteIdx];
      const now = this.ctx.currentTime;
      const durationSec = durationBeats * tempoSeconds;

      // Play main melody note (chime/bell + warm acoustic tone)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle'; // Bright music box / acoustic chime tone
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.04); // Crisp pluck attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.95);

      osc.connect(gain);
      gain.connect(this.filter);
      osc.start(now);
      osc.stop(now + durationSec);
      this.oscillators.push({ osc, gain });

      // Play background accompaniment chord
      if (bassChord && bassChord.length > 0) {
        bassChord.forEach(bFreq => {
          if (!this.ctx || !this.filter) return;
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.type = 'sine';
          bOsc.frequency.setValueAtTime(bFreq, now);

          bGain.gain.setValueAtTime(0, now);
          bGain.gain.linearRampToValueAtTime(0.06 / bassChord.length, now + 0.1);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.2);

          bOsc.connect(bGain);
          bGain.connect(this.filter);
          bOsc.start(now);
          bOsc.stop(now + durationSec * 1.2);
          this.oscillators.push({ osc: bOsc, gain: bGain });
        });
      }

      noteIdx = (noteIdx + 1) % melody.length;
      const nextDelay = durationSec * 1000;

      // Loop melody continuously
      this.timeoutId = setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
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

    const fadeTime = 1.0;
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
