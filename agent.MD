<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


<!-- Design Rules -->
# 📚 Documentation & Knowledge Rules
1. DO NOT rely on your pre-trained outdated knowledge.
2. ALWAYS search and read the latest official documentation for React, Tailwind CSS, and Shadcn UI before generating or modifying code.

# 🎨 Shadcn UI & Strict Styling Rules
1. Shadcn components are fully pre-designed. Rely EXCLUSIVELY on their built-in props (e.g., `variant="default"`, `variant="outline"`, `size="sm"`, `size="icon"`).
2. NEVER use the `className` prop on a Shadcn UI component to add margins, paddings, colors, typography, or any other styling. Keep the component completely pure.
3. For layout, positioning, and spacing (e.g., flex, grid, gap), DO NOT add these utility classes directly to the Shadcn component.
4. Instead, wrap the Shadcn components in standard HTML elements (like `<div>` or `<section>`) and apply Tailwind layout utilities (`flex`, `grid`, `gap-4`, `space-y-4`, `items-center`, etc.) to those wrapper elements.
5. Write clean, modular, and standard code adhering strictly to the latest Shadcn UI documentation.

# 🧩 Component Variant Extension Rule
1. NEVER use `className` on a shadcn component to change its appearance (size, color, spacing, typography).
2. If you need a different look or size, EXTEND the component's `variant` or `size` options in its source file (e.g., `button.tsx`, `card.tsx`) using `cva()`.
3. Add only what you actually need — don't pre-create unused variants.
4. After adding a new variant/size, use it via props: `<Button size="xl">` or `<Button variant="hero">`. Never fall back to `className`.

✅ Correct:
```tsx
// button.tsx — add new size
size: { xl: "h-12 gap-2 px-5 text-base" }

// usage
<Button size="xl">Book now</Button>
```

❌ Wrong:
```tsx
<Button className="h-12 px-5 text-base">Book now</Button>
```

5. Same principle applies to any shadcn or custom component with `cva()` — extend don't override.

# 🎨 Color System Rules
1. NEVER use hardcoded color values (e.g., `text-amber-500`, `bg-[#123456]`, `border-blue-300`, custom hex/rgb/oklch) directly on any component.
2. ALWAYS use CSS variable-based colors: `text-primary`, `bg-muted`, `border-border`, etc. All colors must be defined in `globals.css`.
3. Every color variable MUST have BOTH `:root` (light mode) and `.dark` (dark mode) definitions in `globals.css`, plus an `@theme inline` entry for Tailwind v4.
4. If a color you need doesn't exist in `globals.css`, add it first — in all three places: `@theme inline` block, `:root` section, and `.dark` section. Never skip dark mode.
5. For opacity variants, use the slash syntax with CSS variables: `text-primary/80`, `bg-primary/10`, `border-border/50`. Do NOT hardcode separate opacity colors.

# Responsive Design Rule
1. ALWAYS follow a mobile-first approach. Use base Tailwind utility classes for mobile screens and apply breakpoints (sm:, md:, lg:) for larger screens.

# TypeScript Error Handling Rule
1. ALWAYS use `error: unknown` in `catch` blocks instead of `error: any` to satisfy strict linting rules.
2. When extracting error messages, safely check the error type using `error instanceof Error ? error.message : "Fallback message"`.

<!-- End: Design rules -->


<!-- BEGIN:binksanders-project-rules -->
# 🏗️ Project Overview

**Bink Sanders Website** — A modern Next.js web app with three main areas: a public-facing mobile-first website, a Company admin portal, and a Super-Admin dashboard.

## Build & Dev Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

Package manager: **pnpm** (see `pnpm-workspace.yaml`).

## 📁 Route Architecture

Three route groups + standalone routes:

| Route Group | Layout | Purpose |
|---|---|---|
| `(main-route)/` | `TopNav` + `max-w-120` centered container | Public mobile-first pages |
| `(admin-route)/` | `MainLayout` (Sidebar + Header) | Company & Super-Admin portals |
| `auth/` | Centered flex layout | Login, forgot-password, reset-password, verify-otp |
| `onboard/` | Standalone (no layout) | Onboarding intro flow |

Key layout files:
- Root: `src/app/layout.tsx` — fonts (Inter, Raleway), `DynamicThemeProvider` → `ThemeProvider` → `TooltipProvider`
- Main: `src/app/(main-route)/layout.tsx` — mobile container (480px max-width, centered)
- Admin: `src/app/(admin-route)/layout.tsx` — delegates to `MainLayout`
- Auth: `src/app/auth/layout.tsx` — centered flex column

