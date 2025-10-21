export interface IntervalData {
  id: string;
  name: string;
  shortName: string;
  semitones: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  songs: { pl: string; en: string }[];
}

export const intervalList: IntervalData[] = [
  { id: 'P1', name: 'Interwał doskonały prymy', shortName: 'P1', semitones: 0, difficulty: 'basic', songs: [{ pl: 'Sto lat', en: 'Happy Birthday' }] },
  { id: 'm2', name: 'Sekunda mała', shortName: 'm2', semitones: 1, difficulty: 'basic', songs: [{ pl: 'Słodkiego miłego życia', en: 'Jaws' }] },
  { id: 'M2', name: 'Sekunda wielka', shortName: 'M2', semitones: 2, difficulty: 'basic', songs: [{ pl: 'Wlazł kotek', en: 'Frère Jacques' }] },
  { id: 'm3', name: 'Tercja mała', shortName: 'm3', semitones: 3, difficulty: 'basic', songs: [{ pl: 'Pod papugami', en: 'Greensleeves' }] },
  { id: 'M3', name: 'Tercja wielka', shortName: 'M3', semitones: 4, difficulty: 'basic', songs: [{ pl: 'Kiedy byłem małym chłopcem', en: 'Oh When the Saints' }] },
  { id: 'P4', name: 'Kwarta czysta', shortName: 'P4', semitones: 5, difficulty: 'basic', songs: [{ pl: 'Szła dzieweczka', en: 'Here Comes the Bride' }] },
  { id: 'TT', name: 'Tryton', shortName: 'TT', semitones: 6, difficulty: 'intermediate', songs: [{ pl: 'Simpsonowie', en: 'Maria (West Side Story)' }] },
  { id: 'P5', name: 'Kwinta czysta', shortName: 'P5', semitones: 7, difficulty: 'basic', songs: [{ pl: 'Panie Janie', en: 'Twinkle Twinkle' }] },
  { id: 'm6', name: 'Seksta mała', shortName: 'm6', semitones: 8, difficulty: 'intermediate', songs: [{ pl: 'Wehikuł czasu', en: 'The Entertainer' }] },
  { id: 'M6', name: 'Seksta wielka', shortName: 'M6', semitones: 9, difficulty: 'intermediate', songs: [{ pl: 'Dwa serduszka', en: 'My Bonnie' }] },
  { id: 'm7', name: 'Septyma mała', shortName: 'm7', semitones: 10, difficulty: 'advanced', songs: [{ pl: 'Somewhere', en: 'Star Trek' }] },
  { id: 'M7', name: 'Septyma wielka', shortName: 'M7', semitones: 11, difficulty: 'advanced', songs: [{ pl: 'Wesoła wdówka', en: 'Take On Me' }] },
  { id: 'P8', name: 'Oktawa czysta', shortName: 'P8', semitones: 12, difficulty: 'basic', songs: [{ pl: 'Hej sokoły', en: 'Somewhere Over the Rainbow' }] }
];

export const getIntervalById = (id: string) => intervalList.find((i) => i.id === id);

export const getIntervalsByDifficulty = (difficulty: 'basic' | 'intermediate' | 'advanced') =>
  intervalList.filter((i) => i.difficulty === difficulty || difficulty === 'advanced');

export const chooseWeightedInterval = (
  weights: Record<string, number>,
  pool: IntervalData[] = intervalList
) => {
  const entries = pool.map((interval) => ({ interval, weight: weights[interval.id] ?? 1 }));
  const sum = entries.reduce((acc, item) => acc + item.weight, 0);
  let r = Math.random() * sum;
  for (const entry of entries) {
    if (r < entry.weight) {
      return entry.interval;
    }
    r -= entry.weight;
  }
  return entries[0]?.interval ?? pool[0];
};

export const centsBetween = (freqA: number, freqB: number) => 1200 * Math.log2(freqB / freqA);
