import React, { useSyncExternalStore } from 'react'
import { useStepperStore } from '../hooks/useStepperStore'
import { findNode, flattenStepIds } from '../utils'

export type StepGroupProps = React.PropsWithChildren<{
  id: string
  title?: string
  disabled?: boolean
  className?: string
}>

export function StepGroup({ id, children, className }: StepGroupProps) {
  const stepper = useStepperStore()
  const isActive = useSyncExternalStore(stepper.subscribe, () => {
    const activeStepId = stepper.getActiveStepId()
    if (activeStepId === id) return true
    const node = findNode(stepper.getTree(), id)
    if (node?.children) return flattenStepIds(node.children).includes(activeStepId)
    return false
  })

  if (!isActive) return null

  return (
    <div id={`step-group-${id}`} className={className}>
      {children}
    </div>
  )
}

StepGroup.stepRole = 'step-group' as const
