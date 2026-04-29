<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# ChurchLink Frontend — Architecture Guide

## Stack Overview

| Concern | Tool |
|---|---|
| Framework | Next.js (App Router) + React 19 + TypeScript 5 |
| Styling | Tailwind v4 (`@tailwindcss/postcss`) + shadcn (`base-nova` style) |
| Async state | TanStack React Query v5 |
| Client UI state | Zustand |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| HTTP client | Axios (`src/lib/axios.ts`) — **not yet wired into hooks** (see Data Layer) |
| Linter / formatter | Biome (primary); ESLint (`eslint-config-next`) also present |
| Date utilities | `date-fns` |
| Icons | `lucide-react` |
| Testing | Jest + Testing Library + `jsdom` |

---

## Folder Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (font, metadata, wraps in <Providers>)
│   ├── providers.tsx           # Client boundary: QueryClientProvider, TooltipProvider, Devtools
│   ├── globals.css             # Tailwind v4 entry + design tokens (@theme inline)
│   ├── page.tsx                # Redirects / → /dashboard
│   ├── (auth)/
│   │   └── login/              # Login page (client form; auth not fully wired yet)
│   └── (dashboard)/
│       ├── layout.tsx          # Authenticated shell: Sidebar + Header + <main>
│       ├── dashboard/          # Home / stats
│       ├── members/            # Member management
│       ├── ministries/         # Ministry management
│       ├── events/             # Event management
│       ├── schedules/          # Volunteer schedules
│       ├── cells/              # Cell groups list
│       │   └── [id]/           # Cell group detail
│       └── cell-meetings/      # Cell meetings aggregate listing
│
├── components/
│   ├── ui/                     # Generic primitives (shadcn-style): button, dialog, input,
│   │                           # card, table, calendar, command, dropdown-menu, etc.
│   ├── layout/                 # App chrome: Sidebar, Header
│   └── features/               # Domain UI — grouped by area:
│       ├── dashboard/          # Stats cards, activity feed, birthdays, upcoming events
│       ├── members/            # Table, modals, pickers, function manager
│       ├── ministries/         # MinistryCard, CreateMinistryModal
│       ├── cells/              # CellCard, RegisterMeetingModal
│       ├── schedules/          # Modals, volunteer rows, notifications
│       └── events/             # Event cards, modals, recurrence pickers
│           └── hooks/          # Form/UI logic scoped to events (e.g. useEventForm)
│
├── hooks/
│   ├── queries/                # useQuery wrappers per domain (useCells, useMembers, etc.)
│   └── mutations/              # useMutation + cache invalidation (create/update/delete)
│
├── lib/
│   ├── axios.ts                # Shared `api` instance (NEXT_PUBLIC_API_URL, Bearer token)
│   ├── utils.ts                # `cn` (clsx + tailwind-merge), avatar helpers
│   ├── mocks.ts                # In-memory mock data used by hooks while API is not wired
│   ├── dateUtils.ts            # Date formatting helpers
│   └── iconMap.ts              # Icon name → component mapping
│
├── store/
│   └── useSidebarStore.ts      # Zustand: sidebar open/toggle state
│
├── types/                      # Domain TypeScript interfaces
│   ├── index.ts                # Re-exports: church, event, ministry, schedule, user
│   └── cellMeeting.ts          # Imported directly (not re-exported from index yet)
│
├── schemas/                    # Zod schemas for form validation
│   │                           # (member, schedule, event, ministry)
│
├── constants/                  # Shared static data (days.ts, colors.ts)
│
├── utils/
│   ├── formatters/             # e.g. calendar.ts
│   └── helpers/                # e.g. eventOccurrences.ts
│
└── __tests__/
    ├── components/             # Component tests
    └── hooks/                  # Hook tests
