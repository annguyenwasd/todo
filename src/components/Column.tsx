import React from 'react';
import { Box, Text } from 'ink';
import { CardItem } from './Card.js';
import type { Column as ColumnType } from '../types.js';

const LINES_PER_CARD = 3; // text line + meta line + marginBottom

interface Props {
  column: ColumnType;
  isFocused: boolean;
  selectedRow: number;
  width: number;
  height: number;
  isMinimized?: boolean;
  relativeTime: boolean;
}

export function ColumnView({ column, isFocused, selectedRow, width, height, isMinimized, relativeTime }: Props) {
  if (isMinimized) {
    return (
      <Box
        flexDirection="column"
        width={width}
        height={height}
        borderStyle={isFocused ? 'bold' : 'single'}
        borderColor={isFocused ? 'cyan' : 'gray'}
        alignItems="center"
        justifyContent="center"
      >
        <Text bold color={isFocused ? 'cyan' : 'white'}>
          {column.title.charAt(0)}
        </Text>
        <Text dimColor>{column.cards.length}</Text>
      </Box>
    );
  }

  // border top+bottom = 2, title = 1, marginTop = 1, indicator rows (up to 2)
  const HEADER_LINES = 4;
  const INDICATOR_LINES = 2;
  const innerHeight = Math.max(LINES_PER_CARD, height - HEADER_LINES - INDICATOR_LINES);
  const visibleCount = Math.max(1, Math.floor(innerHeight / LINES_PER_CARD));

  // Keep selectedRow inside the scroll window (only for the focused column)
  const cards = column.cards;
  let scrollTop = 0;
  if (isFocused && selectedRow >= 0) {
    // Scroll so selectedRow is always visible
    scrollTop = Math.min(selectedRow, Math.max(0, selectedRow - visibleCount + 1));
    // Clamp so we don't show empty space at the bottom
    scrollTop = Math.min(scrollTop, Math.max(0, cards.length - visibleCount));
  }

  const visibleCards = cards.slice(scrollTop, scrollTop + visibleCount);
  const hiddenAbove = scrollTop;
  const hiddenBelow = Math.max(0, cards.length - scrollTop - visibleCount);

  return (
    <Box
      flexDirection="column"
      width={width}
      height={height}
      borderStyle={isFocused ? 'bold' : 'single'}
      borderColor={isFocused ? 'cyan' : 'gray'}
      overflowY="hidden"
    >
      {/* Title */}
      <Box justifyContent="center">
        <Text bold color={isFocused ? 'cyan' : 'white'}>
          {column.title}
        </Text>
        <Text dimColor> ({column.cards.length})</Text>
      </Box>

      {/* Scroll up indicator */}
      <Box paddingX={1}>
        {hiddenAbove > 0 ? (
          <Text dimColor>▲ {hiddenAbove} more</Text>
        ) : (
          <Text> </Text>
        )}
      </Box>

      {/* Visible cards */}
      <Box flexDirection="column" paddingX={1}>
        {visibleCards.length === 0 ? (
          <Text dimColor italic>{'  '}(empty)</Text>
        ) : (
          visibleCards.map((card, i) => (
            <CardItem
              key={card.id}
              card={card}
              index={scrollTop + i}
              isSelected={scrollTop + i === selectedRow}
              isFocusedColumn={isFocused}
              relativeTime={relativeTime}
            />
          ))
        )}
      </Box>

      {/* Scroll down indicator */}
      <Box paddingX={1}>
        {hiddenBelow > 0 ? (
          <Text dimColor>▼ {hiddenBelow} more</Text>
        ) : (
          <Text> </Text>
        )}
      </Box>
    </Box>
  );
}
