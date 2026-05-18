"use client";

import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import {
  useLuckyDraw,
  CSVUpload,
  ParticipantList,
  PrizeTierConfig,
  DrawSpinner,
  WinnersPanel,
  AdminControls,
  ConfettiCelebration,
} from "@/src/features/lucky-draw";

export default function LuckyDrawPage() {
  const {
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
    setCurrentTier,
    draw,
    undoLastDraw,
    resetDraw,
    resetAll,
  } = useLuckyDraw();

  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when a winner is revealed
  useEffect(() => {
    if (!isDrawing && lastWinner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isDrawing, lastWinner]);

  const currentTier = prizeTiers.find((t) => t.id === currentTierId) || null;
  const winnersForCurrentTier = winners.filter((w) => w.tier.id === currentTierId);
  const isTierFull = currentTier
    ? winnersForCurrentTier.length >= currentTier.maxWinners
    : false;

  return (
    <main className="min-h-screen bg-background">
      <ConfettiCelebration trigger={showConfetti} />

      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
              <Gift className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Lucky Draw</h1>
              <p className="text-sm text-muted-foreground">Family Day Event</p>
            </div>
          </div>
          <AdminControls
            canUndo={!!lastWinner}
            hasWinners={winners.length > 0}
            hasParticipants={participants.length > 0}
            onUndo={undoLastDraw}
            onResetDraw={resetDraw}
            onResetAll={resetAll}
          />
        </div>
      </header>

      {/* Main content - Three panel layout */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr_300px]">
          {/* Left Panel - Participants */}
          <div className="space-y-4">
            <CSVUpload
              onUpload={setParticipants}
              participantCount={participants.length}
            />
            <ParticipantList participants={participants} winners={winners} />
          </div>

          {/* Center Panel - Draw Spinner */}
          <div className="flex flex-col">
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-border/50 bg-card/30 p-8">
              <DrawSpinner
                participants={participants}
                winners={winners}
                currentTier={currentTier}
                isDrawing={isDrawing}
                lastWinner={lastWinner}
                onDraw={draw}
                disabled={
                  participants.length === 0 || !currentTierId || isTierFull
                }
              />
            </div>

            {/* Prize tier selector (mobile-friendly) */}
            <div className="mt-4 lg:hidden">
              <PrizeTierConfig
                tiers={prizeTiers}
                winners={winners}
                currentTierId={currentTierId}
                onSelectTier={setCurrentTier}
                onAddTier={addPrizeTier}
                onUpdateTier={updatePrizeTier}
                onRemoveTier={removePrizeTier}
              />
            </div>
          </div>

          {/* Right Panel - Prize Tiers & Winners */}
          <div className="space-y-4">
            <div className="hidden lg:block">
              <PrizeTierConfig
                tiers={prizeTiers}
                winners={winners}
                currentTierId={currentTierId}
                onSelectTier={setCurrentTier}
                onAddTier={addPrizeTier}
                onUpdateTier={updatePrizeTier}
                onRemoveTier={removePrizeTier}
              />
            </div>
            <WinnersPanel winners={winners} tiers={prizeTiers} />
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm text-muted-foreground">
          Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Space</kbd> to draw
        </div>
      </footer>
    </main>
  );
}
