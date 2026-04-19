import React, { useState } from 'react';
import { Box, Text, useInput, useApp, useWindowSize } from 'ink';
import { BoardView } from './components/Board.js';
import { HelpMenu } from './components/HelpMenu.js';
import { MoveMenu } from './components/MoveMenu.js';
import { StatusBar } from './components/StatusBar.js';
import { TextInput } from './components/TextInput.js';
import { useBoard } from './hooks/useBoard.js';
import { copyToClipboard } from './clipboard.js';

export function App() {
  const { exit } = useApp();
  const {
    board, cursor, mode, setMode,
    moveUp, moveDown, jumpLeft, jumpRight, jumpToCol,
    moveColLeft, moveColRight,
    moveCardLeft, moveCardRight,
    addCard, addColumn, deleteCard, deleteColumn,
    editCard, getCurrentCard,
    findColIndex, moveCardToNamedColumn, moveCardToCol,
    minimizedCols, maximizedCol, toggleMinimize, toggleMaximize,
  } = useBoard();

  const [copiedFlash, setCopiedFlash] = useState(false);

  // target column index for quick-add shortcuts (t / b / I)
  const [addTarget, setAddTarget] = useState<number | undefined>(undefined);
  const [addPrompt, setAddPrompt] = useState('New card');

  useInput((input, key) => {
    if (mode !== 'normal') return;

    if (input === 'q') { exit(); return; }
    if (input === '?') { setMode('help'); return; }

    // Vim vertical navigation
    if (input === 'j') { moveDown(); return; }
    if (input === 'k') { moveUp(); return; }

    // h/l — switch columns
    if (input === 'h' && !key.ctrl) { jumpLeft(); return; }
    if (input === 'l' && !key.ctrl) { jumpRight(); return; }

    // < / > — move card left/right between adjacent columns
    if (input === '<') { moveCardLeft(); return; }
    if (input === '>') { moveCardRight(); return; }
    if (input === '[') { moveColLeft(); return; }
    if (input === ']') { moveColRight(); return; }

    // Arrow keys — also switch columns
    if (key.leftArrow) { jumpLeft(); return; }
    if (key.rightArrow) { jumpRight(); return; }

    // Quick move to named column
    if (input === 'i') { moveCardToNamedColumn('in progress'); return; }
    if (input === 'd') { moveCardToNamedColumn('done'); return; }

    // Quick add to named column (prompts for text)
    if (input === 't') {
      const idx = findColIndex('todo');
      setAddTarget(idx === -1 ? undefined : idx);
      setAddPrompt(idx === -1 ? 'New card' : `Add to ${board.columns[idx]!.title}`);
      setMode('add-card');
      return;
    }
    if (input === 'b') {
      const idx = findColIndex('backlog');
      setAddTarget(idx === -1 ? undefined : idx);
      setAddPrompt(idx === -1 ? 'New card' : `Add to ${board.columns[idx]!.title}`);
      setMode('add-card');
      return;
    }
    if (input === 'I') {
      const idx = findColIndex('idea');
      setAddTarget(idx === -1 ? undefined : idx);
      setAddPrompt(idx === -1 ? 'New card' : `Add to ${board.columns[idx]!.title}`);
      setMode('add-card');
      return;
    }

    // Generic add to current column
    if (input === 'a') {
      setAddTarget(undefined);
      setAddPrompt('New card');
      setMode('add-card');
      return;
    }
    if (input === '-') { toggleMinimize(); return; }
    if (input === '+') { toggleMaximize(); return; }
    if (input === 'A') { setMode('add-column'); return; }
    if (input === 'D') { setMode('confirm-delete-col'); return; }
    if (input === 'x') { deleteCard(); return; }
    if (input === 'e') {
      if (getCurrentCard()) setMode('edit-card');
      return;
    }
    if (input === 'm') {
      if (getCurrentCard()) setMode('move-picker');
      return;
    }
    if (input === 'c') {
      const card = getCurrentCard();
      if (card) {
        copyToClipboard(card.text);
        setCopiedFlash(true);
        setTimeout(() => setCopiedFlash(false), 1500);
      }
      return;
    }

    // Digit 1-9: jump focus to that column
    const digit = parseInt(input, 10);
    if (!isNaN(digit) && digit >= 1 && digit <= board.columns.length) {
      jumpToCol(digit - 1);
      return;
    }

    // Jump to top/bottom of column
    if (input === 'g') {
      for (let i = 0; i < 50; i++) moveUp();
      return;
    }
    if (input === 'G') {
      for (let i = 0; i < 50; i++) moveDown();
      return;
    }
  }, { isActive: mode === 'normal' });

  useInput((input, key) => {
    if (input === 'y') { deleteColumn(); return; }
    if (input === 'n' || key.escape) { setMode('normal'); return; }
  }, { isActive: mode === 'confirm-delete-col' });

  const { rows } = useWindowSize();
  const currentCol = board.columns[cursor.col];
  const totalCards = board.columns.reduce((s, c) => s + c.cards.length, 0);

  // header = 2 lines, status bar = 2 lines, bottom padding = 1
  const CHROME_LINES = 5;
  const boardHeight = Math.max(8, rows - CHROME_LINES);

  return (
    <Box flexDirection="column" height={rows}>
      <Box marginBottom={1}>
        <Text bold color="cyan">  ◫ KANBAN </Text>
        <Text dimColor>
          — {totalCards} cards across {board.columns.length} columns
        </Text>
      </Box>

      <BoardView board={board} cursor={cursor} height={boardHeight} minimizedCols={minimizedCols} maximizedCol={maximizedCol} />

      {mode === 'add-card' && (
        <TextInput
          prompt={addPrompt}
          onSubmit={text => { addCard(text, addTarget); setAddTarget(undefined); }}
          onCancel={() => { setMode('normal'); setAddTarget(undefined); }}
        />
      )}
      {mode === 'add-column' && (
        <TextInput
          prompt="Column name"
          onSubmit={addColumn}
          onCancel={() => setMode('normal')}
        />
      )}
      {mode === 'edit-card' && (
        <TextInput
          prompt="Edit card"
          initialValue={getCurrentCard()?.text ?? ''}
          onSubmit={editCard}
          onCancel={() => setMode('normal')}
        />
      )}

      {mode === 'move-picker' && (
        <MoveMenu
          columns={board.columns}
          currentColIndex={cursor.col}
          onSelect={colIndex => { moveCardToCol(colIndex); }}
          onCancel={() => setMode('normal')}
        />
      )}

      {mode === 'help' && (
        <HelpMenu onClose={() => setMode('normal')} />
      )}

      {mode === 'confirm-delete-col' && (
        <Box marginTop={1}>
          <Text color="red" bold>Delete </Text>
          <Text bold>"{currentCol?.title}"</Text>
          {currentCol && currentCol.cards.length > 0 && (
            <Text color="yellow"> ({currentCol.cards.length} card{currentCol.cards.length === 1 ? '' : 's'} → Unassigned)</Text>
          )}
          <Text color="red" bold>? </Text>
          <Text dimColor>y / n</Text>
        </Box>
      )}

      {copiedFlash && (
        <Box marginTop={1}>
          <Text color="green" bold>✓ Copied to clipboard</Text>
        </Box>
      )}

      <StatusBar
        mode={mode}
        columnName={currentCol?.title ?? ''}
        cardCount={currentCol?.cards.length ?? 0}
        totalCards={totalCards}
      />
    </Box>
  );
}
