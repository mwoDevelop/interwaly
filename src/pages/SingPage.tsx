import { useEffect, useMemo } from 'react';
import { useIntervalGenerator } from '../hooks/useIntervalGenerator';
import { intervalList, centsBetween } from '../utils/intervals';
import { usePitchDetector } from '../hooks/usePitchDetector';
import { midiToFrequency } from '../utils/note';
import { useSettingsStore } from '../state/settingsStore';
import { useProgressStore } from '../state/progressStore';

export const SingPage = () => {
  const { question, generateQuestion, play } = useIntervalGenerator();
  const { tuning } = useSettingsStore();
  const addResult = useProgressStore((state) => state.addResult);

  useEffect(() => {
    const q = generateQuestion();
    void play(q);
  }, [generateQuestion, play]);

  const targetFrequency = useMemo(() => {
    const interval = intervalList.find((i) => i.id === question?.intervalId);
    if (!interval || !question) return null;
    const tonic = midiToFrequency(question.tonicMidi, tuning);
    return tonic * Math.pow(2, (interval.semitones * question.direction) / 12);
  }, [question, tuning]);

  const { recording, start, stop, result } = usePitchDetector(targetFrequency);

  useEffect(() => {
    if (!recording && result.frequency && targetFrequency) {
      const deviation = centsBetween(targetFrequency, result.frequency);
      const correct = Math.abs(deviation) <= 30;
      if (question) {
        addResult({
          intervalId: question.intervalId,
          correct,
          deviation,
          timestamp: Date.now()
        });
      }
    }
  }, [result.frequency, targetFrequency, addResult, question, recording, result.centsDiff]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-white">Śpiewaj interwał</h2>
        <p className="text-sm text-slate-300">Nagraj swój głos, aby sprawdzić dokładność ±30 centów.</p>
      </header>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => play()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
          >
            Odtwórz interwał
          </button>
          {!recording ? (
            <button onClick={start} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">
              Nagraj
            </button>
          ) : (
            <button onClick={stop} className="rounded-md border border-rose-500 px-4 py-2 text-sm text-rose-400">
              Zatrzymaj
            </button>
          )}
          <button
            onClick={() => {
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
            <p className="text-xs uppercase tracking-wide text-slate-400">Cel</p>
            <p className="mt-2 text-xl font-semibold text-white">{question?.intervalId ?? '—'}</p>
            <p className="text-slate-400">Częstotliwość docelowa: {targetFrequency?.toFixed(2) ?? '—'} Hz</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Wynik</p>
            <p className="mt-2 text-xl font-semibold text-white">{result.frequency?.toFixed(2) ?? '—'} Hz</p>
            <p className={
              result.centsDiff !== null && Math.abs(result.centsDiff) <= 30
                ? 'text-emerald-400'
                : 'text-slate-400'
            }>
              Odchyłka: {result.centsDiff ? result.centsDiff.toFixed(1) : '—'} centów
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
