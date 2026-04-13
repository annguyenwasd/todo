import React from 'react';
import { Box, Text } from 'ink';
import type { Card } from '../types.js';

interface Props {
  card: Card;
  index: number;
  isSelected: boolean;
  isFocusedColumn: boolean;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function CardItem({ card, index, isSelected, isFocusedColumn }: Props) {
  const active = isSelected && isFocusedColumn;
  const bullet = `${index + 1}.`;

  const meta = card.dateDone
    ? `created ${fmtDate(card.createdAt)}  ✓ ${fmtDate(card.dateDone)}`
    : `created ${fmtDate(card.createdAt)}`;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text
          color={active ? 'black' : undefined}
          backgroundColor={active ? 'cyan' : undefined}
          dimColor={!isFocusedColumn}
          bold={active}
        >
          {active ? '▸' : ' '}{bullet} {card.text}
        </Text>
      </Box>
      <Box justifyContent="flex-end">
        <Text dimColor={true}>
          {meta}
        </Text>
      </Box>
    </Box>
  );
}
