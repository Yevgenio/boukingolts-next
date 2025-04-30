'use client';

import { useState, useEffect } from 'react';
import { supportedLanguages, Language } from '@/config/i18n';
import { translations } from '@/config/translations';
// import { setLanguageCookie, getLanguageCookie } from './cookie';

// Helper function to detect browser language
function detectBrowserLanguage() {
  const lang = navigator.language.split('-')[0]; // 'en-US' -> 'en'
  return supportedLanguages.includes(lang as Language) ? (lang as Language) : 'en';
}

export function setLanguage(lang: string, isClientSide: boolean = false) {
  if (typeof window !== 'undefined' && isClientSide) {
    // Save language in localStorage on the client side
    localStorage.setItem('lang', lang);
  }
  // Server-side (no localStorage, use cookies instead)
  document.cookie = `lang=${lang};path=/;max-age=${60 * 60 * 24 * 365}`; // Set language cookie
}

export function useTranslation(req?: any) {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    // Client-side: Use localStorage or detect browser language
    const savedLang = localStorage.getItem('lang');
    if (savedLang && supportedLanguages.includes(savedLang as Language)) {
      setCurrentLang(savedLang as Language);
    } else {
      setCurrentLang(detectBrowserLanguage());
    }
  }, []);

  // On SSR (Server-side), read the language from the cookie
//   useEffect(() => {
//     if (req) {
//       const cookieLang = getLanguageCookie(req); // Get language from cookies
//       setCurrentLang(cookieLang);
//     }
//   }, [req]);

  function t(key: string): string {
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (!result) break;
    }
    return result?.[currentLang] || key;
  }

  return { t, currentLang };
}
