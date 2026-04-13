import React from 'react';
import { Box, Text, useInput } from 'ink';

interface Props {
  onClose: () => void;
}

const SECTIONS: Array<{ title: string; bindings: Array<[string, string]> }> = [
  {
    title: 'Navigation',
    bindings: [
      ['j / k', 'Move cursor down / up'],
      ['h / l', 'Switch column left / right'],
      ['← →', 'Switch column left / right'],
      ['1 - 9', 'Jump to column by number'],
      ['g', 'Jump to top of column'],
      ['G', 'Jump to bottom of column'],
    ],
  },
  {
    title: 'Card Actions',
    bindings: [
      ['a', 'Add card to current column'],
      ['t', 'Add card to Todo column'],
      ['b', 'Add card to Backlog column'],
      ['I', 'Add card to Ideas column'],
      ['e', 'Edit selected card text'],
      ['x', 'Delete selected card'],
      ['< / >', 'Move card to adjacent left / right column'],
      ['m', 'Open move picker (choose any column)'],
      ['i', 'Quick-move card → In Progress'],
      ['d', 'Quick-move card → Done'],
    ],
  },
  {
    title: 'Column Actions',
    bindings: [
      ['[ / ]', 'Move column left / right'],
      ['A', 'Add new column'],
      ['D', 'Delete current column'],
      ['-', 'Minimize / restore column'],
      ['+', 'Maximize / restore column'],
    ],
  },
  {
    title: 'Other',
    bindings: [
      ['?', 'Toggle this help menu'],
      ['q', 'Quit'],
    ],
  },
];

export function HelpMenu({ onClose }: Props) {
  useInput((_input, key) => {
    if (key.escape || _input === 'q' || _input === '?') {
      onClose();
    }
  });

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">  KEY BINDINGS</Text>
        <Text dimColor>  — press ? / Esc / q to close</Text>
      </Box>
      <Box flexDirection="row" flexWrap="wrap" gap={3}>
        {SECTIONS.map(section => (
          <Box key={section.title} flexDirection="column" marginRight={4} minWidth={38}>
            <Box marginBottom={0}>
              <Text bold color="white">{section.title.toUpperCase()}</Text>
            </Box>
            {section.bindings.map(([key, desc]) => (
              <Box key={key}>
                <Box minWidth={10}>
                  <Text bold color="yellow">{key}</Text>
                </Box>
                <Text dimColor>{desc}</Text>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
