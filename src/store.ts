import fs from 'node:fs';
import path from 'node:path';
import type { Board } from './types.js';

function resolveBoardPath(): string {
  const env = process.env.TODO;
  if (env) {
    return env.endsWith('.json') ? path.resolve(env) : path.resolve(env, 'todos.json');
  }
  return path.resolve(process.cwd(), 'todos.json');
}

const DATA_PATH = resolveBoardPath();

export function loadBoard(): Board {
  if (fs.existsSync(DATA_PATH)) {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  }
  const now = Date.now();
  return {
    columns: [
      { id: String(now),     title: 'In Progress', cards: [] },
      { id: String(now + 1), title: 'Todo',        cards: [] },
      { id: String(now + 2), title: 'Backlog',     cards: [] },
      { id: String(now + 3), title: 'Idea',        cards: [] },
      { id: String(now + 4), title: 'Done',        cards: [] },
    ],
  };
}

export function saveBoard(board: Board): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(board, null, 2));
}
