# forge-ui Monorepo Design

**Date:** 2026-05-26  
**Status:** Approved

## Overview

forge-ui is an open-source React component library, publishable to npm, modeled after Radix UI primitives. Built as a Vite-powered monorepo using pnpm workspaces and Turborepo. Components are Tailwind-styled (peer dependency), individually installable per component or all at once via the unified package.

## Monorepo Structure

```
forge-ui/
├── apps/
│   ├── docs/                          # Astro documentation site
│   └── storybook/                     # Vite-based Storybook 8
├── packages/
│   ├── react/
│   │   ├── button/                    # @forge-ui/react-button
│   │   │   ├── src/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   ├── dialog/                    # @forge-ui/react-dialog
│   │   │   ├── src/
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── Dialog.test.tsx
│   │   │   │   ├── Dialog.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   ├── use-click-outside/         # @forge-ui/react-use-click-outside
│   │   │   ├── src/
│   │   │   │   ├── useClickOutside.ts
│   │   │   │   ├── useClickOutside.test.ts
│   │   │   │   └── index.ts
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   └── index/                     # @forge-ui/react — unified re-export package
│   │       ├── src/
│   │       │   └── index.ts           # re-exports all @forge-ui/react-* packages
│   │       ├── package.json           # name: "@forge-ui/react"
│   │       └── tsconfig.json
│   ├── types/                         # @forge-ui/types — shared global types
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils/                         # @forge-ui/utils — cn(), clsx, tailwind-merge
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## Install & Import

### Install everything React
```bash
npm install @forge-ui/react
```
```ts
import { Button, Dialog } from '@forge-ui/react'
```

### Install individual component
```bash
npm install @forge-ui/react-button
```
```ts
import { Button } from '@forge-ui/react-button'
```

### Install individual hook
```bash
npm install @forge-ui/react-use-click-outside
```
```ts
import { useClickOutside } from '@forge-ui/react-use-click-outside'
```

## Package Naming Convention

Follows Radix UI convention — framework prefix on every package:

| Folder | Package name |
|---|---|
| `packages/react/button` | `@forge-ui/react-button` |
| `packages/react/dialog` | `@forge-ui/react-dialog` |
| `packages/react/use-click-outside` | `@forge-ui/react-use-click-outside` |
| `packages/react/index` | `@forge-ui/react` (unified) |
| `packages/types` | `@forge-ui/types` |
| `packages/utils` | `@forge-ui/utils` |

## Component Package Structure

Each component/hook under `packages/react/` follows the same structure:

```
packages/react/button/
├── src/
│   ├── Button.tsx           # component implementation
│   ├── Button.test.tsx      # Vitest + React Testing Library tests
│   ├── Button.stories.tsx   # Storybook stories
│   └── index.ts             # public exports
├── package.json             # name: "@forge-ui/react-button"
└── tsconfig.json            # extends ../../../tsconfig.base.json
```

Each component `package.json`:
```json
{
  "name": "@forge-ui/react-button",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "peerDependencies": {
    "react": ">=18",
    "tailwindcss": ">=3"
  }
}
```

Hooks that are internal to a component are listed as dependencies:
```json
{
  "dependencies": {
    "@forge-ui/react-use-controllable-state": "workspace:*"
  }
}
```

## Unified Package (`@forge-ui/react`)

`packages/react/index/src/index.ts` re-exports all published components and hooks:

```ts
export * from '@forge-ui/react-button'
export * from '@forge-ui/react-dialog'
export * from '@forge-ui/react-use-click-outside'
```

`packages/react/index/package.json`:
```json
{
  "name": "@forge-ui/react",
  "dependencies": {
    "@forge-ui/react-button": "workspace:*",
    "@forge-ui/react-dialog": "workspace:*"
  }
}
```

## Tooling

### TypeScript
- `tsconfig.base.json` at root with shared compiler options
- Each package extends root with its own `tsconfig.json`

### Vite
- Each component package has a `vite.config.ts`
- Library mode: outputs ESM + CJS + `.d.ts` type declarations

### Turborepo
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev":   { "cache": false, "persistent": true },
    "lint":  {},
    "test":  {}
  }
}
```
- `^build` ensures `@forge-ui/types` and `@forge-ui/utils` build before components
- Build caching — unchanged packages are not rebuilt

### Testing
- **Vitest** — Vite-native test runner
- **React Testing Library** (`@testing-library/react`) — component behavior tests
- Tests co-located with components: `Button.test.tsx`

### Storybook
- Vite-based Storybook 8 in `apps/storybook`
- Stories co-located with components: `Button.stories.tsx`
- Storybook globs stories: `../../packages/react/**/*.stories.tsx`

### Docs (Astro)
- Astro app in `apps/docs`
- MDX for component documentation pages
- Imports components directly from workspace for live examples
- Static output, deployable to Vercel/Netlify/GitHub Pages

## Publishing

- **Changesets** (`@changesets/cli`) for versioning and publishing
- Independent versioning per component package
- Workflow:
  1. PR includes a changeset file
  2. Merge to `main` → `changeset version` bumps versions
  3. `changeset publish` publishes to npm

## pnpm-workspace.yaml

```yaml
packages:
  - 'packages/react/*'
  - 'packages/types'
  - 'packages/utils'
  - 'apps/*'
```

## CI (GitHub Actions)

- **PR:** `build` → `lint` → `test`
- **Main merge:** changesets publish workflow

## Future Vue Support

When Vue is added:
- `packages/vue/button/` → `@forge-ui/vue-button`
- `packages/vue/index/` → `@forge-ui/vue` (unified)
- Same structure, same conventions
