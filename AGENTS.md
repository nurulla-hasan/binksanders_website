# Repository Guidelines

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



## Project Structure & Module Organization

This is a Next.js 16, React 19, TypeScript app. Route files live in `src/app`: `(main-route)` contains the public mobile-first experience, `(admin-route)` contains company and super-admin dashboards, `auth` handles authentication pages, and `onboard` / `qr-login` are standalone flows. Reusable components are grouped in `src/components` by feature, with shadcn UI primitives in `src/components/ui`. Shared helpers, schemas, and seed data belong in `src/lib`; hooks in `src/hooks`; providers in `src/providers`; API/service logic in `src/services`; static assets in `public`; reference data in `docs`.

## Build, Test, and Development Commands

Use npm because this repository includes `package-lock.json`.

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build and run Next.js compile checks.
- `npm run start`: serve the production build locally.
- `npm run lint`: run ESLint using `eslint.config.mjs`.

## Coding Style & Naming Conventions

Write TypeScript with strict types and import local modules via `@/*`. Use 2-space indentation, named exports for shared utilities, PascalCase for React components, camelCase for functions and variables, and kebab-case for route segments. Keep pages as client components when they use hooks; layouts should remain server components unless they need client-only behavior. In `catch` blocks, use `error: unknown` and narrow before reading messages.

For styling, use Tailwind CSS v4 tokens from `src/app/globals.css`. Do not hardcode colors; add CSS variables for both light and dark themes when a new color is required. Keep shadcn components pure: prefer built-in `variant` and `size` props, extend CVA variants in `src/components/ui`, and apply layout classes to wrapper elements.

Also note: this project uses `shadcn/ui` style `"radix-vega"` (set in `components.json`), with `data-slot` attributes on primitives. The icon library is `lucide-react`.

## Data Fetching & Service Layer

All API calls go through `src/lib/nextServerFetch.ts` — a **server-only** wrapper around `fetch()` that auto-injects the `accessToken` from `httpOnly` cookies. Service files live in `src/services/` and all start with `"use server"` — they are **Next.js Server Actions**.

**Pattern for read operations:**
```typescript
"use server";
import { nextServerFetch } from "@/lib/nextServerFetch";
import type { ApiResponse } from "@/lib/types/api.type";

export const getItems = async (params: TQuery = {}) =>
  nextServerFetch<ApiResponse<ItemType>>(`/endpoint${buildQueryString(params)}`, {
    next: { tags: ["items"], revalidate: 3600 },
  });
```

**Pattern for write/mutation operations:**
```typescript
"use server";
import { nextServerFetch } from "@/lib/nextServerFetch";
import { updateTag } from "next/cache";

export const createItem = async (payload: PayloadType) => {
  const response = await nextServerFetch<ApiResponse<T>>("/endpoint", {
    method: "POST",
    body: payload,
  });
  if (response?.success) updateTag("items");
  return response;
};
```

Key helpers in `src/lib/`:
- `buildQueryString(params)` — filters out `undefined`/`null`/empty values, handles arrays
- `createMultipartBody(data, files)` — wraps data + files into `FormData` for uploads
- `updateTag("tag-name")` — revalidates cached data after mutations (from `next/cache`)

**Data flow:** Server component page → service function → `nextServerFetch()` → fetch to `NEXT_PUBLIC_BASE_API` URL → typed response → passed to client components via props or `UserProvider`.

## State Management

**Zustand (`src/stores/`) is deprecated.** Auth state is managed via React Context and Next.js Server Actions.

Use the `UserProvider` context (`src/providers/UserProvider.tsx`) for accessing the current user:
- Server components fetch the user and pass it to `<UserProvider user={user}>`.
- Client components consume it via `useUserContext()` (throws if used outside provider).

**URL as state:** Use `useNextFilter` hook (`src/hooks/useNextFilter.ts`) for filter/pagination state synced to URL search params. It supports optimistic updates, debounced navigation, batch updates, multi-select toggle, and clear-all with exclusion list.

## Layout Composition

