# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Task management system for agile teams ("Sistema de gestión de tareas"), built with Astro + React. UI strings, comments, and commit-facing text in this repo are in Spanish — match that when editing existing files.

## Commands

Package manager is **pnpm** (matches README.md; a since-reverted commit briefly switched to npm to work around a `pnpm audit` bug — that switch was undone, so the project is back on pnpm >= 11.x with `pnpm-lock.yaml` as the lockfile).

```bash
pnpm install          # install dependencies
pnpm dev               # start dev server (astro dev)
pnpm build              # production build
pnpm preview            # preview production build

pnpm test                # run vitest in watch mode
pnpm test:ui             # vitest with UI
pnpm test:coverage       # vitest with coverage
```

Run a single test file: `pnpm exec vitest run src/test/taskUtils.test.js`
Run a single test by name: `pnpm exec vitest run -t "debe retornar tareas completadas"`

pnpm >= 11.x blocks postinstall scripts from dependencies by default (supply-chain policy). If `pnpm install` fails with `ERR_PNPM_IGNORED_BUILDS`, run `pnpm approve-builds` (or `pnpm approve-builds --all`) — approved builds are recorded in `pnpm-workspace.yaml` under `allowBuilds`.

## Architecture

- **Astro + React islands**: `src/pages/index.astro` is the only page. It renders `Layout.astro` and mounts the React component `TaskList.jsx` with `client:load` (fully hydrated on load, not server-only).
- **`userRole` is hardcoded** in `index.astro` (`const userRole = "Jefe"`) — there is no auth. Roles are `"Jefe"`, `"Supervisor"`, `"Analista"`, with visibility rules:
  - Jefe sees all non-Jefe tasks as "team tasks"
  - Supervisor sees only Analista tasks as "team tasks"
  - Analista sees no team tasks
- **Task data is in-memory only**, seeded as a hardcoded array inside the component itself (no backend/API/persistence). State lives in React `useState` in `TaskList.jsx`.
- **`src/utils/taskUtils.js`** holds pure, testable task-manipulation functions (filtering by status/role, progress calculation, sorting, overdue checks, title validation). These are decoupled from the component's inline task logic — the component does its own filtering rather than calling into these utils, so when changing task-filtering behavior, check both places.
- **Orphaned duplicate implementation**: `TaskList.astro`, `MyTasks.astro`, and `TeamTasks.astro` implement the same task-list UI as a server-rendered Astro component with vanilla-JS DOM manipulation, but are not imported by any page — only `TaskList.jsx` is live. Don't assume changes to the `.astro` versions have any visible effect; if asked to modify task-list behavior, edit `TaskList.jsx` unless told otherwise.

## Testing

- Vitest + jsdom + React Testing Library, configured in `vitest.config.ts` (setup file: `src/test/setup.ts`, which runs `cleanup()` after each test).
- Tests live in `src/test/`, mirroring the two testable units: `taskUtils.test.js` (pure functions) and `TaskList.test.jsx` (component behavior).
- README.md references a `TESTING.md` file that does not exist in the repo.
