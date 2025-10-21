import { useEffect, useMemo, useState } from 'react';
import { useIntervalGenerator } from '../hooks/useIntervalGenerator';
import { intervalList, centsBetween } from '../utils/intervals';
import { midiToFrequency } from '../utils/note';
import { useSettingsStore } from '../state/settingsStore';

export const ComparePage = () => {
  const { question, generateQuestion, play, audioReady } = useIntervalGenerator();
  const { tuning } = useSettingsStore();
  const [comparison, setComparison] = useState<'higher' | 'lower' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!question) {
      generateQuestion();
    }
  }, [generateQuestion, question]);

  useEffect(() => {
    if (!question || !audioReady) return;
    void play(question);
  }, [question, audioReady, play]);

  const baseInterval = useMemo(() => intervalList.find((i) => i.id === question?.intervalId), [question]);

  const compare = async (direction: 'higher' | 'lower') => {
    if (!question || !baseInterval) return;
    setComparison(direction);
    const tonic = midiToFrequency(question.tonicMidi, tuning);
    const target = tonic * Math.pow(2, (baseInterval.semitones * question.direction) / 12);
    const variantSemitones = direction === 'higher' ? baseInterval.semitones + 1 : baseInterval.semitones - 1;
    const variant = tonic * Math.pow(2, (variantSemitones * question.direction) / 12);
    setFeedback(`Różnica ${centsBetween(target, variant).toFixed(1)} centów`);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-white">Porównaj interwały</h2>
        <p className="text-sm text-slate-300">Porównaj interwał referencyjny z wariantem i naucz się subtelnych różnic.</p>
      </header>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => play()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
          >
            Referencja
          </button>
          <button onClick={() => compare('higher')} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">
            + półton
          </button>
          <button onClick={() => compare('lower')} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">
            - półton
          </button>
          <button
            onClick={() => {
              setFeedback(null);
              setComparison(null);
              const q = generateQuestion();
              void play(q);
            }}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200"
          >
            Nowy interwał
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Referencja</p>
            <p className="mt-2 text-xl font-semibold text-white">{baseInterval?.shortName ?? '—'}</p>
            <p className="text-slate-400">{baseInterval?.name}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Wariant</p>
            <p className="mt-2 text-xl font-semibold text-white">{comparison ?? '—'}</p>
            <p className="text-slate-400">{feedback ?? 'Wybierz wariant, aby porównać.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
