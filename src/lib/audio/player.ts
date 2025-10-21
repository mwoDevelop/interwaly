import { resumeAudioContext } from './context';
import type { InstrumentType } from '../../state/settingsStore';

export interface NoteOptions {
  frequency: number;
  duration: number;
  instrument: InstrumentType;
  volume: number;
  adsr?: { attack: number; decay: number; sustain: number; release: number };
}

export const playNote = async ({ frequency, duration, instrument, volume, adsr }: NoteOptions) => {
  const ctx = await resumeAudioContext();
  const oscillator = ctx.createOscillator();
  oscillator.type = instrument;
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const env = adsr ?? { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.2 };

  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + env.attack);
  gain.gain.linearRampToValueAtTime(volume * env.sustain, now + env.attack + env.decay);
  gain.gain.setValueAtTime(volume * env.sustain, now + duration);
  gain.gain.linearRampToValueAtTime(0.0001, now + duration + env.release);

  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + env.release + 0.05);
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
