import { TRANSLATIONS } from '@/config';

export const getTranslationsForLanguage = (language: string) => {
    const translations: Record<keyof typeof TRANSLATIONS, Record<string, string>> = {} as any;

    for (const sectionKey in TRANSLATIONS) {
    const section = sectionKey as keyof typeof TRANSLATIONS;
    const sectionTranslations = TRANSLATIONS[section];
    const sectionTranslation: Record<string, string> = {};

    for (const key in sectionTranslations) {
        const typedKey = key as keyof typeof sectionTranslations;

        sectionTranslation[typedKey] = sectionTranslations[typedKey][language] || sectionTranslations[typedKey]['en'];
    }

    translations[section] = sectionTranslation;
    }

    return translations;
};
  
