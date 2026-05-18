"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Participant, PrizeTier, Winner } from "../types";
import { SPIN_DURATION_MS, SPIN_INTERVAL_MS, SPIN_SLOWDOWN_START } from "../constants";

type DrawSpinnerProps = {
  participants: Participant[];
  winners: Winner[];
  currentTier: PrizeTier | null;
  isDrawing: boolean;
  lastWinner: Winner | null;
  onDraw: () => void;
  disabled: boolean;
};

export function DrawSpinner({
  participants,
  winners,
  currentTier,
  isDrawing,
  lastWinner,
  onDraw,
  disabled,
}: DrawSpinnerProps) {
  const [displayName, setDisplayName] = useState<string>("");
  const [showWinner, setShowWinner] = useState(false);

  // Get eligible participants
  const eligibleParticipants = useMemo(() => {
    const winnerIds = new Set(winners.map((w) => w.participant.id));
    return participants.filter((p) => !winnerIds.has(p.id));
  }, [participants, winners]);

  // Spinning animation
  useEffect(() => {
    if (!isDrawing || eligibleParticipants.length === 0) return;

    setShowWinner(false);
    const startTime = Date.now();
    let intervalId: NodeJS.Timeout;

    const spin = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / SPIN_DURATION_MS;

      // Slow down as we approach the end
      let interval = SPIN_INTERVAL_MS;
      if (progress > SPIN_SLOWDOWN_START) {
        const slowdownProgress = (progress - SPIN_SLOWDOWN_START) / (1 - SPIN_SLOWDOWN_START);
        interval = SPIN_INTERVAL_MS + slowdownProgress * 200;
      }

      // Pick random name
      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
      setDisplayName(eligibleParticipants[randomIndex].name);

      if (elapsed < SPIN_DURATION_MS) {
        intervalId = setTimeout(spin, interval);
      }
    };

    spin();

    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, [isDrawing, eligibleParticipants]);

  // Show winner after drawing
  useEffect(() => {
    if (!isDrawing && lastWinner) {
      setDisplayName(lastWinner.participant.name);
      setShowWinner(true);
    }
  }, [isDrawing, lastWinner]);

  const handleDraw = useCallback(() => {
    if (!disabled && !isDrawing) {
      onDraw();
    }
  }, [disabled, isDrawing, onDraw]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !disabled && !isDrawing) {
        e.preventDefault();
        handleDraw();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, isDrawing, handleDraw]);

  const canDraw = !disabled && !isDrawing && currentTier && eligibleParticipants.length > 0;

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Prize tier indicator */}
      {currentTier && (
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Now Drawing
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gold">{currentTier.name}</h2>
        </div>
      )}

      {/* Spinner display */}
      <div
        className={cn(
          "relative flex h-48 w-full max-w-xl items-center justify-center overflow-hidden rounded-2xl border-2 bg-gradient-to-b from-background to-muted/50",
          isDrawing ? "border-gold/50" : showWinner ? "border-gold" : "border-border/50",
          showWinner && "animate-pulse"
        )}
      >
        {/* Glow effect */}
        {(isDrawing || showWinner) && (
          <div
            className={cn(
              "absolute inset-0 opacity-20",
              showWinner ? "bg-gold" : "bg-gold/50"
            )}
          />
        )}

        {/* Name display */}
        <div className="relative z-10 px-8 text-center">
          {!currentTier ? (
            <p className="text-xl text-muted-foreground">
              Select a prize tier to start
            </p>
          ) : eligibleParticipants.length === 0 ? (
            <p className="text-xl text-muted-foreground">
              No eligible participants
            </p>
          ) : displayName ? (
            <p
              className={cn(
                "text-4xl font-bold transition-all duration-200 md:text-5xl",
                showWinner ? "scale-110 text-gold" : "text-foreground"
              )}
            >
              {displayName}
            </p>
          ) : (
            <p className="text-xl text-muted-foreground">
              Press DRAW or hit Space
            </p>
          )}

          {/* Winner department */}
          {showWinner && lastWinner?.participant.department && (
            <p className="mt-2 text-lg text-muted-foreground">
              {lastWinner.participant.department}
            </p>
          )}
        </div>
      </div>

      {/* Draw button */}
      <Button
        size="lg"
        className={cn(
          "h-14 min-w-[200px] text-lg font-semibold transition-all",
          canDraw
            ? "bg-gold text-gold-foreground hover:bg-gold/90"
            : "bg-muted text-muted-foreground"
        )}
        disabled={!canDraw}
        onClick={handleDraw}
      >
        {isDrawing ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Drawing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            DRAW
          </span>
        )}
      </Button>

      {/* Hint */}
      <p className="text-sm text-muted-foreground">
        {eligibleParticipants.length} participants remaining
      </p>
    </div>
  );
}
