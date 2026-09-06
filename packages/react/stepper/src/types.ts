import { StepperStore } from "./store/StepperStore"

export type StepNode = {
  id: string
  title?: string
  disabled?: boolean
  children?: StepNode[]
}

export type StepperContextValue = StepperStore
