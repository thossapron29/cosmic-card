import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  let id = localStorage.getItem('cosmic_anon_id');
  if (!id) {
    id = generateUUID();
    localStorage.setItem('cosmic_anon_id', id);
  }
  return id;
}

export function getTodayDateStr(date?: Date) {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const CACHE_KEY = 'cosmic_today_card';

export function setCachedTodayCard(card: any) {
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

