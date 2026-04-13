import React from 'react';
import { Box, Text } from 'ink';
import type { Mode } from '../types.js';

interface Props {
  mode: Mode;
  columnName: string;
  cardCount: number;
  totalCards: number;
}

export function StatusBar({ mode, columnName, cardCount, totalCards }: Props) {
  if (mode !== 'normal') return null;

  return (
    <Box marginTop={1} flexDirection="column">
      <Box>
        <Text dimColor>
          <Text bold color="white">j</Text>/<Text bold color="white">k</Text>{' up/down  '}
          <Text bold color="white">h</Text>/<Text bold color="white">l</Text>/<Text bold color="white">1-9</Text>{' switch col  '}
          <Text bold color="white">{'<'}</Text>/<Text bold color="white">{'>'}</Text>{' move card  '}
          <Text bold color="white">m</Text>{' move picker  '}
          <Text bold color="white">i</Text>/<Text bold color="white">d</Text>{' →InProg/Done  '}
          <Text bold color="white">t</Text>/<Text bold color="white">b</Text>/<Text bold color="white">I</Text>{' +Todo/Backlog/Idea  '}
          <Text bold color="white">a</Text>{' add  '}
          <Text bold color="white">e</Text>{' edit  '}
          <Text bold color="white">x</Text>{' del  '}
          <Text bold color="white">A</Text>{' +col  '}
          <Text bold color="white">-</Text>/<Text bold color="white">+</Text>{' min/max  '}
          <Text bold color="white">?</Text>{' help  '}
          <Text bold color="white">q</Text>{' quit'}
        </Text>
      </Box>
      <Box>
        <Text dimColor>
          {columnName} · {cardCount} cards · {totalCards} total
        </Text>
      </Box>
    </Box>
  );
}
