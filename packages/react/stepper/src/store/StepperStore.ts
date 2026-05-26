import type { StepNode } from '../types'
import { findNode, findNextLeaf, findPrevLeaf, flattenStepIds } from '../utils'

export type StepperStore = {
  getActiveStepId: () => string
  setActiveStepId: (id: string) => void
  getTree: () => StepNode[]
  setTree: (tree: StepNode[]) => void
  subscribe: (cb: () => void) => () => void
  goTo: (id: string) => void
  next: () => void
  prev: () => void
}

export function createStepperStore(initialId: string): StepperStore {
  let activeStepId = initialId
  let tree: StepNode[] = []
  const listeners = new Set<() => void>()

  const notify = () => listeners.forEach((cb) => cb())

  const getActiveStepId = () => activeStepId

  const setActiveStepId = (id: string) => {
    if (id === activeStepId) return
    activeStepId = id
    notify()
  }

  const getTree = () => tree
  const setTree = (next: StepNode[]) => { tree = next }

  const subscribe = (cb: () => void) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }

  const goTo = (id: string) => {
    const node = findNode(tree, id)
    if (!node || node.disabled) return
    setActiveStepId(id)
  }

  const next = () => {
    const id = findNextLeaf(tree, activeStepId)
    if (id != null) setActiveStepId(id)
  }

  const prev = () => {
    const id = findPrevLeaf(tree, activeStepId)
    if (id != null) setActiveStepId(id)
  }

  return { getActiveStepId, setActiveStepId, getTree, setTree, subscribe, goTo, next, prev }
}
