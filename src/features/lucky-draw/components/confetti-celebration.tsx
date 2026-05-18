"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

type ConfettiCelebrationProps = {
  trigger: boolean;
};

export function ConfettiCelebration({ trigger }: ConfettiCelebrationProps) {
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#FFFFFF", "#87CEEB"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#FFFFFF", "#87CEEB"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trigger) {
      const cleanup = fireConfetti();
      return cleanup;
    }
  }, [trigger, fireConfetti]);

  return null;
}
