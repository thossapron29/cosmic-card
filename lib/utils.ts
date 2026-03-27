import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const ANONYMOUS_ID_KEY = "cosmic_anon_id";
const PREFERRED_DECK_KEY = "cosmic_preferred_deck";
const SELECTED_THEME_KEY = "cosmic_selected_theme";
const PREFERRED_LOCALE_KEY = "cosmic_locale";
const PREFERRED_TIMEZONE_KEY = "cosmic_timezone";
const ONBOARDING_COMPLETED_KEY = "cosmic_onboarding_completed";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getAnonymousId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

export function getPreferredDeckSlug() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PREFERRED_DECK_KEY);
}

export function setPreferredDeckSlug(slug: string | null) {
  if (typeof window === "undefined") return;

  if (!slug) {
    localStorage.removeItem(PREFERRED_DECK_KEY);
    return;
  }

  localStorage.setItem(PREFERRED_DECK_KEY, slug);
}

export function getSelectedTheme() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SELECTED_THEME_KEY);
}

export function setSelectedTheme(theme: string | null) {
  if (typeof window === "undefined") return;

  if (!theme) {
    localStorage.removeItem(SELECTED_THEME_KEY);
    return;
  }

  localStorage.setItem(SELECTED_THEME_KEY, theme);
}

export function getPreferredLocale() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PREFERRED_LOCALE_KEY);
}

export function setPreferredLocale(locale: string | null) {
  if (typeof window === "undefined") return;

  if (!locale) {
    localStorage.removeItem(PREFERRED_LOCALE_KEY);
    return;
  }

  localStorage.setItem(PREFERRED_LOCALE_KEY, locale);
}

export function getPreferredTimezone() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PREFERRED_TIMEZONE_KEY);
}

export function setPreferredTimezone(timezone: string | null) {
  if (typeof window === "undefined") return;

  if (!timezone) {
    localStorage.removeItem(PREFERRED_TIMEZONE_KEY);
    return;
  }

  localStorage.setItem(PREFERRED_TIMEZONE_KEY, timezone);
}

export function getOnboardingCompleted() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
}

export function setOnboardingCompleted(completed: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? "true" : "false");
}

export function getTodayDateStr(date?: Date) {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const CACHE_KEY = 'cosmic_today_card';

export function setCachedTodayCard(card: unknown) {
  if (typeof window === 'undefined') return;
  const data = {
    card,
    date: getTodayDateStr(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export function getCachedTodayCard() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.date === getTodayDateStr()) {
      return data.card;
    }
    // Expired or different date
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}
