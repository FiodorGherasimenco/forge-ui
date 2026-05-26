import type { StepNode } from '../types'
import { flattenStepIds, findNode, findNextLeaf, findPrevLeaf } from '../utils'

const leaf = (id: string, disabled?: boolean): StepNode => ({ id, disabled })
const group = (id: string, children: StepNode[], disabled?: boolean): StepNode => ({ id, children, disabled })

describe('flattenStepIds', () => {
  it('returns ids of flat leaf nodes', () => {
    expect(flattenStepIds([leaf('one'), leaf('two'), leaf('three')])).toEqual(['one', 'two', 'three'])
  })

  it('flattens nested group children', () => {
    expect(flattenStepIds([leaf('one'), group('g', [leaf('two'), leaf('three')]), leaf('four')])).toEqual(['one', 'two', 'three', 'four'])
  })

  it('returns empty array for empty input', () => {
    expect(flattenStepIds([])).toEqual([])
  })
})

describe('findNode', () => {
  it('finds a leaf node by id', () => {
    expect(findNode([leaf('one'), leaf('two')], 'two')).toEqual(leaf('two'))
  })

  it('finds a node nested inside a group', () => {
    expect(findNode([group('g', [leaf('one'), leaf('two')])], 'two')).toEqual(leaf('two'))
  })

  it('returns undefined when id does not exist', () => {
    expect(findNode([leaf('one')], 'missing')).toBeUndefined()
  })
})

describe('findNextLeaf', () => {
  it('returns the next enabled leaf id', () => {
    expect(findNextLeaf([leaf('one'), leaf('two'), leaf('three')], 'one')).toBe('two')
  })

  it('returns undefined when on the last leaf', () => {
    expect(findNextLeaf([leaf('one'), leaf('two')], 'two')).toBeUndefined()
  })

  it('skips disabled leaves', () => {
    expect(findNextLeaf([leaf('one'), leaf('two', true), leaf('three')], 'one')).toBe('three')
  })

  it('returns undefined when activeId is not in the tree', () => {
    expect(findNextLeaf([leaf('one'), leaf('two')], 'missing')).toBeUndefined()
  })

  it('returns next enabled leaf when active is disabled', () => {
    expect(findNextLeaf([leaf('one'), leaf('two', true), leaf('three')], 'two')).toBe('three')
  })
})

describe('findPrevLeaf', () => {
  it('returns the previous enabled leaf id', () => {
    expect(findPrevLeaf([leaf('one'), leaf('two'), leaf('three')], 'three')).toBe('two')
  })

  it('returns undefined when on the first leaf', () => {
    expect(findPrevLeaf([leaf('one'), leaf('two')], 'one')).toBeUndefined()
  })

  it('skips disabled leaves', () => {
    expect(findPrevLeaf([leaf('one'), leaf('two', true), leaf('three')], 'three')).toBe('one')
  })

  it('returns prev enabled leaf when active is disabled', () => {
    expect(findPrevLeaf([leaf('one'), leaf('two', true), leaf('three')], 'two')).toBe('one')
  })
})
