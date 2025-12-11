import { BirthdayData } from '../types';

// This service handles interaction with the backend database.
// Currently simulates a DB using LocalStorage so you can test the functionality immediately.
// To use a real backend, simply replace the implementation of these two functions.

const SIMULATE_DELAY = 800; // ms to simulate network latency

export const saveBirthdayData = async (data: BirthdayData): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // GENERATE ID
      const id = Math.random().toString(36).substring(2, 9);
      const dataWithId = { ...data, id, createdAt: Date.now() };
      
      // SAVE TO "DATABASE" (LocalStorage for demo)
      // In a real app: await fetch('/api/birthdays', { method: 'POST', body: JSON.stringify(data) })
      try {
        localStorage.setItem(`lumiwish_${id}`, JSON.stringify(dataWithId));
      } catch (e) {
        console.error("Database Error:", e);
      }
      
      resolve(id);
    }, SIMULATE_DELAY);
  });
};

export const getBirthdayData = async (id: string): Promise<BirthdayData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // FETCH FROM "DATABASE"
      // In a real app: const res = await fetch(`/api/birthdays/${id}`); return res.json();
      const stored = localStorage.getItem(`lumiwish_${id}`);
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        resolve(null);
      }
    }, SIMULATE_DELAY);
  });
};