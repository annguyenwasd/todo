# ◫ KANBAN

A keyboard-driven kanban board in your terminal.

```
  ◫ KANBAN — 5 cards across 5 columns

 ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌──────┐ ┌─────────────────────┐
 │  In Progress  (1)   │ │      Todo  (2)      │ │    Backlog  (1)     │ │ Idea │ │       Done  (1)     │
 ├─────────────────────┤ ├─────────────────────┤ ├─────────────────────┤ │  (0) │ ├─────────────────────┤
 │ ● Fix login bug     │ │ ● Write tests       │ │ ● Dark mode         │ │      │ │ ● Setup CI      ✓  │
 │                     │ │ ● Update docs       │ │                     │ │      │ │                     │
 └─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └──────┘ └─────────────────────┘

 col 1/5 · 1 card                                                           j/k navigate  ? help  q quit
```

## Install

### Global installation (recommended)

Install it globally from npm:

```sh
npm install -g @annguyenvanchuc/todo
```

Then run it from anywhere in your terminal:

```sh
todo
```

### Local development

If you want to run it from source:

```sh
pnpm install
pnpm dev
```

Or build and install it locally on your machine:

```sh
npm run install:local
todo
```

## Key bindings

### Navigation

| Key | Action |
|-----|--------|
| `j` / `k` | Move cursor down / up |
| `h` / `l` | Switch column left / right |
| `←` `→` | Switch column left / right |
| `1` – `9` | Jump to column by number |
| `g` | Jump to top of column |
| `G` | Jump to bottom of column |

### Card actions

| Key | Action |
|-----|--------|
| `a` | Add card to current column |
| `t` | Add card to Todo column |
| `b` | Add card to Backlog column |
| `I` | Add card to Idea column |
| `e` | Edit selected card |
| `x` | Delete selected card |
| `<` / `>` | Move card to adjacent left / right column |
| `m` | Open move picker (choose any column) |
| `i` | Quick-move card → In Progress |
| `d` | Quick-move card → Done |

### Column actions

| Key | Action |
|-----|--------|
| `[` / `]` | Move column left / right |
| `A` | Add new column |
| `D` | Delete current column |
| `-` | Minimize / restore column |
| `+` | Maximize / restore column |

### Other

| Key | Action |
|-----|--------|
| `?` | Toggle help menu |
| `q` | Quit |

## Data

Cards are stored in `todos.json` in the current directory. Override the path:

```sh
TODO=/path/to/my-project todo
# or point to a directory
TODO=~/notes todo
```
