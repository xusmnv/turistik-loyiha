import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSavedLanguage, 
  saveLanguage, 
  resolveEffectiveLanguage, 
  getTranslation,
  SUPPORTED_LANGUAGES 
} from '../services/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => getSavedLanguage());
  const [effectiveLanguage, setEffectiveLanguage] = useState(() => resolveEffectiveLanguage(getSavedLanguage()));

  const changeLanguage = (newLang) => {
    setLanguageState(newLang);
    saveLanguage(newLang);
    setEffectiveLanguage(resolveEffectiveLanguage(newLang));
  };

  useEffect(() => {
    setEffectiveLanguage(resolveEffectiveLanguage(language));
  }, [language]);

  const t = (key) => getTranslation(key, language);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      effectiveLanguage,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    const eff = resolveEffectiveLanguage('auto');
    return {
      language: 'auto',
      effectiveLanguage: eff,
      setLanguage: () => {},
      t: (key) => getTranslation(key, 'auto'),
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return context;
}
