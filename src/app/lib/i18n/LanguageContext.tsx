import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, getNestedTranslation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Detecta idioma do navegador ou usa português como padrão
  const detectBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    // Força português como padrão (sempre retorna 'pt' inicialmente)
    return 'pt';
  };

  const [language, setLanguageState] = useState<Language>(() => {
    // Tenta carregar do localStorage primeiro
    const saved = localStorage.getItem('userLanguage');
    // Se não houver preferência salva, usa português como padrão
    return (saved as Language) || 'pt';
  });

  // Salva no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('userLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Função de tradução
  const t = (key: string): string => {
    return getNestedTranslation(translations[language], key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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