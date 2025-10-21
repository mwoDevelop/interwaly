import { memo } from 'react';
import clsx from 'clsx';

interface VirtualKeyboardProps {
  activeMidi?: number;
  range?: [number, number];
}

const whiteKeys = [0, 2, 4, 5, 7, 9, 11];

const isWhiteKey = (note: number) => whiteKeys.includes(note % 12);

const noteLabels: Record<number, string> = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'Eb',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'Bb',
  11: 'B'
};

export const VirtualKeyboard = memo(({ activeMidi, range = [48, 72] }: VirtualKeyboardProps) => {
  const keys = [];
  for (let midi = range[0]; midi <= range[1]; midi++) {
    const noteClass = midi % 12;
    const white = isWhiteKey(noteClass);
    keys.push({ midi, white, label: `${noteLabels[noteClass]}${Math.floor(midi / 12) - 1}` });
  }

  return (
    <div className="mt-6 flex h-32 select-none overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
      {keys.map((key) => (
        <div
          key={key.midi}
          className={clsx(
            'relative flex-1 border-r border-slate-800 text-center text-[10px] uppercase last:border-r-0',
            key.white ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-200',
            activeMidi === key.midi && 'bg-accent/70 text-white'
          )}
        >
          <span className="absolute bottom-1 left-0 right-0">{key.label}</span>
        </div>
      ))}
    </div>
  );
});
