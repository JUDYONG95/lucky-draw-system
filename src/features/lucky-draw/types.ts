export interface Participant {
  id: string;
  name: string;
  employeeId?: string;
  department?: string;
}

export interface PrizeTier {
  id: string;
  name: string;
  maxWinners: number;
  displayColor?: string;
  order?: number;
}

export interface Winner {
  id: string;
  participant: Participant;
  tier: PrizeTier;
  timestamp: Date;
  drawnAt?: Date;
}

export interface DrawState {
  participants: Participant[];
  winners: Winner[];
  prizeTiers: PrizeTier[];
  currentTierId: string | null;
  isDrawing: boolean;
  lastWinner: Winner | null;
}

export interface DrawActions {
  setParticipants: (participants: Participant[]) => void;
  addPrizeTier: (tier: Omit<PrizeTier, 'id'>) => void;
  updatePrizeTier: (id: string, tier: Partial<PrizeTier>) => void;
  removePrizeTier: (id: string) => void;
  setCurrentTier: (tierId: string) => void;
  draw: () => void;
  undoLastDraw: () => void;
  resetDraw: () => void;
  resetAll: () => void;
}

export type CSVColumn = 'name' | 'employeeId' | 'department';

export interface CSVParseResult {
  participants: Participant[];
  errors: string[];
  mappedColumns: Record<CSVColumn, number | null>;
}
