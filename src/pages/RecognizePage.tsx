import { useEffect, useMemo, useState } from 'react';
import { intervalList } from '../utils/intervals';
import { useIntervalGenerator } from '../hooks/useIntervalGenerator';
import { useProgressStore } from '../state/progressStore';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { StaffPreview } from '../components/StaffPreview';
import { useSettingsStore } from '../state/settingsStore';

export const RecognizePage = () => {
  const { question, generateQuestion, play, audioReady } = useIntervalGenerator();
  const [revealed, setRevealed] = useState(false);
  const addResult = useProgressStore((state) => state.addResult);
  const [answer, setAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const theme = useSettingsStore((state) => state.theme);
  const headingColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const correctIntervalId = question?.intervalId ?? null;

  const getButtonClasses = (intervalId: string) => {
    const base =
      theme === 'light'
        ? 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
        : 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800';

    if (!answer) {
      return `rounded-md border px-3 py-2 text-sm transition ${base}`;
    }

    const success =
      theme === 'light'
        ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
        : 'border-emerald-400 bg-emerald-500/20 text-emerald-100';
    const error =
      theme === 'light'
        ? 'border-rose-500 bg-rose-100 text-rose-900'
        : 'border-rose-500 bg-rose-500/20 text-rose-100';

    const isSelected = answer === intervalId;
    const isCorrect = correctIntervalId === intervalId;

    if (isSelected && isCorrect) {
      return `rounded-md border px-3 py-2 text-sm transition ${success}`;
    }

    if (isSelected && !isCorrect) {
      return `rounded-md border px-3 py-2 text-sm transition ${error}`;
    }

    if (answer !== correctIntervalId && isCorrect) {
      return `rounded-md border px-3 py-2 text-sm transition ${success}`;
    }

    return `rounded-md border px-3 py-2 text-sm transition ${base}`;
  };

  useEffect(() => {
    if (!question) {
      generateQuestion();
    }
  }, [generateQuestion, question]);

  useEffect(() => {
    if (!question || !audioReady) return;
    void play(question);
  }, [question, audioReady, play]);

  const interval = useMemo(() => intervalList.find((i) => i.id === question?.intervalId), [question]);

  const handleReveal = () => {
    setRevealed(true);
    setFeedback(interval?.name ?? '');
  };

  const handleAnswer = (intervalId: string) => {
    if (!question) return;
    setAnswer(intervalId);
    const correct = intervalId === question.intervalId;
    if (correct) {
      setFeedback('Poprawna odpowiedź!');
    } else {
      setFeedback(`To ${interval?.name ?? 'nieznany interwał'}`);
    }
    addResult({
      intervalId: question.intervalId,
      correct,
      deviation: correct ? 0 : 100,
      timestamp: Date.now()
    });
  };

  const next = () => {
    const q = generateQuestion();
    setRevealed(false);
    setAnswer(null);
    setFeedback(null);
    void play(q);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className={`text-2xl font-semibold ${headingColor}`}>Rozpoznawanie interwałów</h2>
        <p className="text-sm text-slate-300">Wybierz poprawny interwał po odsłuchu toniki i drugiego dźwięku.</p>
      </header>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => play()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
          >
            Odtwórz
          </button>
          <button onClick={handleReveal} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Pokaż odpowiedź
          </button>
          <button onClick={next} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Następny przykład
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {intervalList.map((intv) => (
            <button
              key={intv.id}
              onClick={() => handleAnswer(intv.id)}
              className={getButtonClasses(intv.id)}
            >
              <p className="font-semibold">{intv.shortName}</p>
              <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{intv.name}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-md border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
          {revealed ? feedback : 'Wybierz odpowiedź lub pokaż rozwiązanie.'}
        </div>
        <VirtualKeyboard activeMidi={question?.tonicMidi ?? undefined} />
        <StaffPreview
          tonicMidi={question?.tonicMidi ?? null}
          intervalMidi={
            question && interval ? question.tonicMidi + interval.semitones * question.direction : null
          }
        />
      </div>
    </div>
  );
};
