export interface IntervalData {
  id: string;
  name: string;
  shortName: string;
  semitones: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  songs: {
    title: string;
    fragment: string;
    direction: 'up' | 'down' | 'static';
  }[];
}

export const intervalList: IntervalData[] = [
  {
    id: 'P1',
    name: 'Interwał doskonały prymy',
    shortName: 'P1',
    semitones: 0,
    difficulty: 'basic',
    songs: [
      {
        title: 'Sto lat',
        fragment: '„Sto lat, sto lat” – dwa identyczne dźwięki na starcie melodii',
        direction: 'static',
      },
      {
        title: 'Hej, hej ułani',
        fragment: 'Okrzyk „Hej, hej” powtarza ten sam dźwięk',
        direction: 'static',
      },
    ],
  },
  {
    id: 'm2',
    name: 'Sekunda mała',
    shortName: 'm2',
    semitones: 1,
    difficulty: 'basic',
    songs: [
      {
        title: 'Bogurodzica',
        fragment: 'Sylaby „Bogu-rodzica” unoszą się o pół tonu',
        direction: 'up',
      },
      {
        title: 'Szczęki – motyw przewodni',
        fragment: 'Wejście kontrabasów rośnie o pół tonu niczym zbliżający się rekin',
        direction: 'up',
      },
    ],
  },
  {
    id: 'M2',
    name: 'Sekunda wielka',
    shortName: 'M2',
    semitones: 2,
    difficulty: 'basic',
    songs: [
      {
        title: 'Panie Janie',
        fragment: '„Pa-nie” wznosi się o cały ton',
        direction: 'up',
      },
      {
        title: 'Wlazł kotek na płotek',
        fragment: 'Początek „Wlazł ko-” idzie w górę o cały ton',
        direction: 'up',
      },
    ],
  },
  {
    id: 'm3',
    name: 'Tercja mała',
    shortName: 'm3',
    semitones: 3,
    difficulty: 'basic',
    songs: [
      {
        title: 'Był sobie król',
        fragment: 'Słowa „Był so-” opadają o tercję małą',
        direction: 'down',
      },
      {
        title: 'Ach śpij kochanie',
        fragment: '„Ach śpij” wykonuje delikatny zjazd o tercję małą',
        direction: 'down',
      },
    ],
  },
  {
    id: 'M3',
    name: 'Tercja wielka',
    shortName: 'M3',
    semitones: 4,
    difficulty: 'basic',
    songs: [
      {
        title: 'Kiedy byłem małym chłopcem',
        fragment: '„Kiedy byłem” rozpoczyna się skokiem o tercję wielką w górę',
        direction: 'up',
      },
      {
        title: 'Etiuda Es-dur op. 10 nr 3 (Tristesse)',
        fragment: 'Pierwsze dwa dźwięki prawej ręki oddalone są o tercję wielką',
        direction: 'up',
      },
    ],
  },
  {
    id: 'P4',
    name: 'Kwarta czysta',
    shortName: 'P4',
    semitones: 5,
    difficulty: 'basic',
    songs: [
      {
        title: 'Marsz weselny Mendelssohna',
        fragment: 'Fanfara „Ta-dam” otwiera się czystą kwartą',
        direction: 'up',
      },
      {
        title: 'Szła dzieweczka do laseczka',
        fragment: '„Szła dziew-” wspina się o kwartę w górę',
        direction: 'up',
      },
    ],
  },
  {
    id: 'TT',
    name: 'Tryton',
    shortName: 'TT',
    semitones: 6,
    difficulty: 'intermediate',
    songs: [
      {
        title: 'Simpsonowie – motyw przewodni',
        fragment: 'Wejście saksofonu tworzy charakterystyczny tryton w górę',
        direction: 'up',
      },
      {
        title: 'Diabelski taniec (Kabaret Starszych Panów)',
        fragment: 'Rozpoczyna się trytonem podkreślającym napięcie',
        direction: 'up',
      },
    ],
  },
  {
    id: 'P5',
    name: 'Kwinta czysta',
    shortName: 'P5',
    semitones: 7,
    difficulty: 'basic',
    songs: [
      {
        title: 'Gwiezdne wojny – motyw przewodni',
        fragment: 'Pierwszy skok fanfary to kwinta w górę',
        direction: 'up',
      },
      {
        title: 'Płonie ognisko i szumią knieje',
        fragment: '„Płonie og-” otwiera się kwintą w górę',
        direction: 'up',
      },
    ],
  },
  {
    id: 'm6',
    name: 'Seksta mała',
    shortName: 'm6',
    semitones: 8,
    difficulty: 'intermediate',
    songs: [
      {
        title: 'Historia miłosna – motyw przewodni',
        fragment: 'Skrzypce rozpoczynają temat skokiem o sekstę małą w górę',
        direction: 'up',
      },
      {
        title: 'Wojenko, wojenko',
        fragment: '„Wojenko, wojenko” opada o sekstę małą',
        direction: 'down',
      },
    ],
  },
  {
    id: 'M6',
    name: 'Seksta wielka',
    shortName: 'M6',
    semitones: 9,
    difficulty: 'intermediate',
    songs: [
      {
        title: 'Góralu, czy ci nie żal',
        fragment: '„Góralu czy” wspina się o sekstę wielką',
        direction: 'up',
      },
      {
        title: 'Pieśń o małym rycerzu',
        fragment: '„Hej wojenko” z refrenu skacze o sekstę wielką',
        direction: 'up',
      },
    ],
  },
  {
    id: 'm7',
    name: 'Septyma mała',
    shortName: 'm7',
    semitones: 10,
    difficulty: 'advanced',
    songs: [
      {
        title: 'Gdzieś tam (West Side Story)',
        fragment: 'Wejście wokalu „Gdzieś tam” szybuje o septymę małą',
        direction: 'up',
      },
      {
        title: 'Kolęda: Mizerna cicha',
        fragment: '„Mizerna cicha” opada o septymę małą',
        direction: 'down',
      },
    ],
  },
  {
    id: 'M7',
    name: 'Septyma wielka',
    shortName: 'M7',
    semitones: 11,
    difficulty: 'advanced',
    songs: [
      {
        title: 'Błękitna rapsodia',
        fragment: 'Słynny wstęp klarnetu wznosi się o septymę wielką',
        direction: 'up',
      },
      {
        title: 'Walc Caton (Jerzy Petersburski)',
        fragment: 'Pierwszy skok melodii to septyma wielka w górę',
        direction: 'up',
      },
    ],
  },
  {
    id: 'P8',
    name: 'Oktawa czysta',
    shortName: 'P8',
    semitones: 12,
    difficulty: 'basic',
    songs: [
      {
        title: 'Gdzieś nad tęczą',
        fragment: '„Gdzieś nad tęczą” zaczyna się skokiem o oktawę w górę',
        direction: 'up',
      },
      {
        title: 'Hej sokoły',
        fragment: '„Hej tam gdzieś” podskakuje o oktawę',
        direction: 'up',
      },
    ],
  },
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
