import type { PrizeTier } from './types';

export const DEFAULT_PRIZE_TIERS: PrizeTier[] = [
  { id: 'grand', name: 'Grand Prize', maxWinners: 1, displayColor: '#FFD700' },
  { id: 'first', name: '1st Prize', maxWinners: 2, displayColor: '#E8C547' },
  { id: 'second', name: '2nd Prize', maxWinners: 3, displayColor: '#D4AF37' },
  { id: 'third', name: '3rd Prize', maxWinners: 5, displayColor: '#C0A028' },
  { id: 'consolation', name: 'Consolation', maxWinners: 10, displayColor: '#8B7500' },
];

export const SPIN_DURATION_MS = 3000;
export const SPIN_INTERVAL_MS = 50;
export const SPIN_SLOWDOWN_START = 0.7;
export const SPIN_ROUNDS = 3;
