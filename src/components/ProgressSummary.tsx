import { useMemo } from 'react';
import { useProgressStore } from '../state/progressStore';
import { intervalList } from '../utils/intervals';
import { useSettingsStore } from '../state/settingsStore';

export const ProgressSummary = () => {
  const { stats, history, dailyGoal, streak } = useProgressStore();
  const theme = useSettingsStore((state) => state.theme);

  const weakSpots = useMemo(() => {
    return Object.values(stats)
      .filter((s) => s.attempts >= 3)
      .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts)
      .slice(0, 3)
      .map((stat) => {
        const interval = intervalList.find((i) => i.id === stat.id);
        return {
          id: stat.id,
          label: interval?.shortName ?? stat.id,
          accuracy: stat.attempts ? Math.round((stat.correct / stat.attempts) * 100) : 0
        };
      });
  }, [stats]);

  const accuracy = useMemo(() => {
    const totalAttempts = Object.values(stats).reduce((acc, stat) => acc + stat.attempts, 0);
    const totalCorrect = Object.values(stats).reduce((acc, stat) => acc + stat.correct, 0);
    return totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  }, [stats]);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            Postępy
          </h2>
          <p className="text-sm text-slate-400">Łączna dokładność {accuracy}%</p>
        </div>
        <div className="text-right text-sm text-slate-300">
          <p>Seria: {streak} dni</p>
          <p>Cel dzienny: {dailyGoal}</p>
        </div>
      </header>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Ostatnie odpowiedzi</h3>
          <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto text-xs text-slate-300">
            {history.length === 0 && <li>Brak danych. Zacznij trening!</li>}
            {history
              .slice()
              .reverse()
              .map((entry) => {
                const interval = intervalList.find((i) => i.id === entry.intervalId);
                return (
                  <li key={entry.id} className="flex justify-between">
                    <span>{interval?.shortName ?? entry.intervalId}</span>
                    <span className={entry.correct ? 'text-emerald-400' : 'text-rose-400'}>
                      {entry.correct ? '✓' : '✕'} ({Math.round(entry.deviation)} centów)
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Słabe miejsca</h3>
          <ul className="mt-2 space-y-2 text-xs text-slate-300">
            {weakSpots.length === 0 && <li>Za mało danych</li>}
            {weakSpots.map((spot) => (
              <li key={spot.id} className="flex justify-between">
                <span>{spot.label}</span>
                <span>{spot.accuracy}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
