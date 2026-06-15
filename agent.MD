<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:shadcn-agent-rules -->

# shadcn/ui: Be careful with component updates/removals

When using shadcn/ui components, always verify the installed version's API and structure, as shadcn has updated or removed several components/props in recent versions. Refer to local configurations or components in `src/components/ui/` before coding.

<!-- END:shadcn-agent-rules -->

<!-- BEGIN:project-design-rules -->

# Project Design Rules & Guidelines

1. **No Custom/Hex Color Hardcoding:**
   - NEVER use custom hex values (like `bg-[#E9308F]`, `text-[#FF3B3B]`, `zinc-` overrides) in your JSX files.
   - ALWAYS use semantic Tailwind theme variables (e.g., `bg-primary`, `bg-secondary`, `bg-background`, `text-foreground`, `text-destructive`, `border-border`, etc.) mapped to CSS variables in `src/app/globals.css`.

2. **Respect shadcn Component Styles:**
   - Do NOT override base styles (like padding `py-6`, borders, custom roundedness `rounded-xl`) on elements like `<Button>` and `<Input>` in individual page templates.
   - Let shadcn defaults and theme-wide configurations (e.g., `--radius` in `globals.css`) govern the shapes and dimensions.

3. **High-Precision Layouts:**
   - Closely match layouts to Figma screenshots (e.g., right-aligned icons in input fields, correct opacity modifiers like `bg-secondary/20` for helper alert cards, and using specific SVG image assets like `acme-logo.svg` or `scan-illustration.svg` instead of generic icon outlines).

<!-- END:project-design-rules -->