import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { intervalList } from '../utils/intervals';

export interface IntervalStat {
  id: string;
  attempts: number;
  correct: number;
  avgCents: number;
}

export interface HistoryEntry {
  id: string;
  intervalId: string;
  correct: boolean;
  deviation: number;
  timestamp: number;
}

interface ProgressState {
  history: HistoryEntry[];
  stats: Record<string, IntervalStat>;
  streak: number;
  dailyGoal: number;
  incrementStreak: () => void;
  addResult: (entry: Omit<HistoryEntry, 'id'>) => void;
  setDailyGoal: (goal: number) => void;
}

const initialStats: Record<string, IntervalStat> = Object.fromEntries(
  intervalList.map((i) => [i.id, { id: i.id, attempts: 0, correct: 0, avgCents: 0 }])
);

const todayKey = () => new Date().toISOString().slice(0, 10);

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      history: [],
      stats: initialStats,
      streak: 0,
      dailyGoal: 10,
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      addResult: (entry) =>
        set((state) => {
          const id = createId();
          const history = [...state.history, { ...entry, id }].slice(-50);
          const stats = { ...state.stats };
          const stat = stats[entry.intervalId];
          const attempts = stat.attempts + 1;
          const correct = stat.correct + (entry.correct ? 1 : 0);
          const avgCents = (stat.avgCents * stat.attempts + Math.abs(entry.deviation)) / attempts;
          stats[entry.intervalId] = { ...stat, attempts, correct, avgCents };

          const today = todayKey();
          const historyToday = history.filter((h) => new Date(h.timestamp).toISOString().startsWith(today));
          const reachedGoal = historyToday.filter((h) => h.correct).length >= get().dailyGoal;
          const lastKey = typeof window !== 'undefined' ? localStorage.getItem('interwaly.lastGoalDay') : null;
          if (reachedGoal && lastKey !== today) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('interwaly.lastGoalDay', today);
            }
            return { history, stats, streak: state.streak + 1 };
          }

          return { history, stats };
        }),
      setDailyGoal: (goal) => set({ dailyGoal: goal })
    }),
    {
      name: 'interwaly.progress'
    }
  )
);
