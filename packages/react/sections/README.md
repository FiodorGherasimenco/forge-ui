# @forge-ui/react-sections

A unique composable component for multi-page content navigation with live search and highlight.

There is no direct equivalent in the ecosystem. It combines three things that are typically solved separately:

- **Page navigation** — sidebar triggers that switch between named pages of content
- **Search-within-page** — debounced search that filters sections by content, keywords, and description, showing only matching sections across all pages
- **CSS Custom Highlight API** — native browser highlighting of matched text ranges with zero DOM mutation

All wired together as a declarative JSX API with no pre-declaration of pages or sections needed.

## Install

```sh
npm install @forge-ui/react-sections
```

## Usage

```tsx
import { Sections, Section, Trigger, Search, SectionNotFound } from '@forge-ui/react-sections'

export function App() {
  return (
    <Sections defaultPageId="page1">
      <div>
        <Trigger pageId="page1">Page 1</Trigger>
        <Trigger pageId="page2">Page 2</Trigger>
      </div>
      <Search />
      <Section pageId="page1" sectionId="intro">
        <h2>Introduction</h2>
        <p>Content here...</p>
      </Section>
      <Section pageId="page2" sectionId="details">
        <h2>Details</h2>
        <p>More content...</p>
      </Section>
      <SectionNotFound>No results found.</SectionNotFound>
    </Sections>
  )
}
```

## API

### `<Sections>`

| Prop | Type | Description |
|------|------|-------------|
| `defaultPageId` | `string` | Initial active page |
| `searchParamKey` | `string` | URL search param key (default: `"q"`) |
| `className` | `string` | Class on the wrapper div |

### `<Section>`

| Prop | Type | Description |
|------|------|-------------|
| `pageId` | `string` | Page this section belongs to |
| `sectionId` | `string` | Unique section identifier |
| `keywords` | `string` | Extra keywords for search matching |
| `description` | `string` | Extra description for search matching |

### `<Trigger>`

| Prop | Type | Description |
|------|------|-------------|
| `pageId` | `string` | Page to navigate to on click |
| `disabled` | `boolean` | Disables the trigger |
| `className` | `string` | Class on the button |
| `classNameActive` | `string` | Class applied when page is active |
| `onClick` | `() => void` | Additional click handler |

### `<Search>`

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Class on the search wrapper |
| `placeholder` | `string` | Input placeholder text |

### `<SectionNotFound>`

Renders its children when a search is active but no sections matched.

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Class on the wrapper div |
