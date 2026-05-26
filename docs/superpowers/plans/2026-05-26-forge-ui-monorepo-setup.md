# forge-ui Monorepo Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-ready pnpm + Turborepo monorepo for forge-ui with a Button component, shared packages, Storybook, Astro docs, Vitest testing, and Changesets publishing.

**Architecture:** All React packages live under `packages/react/*`, each as an independent npm package. A unified `packages/react/index` re-exports everything as `@forge-ui/react`. Shared utilities (`@forge-ui/types`, `@forge-ui/utils`) are built first via Turborepo's dependency graph.

**Tech Stack:** pnpm workspaces, Turborepo, Vite 5, React 18, TypeScript 5, Tailwind CSS 4, Vitest 2, React Testing Library, Storybook 8, Astro 5, Changesets

---

## File Map

```
forge-ui/
├── .github/workflows/
│   ├── ci.yml                              # PR: build, lint, test
│   └── release.yml                         # main: changesets publish
├── apps/
│   ├── docs/                               # Astro docs site
│   └── storybook/                          # Storybook 8
├── packages/
│   ├── react/
│   │   ├── button/                         # @forge-ui/react-button
│   │   │   ├── src/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   └── vite.config.ts
│   │   └── index/                          # @forge-ui/react (unified)
│   │       ├── src/index.ts
│   │       ├── package.json
│   │       └── tsconfig.json
│   ├── types/                              # @forge-ui/types
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils/                              # @forge-ui/utils
│       ├── src/index.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

---

## Task 1: Root Monorepo Scaffold

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.npmrc`

- [ ] **Step 1: Verify pnpm is installed**

```bash
pnpm --version
```
Expected: `9.x.x` or higher. If not installed: `npm install -g pnpm`

- [ ] **Step 2: Create root `package.json`**

Create `/Users/fgherasimen/Projects/forge-ui/package.json`:
```json
{
  "name": "forge-ui",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0",
    "@changesets/cli": "^2.27.0"
  },
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  }
}
```

- [ ] **Step 3: Create `pnpm-workspace.yaml`**

Create `/Users/fgherasimen/Projects/forge-ui/pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/react/*'
  - 'packages/types'
  - 'packages/utils'
  - 'apps/*'
```

- [ ] **Step 4: Create `turbo.json`**

Create `/Users/fgherasimen/Projects/forge-ui/turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 5: Create `tsconfig.base.json`**

Create `/Users/fgherasimen/Projects/forge-ui/tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

- [ ] **Step 6: Create `.npmrc`**

Create `/Users/fgherasimen/Projects/forge-ui/.npmrc`:
```
auto-install-peers=true
strict-peer-dependencies=false
```

- [ ] **Step 7: Create `.gitignore`**

Create `/Users/fgherasimen/Projects/forge-ui/.gitignore`:
```
node_modules
dist
.turbo
*.tsbuildinfo
.DS_Store
coverage
storybook-static
```

- [ ] **Step 8: Install root dependencies**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm install
```
Expected: `node_modules` created at root, `pnpm-lock.yaml` generated.

- [ ] **Step 9: Commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add . && git commit -m "chore: scaffold monorepo root with pnpm workspaces and turborepo"
```

---

## Task 2: `@forge-ui/types` Package

**Files:**
- Create: `packages/types/src/index.ts`
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p /Users/fgherasimen/Projects/forge-ui/packages/types/src
```

- [ ] **Step 2: Create `packages/types/src/index.ts`**

```ts
export type Size = 'sm' | 'md' | 'lg'
export type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

