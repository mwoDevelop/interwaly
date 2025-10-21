import { resumeAudioContext } from './context';
import type { InstrumentType } from '../../state/settingsStore';

export interface NoteOptions {
  frequency: number;
  duration: number;
  instrument: InstrumentType;
  volume: number;
  adsr?: { attack: number; decay: number; sustain: number; release: number };
}

type InstrumentVoice = {
  output: AudioNode;
  start: (when: number) => void;
  stop: (when: number) => void;
  envelope?: { attack: number; decay: number; sustain: number; release: number };
};

type InstrumentFactory = (
  ctx: AudioContext,
  frequency: number,
  duration: number
) => InstrumentVoice;

const getNoiseBuffer = (() => {
  let cache: { sampleRate: number; buffer: AudioBuffer } | null = null;
  return (ctx: AudioContext) => {
    if (!cache || cache.sampleRate !== ctx.sampleRate) {
      const length = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        data[i] = Math.random() * 2 - 1;
      }
      cache = { sampleRate: ctx.sampleRate, buffer: noiseBuffer };
    }
    return cache.buffer;
  };
})();

const instrumentVoices: Record<InstrumentType, InstrumentFactory> = {
  piano: (ctx, frequency) => {
    const output = ctx.createGain();
    const harmonics: OscillatorNode[] = [];

    const fundamental = ctx.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(frequency, ctx.currentTime);
    const fundamentalGain = ctx.createGain();
    fundamentalGain.gain.setValueAtTime(0.7, ctx.currentTime);
    fundamental.connect(fundamentalGain);
    fundamentalGain.connect(output);
    harmonics.push(fundamental);

    const third = ctx.createOscillator();
    third.type = 'triangle';
    third.frequency.setValueAtTime(frequency * 2, ctx.currentTime);
    const thirdGain = ctx.createGain();
    thirdGain.gain.setValueAtTime(0.25, ctx.currentTime);
    third.connect(thirdGain);
    thirdGain.connect(output);
    harmonics.push(third);

    const detuned = ctx.createOscillator();
    detuned.type = 'sine';
    detuned.frequency.setValueAtTime(frequency * 0.997, ctx.currentTime);
    const detunedGain = ctx.createGain();
    detunedGain.gain.setValueAtTime(0.2, ctx.currentTime);
    detuned.connect(detunedGain);
    detunedGain.connect(output);
    harmonics.push(detuned);

    return {
      output,
      start: (when) => harmonics.forEach((osc) => osc.start(when)),
      stop: (when) => harmonics.forEach((osc) => osc.stop(when)),
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.55, release: 0.8 }
    };
  },
  guitar: (ctx, frequency) => {
    const output = ctx.createGain();
    const source = ctx.createOscillator();
    source.type = 'sawtooth';
    source.frequency.setValueAtTime(frequency, ctx.currentTime);

    const octave = ctx.createOscillator();
    octave.type = 'triangle';
    octave.frequency.setValueAtTime(frequency * 2, ctx.currentTime);

    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(frequency * 4, ctx.currentTime);
    bodyFilter.Q.setValueAtTime(0.9, ctx.currentTime);

    const shimmer = ctx.createGain();
    shimmer.gain.setValueAtTime(0.15, ctx.currentTime);

    octave.connect(shimmer);
    shimmer.connect(bodyFilter);
    source.connect(bodyFilter);
    bodyFilter.connect(output);

    return {
      output,
      start: (when) => {
        source.start(when);
        octave.start(when);
      },
      stop: (when) => {
        source.stop(when);
        octave.stop(when);
      },
      envelope: { attack: 0.005, decay: 0.25, sustain: 0.45, release: 0.7 }
    };
  },
  cymbals: (ctx, frequency) => {
    const output = ctx.createGain();
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(5000, ctx.currentTime);
    highpass.Q.setValueAtTime(0.8, ctx.currentTime);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(frequency * 6, ctx.currentTime);
    bandpass.Q.setValueAtTime(5, ctx.currentTime);

    const tone = ctx.createOscillator();
    tone.type = 'square';
    tone.frequency.setValueAtTime(frequency * 3, ctx.currentTime);
    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0.1, ctx.currentTime);

    noise.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(output);

    tone.connect(toneGain);
    toneGain.connect(output);

    return {
      output,
      start: (when) => {
        noise.start(when);
        tone.start(when);
      },
      stop: (when) => {
        noise.stop(when);
        tone.stop(when);
      },
      envelope: { attack: 0.002, decay: 0.15, sustain: 0.3, release: 1.3 }
    };
  }
};

export const playNote = async ({ frequency, duration, instrument, volume, adsr }: NoteOptions) => {
  const ctx = await resumeAudioContext();
  const voice = instrumentVoices[instrument](ctx, frequency, duration);
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const env = adsr ?? voice.envelope ?? { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.2 };

  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(volume, now + env.attack);
  gain.gain.linearRampToValueAtTime(volume * env.sustain, now + env.attack + env.decay);
  gain.gain.setValueAtTime(volume * env.sustain, now + duration);
  gain.gain.linearRampToValueAtTime(0.0001, now + duration + env.release);

  voice.output.connect(gain);
  gain.connect(ctx.destination);

  voice.start(now);
  const stopTime = now + duration + env.release + 0.05;
  voice.stop(stopTime);
};

export const playInterval = async (
  tonic: number,
  semitoneOffset: number,
  options: Omit<NoteOptions, 'frequency'> & { direction: 1 | -1 }
) => {
  const tonicOpts = { ...options, frequency: tonic };
  const secondOpts = { ...options, frequency: tonic * Math.pow(2, (semitoneOffset * options.direction) / 12) };
  await playNote(tonicOpts);
  await new Promise((resolve) => setTimeout(resolve, (options.duration * 1000) / 2));
  await playNote(secondOpts);
};
