import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = () => {
    const next = i18n.language === 'pl' ? 'en' : 'pl';
    void i18n.changeLanguage(next);
  };

  return (
    <button
      type="button"
      onClick={changeLanguage}
      className="rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold uppercase text-slate-200"
    >
      {i18n.language === 'pl' ? 'EN' : 'PL'}
    </button>
  );
};
