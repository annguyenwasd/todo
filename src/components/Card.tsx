import React from 'react';
import { Box, Text } from 'ink';
import type { Card } from '../types.js';

interface Props {
  card: Card;
  index: number;
  isSelected: boolean;
  isFocusedColumn: boolean;
  relativeTime: boolean;
}

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
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

export function CardItem({ card, index, isSelected, isFocusedColumn, relativeTime }: Props) {
  const active = isSelected && isFocusedColumn;
  const bullet = `${index + 1}.`;
  const fmt = (iso: string) => relativeTime ? fmtRelative(iso) : fmtDate(iso);

  const meta = card.dateDone
    ? `created ${fmt(card.createdAt)}  ✓ ${fmt(card.dateDone)}`
    : `created ${fmt(card.createdAt)}`;

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