export interface BaseComponentProps {
  className?: string
}
```

- [ ] **Step 3: Create `packages/types/package.json`**

```json
{
  "name": "@forge-ui/types",
  "version": "0.0.1",
  "private": false,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 4: Create `packages/types/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Build and verify**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm --filter @forge-ui/types build
```
Expected: `packages/types/dist/` created with `index.js`, `index.mjs`, `index.d.ts`.

- [ ] **Step 6: Commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add packages/types && git commit -m "feat: add @forge-ui/types package"
```

---

## Task 3: `@forge-ui/utils` Package

**Files:**
- Create: `packages/utils/src/index.ts`
- Create: `packages/utils/package.json`
- Create: `packages/utils/tsconfig.json`
- Create: `packages/utils/vite.config.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p /Users/fgherasimen/Projects/forge-ui/packages/utils/src
```

- [ ] **Step 2: Create `packages/utils/package.json`**

```json
{
  "name": "@forge-ui/utils",
  "version": "0.0.1",
  "private": false,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 3: Create `packages/utils/src/index.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Create `packages/utils/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `packages/utils/vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js',
    },
    rollupOptions: {
      external: ['clsx', 'tailwind-merge'],
    },
  },
})
```

- [ ] **Step 6: Install dependencies and build**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm install && pnpm --filter @forge-ui/utils build
```
Expected: `packages/utils/dist/` with `index.js`, `index.mjs`.

- [ ] **Step 7: Commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add packages/utils && git commit -m "feat: add @forge-ui/utils package with cn() helper"
```

---

## Task 4: `@forge-ui/react-button` Package

**Files:**
- Create: `packages/react/button/src/Button.tsx`
- Create: `packages/react/button/src/Button.test.tsx`
- Create: `packages/react/button/src/Button.stories.tsx`
- Create: `packages/react/button/src/index.ts`
- Create: `packages/react/button/package.json`
- Create: `packages/react/button/tsconfig.json`
- Create: `packages/react/button/vite.config.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p /Users/fgherasimen/Projects/forge-ui/packages/react/button/src
```

- [ ] **Step 2: Create `packages/react/button/package.json`**

```json
{
  "name": "@forge-ui/react-button",
  "version": "0.0.1",
  "private": false,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "test": "vitest run",
    "test:watch": "vitest",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@forge-ui/types": "workspace:*",
    "@forge-ui/utils": "workspace:*"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "tailwindcss": ">=3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: Write the failing test first**

Create `packages/react/button/src/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './index'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies variant class', () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('destructive')
  })

  it('applies size class', () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('lg')
  })
})
```

- [ ] **Step 4: Create `packages/react/button/tsconfig.json`**

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declarationDir": "./dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `packages/react/button/vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 6: Create test setup file**

Create `packages/react/button/src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Run test to verify it fails**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm install && pnpm --filter @forge-ui/react-button test
```
Expected: FAIL — `Cannot find module './index'`

- [ ] **Step 8: Implement `Button.tsx`**

Create `packages/react/button/src/Button.tsx`:
```tsx
import * as React from 'react'
import { cn } from '@forge-ui/utils'
import type { Size, Variant, BaseComponentProps } from '@forge-ui/types'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseComponentProps {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-900 hover:bg-gray-100',
  destructive: 'bg-red-600 text-white hover:bg-red-700 destructive',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg lg',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

- [ ] **Step 9: Create `packages/react/button/src/index.ts`**

```ts
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

- [ ] **Step 10: Run tests to verify they pass**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm --filter @forge-ui/react-button test
```
Expected: All 5 tests PASS.

- [ ] **Step 11: Build the package**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm --filter @forge-ui/react-button build
```
Expected: `packages/react/button/dist/` created.

- [ ] **Step 12: Commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add packages/react/button && git commit -m "feat: add @forge-ui/react-button with tests"
```

---

## Task 5: `@forge-ui/react` Unified Package

**Files:**
- Create: `packages/react/index/src/index.ts`
- Create: `packages/react/index/package.json`
- Create: `packages/react/index/tsconfig.json`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p /Users/fgherasimen/Projects/forge-ui/packages/react/index/src
```

- [ ] **Step 2: Create `packages/react/index/package.json`**

```json
{
  "name": "@forge-ui/react",
  "version": "0.0.1",
  "private": false,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@forge-ui/react-button": "workspace:*"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "tailwindcss": ">=3"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 3: Create `packages/react/index/src/index.ts`**

```ts
export * from '@forge-ui/react-button'
```

- [ ] **Step 4: Create `packages/react/index/tsconfig.json`**

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declarationDir": "./dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `packages/react/index/vite.config.ts`**

Create `packages/react/index/vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
})
```

- [ ] **Step 6: Build and verify**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm install && pnpm --filter @forge-ui/react build
```
Expected: `packages/react/index/dist/` created, exports Button correctly.

