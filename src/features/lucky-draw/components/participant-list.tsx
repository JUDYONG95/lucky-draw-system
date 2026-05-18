"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Participant, Winner } from "../types";

type ParticipantListProps = {
  participants: Participant[];
  winners: Winner[];
};

export function ParticipantList({ participants, winners }: ParticipantListProps) {
  const winnerIds = new Set(winners.map((w) => w.participant.id));
  const eligibleCount = participants.filter((p) => !winnerIds.has(p.id)).length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Participant Pool</span>
          <span className="text-sm font-normal text-muted-foreground">
            {eligibleCount} eligible
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {participants.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Upload a CSV to load participants
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {participants.map((participant) => {
                const isWinner = winnerIds.has(participant.id);
                return (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between px-4 py-2 ${
                      isWinner ? "bg-muted/30 opacity-50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${
                          isWinner ? "line-through" : ""
                        }`}
                      >
                        {participant.name}
                      </p>
                      {participant.department && (
                        <p className="truncate text-xs text-muted-foreground">
                          {participant.department}
                        </p>
                      )}
                    </div>
                    {isWinner && (
                      <Badge variant="secondary" className="ml-2 shrink-0 text-xs">
                        Won
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
