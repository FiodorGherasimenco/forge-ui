import React, { useEffect, useRef } from 'react'
import { StepperContext } from '../store/StepperContext'
import { createStepperStore } from '../store/StepperStore'
import {buildTree, flattenSteps} from '../utils'

export type StepperProps = React.PropsWithChildren<{
  selectedStepId?: string
  defaultStepId?: string
  className?: string
  onSelect?: (stepId: string) => void
}>

export function Stepper({ selectedStepId, defaultStepId, children, className, onSelect }: StepperProps) {
  const storeRef = useRef<ReturnType<typeof createStepperStore> | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createStepperStore(selectedStepId ?? defaultStepId ?? '')
  }

  const store = storeRef.current
  const tree = buildTree(children)
  store.setTree(tree)

  if (!store.getActiveStepId()) {
   const [firstNode] = flattenSteps(tree).filter((n) => !n.disabled);
   if(firstNode){
     store.setActiveStepId(firstNode.id)
   }
  }

  useEffect(() => {
    if (selectedStepId !== undefined) store.setActiveStepId(selectedStepId)
  }, [selectedStepId, store])

  useEffect(
    () => store.subscribe(() => { onSelect?.(store.getActiveStepId()) }),
    [store, onSelect],
  )

  return (
    <StepperContext.Provider value={store}>
      <div className={className}>{children}</div>
    </StepperContext.Provider>
  )
}

Stepper.stepRole = 'stepper' as const
