import React from 'react'
import type { StepNode } from './types'

function getStepRole(child: React.ReactNode): string | undefined {
  if (!React.isValidElement(child)) return undefined
  const type = child.type as { stepRole?: string }
  return type.stepRole
}

export function buildTree(children: React.ReactNode): StepNode[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return []
    const role = getStepRole(child)
    if (!role) {
      const props = child.props as { children?: React.ReactNode }
      return props.children ? buildTree(props.children) : []
    }
    const props = child.props as { id: string; title?: string; disabled?: boolean; children?: React.ReactNode }
    const node: StepNode = { id: props.id, title: props.title, disabled: props.disabled }
    if (role === 'step-group' && props.children) {
      node.children = buildTree(props.children)
    }

    return [node]
  })
}

export function flattenSteps(tree: StepNode[]): StepNode[] {
  return tree.flatMap((node) =>
      node.children ? flattenSteps(node.children) : [node]
  )
}

export function flattenStepIds(tree: StepNode[]): string[] {
  return tree.flatMap((node) =>
    node.children ? flattenStepIds(node.children) : [node.id]
  )
}

export function findNode(tree: StepNode[], id: string): StepNode | undefined {
  for (const node of tree) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return undefined
}

export function findNextLeaf(tree: StepNode[], currentId: string): string | undefined {
  const steps = flattenSteps(tree)
  let found = false
  for (const step of steps) {
    if (found && !step.disabled) return step.id
    if (step.id === currentId) found = true
  }
  return undefined
}

export function findPrevLeaf(tree: StepNode[], currentId: string): string | undefined {
  const steps = flattenSteps(tree)
  let last: string | undefined
  for (const step of steps) {
    if (step.id === currentId) return last
    if (!step.disabled) last = step.id
  }
  return undefined
}
