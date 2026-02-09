// Internationalization (i18n) system for Phil3
// Supports English (EN) and French (FR) locales

export type Locale = 'en' | 'fr';

export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'fr'];

// Storage key for persisting language preference
const LOCALE_STORAGE_KEY = 'phil3_locale';

// Get stored locale from localStorage
export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }
  
  return DEFAULT_LOCALE;
}

// Store locale in localStorage
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

// Format date according to locale
export function formatDate(date: Date | bigint, locale: Locale): string {
  const dateObj = typeof date === 'bigint' ? new Date(Number(date) / 1000000) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', options).format(dateObj);
}

// Format date and time according to locale
export function formatDateTime(date: Date | bigint, locale: Locale): string {
  const dateObj = typeof date === 'bigint' ? new Date(Number(date) / 1000000) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', options).format(dateObj);
}

// Format number according to locale
export function formatNumber(num: number | bigint, locale: Locale): string {
  const numValue = typeof num === 'bigint' ? Number(num) : num;
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US').format(numValue);
}

// Pluralization helper
export function pluralize(count: number, singular: string, plural: string, locale: Locale): string {
  if (locale === 'fr') {
    // French pluralization: 0 and 1 are singular, 2+ are plural
    return count <= 1 ? singular : plural;
  } else {
    // English pluralization: 1 is singular, everything else is plural
    return count === 1 ? singular : plural;
  }
}
