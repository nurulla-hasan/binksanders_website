<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:shadcn-agent-rules -->

# shadcn/ui: Be careful with component updates/removals

When using shadcn/ui components, always verify the installed version's API and structure, as shadcn has updated or removed several components/props in recent versions. Refer to local configurations or components in `src/components/ui/` before coding.

<!-- END:shadcn-agent-rules -->