import { useEffect, useMemo, useState } from 'react';
import { intervalList } from '../utils/intervals';
import { useIntervalGenerator } from '../hooks/useIntervalGenerator';
import { VirtualKeyboard } from '../components/VirtualKeyboard';

export const FlashcardsPage = () => {
  const [flipped, setFlipped] = useState(false);
  const { question, generateQuestion, play, audioReady } = useIntervalGenerator();

  useEffect(() => {
    if (!question) {
      generateQuestion();
    }
  }, [generateQuestion, question]);

  useEffect(() => {
    if (!question || !audioReady) return;
    void play(question);
  }, [question, audioReady, play]);

  const card = useMemo(() => {
    if (!question) return intervalList[0];
    return intervalList.find((interval) => interval.id === question.intervalId) ?? intervalList[0];
  }, [question]);

  const handleNext = () => {
    const q = generateQuestion();
    setFlipped(false);
    void play(q);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-white">Fiszki interwałowe</h2>
        <p className="text-sm text-slate-300">Utrwalaj teorię poprzez szybkie fiszki dźwiękowe i opisowe.</p>
      </header>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex gap-3">
          <button
            onClick={() => play()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80"
          >
            Odtwórz
          </button>
          <button
            onClick={() => setFlipped((prev) => !prev)}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200"
          >
            {flipped ? 'Ukryj opis' : 'Pokaż opis'}
          </button>
          <button onClick={handleNext} className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200">
            Następna karta
          </button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="text-sm uppercase text-slate-400">Interwał</p>
            <p className="mt-2 text-4xl font-bold text-white">{card.shortName}</p>
            <p className="text-sm text-slate-300">{card.name}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-200">
            {flipped ? (
              <div>
                <p className="font-semibold uppercase tracking-wide text-slate-400">Melodie</p>
                <ul className="mt-2 space-y-1">
                  {card.songs.map((song) => (
                    <li key={song.pl}>{song.pl} / {song.en}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-400">
                  Liczba półtonów: {card.semitones}. Kierunek {question?.direction === 1 ? 'w górę' : 'w dół'}.
                </p>
              </div>
            ) : (
              <p className="text-slate-400">Kliknij „Pokaż opis”, aby zobaczyć szczegóły i skojarzenia.</p>
            )}
          </div>
        </div>
        <VirtualKeyboard activeMidi={question?.tonicMidi ?? undefined} />
      </div>
    </div>
  );
};