```

Each `features/<domain>/` folder may also contain:
- `constants/` — domain-specific labels, copy, static maps
- `hooks/` — form or UI logic scoped to that feature

---

## Escopo Global vs. Escopo de Feature

Várias pastas existem **nos dois níveis** — global (`src/`) e local dentro de um feature (`src/components/features/<domain>/`). A regra é simples: coloque onde o escopo pede.

| Pasta | Global (`src/`) | Local (`features/<domain>/`) |
|---|---|---|
| `constants/` | Dados compartilhados entre features (ex: `days.ts`, `colors.ts`) | Labels/copy/mapas exclusivos daquele domínio |
| `hooks/` | `queries/` e `mutations/` usados por múltiplos lugares | Hooks de formulário ou UI específicos de uma feature (ex: `useEventForm`) |
| `schemas/` | Schemas Zod reutilizáveis entre features | — (ainda não há, mas pode existir se necessário) |
| `types/` | Tipos de domínio compartilhados | — (preferir o global; tipar localmente só se for tipo interno do componente) |
| `utils/` | Formatters e helpers genéricos | — (extrair para o global quando mais de um feature precisar) |

**Critério de decisão:** se apenas um feature usa aquele código, pode ficar dentro da pasta do feature. Quando um segundo feature precisar do mesmo código, mova para o escopo global correspondente.

---

## Key Patterns

### Component Layers

There are three distinct layers. Respect the separation:

1. **`components/ui/`** — generic, unstyled-by-domain primitives. Never import from `features/` here.
2. **`components/layout/`** — app shell only (Sidebar, Header). No domain logic.
3. **`components/features/<domain>/`** — product screens, modals, tables. Allowed to import from `ui/` and `layout/` but not from other feature domains (prefer hooks/types as the bridge).

### Data Fetching (React Query)

All server/async state goes through TanStack Query:

- **`src/hooks/queries/`** — `useQuery` wrappers (e.g. `useMembers`, `useCells`). Each hook owns its query key.
- **`src/hooks/mutations/`** — `useMutation` hooks that invalidate related query keys on success.
- Query keys follow the pattern `['domain']` or `['domain', id]`.
- Default client config (in `providers.tsx`): 5 min stale time, 1 retry, no refetch on window focus.

### Data Layer Status — Important

`src/lib/axios.ts` defines the real `api` client:
- Base URL: `NEXT_PUBLIC_API_URL` env var, fallback `http://localhost:3333`
- Auth: `Authorization: Bearer <token>` from `localStorage` key `churchlink:token`
- 401 handler: clears token, redirects to `/login`

**However, hooks currently use `src/lib/mocks.ts`** (in-memory arrays + simulated async delays) instead of hitting the real API. `api` from axios is not yet imported by any hook. When wiring a feature to the real backend, replace mock calls with `api.get/post/put/delete` inside the existing query/mutation hooks.

### Forms

Forms use `react-hook-form` + Zod resolver pattern:

```ts
const schema = z.object({ ... })  // src/schemas/<domain>.ts
const form = useForm({ resolver: zodResolver(schema) })
```

### Client State

Only Zustand for true client-only UI state (sidebar). Do not add Redux or Context for data that React Query can own.

### Routing

Route groups (`(auth)`, `(dashboard)`) separate UX concerns without affecting URL segments. The dashboard layout handles all chrome — individual pages just render their content area.

### Path Alias

Always use `@/` instead of relative paths:
```ts
import { Button } from '@/components/ui/button'
import { useMembers } from '@/hooks/queries/useMembers'
```

### Linting & Formatting

**Biome is the primary tool** (single quotes, trailing commas, 80-col lines, organized imports). Run `pnpm lint` before committing. ESLint (`next`) is also present but Biome takes precedence.

### Dark Mode Consistency

- Prefer semantic design tokens (`text-foreground`, `text-muted-foreground`,
  `bg-background`, `bg-muted`, `border`, `ring-border`) instead of fixed
  palette classes.
- Do not introduce `text-gray-*`, `bg-white`, `border-gray-*` in feature code.
- When branding colors are intentional (e.g. blue/emerald badges), add proper
  `dark:` variants to preserve contrast and readability.
- Any new feature or adjustment must be validated in both light and dark modes.

### Responsiveness Baseline

- Build mobile-first layouts by default.
- For metric grids, start at `grid-cols-1` and scale up with breakpoints
  (`sm:grid-cols-2`, `lg:grid-cols-4` when needed).
- For dense data views (especially tables), provide a mobile strategy:
  hide lower-priority columns and/or render a card list variant below `md`.
- New pages and updates must be checked in common breakpoints (`<640`, `768`,
  `1024+`).

### Comments and Documentation

- Avoid non-essential inline comments in components and page files.
- Use comments only when explaining non-obvious decisions or constraints.
- Prefer JSDoc for reusable utility functions in `src/lib/` and shared
  formatter/helper modules.

---

## Types

Domain types live in `src/types/`. The barrel `types/index.ts` re-exports most modules but **not `cellMeeting`** — import that directly:

```ts
import type { CellMeeting } from '@/types/cellMeeting'  
import type { Member } from '@/types'                   
```

Prefer extending the barrel re-exports for consistency when adding new type files.

---

## Testing

- Test files live in `src/__tests__/components/` and `src/__tests__/hooks/`.
- Jest with `jsdom`, `@testing-library/react`.
- `@/` alias works in tests (configured in `jest.config.ts`).
- `src/components/ui/**` is excluded from coverage.
- Run: `pnpm test`
