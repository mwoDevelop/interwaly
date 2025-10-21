// Ikony zastępcze (emoji zamiast ikon z lucide-react)
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShortcutHints } from './ShortcutHints';

const navItems = [
  { to: '/', labelKey: 'nav.dashboard', icon: () => <span>📈</span> },
  { to: '/recognize', labelKey: 'nav.recognize', icon: () => <span>🎹</span> },
  { to: '/flashcards', labelKey: 'nav.flashcards', icon: () => <span>🃏</span> },
  { to: '/sing', labelKey: 'nav.sing', icon: () => <span>🎤</span> },
  { to: '/compare', labelKey: 'nav.compare', icon: () => <span>⚖️</span> },
  { to: '/assoc', labelKey: 'nav.assoc', icon: () => <span>🎵</span> }
];

export const AppLayout = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-16 pt-6 md:flex-row">
        <aside className={`md:w-64 md:shrink-0 ${isOpen ? 'block' : 'hidden'} md:block`}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Interwały</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 text-slate-300 md:hidden"
              aria-label={t('aria.closeMenu')}
            >
              ✕
            </button>
          </div>
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-slate-800 ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-300'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon />
                  {t(item.labelKey)}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-6 flex items-center justify-between">
            <LanguageSwitcher />
          </div>
        </aside>
        <button
          onClick={() => setIsOpen(true)}
          className="mb-4 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow md:hidden"
        >
          <span>☰</span> {t('aria.openMenu')}
        </button>
        <main className="flex-1 md:pl-10">
          <Outlet />
        </main>
      </div>
      <ShortcutHints />
    </div>
  );
};
