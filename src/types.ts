export interface Card {
  id: string;
  text: string;
  createdAt: string;
  dateDone?: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  columns: Column[];
}

export interface Cursor {
  col: number;
  row: number;
}

export type Mode = 'normal' | 'add-card' | 'add-column' | 'edit-card' | 'move-picker' | 'help' | 'confirm-delete-col';
