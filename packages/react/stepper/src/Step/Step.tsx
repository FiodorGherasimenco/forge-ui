import React, { useSyncExternalStore } from 'react'
import { useStepperStore } from '../hooks/useStepperStore'

export type StepProps = React.PropsWithChildren<{
  id: string
  title?: string
  disabled?: boolean
  className?: string
}>

export function Step({ id, children, className }: StepProps) {
  const stepper = useStepperStore()
  const isActive = useSyncExternalStore(
    stepper.subscribe,
    () => stepper.getActiveStepId() === id,
  )

  if (!isActive) return null

  return (
    <div id={`step-${id}`} className={className}>
      {children}
    </div>
  )
}

Step.stepRole = 'step' as const
