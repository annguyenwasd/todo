import { useState, useCallback } from 'react';
import type { Board, Card, Column, Cursor, Mode } from '../types.js';
import { loadBoard, saveBoard } from '../store.js';

let nextId = Date.now();
function genId(): string {
  return String(nextId++);
}

export function useBoard() {
  const [board, setBoard] = useState<Board>(loadBoard);
  const [cursor, setCursor] = useState<Cursor>({ col: 0, row: 0 });
  const [mode, setMode] = useState<Mode>('normal');
  const [minimizedCols, setMinimizedCols] = useState<Set<string>>(new Set());
  const [maximizedCol, setMaximizedCol] = useState<string | null>(null);

  const sortColumn = (col: Column) => {
    const isDone = col.title.toLowerCase().includes('done');
    col.cards.sort((a, b) => isDone
      ? new Date(b.dateDone ?? b.createdAt).getTime() - new Date(a.dateDone ?? a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  };

  const persist = useCallback((b: Board) => {
    b.columns.forEach(sortColumn);
    setBoard(b);
    saveBoard(b);
  }, []);

  const stampDone = (card: Card, col: Column) => {
    if (col.title.toLowerCase().includes('done')) {
      card.dateDone ??= new Date().toISOString();
    } else {
      delete card.dateDone;
    }
  };

  const clampRow = (col: number, row: number, b: Board) => {
    const cards = b.columns[col]?.cards ?? [];
    return Math.max(0, Math.min(row, cards.length - 1));
  };

  const moveUp = useCallback(() => {
    setCursor(c => ({ ...c, row: Math.max(0, c.row - 1) }));
  }, []);

  const moveDown = useCallback(() => {
    setCursor(c => {
      const col = board.columns[c.col];
      if (!col) return c;
      return { ...c, row: Math.min(col.cards.length - 1, c.row + 1) };
    });
  }, [board]);

  const jumpLeft = useCallback(() => {
    setCursor(c => {
      const newCol = Math.max(0, c.col - 1);
      return { col: newCol, row: clampRow(newCol, c.row, board) };
    });
  }, [board]);

  const jumpRight = useCallback(() => {
    setCursor(c => {
      const newCol = Math.min(board.columns.length - 1, c.col + 1);
      return { col: newCol, row: clampRow(newCol, c.row, board) };
    });
  }, [board]);

  const jumpToCol = useCallback((colIndex: number) => {
    if (colIndex < 0 || colIndex >= board.columns.length) return;
    setCursor(c => ({ col: colIndex, row: clampRow(colIndex, c.row, board) }));
  }, [board]);

  const moveCardLeft = useCallback(() => {
    if (cursor.col === 0) return;
    const b = structuredClone(board);
    const src = b.columns[cursor.col];
    const dst = b.columns[cursor.col - 1];
    if (!src?.cards[cursor.row] || !dst) return;
    const [card] = src.cards.splice(cursor.row, 1);
    stampDone(card!, dst);
    dst.cards.push(card!);
    setCursor(c => ({ ...c, row: clampRow(c.col, c.row, b) }));
    persist(b);
  }, [board, cursor, persist]);

  const moveColLeft = useCallback(() => {
    if (cursor.col === 0) return;
    const b = structuredClone(board);
    const [col] = b.columns.splice(cursor.col, 1);
    b.columns.splice(cursor.col - 1, 0, col!);
    setCursor(c => ({ ...c, col: c.col - 1 }));
    persist(b);
  }, [board, cursor, persist]);

  const moveColRight = useCallback(() => {
    if (cursor.col >= board.columns.length - 1) return;
    const b = structuredClone(board);
    const [col] = b.columns.splice(cursor.col, 1);
    b.columns.splice(cursor.col + 1, 0, col!);
    setCursor(c => ({ ...c, col: c.col + 1 }));
    persist(b);
  }, [board, cursor, persist]);

  const moveCardRight = useCallback(() => {
    if (cursor.col >= board.columns.length - 1) return;
    const b = structuredClone(board);
    const src = b.columns[cursor.col];
    const dst = b.columns[cursor.col + 1];
    if (!src?.cards[cursor.row] || !dst) return;
    const [card] = src.cards.splice(cursor.row, 1);
    stampDone(card!, dst);
    dst.cards.push(card!);
    setCursor(c => ({ ...c, row: clampRow(c.col, c.row, b) }));
    persist(b);
  }, [board, cursor, persist]);

  const addCard = useCallback((text: string, colIndex?: number) => {
    const b = structuredClone(board);
    const targetIndex = colIndex ?? cursor.col;
    const col = b.columns[targetIndex];
    if (!col) return;
    col.cards.push({ id: genId(), text, createdAt: new Date().toISOString() });
    persist(b);
    setCursor({ col: targetIndex, row: col.cards.length - 1 });
    setMode('normal');
  }, [board, cursor, persist]);

  const addColumn = useCallback((title: string) => {
    const b = structuredClone(board);
    b.columns.push({ id: genId(), title, cards: [] });
    persist(b);
    setMode('normal');
  }, [board, persist]);

  const deleteCard = useCallback(() => {
    const b = structuredClone(board);
    const col = b.columns[cursor.col];
    if (!col?.cards[cursor.row]) return;
    col.cards.splice(cursor.row, 1);
    setCursor(c => ({ ...c, row: clampRow(c.col, c.row, b) }));
    persist(b);
  }, [board, cursor, persist]);

  const deleteColumn = useCallback(() => {
    if (board.columns.length <= 1) return;
    const b = structuredClone(board);
    const col = b.columns[cursor.col];
    if (col && col.cards.length > 0) {
      let unassigned = b.columns.find(c => c.title.toLowerCase() === 'unassigned');
      if (!unassigned) {
        unassigned = { id: genId(), title: 'Unassigned', cards: [] };
        b.columns.push(unassigned);
      }
      for (const card of col.cards) {
        delete card.dateDone;
        unassigned.cards.push(card);
      }
      col.cards = [];
    }
    b.columns.splice(cursor.col, 1);
    const newCol = Math.min(cursor.col, b.columns.length - 1);
    setCursor({ col: newCol, row: clampRow(newCol, cursor.row, b) });
    persist(b);
    setMode('normal');
  }, [board, cursor, persist]);

  const editCard = useCallback((text: string) => {
    const b = structuredClone(board);
    const card = b.columns[cursor.col]?.cards[cursor.row];
    if (!card) return;
    card.text = text;
    persist(b);
    setMode('normal');
  }, [board, cursor, persist]);

  const getCurrentCard = useCallback((): Card | undefined => {
    return board.columns[cursor.col]?.cards[cursor.row];
  }, [board, cursor]);

  const findColIndex = useCallback((name: string): number => {
    const lower = name.toLowerCase();
    return board.columns.findIndex(c => c.title.toLowerCase().includes(lower));
  }, [board]);

  const moveCardToNamedColumn = useCallback((name: string) => {
    const dstIndex = board.columns.findIndex(c =>
      c.title.toLowerCase().includes(name.toLowerCase()),
    );
    if (dstIndex === -1 || dstIndex === cursor.col) return;
    const b = structuredClone(board);
    const src = b.columns[cursor.col];
    const dst = b.columns[dstIndex];
    if (!src?.cards[cursor.row] || !dst) return;
    const [card] = src.cards.splice(cursor.row, 1);
    stampDone(card!, dst);
    dst.cards.push(card!);
    const newRow = clampRow(cursor.col, cursor.row, b);
    setCursor({ col: cursor.col, row: newRow });
    persist(b);
  }, [board, cursor, persist]);

  const moveCardToCol = useCallback((dstIndex: number) => {
    if (dstIndex === cursor.col || dstIndex < 0 || dstIndex >= board.columns.length) return;
    const b = structuredClone(board);
    const src = b.columns[cursor.col];
    const dst = b.columns[dstIndex];
    if (!src?.cards[cursor.row] || !dst) return;
    const [card] = src.cards.splice(cursor.row, 1);
    stampDone(card!, dst);
    dst.cards.push(card!);
    const newRow = clampRow(cursor.col, cursor.row, b);
    setCursor({ col: cursor.col, row: newRow });
    persist(b);
    setMode('normal');
  }, [board, cursor, persist]);

  const toggleMinimize = useCallback(() => {
    const col = board.columns[cursor.col];
    if (!col) return;
    if (maximizedCol) { setMaximizedCol(null); return; }
    setMinimizedCols(prev => {
      const next = new Set(prev);
      if (next.has(col.id)) next.delete(col.id);
      else next.add(col.id);
      return next;
    });
  }, [board, cursor, maximizedCol]);

  const toggleMaximize = useCallback(() => {
    const col = board.columns[cursor.col];
    if (!col) return;
    setMaximizedCol(prev => prev === col.id ? null : col.id);
  }, [board, cursor]);

  return {
    board, cursor, mode, setMode,
    moveUp, moveDown, jumpLeft, jumpRight, jumpToCol,
    moveColLeft, moveColRight,
    moveCardLeft, moveCardRight,
    addCard, addColumn, deleteCard, deleteColumn,
    editCard, getCurrentCard,
    findColIndex, moveCardToNamedColumn, moveCardToCol,
    minimizedCols, maximizedCol, toggleMinimize, toggleMaximize,
  };
}
