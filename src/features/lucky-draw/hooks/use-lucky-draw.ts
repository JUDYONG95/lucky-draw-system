import { useState, useCallback } from 'react';
import { DEFAULT_PRIZE_TIERS } from '../constants';
import type { Participant, PrizeTier, Winner, DrawActions } from '../types';

export function useLuckyDraw(): DrawActions & {
  participants: Participant[];
  winners: Winner[];
  prizeTiers: PrizeTier[];
  currentTierId: string | null;
  isDrawing: boolean;
  lastWinner: Winner | null;
} {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [prizeTiers, setPrizeTiers] = useState<PrizeTier[]>(DEFAULT_PRIZE_TIERS);
  const [currentTierId, setCurrentTierId] = useState<string | null>(DEFAULT_PRIZE_TIERS[0].id);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastWinner, setLastWinner] = useState<Winner | null>(null);
  const [history, setHistory] = useState<Winner[]>([]);

  const getAvailableParticipants = useCallback(() => {
    const winnerIds = new Set(winners.map((w) => w.participant.id));
    return participants.filter((p) => !winnerIds.has(p.id));
  }, [participants, winners]);

  const draw = useCallback(() => {
    const currentTier = prizeTiers.find((t) => t.id === currentTierId);
    if (!currentTier) return;

    const available = getAvailableParticipants();
    if (available.length === 0) return;

    // Animate drawing
    setIsDrawing(true);
    const startTime = Date.now();
    const duration = 3000;

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(animationInterval);

        // Select random winner
        const selectedParticipant = available[Math.floor(Math.random() * available.length)];
        const newWinner: Winner = {
          id: `${Date.now()}-${Math.random()}`,
          participant: selectedParticipant,
          tier: currentTier,
          timestamp: new Date(),
        };

        setWinners((prev) => [...prev, newWinner]);
        setLastWinner(newWinner);
        setHistory((prev) => [...prev, newWinner]);
        setIsDrawing(false);
      }
    }, 50);

    return () => clearInterval(animationInterval);
  }, [currentTierId, prizeTiers, winners, participants, getAvailableParticipants]);

  const undoLastDraw = useCallback(() => {
    if (lastWinner) {
      setWinners((prev) => prev.filter((w) => w.id !== lastWinner.id));
      setHistory((prev) => prev.slice(0, -1));
      setLastWinner(history.length > 1 ? history[history.length - 2] : null);
    }
  }, [lastWinner, history]);

  const resetDraw = useCallback(() => {
    setWinners([]);
    setLastWinner(null);
    setHistory([]);
  }, []);

  const resetAll = useCallback(() => {
    setParticipants([]);
    setWinners([]);
    setLastWinner(null);
    setHistory([]);
    setPrizeTiers(DEFAULT_PRIZE_TIERS);
    setCurrentTierId(DEFAULT_PRIZE_TIERS[0].id);
  }, []);

  const addPrizeTier = useCallback((tier: Omit<PrizeTier, 'id'>) => {
    const newTier: PrizeTier = {
      ...tier,
      id: `tier-${Date.now()}`,
    };
    setPrizeTiers((prev) => [...prev, newTier]);
  }, []);

  const updatePrizeTier = useCallback((id: string, updates: Partial<PrizeTier>) => {
    setPrizeTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const removePrizeTier = useCallback((id: string) => {
    setPrizeTiers((prev) => prev.filter((t) => t.id !== id));
    if (currentTierId === id) {
      const remaining = prizeTiers.filter((t) => t.id !== id);
      setCurrentTierId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [currentTierId, prizeTiers]);

  return {
    participants,
    winners,
    prizeTiers,
    currentTierId,
    isDrawing,
    lastWinner,
    setParticipants,
    addPrizeTier,
    updatePrizeTier,
    removePrizeTier,
    setCurrentTier: setCurrentTierId,
    draw,
    undoLastDraw,
    resetDraw,
    resetAll,
  };
}
