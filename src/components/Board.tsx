import React from 'react';
import { Box, useWindowSize } from 'ink';
import { ColumnView } from './Column.js';
import type { Board as BoardType, Cursor } from '../types.js';

const MINIMIZED_WIDTH = 5;

interface Props {
  board: BoardType;
  cursor: Cursor;
  height: number;
  minimizedCols: Set<string>;
  maximizedCol: string | null;
  relativeTime: boolean;
}

export function BoardView({ board, cursor, height, minimizedCols, maximizedCol, relativeTime }: Props) {
  const { columns: termWidth } = useWindowSize();
  const colCount = board.columns.length || 1;

  const getColWidth = (colId: string): number => {
    if (maximizedCol) {
      return colId === maximizedCol
        ? Math.max(20, termWidth - (colCount - 1) * MINIMIZED_WIDTH - colCount + 1)
        : MINIMIZED_WIDTH;
    }
    const minimizedCount = board.columns.filter(c => minimizedCols.has(c.id)).length;
    if (minimizedCols.has(colId)) return MINIMIZED_WIDTH;
    const expandedCount = colCount - minimizedCount;
    const usedByMinimized = minimizedCount * MINIMIZED_WIDTH;
    return expandedCount > 0
      ? Math.max(20, Math.floor((termWidth - usedByMinimized - colCount + 1) / expandedCount))
      : 20;
  };

  const isMinimized = (colId: string): boolean =>
    maximizedCol ? colId !== maximizedCol : minimizedCols.has(colId);

  return (
    <Box flexDirection="row" height={height}>
      {board.columns.map((col, i) => (
        <ColumnView
          key={col.id}
          column={col}
          isFocused={i === cursor.col}
          selectedRow={i === cursor.col ? cursor.row : -1}
          width={getColWidth(col.id)}
          height={height}
          isMinimized={isMinimized(col.id)}
          relativeTime={relativeTime}
        />
      ))}
    </Box>
  );
}
