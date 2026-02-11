# Race Pace Calculator — Implementation Plan

## Problem Statement

Build a **greenfield** "Race Pace Calculator" web app that lets runners compute pace, time, or distance from any two of the three values, view split/interval tables, and switch between metric and imperial units — all in English or French, with no server-side state.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Components | shadcn/ui (Tailwind CSS v4) |
| i18n | next-intl (URL-based: `/en/…`, `/fr/…`) |
| Theme | next-themes (light / dark / system) |
| Unit Tests | Vitest + React Testing Library |
| E2E Tests | Playwright |
| Language | TypeScript |
| State | Fully stateless — no DB, no cookies, no localStorage |

## Screens / Routes

1. **Calculator** (`/[locale]/`) — Unified calculator: fill any 2 of (distance, pace, time) → compute the 3rd.
2. **Splits** (`/[locale]/splits`) — Configurable interval splits table: user picks distance + pace/time + split interval → full split table.

Both screens share a top navigation bar with:
- Language switcher (EN / FR)
- Unit system toggle (km ↔ mi)
- Dark/light mode toggle

## Pre-configured Distances

5K · 10K · 15K · Half Marathon (21.0975 km) · Marathon (42.195 km) · Ultra 50K · Ultra 100K · **Custom** (user-entered)

## Approach

### Phase 0 — Project Scaffold
- Initialize Next.js 15 project with TypeScript, Tailwind CSS, ESLint
- Install and configure shadcn/ui
- Set up next-intl for `/en` and `/fr` routing
- Set up next-themes for dark/light mode
- Configure Vitest + React Testing Library
- Configure Playwright

### Phase 1 — Core Logic (pure functions, fully tested)
- `convertDistance(value, from, to)` — km ↔ mi
- `calculatePace(distance, time)` → pace (min/km or min/mi)
- `calculateTime(distance, pace)` → total time
- `calculateDistance(pace, time)` → distance
- `generateSplits(distance, pace, interval)` → array of split objects
- `formatTime(seconds)` / `parseTime(str)` helpers
- Unit test suite for every function and edge case

### Phase 2 — UI Components
- `<DistancePicker>` — preset buttons + custom input
- `<TimeInput>` — HH:MM:SS input
- `<PaceInput>` — MM:SS per km/mi input
- `<UnitToggle>` — km ↔ mi switch
- `<SplitTable>` — renders interval splits
- `<Navbar>` — language, unit, theme toggles
- Component-level tests with React Testing Library

### Phase 3 — Pages & Integration
- Calculator page: wire components, auto-compute missing value
- Splits page: wire components, render split table
- Responsive layout (mobile-first, works on all breakpoints)
- i18n: translate all strings to EN and FR

### Phase 4 — E2E Tests (Playwright)
- Calculator: select preset distance + enter pace → verify computed time
- Calculator: enter time + distance → verify computed pace
- Calculator: custom distance flow
- Splits: generate splits and verify table rows
- Language switch: navigate `/en` ↔ `/fr`, verify translations
- Unit toggle: switch km ↔ mi, verify recalculation
- Dark mode toggle
- Mobile viewport tests

### Phase 5 — User Stories (documentation)
- Write Gherkin-style user stories covering all features
- Store in `docs/user-stories.md`

### Phase 6 — Polish & QA
- Accessibility audit (keyboard nav, ARIA labels, contrast)
- Final responsive QA
- README with setup, dev, test, and build instructions

## Notes

- All calculations happen client-side (no API routes needed).
- Next.js static export (`output: 'export'`) could be used since there's no server state, but we keep SSR available for SEO of the pages.
- Pace is always displayed as MM:SS per unit (min/km or min/mi).
- Time is displayed as HH:MM:SS.
- Custom distance input accepts decimals (e.g., 13.1 mi).
