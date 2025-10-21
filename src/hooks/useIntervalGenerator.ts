import { useCallback, useMemo, useState } from 'react';
import { chooseWeightedInterval, intervalList } from '../utils/intervals';
import { midiToFrequency, randomMidiInRange } from '../utils/note';
import { useSettingsStore } from '../state/settingsStore';
import { playInterval } from '../lib/audio/player';
import { useProgressStore } from '../state/progressStore';

export interface IntervalQuestion {
  intervalId: string;
  tonicMidi: number;
  direction: 1 | -1;
}

export const useIntervalGenerator = () => {
  const { instrument, volume, tuning, difficulty } = useSettingsStore();
  const stats = useProgressStore((state) => state.stats);
  const [question, setQuestion] = useState<IntervalQuestion | null>(null);

  const weights = useMemo(() => {
    const weak = Object.values(stats).map((s) => {
      const accuracy = s.attempts ? s.correct / s.attempts : 0.5;
      return [s.id, 1 + (1 - accuracy) * 2] as const;
    });
    return Object.fromEntries(weak);
  }, [stats]);

  const generateQuestion = useCallback(() => {
    const allowed = intervalList.filter((interval) => {
      if (difficulty === 'basic') return interval.difficulty === 'basic';
      if (difficulty === 'intermediate') return interval.difficulty !== 'advanced';
      return true;
    });
    const weighted = chooseWeightedInterval(weights, allowed);
    const tonicMidi = randomMidiInRange(48, 72);
    const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    const next: IntervalQuestion = { intervalId: weighted.id, tonicMidi, direction };
    setQuestion(next);
    return next;
  }, [difficulty, weights]);

  const play = useCallback(
    async (q = question) => {
      if (!q) return;
      const interval = intervalList.find((i) => i.id === q.intervalId);
      if (!interval) return;
      await playInterval(midiToFrequency(q.tonicMidi, tuning), interval.semitones, {
        duration: 1.2,
        direction: q.direction,
        instrument,
        volume
      });
    },
    [instrument, volume, tuning, question]
  );

  return { question, generateQuestion, play };
};
