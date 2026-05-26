# @forge-ui/react-stepper

A headless, purely declarative stepper component for multi-step flows.

Unlike most stepper libraries (e.g. `@stepperize/react`, shadcn/ui) which require pre-defining a step schema upfront, this component builds the step tree at runtime from JSX children. Steps and groups can be nested infinitely — no hardcoded levels, no schema declaration needed.

```tsx
<Stepper>
  <Step id="one" />
  <StepGroup id="group">          {/* nest groups */}
    <StepGroup id="nested">       {/* infinitely */}
      <Step id="deep" />
    </StepGroup>
  </StepGroup>
</Stepper>
```

Steps can also be wrapped in arbitrary non-stepper elements (divs, layout components) — `buildTree` recurses transparently through them.

## Install

```sh
npm install @forge-ui/react-stepper
```

## Usage

```tsx
import { Stepper, Step, StepGroup, useStepperStore } from '@forge-ui/react-stepper'

function Nav() {
  const store = useStepperStore()
  return (
    <div>
      <button onClick={() => store.prev()}>Back</button>
      <button onClick={() => store.next()}>Next</button>
    </div>
  )
}

export function App() {
  return (
    <Stepper defaultStepId="step1">
      <Nav />
      <Step id="step1">Step 1 content</Step>
      <Step id="step2">Step 2 content</Step>
      <Step id="step3">Step 3 content</Step>
    </Stepper>
  )
}
```

## With Groups

```tsx
<Stepper defaultStepId="step1a">
  <StepGroup id="group1" title="Account">
    <Step id="step1a">Create account</Step>
    <Step id="step1b">Verify email</Step>
  </StepGroup>
  <StepGroup id="group2" title="Profile">
    <Step id="step2a">Your details</Step>
  </StepGroup>
</Stepper>
```

## API

### `<Stepper>`

| Prop | Type | Description |
|------|------|-------------|
| `defaultStepId` | `string` | Initial active step (uncontrolled) |
| `selectedStepId` | `string` | Active step (controlled) |
| `onSelect` | `(id: string) => void` | Called when active step changes |
| `className` | `string` | Class on the wrapper div |

### `<Step>`

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique step identifier |
| `title` | `string` | Step title (used by nav components) |
| `disabled` | `boolean` | Prevents navigation to this step |
| `className` | `string` | Class on the step div |

### `<StepGroup>`

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique group identifier |
| `title` | `string` | Group title (used by nav components) |
| `disabled` | `boolean` | Disables all steps in the group |
| `className` | `string` | Class on the group div |

### `useStepperStore()`

Must be used inside a `<Stepper>`. Returns the store with:

| Method | Description |
|--------|-------------|
| `getActiveStepId()` | Current active step id |
| `setActiveStepId(id)` | Set active step directly |
| `getTree()` | Full step tree (`StepNode[]`) |
| `getStepIds()` | Flat list of all leaf step ids |
| `next()` | Move to next enabled step |
| `prev()` | Move to previous enabled step |
| `goTo(id)` | Navigate to a specific step |
| `subscribe(cb)` | Subscribe to store changes |
