import Dexie, { Table } from 'dexie';
import { Player, Game } from './types';

export class DartDatabase extends Dexie {
  // '!' sorgt dafür, dass TypeScript weiß, dass die Tabellen von Dexie initialisiert werden
  players!: Table<Player>;
  games!: Table<Game>;

  constructor() {
    super('DartCounterDB');
    
    // Schema-Definition: 
    // 'id' ist der Primärschlüssel. 
    // Weitere Felder nach dem Komma sind Indizes für schnellere Abfragen.
    this.version(1).stores({
      players: 'id, name',
      games: 'id, mode, createdAt'
    });
  }
}

export const db = new DartDatabase();
