"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PrizeTier, Winner } from "../types";

type PrizeTierConfigProps = {
  tiers: PrizeTier[];
  winners: Winner[];
  currentTierId: string | null;
  onSelectTier: (tierId: string | null) => void;
  onAddTier: (tier: Omit<PrizeTier, "id">) => void;
  onUpdateTier: (id: string, updates: Partial<PrizeTier>) => void;
  onRemoveTier: (id: string) => void;
};

export function PrizeTierConfig({
  tiers,
  winners,
  currentTierId,
  onSelectTier,
  onAddTier,
  onUpdateTier,
  onRemoveTier,
}: PrizeTierConfigProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCount, setEditCount] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState("1");

  const getWinnersForTier = (tierId: string) =>
    winners.filter((w) => w.tier.id === tierId);

  const startEdit = (tier: PrizeTier) => {
    setEditingId(tier.id);
    setEditName(tier.name);
    setEditCount(tier.maxWinners.toString());
  };

  const saveEdit = () => {
    if (editingId && editName.trim() && parseInt(editCount) > 0) {
      onUpdateTier(editingId, {
        name: editName.trim(),
        maxWinners: parseInt(editCount),
      });
    }
    setEditingId(null);
  };

  const handleAddTier = () => {
    if (newName.trim() && parseInt(newCount) > 0) {
      onAddTier({
        name: newName.trim(),
        maxWinners: parseInt(newCount),
        order: tiers.length + 1,
      });
      setNewName("");
      setNewCount("1");
      setShowAddForm(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Prize Tiers</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {showAddForm && (
          <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2">
            <Input
              placeholder="Prize name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-8 flex-1"
            />
            <Input
              type="number"
              placeholder="#"
              value={newCount}
              onChange={(e) => setNewCount(e.target.value)}
              className="h-8 w-16"
              min={1}
            />
            <Button size="sm" className="h-8" onClick={handleAddTier}>
              Add
            </Button>
          </div>
        )}

        <ScrollArea className="h-[200px]">
          <div className="divide-y divide-border/50">
            {tiers.map((tier) => {
              const tierWinners = getWinnersForTier(tier.id);
              const isFull = tierWinners.length >= tier.maxWinners;
              const isEditing = editingId === tier.id;
              const isSelected = currentTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`group flex items-center gap-2 px-4 py-2 transition-colors ${
                    isSelected ? "bg-gold/10" : ""
                  } ${isFull ? "opacity-50" : "cursor-pointer hover:bg-muted/50"}`}
                  onClick={() => !isFull && !isEditing && onSelectTier(tier.id)}
                >
                  {isEditing ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-7 flex-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Input
                        type="number"
                        value={editCount}
                        onChange={(e) => setEditCount(e.target.value)}
                        className="h-7 w-14"
                        min={1}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit();
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isSelected ? "bg-gold" : isFull ? "bg-muted" : "bg-green-500"
                        }`}
                      />
                      <span className="flex-1 text-sm font-medium">{tier.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {tierWinners.length}/{tier.maxWinners}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(tier);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive opacity-0 hover:text-destructive group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveTier(tier.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
