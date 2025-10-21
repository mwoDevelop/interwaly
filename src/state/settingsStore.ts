import { create } from 'zustand';

export type InstrumentType = 'piano' | 'guitar' | 'cymbals';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type Theme = 'dark' | 'light';

export interface SettingsState {
  instrument: InstrumentType;
  tempo: number;
  volume: number;
  tuning: number;
  difficulty: Difficulty;
  theme: Theme;
  setInstrument: (instrument: InstrumentType) => void;
  setTempo: (tempo: number) => void;
  setVolume: (volume: number) => void;
  setTuning: (tuning: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'interwaly.settings';

const getStoredSettings = () => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Nie udało się odczytać ustawień', error);
    return null;
  }
};

const writeSettings = (state: SettingsState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        instrument: state.instrument,
        tempo: state.tempo,
        volume: state.volume,
        tuning: state.tuning,
        difficulty: state.difficulty,
        theme: state.theme
      })
    );
  } catch (error) {
    console.warn('Nie udało się zapisać ustawień', error);
  }
};

const stored = getStoredSettings();
type StoredSettings = Partial<Pick<SettingsState, 'instrument' | 'tempo' | 'volume' | 'tuning' | 'difficulty' | 'theme'>>;
const parsedSettings: StoredSettings & { instrument?: string } = stored ? JSON.parse(stored) : {};

const normalizeInstrument = (value: string | undefined): InstrumentType => {
  if (value === 'piano' || value === 'guitar' || value === 'cymbals') {
    return value;
  }
  return 'piano';
};

const defaultState: Pick<SettingsState, 'instrument' | 'tempo' | 'volume' | 'tuning' | 'difficulty' | 'theme'> = {
  instrument: normalizeInstrument(parsedSettings.instrument),
  tempo: parsedSettings.tempo ?? 80,
  volume: parsedSettings.volume ?? 0.7,
  tuning: parsedSettings.tuning ?? 440,
  difficulty: parsedSettings.difficulty ?? 'basic',
  theme: parsedSettings.theme === 'light' ? 'light' : 'dark'
};

if (typeof document !== 'undefined') {
  document.body.dataset.theme = defaultState.theme;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...defaultState,
  setInstrument: (instrument) =>
    set((state) => {
      const next = { ...state, instrument };
      writeSettings(next);
      return next;
    }),
  setTempo: (tempo) =>
    set((state) => {
      const next = { ...state, tempo };
      writeSettings(next);
      return next;
    }),
  setVolume: (volume) =>
    set((state) => {
      const next = { ...state, volume };
      writeSettings(next);
      return next;
    }),
  setTuning: (tuning) =>
    set((state) => {
      const next = { ...state, tuning };
      writeSettings(next);
      return next;
    }),
  setDifficulty: (difficulty) =>
    set((state) => {
      const next = { ...state, difficulty };
      writeSettings(next);
      return next;
    }),
  setTheme: (theme) =>
    set((state) => {
      const next = { ...state, theme };
      writeSettings(next);
      return next;
    })
}));
