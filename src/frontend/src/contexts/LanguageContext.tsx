import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, DEFAULT_LOCALE, getStoredLocale, setStoredLocale } from '../lib/i18n';
import { getTranslations, Translations } from '../lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale());
  const [t, setT] = useState<Translations>(getTranslations(locale));

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
    setT(getTranslations(newLocale));
  };

  useEffect(() => {
    setT(getTranslations(locale));
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
