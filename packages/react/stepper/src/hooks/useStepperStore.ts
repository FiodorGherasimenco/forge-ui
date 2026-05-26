import { useContext } from 'react'
import { StepperContext } from '../store/StepperContext'
import type { StepperStore } from '../store/StepperStore'

export function useStepperStore(): StepperStore {
  const ctx = useContext(StepperContext)
  if (ctx == null)
    throw new Error('useStepperStore must be used within a <Stepper>')
  return ctx
}
