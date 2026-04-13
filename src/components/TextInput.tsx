import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface Props {
  prompt: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

export function TextInput({ prompt, onSubmit, onCancel, initialValue = '' }: Props) {
  const [value, setValue] = useState(initialValue);
  const [pos, setPos] = useState(initialValue.length);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    if (key.return) {
      if (value.trim()) onSubmit(value.trim());
      return;
    }
    if (key.backspace || key.delete) {
      if (pos > 0) {
        setValue(v => v.slice(0, pos - 1) + v.slice(pos));
        setPos(p => p - 1);
      }
      return;
    }
    if (key.leftArrow) {
      setPos(p => Math.max(0, p - 1));
      return;
    }
    if (key.rightArrow) {
      setPos(p => Math.min(value.length, p + 1));
      return;
    }
    if (!key.ctrl && !key.meta && input) {
      setValue(v => v.slice(0, pos) + input + v.slice(pos));
      setPos(p => p + input.length);
    }
  });

  const before = value.slice(0, pos);
  const cursorChar = value[pos] ?? ' ';
  const after = value.slice(pos + 1);

  return (
    <Box marginTop={1}>
      <Text bold color="yellow">{prompt}: </Text>
      <Text>
        {before}
        <Text inverse>{cursorChar}</Text>
        {after}
      </Text>
      <Text dimColor>  (Enter ⏎  Esc ✕)</Text>
    </Box>
  );
}
