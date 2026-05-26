import { createContext } from 'react'
import type { StepperStore } from './StepperStore'

export const StepperContext = createContext<StepperStore | null>(null)