## 🧩 Component Architecture

- **All pages are `"use client"`** — every page uses hooks (`useState`, `useEffect`, `usePathname`, etc.)
- **Layout files are server components** (no `"use client"`) except `MainLayout.tsx`
- **shadcn/ui v4** ("radix-vega" style) with custom CVA variants in `src/components/ui/`
- Custom UI wrappers in `src/components/ui/custom/`: `DashboardHeader`, `DashboardPageLayout`, `data-table`, `tiptap-editor`, `search-input`
- Survey components in `src/components/survey/`: `SurveyIntro`, `SurveyQuestionCard`, `SurveyCompletion` + question types

### Survey Question Types (6 types)
Survey system uses discriminated question types (`src/lib/types/survey.ts`):
- `swipe` — drag-to-agree/disagree with statement
- `chat` — bot message with option buttons
- `rearrange` — reorder items
- `video` — video + options
- `text` — free text input
- `multiple-choice` — select from options

### Admin Course Question Types (7 types)
Admin-facing schemas in `src/lib/validations/course.ts` (discriminated union):
- `mcq`, `swipe`, `ordering`, `chat_scenario`, `video`, `free_input`, `rating`

## 🔄 State & Data Flow

**No global state library** — no Zustand, Redux, or Context API for global state.

| Storage | Use Case |
|---|---|
| `useState` | Local UI state (sidebar, form inputs) |
| `localStorage` | Module completion keys (`module_{name}_completed`), custom theme colors |
| `sessionStorage` | Survey answers (`answers_{moduleId}`) — survives page refresh |
| URL search params | Question progression (`?q=N`) via `useNextFilter` hook |

**`useNextFilter` hook** (`src/hooks/useNextFilter.ts`): generic URL search params manager. Features: optimistic updates, debounced navigation, batch updates, pagination reset, multi-select toggles.

**Theme system**: `next-themes` for dark/light + `DynamicThemeProvider` for custom primary/secondary colors from localStorage. Custom colors use OKLCH color space.

## 🎨 Tailwind CSS v4 Conventions

- **No `tailwind.config.ts`** — v4 uses CSS-based config in `globals.css`
- CSS entry: `@import "tailwindcss"` + `@import "tw-animate-css"` + `@import "shadcn/tailwind.css"`
- Dark mode via `.dark` class and `@custom-variant dark (&:is(.dark *));`
- `@theme inline` block maps CSS variables to Tailwind utilities
- Gradient syntax: `bg-linear-to-b` (Tailwind v4, not `bg-gradient-to-b`)
- Custom success color: `--success` / `--success-foreground`
- Radius tokens: `--radius-sm` through `--radius-4xl`
- iOS zoom fix: `input, textarea, select { font-size: 16px; }`

## 🗂️ Module System (`src/config/modules.ts`)

Three learning modules registered:
1. **Baseline Survey** (`baseline-survey`) — 14 questions
2. **Social Safety** (`social-safety`) — 5 questions
3. **Diversity & Inclusion** (`diversity-inclusion`) — 3 questions

Each module has `introData`, `surveyData` (from seed files in `src/lib/seed/`), and `storageKey`. Dynamic lookup via `getModuleConfig(slug)`.

## ✅ Validation Patterns

All validation uses **Zod v4** with `z.infer<typeof schema>` for types:
- `src/lib/validations/branding.ts` — company branding form
- `src/lib/validations/course.ts` — course module builder (discriminated union for 7 question types)
- `src/lib/validations/location-performance.ts` — QR code generation schema

Pattern: `export const schema = z.object({...})` + `export type FormValues = z.infer<typeof schema>`

## 🚫 Common Pitfalls

1. **Never use `className` on shadcn components** — extend CVA variants or wrap in `<div>`
2. **No hardcoded colors** — always use `text-primary`, `bg-muted`, `border-border`, etc. with slash opacity
3. **`error: unknown`** in catch blocks — check `error instanceof Error ? error.message : "fallback"`
4. **Tailwind v4 gradient syntax**: `bg-linear-to-b` not `bg-gradient-to-b`
5. **All pages must be `"use client"`** since they use hooks — layouts stay server components
6. **No `.env` files committed** — gitignored, use `.env.example` pattern if needed
7. **Icons from `lucide-react`** — import named exports, e.g. `import { Home, User } from "lucide-react"`
8. **Animations via framer-motion** — `motion.div` with `initial`, `animate`, `layout` props
9. **OKLCH color space** for all CSS color variables

<!-- END:binksanders-project-rules -->