```
RootLayout
├── DynamicThemeProvider (client — fetches company branding, overrides CSS vars)
│   ├── ThemeProvider (next-themes wrapper, class strategy, default light)
│   │   ├── TooltipProvider
│   │   │   ├── {route group layout} (server)
│   │   │   │   └── UserProvider
│   │   │   │       └── {page content}
│   │   │   └── Toaster (sonner)
```

- **Main route** (`(main-route)/layout.tsx`): mobile-first layout with `max-w-120` container, `TopNav` (back button + icons), scrollable `<main>`, and `BottomNav` (Home/Modules/Profile tabs).
- **Admin route** (`(admin-route)/layout.tsx`): desktop sidebar layout with `MainLayout` → `Sidebar` + `Header` (hamburger, greeting, theme toggle, avatar).
- **Auth pages**: two-panel layout (image left, form right), no UserProvider.

## Theme System

- All colors are **CSS variables** defined in `src/app/globals.css` using OKLCH color space.
- Every variable has `:root` (light), `.dark` (dark), and `@theme inline` (Tailwind v4 mapping) definitions.
- **`DynamicThemeProvider`** (`src/providers/dynamic-theme-provider.tsx`) fetches company branding and overrides `--primary`, `--primary-foreground`, `--ring`, `--sidebar-*`, `--secondary*` CSS variables dynamically. It clears custom themes on auth pages.
- Use `text-primary/80`, `bg-muted`, `border-border` — never hardcoded hex/rgb/oklch values.
- Custom variables beyond shadcn defaults: `--success`/`--success-foreground`, `--font-heading`, `--radius-sm` through `--radius-4xl`, full sidebar color set.

## Component Variants Already Extended

These shadcn components already have custom variants/sizes in `src/components/ui/`. Use these via props before considering new extensions:

- **Button**: variants `disagree`, `agree`, `sidebar-logout`; sizes `lg-full`, `icon-xs`, `icon-sm`, `icon-lg`, `sidebar-logout`
- **Badge**: variants `success`, `info`, `progress`, `accepted`, `active`, `pending`, `blocked`, `rejected`, `processing`, `completed`, `manager`, `member`, `admin`
- **Avatar**: size prop with `sm`, `lg`, `xl`; sub-components `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`

## Utility Hooks (`src/hooks/`)

- `useCopyToClipboard()` — copies text with 2s feedback state
- `useCountdown(initialSeconds, storageKey)` — OTP timer persistent across page refreshes (localStorage)
- `useLocalStorage<T>(key, initialValue)` — typed localStorage with SSR safety
- `useMediaQuery(query)` — reactive media query matching
- `useNetworkStatus()` — online/offline detection

## Error, Loading & NotFound Boundaries

- **`error.tsx`** — client component with `reset()` button; shows error message from `error.message`
- **`loading.tsx`** — centered `LoaderCircle` spinner with "Loading" text
- **`not-found.tsx`** — "404 — Page Not Found" with "Return Home" link styled as a Button
- Individual pages handle errors inline with `ErrorToast()` (sonner toast) or by `throw new Error()` (caught by error boundary)

## Project Configuration Notes

- **Next.js config** (`next.config.ts`): server actions body limit set to `100mb`; remote images allowed from `images.unsplash.com` and `res.cloudinary.com`
- **ESLint** (`eslint.config.mjs`): uses `eslint-config-next` with core-web-vitals and typescript configs
- **Path alias**: `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- **Platform**: deployed on Vercel at `binksanders-website.vercel.app`

## Testing Guidelines

No automated test framework is currently configured. Before submitting changes, run `npm run lint` and `npm run build`. If tests are added later, colocate them near the feature or use a clear `*.test.ts(x)` naming pattern, and document the command in `package.json`.

## Commit & Pull Request Guidelines

Recent commits use conventional-style subjects such as `feat: ...` and concise imperative summaries. Follow that pattern (`feat: add course preview`, `fix: correct module filter`). Pull requests should include a short description, linked issue or task when available, screenshots for UI changes, and notes about lint/build results.

## Security & Configuration Tips

Keep secrets in local `.env` files and do not commit them. Add an `.env.example` when introducing required configuration. Treat `public` files as browser-visible assets.
