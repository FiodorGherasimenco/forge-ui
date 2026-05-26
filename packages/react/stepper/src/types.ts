import type { StepperStore } from './StepperStore'

export type StepNode = {
  id: string
  title?: string
  disabled?: boolean
  children?: StepNode[]
}

export type StepperContextValue = StepperStore
