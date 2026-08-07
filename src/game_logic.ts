import { GameMode } from './types';

/**
 * Gibt die Startpunkte basierend auf dem Spielmodus zurück.
 */
export function getInitialScore(mode: GameMode): number {
  if (mode.startsWith('501')) return 501;
  if (mode.startsWith('301')) return 301;
  return 501;
}

export interface ThrowResult {
  totalPoints: number;
  remainingPoints: number;
  isBust: boolean;
  isWin: boolean;
}

/**
 * Berechnet das Ergebnis einer Aufnahme (bis zu 3 Würfe).
 * 
 * @param currentScore Punktestand vor der Aufnahme
 * @param thrownValues Array der geworfenen Werte (z.B. [20, 20, 1])
 * @param mode Aktueller Spielmodus
 * @param isLastDartDouble Ob der letzte Dart ein Double war (relevant für Double-Out-Modi)
 */
export function processRound(
  currentScore: number,
  thrownValues: number[],
  mode: GameMode,
  isLastDartDouble: boolean = false
): ThrowResult {
  const totalPoints = thrownValues.reduce((sum, val) => sum + val, 0);
  const remainingAfter = currentScore - totalPoints;
  const isDoubleOut = mode.endsWith('double');

  let isBust = false;

  // Bust-Regeln:
  // 1. Punktestand unter 0 fallen
  // 2. Bei Double Out: Genau 1 Punkt Rest (da kein Finish mit Double möglich)
  // 3. Bei Double Out: Genau 0 Punkte, aber der letzte Dart war kein Double
  if (remainingAfter < 0) {
    isBust = true;
  } else if (remainingAfter === 1 && isDoubleOut) {
    isBust = true;
  } else if (remainingAfter === 0 && isDoubleOut && !isLastDartDouble) {
    isBust = true;
  }

  // Wenn Bust, bleibt der alte Punktestand erhalten und Punkte zählen nicht
  const finalRemaining = isBust ? currentScore : remainingAfter;
  const isWin = !isBust && finalRemaining === 0;

  return {
    totalPoints: isBust ? 0 : totalPoints,
    remainingPoints: finalRemaining,
    isBust,
    isWin,
  };
}
