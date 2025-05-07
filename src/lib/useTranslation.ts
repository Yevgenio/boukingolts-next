'use client';

import { useState, useEffect } from 'react';
import { supportedLanguages, Language } from '@/config/i18n';
import { translations } from '@/config/translations';

interface TranslationValue {
  [key: string]: TranslationValue | string;
}

function isRecord(value: TranslationValue): value is Record<string, TranslationValue> {
  return typeof value === 'object' && value !== null;
}

function detectBrowserLanguage(): Language {
  const lang = navigator.language.split('-')[0];
  return supportedLanguages.includes(lang as Language) ? (lang as Language) : 'en';
}

export function setLanguage(lang: string, isClientSide: boolean = false): void {
  if (typeof window !== 'undefined' && isClientSide) {
    localStorage.setItem('lang', lang);
  }
  document.cookie = `lang=${lang};path=/;max-age=${60 * 60 * 24 * 365}`;
}

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && supportedLanguages.includes(savedLang as Language)) {
      setCurrentLang(savedLang as Language);
    } else {
      setCurrentLang(detectBrowserLanguage());
    }
  }, []);

  function t(key: string): string {
    const keys = key.split('.');
    let result: TranslationValue = translations;

    for (const k of keys) {
      if (isRecord(result) && k in result) {
        result = result[k];
      } else {
        return key; // fallback if path not found
      }
    }

    if (isRecord(result)) {
      return isRecord(result) && typeof result[currentLang] === 'string' ? result[currentLang] : key;
    }

    return typeof result === 'string' ? result : key;
  }

  return { t, currentLang };
}
