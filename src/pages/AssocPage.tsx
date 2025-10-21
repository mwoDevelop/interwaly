import { useMemo, useState } from 'react';
import { intervalList } from '../utils/intervals';
import { useIntervalGenerator } from '../hooks/useIntervalGenerator';
import { useSettingsStore } from '../state/settingsStore';

export const AssocPage = () => {
  const [filter, setFilter] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');
  const { play, generateQuestion } = useIntervalGenerator();
  const theme = useSettingsStore((state) => state.theme);
  const headingColor = theme === 'light' ? 'text-slate-900' : 'text-white';

  const list = useMemo(() => {
    if (filter === 'all') return intervalList;
    return intervalList.filter((interval) => interval.difficulty === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className={`text-2xl font-semibold ${headingColor}`}>Kojarzenie piosenek</h2>
        <p className="text-sm text-slate-300">Łącz interwały z melodiami, aby szybciej je rozpoznawać.</p>
      </header>
      <div className="flex flex-wrap gap-3 text-sm">
        {['all', 'basic', 'intermediate', 'advanced'].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option as typeof filter)}
            className={`rounded-full border px-4 py-2 ${
              filter === option ? 'border-accent bg-accent/20 text-white' : 'border-slate-800 text-slate-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {list.map((interval) => (
            <div key={interval.id} className="rounded-md border border-slate-800 bg-slate-900 p-4 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-semibold ${headingColor}`}>{interval.shortName}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{interval.name}</p>
                </div>
                <button
                  onClick={() => {
                    const random = generateQuestion();
                    const tonicMidi = random?.tonicMidi ?? 60;
                    const direction = random?.direction ?? 1;
                    void play({ intervalId: interval.id, tonicMidi, direction });
                  }}
                  className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-200"
                >
                  Odtwórz
                </button>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                {interval.songs.map((song) => (
                  <li key={song.pl}>{song.pl} / {song.en}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
