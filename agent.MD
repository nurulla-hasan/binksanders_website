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

1. **STRICTLY No Custom/Hex Color Hardcoding:**
   - NEVER use custom hex values (like `bg-[#E9308F]`, `text-[#FF3B3B]`, `bg-[#e0f7fa]`, `zinc-` overrides) in your JSX files.
   - If a screenshot shows a pastel background block (e.g. light pink or light blue), DO NOT hardcode the color. Map it to semantic Tailwind theme variables with opacity (e.g., `bg-primary/10`, `bg-secondary/10`, `bg-card`, `bg-muted/50`).
   - ALWAYS use semantic variables from `src/app/globals.css`.

2. **ABSOLUTELY Respect shadcn/Custom Component Styles:**
   - **FORBIDDEN:** Adding extra styles (like `font-semibold`, `text-lg`, custom spacing) directly to components like `<Field>`, `<FieldLabel>`, `<Input>`, `<Select>`, or `<Button>`.
   - The `<Field>` compound components (e.g. `FieldLabel`, `FieldDescription`) already have built-in styling. Do NOT override them by injecting `className` unless absolutely necessary for layout. Let the components manage their own typography and spacing.
   - **ALLOWED:** You may ONLY apply layout-related utility classes (e.g., `w-full`, `mt-4`, `flex-1`) when necessary for structural positioning.

3. **High-Precision Layouts:**
   - Closely match layouts to Figma screenshots but ALWAYS translate the visual design into our standard design system (semantic tailwind classes).
   - Use specific SVG image assets like `acme-logo.svg` or `scan-illustration.svg` when matching visual assets.

<!-- END:project-design-rules -->