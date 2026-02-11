# Race Pace Calculator

A stateless web app for runners to calculate race pace, finish time, distance, and split intervals. Supports metric and imperial units, English and French languages, and light/dark themes.

## Features

- **Unified Calculator** — Fill any 2 of distance, pace, time → get the 3rd
- **Split Times** — Configurable interval splits table
- **7 Preset Distances** — 5K, 10K, 15K, Half Marathon, Marathon, Ultra 50K, Ultra 100K + Custom
- **Metric & Imperial** — Toggle between km and miles with automatic conversion
- **English & French** — URL-based i18n (`/en/…`, `/fr/…`)
- **Light & Dark Mode** — System detection + manual toggle
- **Responsive** — Mobile-first design with hamburger menu

## Tech Stack

- **Next.js 16** (App Router)
- **shadcn/ui** + Tailwind CSS v4
- **next-intl** for internationalization
- **next-themes** for dark/light mode
- **TypeScript**
- **Vitest** + React Testing Library for unit/component tests
- **Playwright** for E2E tests

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run test:e2e:ui` | Run E2E tests with UI |

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routing
│   │   ├── layout.tsx     # Locale layout with i18n + theme providers
│   │   ├── page.tsx       # Calculator page
│   │   └── splits/
│   │       └── page.tsx   # Splits page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind + shadcn styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── calculator-form.tsx
│   ├── splits-form.tsx
│   ├── distance-picker.tsx
│   ├── time-input.tsx
│   ├── unit-toggle.tsx
│   ├── split-table.tsx
│   ├── navbar.tsx
│   └── theme-provider.tsx
├── i18n/                  # next-intl configuration
├── lib/
│   ├── calculations.ts    # Pure calculation functions
│   └── __tests__/         # Unit tests
├── messages/
│   ├── en.json            # English translations
│   └── fr.json            # French translations
└── middleware.ts           # i18n routing middleware
e2e/                       # Playwright E2E tests
docs/
└── user-stories.md        # Gherkin-style user stories
```

## Testing

```bash
# Run all unit tests (68 tests)
npm test

# Run E2E tests (24 tests)
npx playwright install chromium  # first time only
npm run test:e2e
```
