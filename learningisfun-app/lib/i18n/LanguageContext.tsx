'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import en from '@/messages/en.json';
import he from '@/messages/he.json';

type Language = 'en' | 'he';

type Messages = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messages: Record<Language, Messages> = {
  en,
  he,
};

// Helper to validate language keys
const isValidLanguage = (lang: string | null): lang is Language => {
  return lang !== null && lang in messages;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (isValidLanguage(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Update document dir and save to localStorage when language changes
  useEffect(() => {
    const isRTL = language === 'he';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // Translation function with nested key support (e.g., "nav.home")
  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = messages[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation for key: ${key}`);
        }
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  }, [language]);

  const isRTL = language === 'he';

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ language, setLanguage, t, isRTL }),
    [language, setLanguage, t, isRTL]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