- [ ] **Step 7: Commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add packages/react/index && git commit -m "feat: add @forge-ui/react unified package"
```

---

## Task 6: Storybook App

**Files:**
- Create: `apps/storybook/` (via Storybook CLI)
- Create: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/.storybook/preview.ts`
- Create: `packages/react/button/src/Button.stories.tsx`

- [ ] **Step 1: Scaffold Storybook**

```bash
cd /Users/fgherasimen/Projects/forge-ui && mkdir -p apps/storybook && cd apps/storybook && pnpm dlx storybook@latest init --type react --builder vite --skip-install
```
Expected: `.storybook/` config created, `package.json` generated.

- [ ] **Step 2: Update `apps/storybook/package.json` to use workspace components**

Add to dependencies in `apps/storybook/package.json`:
```json
{
  "dependencies": {
    "@forge-ui/react": "workspace:*"
  }
}
```

- [ ] **Step 3: Update `apps/storybook/.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite'
import { join, dirname } from 'path'

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../../packages/react/**/*.stories.@(ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
}

export default config
```

- [ ] **Step 4: Create `apps/storybook/.storybook/preview.ts`**

```ts
import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

- [ ] **Step 5: Create `packages/react/button/src/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './index'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Button' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
}
```

- [ ] **Step 6: Install dependencies and start Storybook**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm install && pnpm --filter storybook dev
```
Expected: Storybook opens at `http://localhost:6006` showing Button stories.

- [ ] **Step 7: Commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add apps/storybook packages/react/button/src/Button.stories.tsx && git commit -m "feat: add storybook with button stories"
```

---

## Task 7: Astro Docs App

**Files:**
- Create: `apps/docs/` (via Astro CLI)
- Modify: `apps/docs/package.json`
- Create: `apps/docs/src/pages/components/button.mdx`

- [ ] **Step 1: Scaffold Astro docs**

```bash
cd /Users/fgherasimen/Projects/forge-ui/apps && pnpm dlx create-astro@latest docs --template docs --install --no-git
```
Expected: `apps/docs/` created with Astro project.

- [ ] **Step 2: Add React integration to Astro**

```bash
cd /Users/fgherasimen/Projects/forge-ui/apps/docs && pnpm dlx astro add react --yes
```
Expected: `astro.config.mjs` updated with React integration.

- [ ] **Step 3: Add forge-ui dependency to docs**

Add to `apps/docs/package.json` dependencies:
```json
{
  "dependencies": {
    "@forge-ui/react": "workspace:*"
  }
}
```

- [ ] **Step 4: Create Button docs page**

Create `apps/docs/src/pages/components/button.mdx`:
```mdx
---
title: Button
description: A button component with multiple variants and sizes.
---

import { Button } from '@forge-ui/react'

# Button

A clickable button component with support for variants and sizes.

## Install

```bash
npm install @forge-ui/react-button
```

## Usage

```tsx
import { Button } from '@forge-ui/react-button'

export default function App() {
  return <Button>Click me</Button>
}
```

## Variants

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
</div>

## Sizes

<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>
```

- [ ] **Step 5: Install and start docs**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm install && pnpm --filter docs dev
```
Expected: Astro docs site opens at `http://localhost:4321`.

- [ ] **Step 6: Commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add apps/docs && git commit -m "feat: add astro docs site with button page"
```

---

## Task 8: Changesets Publishing Setup

**Files:**
- Create: `.changeset/config.json`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Initialize changesets**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm dlx @changesets/cli init
```
Expected: `.changeset/config.json` created.

- [ ] **Step 2: Update `.changeset/config.json`**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- [ ] **Step 3: Create `.github/workflows/ci.yml`**

```bash
mkdir -p /Users/fgherasimen/Projects/forge-ui/.github/workflows
```

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm lint
      - run: pnpm test
```

- [ ] **Step 4: Create `.github/workflows/release.yml`**

Create `.github/workflows/release.yml`:
```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 5: Verify full monorepo build**

```bash
cd /Users/fgherasimen/Projects/forge-ui && pnpm build
```
Expected: All packages build in correct order — `types` and `utils` before `react-button` before `react`.

- [ ] **Step 6: Final commit**

```bash
cd /Users/fgherasimen/Projects/forge-ui && git add . && git commit -m "chore: add changesets and github actions workflows"
```
