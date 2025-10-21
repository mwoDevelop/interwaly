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
              className={`rounded-md border px-3 py-2 text-sm transition ${
                answer === intv.id ? 'border-accent bg-accent/20 text-white' : 'border-slate-800 bg-slate-900 text-slate-200'
              }`}
            >
              <p className="font-semibold">{intv.shortName}</p>
              <p className="text-xs text-slate-400">{intv.name}</p>
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
