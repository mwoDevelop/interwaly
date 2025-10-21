import { useSettingsStore } from '../state/settingsStore';

export const SettingsPanel = () => {
  const { instrument, setInstrument, tempo, setTempo, volume, setVolume, tuning, setTuning, difficulty, setDifficulty } =
    useSettingsStore();

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-lg font-semibold text-white">Konfiguracja</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-400">
          Instrument
          <select
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
            value={instrument}
            onChange={(event) => setInstrument(event.target.value as typeof instrument)}
          >
            <option value="sine">Sinus</option>
            <option value="square">Kwadrat</option>
            <option value="sawtooth">Piła</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-400">
          Poziom trudności
          <select
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}
          >
            <option value="basic">Podstawowy</option>
            <option value="intermediate">Średni</option>
            <option value="advanced">Zaawansowany</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-400">
          Tempo
          <input
            type="range"
            min="40"
            max="140"
            value={tempo}
            onChange={(event) => setTempo(Number(event.target.value))}
          />
          <span className="text-sm text-slate-300">{tempo} bpm</span>
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-400">
          Głośność
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
          <span className="text-sm text-slate-300">{Math.round(volume * 100)}%</span>
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-400">
          Strojenie (A4)
          <input
            type="number"
            min="430"
            max="450"
            value={tuning}
            onChange={(event) => setTuning(Number(event.target.value))}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          />
        </label>
      </div>
    </section>
  );
};
