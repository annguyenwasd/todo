import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Column } from '../types.js';

interface Props {
  columns: Column[];
  currentColIndex: number;
  onSelect: (colIndex: number) => void;
  onCancel: () => void;
}

export function MoveMenu({ columns, currentColIndex, onSelect, onCancel }: Props) {
  // All columns in board order, keeping their original board index
  const options = columns.map((col, boardIndex) => ({ col, boardIndex }));

  const [sel, setSel] = useState(currentColIndex);

  useInput((input, key) => {
    if (key.escape) { onCancel(); return; }

    if (key.return) {
      const target = options[sel];
      if (!target || target.boardIndex === currentColIndex) { onCancel(); return; }
      onSelect(target.boardIndex);
      return;
    }

    if (input === 'j' || key.downArrow) {
      setSel(s => Math.min(options.length - 1, s + 1));
      return;
    }
    if (input === 'k' || key.upArrow) {
      setSel(s => Math.max(0, s - 1));
      return;
    }

    // Digit 1-9: jump directly (1-indexed, matches board order)
    const digit = parseInt(input, 10);
    if (!isNaN(digit) && digit >= 1 && digit <= options.length) {
      const target = options[digit - 1];
      if (!target || target.boardIndex === currentColIndex) { onCancel(); return; }
      onSelect(target.boardIndex);
      return;
    }
  });

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box>
        <Text bold color="yellow">Move to: </Text>
        <Text dimColor>(j/k navigate  1-9 jump  Enter confirm  Esc cancel)</Text>
      </Box>
      {options.map(({ col, boardIndex }, i) => {
        const active = i === sel;
        const isCurrent = boardIndex === currentColIndex;
        return (
          <Box key={boardIndex}>
            <Text
              color={active && !isCurrent ? 'black' : isCurrent ? 'gray' : undefined}
              backgroundColor={active && !isCurrent ? 'cyan' : undefined}
              bold={active && !isCurrent}
              dimColor={isCurrent}
            >
              {active && !isCurrent ? '▸' : ' '} {i + 1}. {col.title}
              {isCurrent ? ' (current)' : ''}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
