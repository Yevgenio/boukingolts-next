'use client';

import { useState, useEffect } from 'react';
import { setLanguage } from '@/lib/useTranslation';
import { supportedLanguages } from '@/config/i18n';

export default function LanguageSwitcher() {
  const [selectedLang, setSelectedLang] = useState<string>('en'); // no localStorage yet

  const handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    setLanguage(lang);
    setSelectedLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('lang');
      if (storedLang) {
        setSelectedLang(storedLang);
        setLanguage(storedLang);
        document.documentElement.lang = storedLang;
      }
    }
  }, []);

  return (
    <div>
      <select 
        value={selectedLang}
        onChange={handleChangeLanguage}
      >
        {supportedLanguages.map((lang) => (
          <option
            key={lang}
            value={lang}
            style={{ color: 'black' }}
          >
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
