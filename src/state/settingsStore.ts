import { create } from 'zustand';

export type InstrumentType = 'sine' | 'square' | 'sawtooth';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface SettingsState {
  instrument: InstrumentType;
  tempo: number;
  volume: number;
  tuning: number;
  difficulty: Difficulty;
  setInstrument: (instrument: InstrumentType) => void;
  setTempo: (tempo: number) => void;
  setVolume: (volume: number) => void;
  setTuning: (tuning: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
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
        difficulty: state.difficulty
      })
    );
  } catch (error) {
    console.warn('Nie udało się zapisać ustawień', error);
  }
};

const stored = getStoredSettings();
const defaultState: Pick<SettingsState, 'instrument' | 'tempo' | 'volume' | 'tuning' | 'difficulty'> = stored
  ? JSON.parse(stored)
  : {
      instrument: 'sine',
      tempo: 80,
      volume: 0.7,
      tuning: 440,
      difficulty: 'basic'
    };

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
    })
}));
