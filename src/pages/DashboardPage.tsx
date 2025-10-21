import { Link } from 'react-router-dom';
import { ProgressSummary } from '../components/ProgressSummary';
import { SettingsPanel } from '../components/SettingsPanel';
import { intervalList } from '../utils/intervals';
import { useSettingsStore } from '../state/settingsStore';

const quickStart = [
  { to: '/recognize', label: 'Rozpoznawanie' },
  { to: '/sing', label: 'Śpiewanie' },
  { to: '/flashcards', label: 'Fiszki' }
];

export const DashboardPage = () => {
  const theme = useSettingsStore((state) => state.theme);
  const headingColor = theme === 'light' ? 'text-slate-900' : 'text-white';

  return (
    <div className="space-y-8">
      <header className="rounded-lg border border-slate-800 bg-gradient-to-r from-primary/60 to-accent/40 p-10 shadow">
        <h2 className={`text-3xl font-bold ${headingColor}`}>Trening interwałów</h2>
        <p className="mt-2 max-w-2xl text-slate-100">
          Ucz się interwałów dzięki kilku trybom treningowym, śledź swoje postępy i utrzymuj codzienny nawyk.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          {quickStart.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full bg-slate-900/60 px-4 py-2 font-semibold text-slate-100 transition hover:bg-white/20"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
      <ProgressSummary />
      <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className={`text-lg font-semibold ${headingColor}`}>Zakres interwałów</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
          {intervalList.map((interval) => (
            <div key={interval.id} className="rounded-md border border-slate-800 bg-slate-900/70 p-3">
              <p className={`text-base font-semibold ${headingColor}`}>{interval.shortName}</p>
              <p>{interval.name}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Powiązane melodie</p>
              <ul className="mt-1 text-xs space-y-1">
                {interval.songs.map((song) => (
                  <li key={song.title}>
                    <span className="font-medium text-slate-200">{song.title}</span>
                    <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-500">
                      {song.direction === 'up' && 'w górę'}
                      {song.direction === 'down' && 'w dół'}
                      {song.direction === 'static' && 'stały'}
                    </span>
                    <p className="text-[11px] text-slate-500">{song.fragment}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <SettingsPanel />
    </div>
  );
};
