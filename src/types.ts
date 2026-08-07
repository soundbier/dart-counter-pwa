export type GameMode = '501-double' | '301-double' | '501-simple' | '301-simple';

export interface PlayerLifetimeStats {
  gamesPlayed: number;
  gamesWon: number;
  totalThrows: number;
  totalPoints: number;
  average: number;
  highestCheckout: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
  lifetime: PlayerLifetimeStats;
}

export interface Round {
  id: string;
  legId: string;
  playerId: string;
  throwCount: number; // 1-3
  values: number[]; // z.B. [20, 20, 1]
  totalPoints: number;
  remainingPoints: number;
  isBust: boolean;
  timestamp: number;
}

export interface Leg {
  id: string;
  gameId: string;
  playerIds: string[];
  rounds: Round[];
  winner?: string;
  finishedAt?: number;
}

export interface Game {
  id: string;
  mode: GameMode;
  playerIds: string[];
  legs: Leg[];
  winner?: string;
  createdAt: number;
  updatedAt: number;
}
