import { useEffect, useState } from 'react';

const hints = [
  { combo: 'Space', descriptionPl: 'Odtwarzaj / zatrzymaj', descriptionEn: 'Play / Stop' },
  { combo: 'R', descriptionPl: 'Pokaż odpowiedź', descriptionEn: 'Reveal answer' },
  { combo: 'N', descriptionPl: 'Następny przykład', descriptionEn: 'Next example' }
];

export const ShortcutHints = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handle = () => setHidden(true);
    window.addEventListener('keydown', handle, { once: true });
    return () => window.removeEventListener('keydown', handle);
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-slate-900/80 px-6 py-3 text-xs text-slate-300 shadow-lg backdrop-blur">
      <div className="flex items-center gap-4">
        {hints.map((hint) => (
          <span key={hint.combo}>
            <kbd className="rounded border border-slate-600 px-1.5 py-0.5 text-[10px] uppercase text-slate-200">
              {hint.combo}
            </kbd>{' '}
            <span className="hidden sm:inline">{hint.descriptionPl}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
