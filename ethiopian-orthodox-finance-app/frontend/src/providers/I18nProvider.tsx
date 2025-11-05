import React, { createContext, useContext, useState, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../assets/translations';

interface I18nContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('fr'); // Default language

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: changeLanguage }}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextProps => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};