"use client";

import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { PrizeTier, Winner } from "../types";

type WinnersPanelProps = {
  winners: Winner[];
  tiers: PrizeTier[];
};

export function WinnersPanel({ winners, tiers }: WinnersPanelProps) {
  const exportWinnersCSV = () => {
    if (winners.length === 0) return;

    const headers = ["Prize Tier", "Name", "Employee ID", "Department", "Drawn At"];
    const rows = winners
      .map((w) => [
        w.tier.name,
        w.participant.name,
        w.participant.employeeId || "",
        w.participant.department || "",
        (w.drawnAt || w.timestamp).toLocaleString(),
      ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lucky-draw-winners-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group winners by tier
  const winnersByTier = tiers.map((tier) => ({
    tier,
    winners: winners.filter((w) => w.tier.id === tier.id),
  }));

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Winners</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={exportWinnersCSV}
            disabled={winners.length === 0}
          >
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {winners.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No winners yet. Start drawing!
            </p>
          ) : (
            <div className="space-y-4 p-4">
              {winnersByTier.map(
                ({ tier, winners: tierWinners }) =>
                  tierWinners.length > 0 && (
                    <div key={tier.id}>
                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-gold/50 bg-gold/10 text-gold"
                        >
                          {tier.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {tierWinners.length}/{tier.maxWinners}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {tierWinners.map((winner, index) => (
                          <div
                            key={`${winner.participant.id}-${winner.tier.id}`}
                            className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-muted-foreground">
                                #{index + 1}
                              </span>
                              <div>
                                <p className="text-sm font-medium">
                                  {winner.participant.name}
                                </p>
                                {winner.participant.department && (
                                  <p className="text-xs text-muted-foreground">
                                    {winner.participant.department}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
