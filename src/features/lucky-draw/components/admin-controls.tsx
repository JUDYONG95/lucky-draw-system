"use client";

import { RotateCcw, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AdminControlsProps = {
  canUndo: boolean;
  hasWinners: boolean;
  hasParticipants: boolean;
  onUndo: () => void;
  onResetDraw: () => void;
  onResetAll: () => void;
};

export function AdminControls({
  canUndo,
  hasWinners,
  hasParticipants,
  onUndo,
  onResetDraw,
  onResetAll,
}: AdminControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <Undo2 className="mr-1 h-4 w-4" />
        Undo Last
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={!hasWinners}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset Draw
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Draw?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all winners but keep the participants. You can start
              the draw from the beginning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onResetDraw}>Reset Draw</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={!hasParticipants}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Reset All
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Everything?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all participants, winners, and prize tier
              configurations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onResetAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
