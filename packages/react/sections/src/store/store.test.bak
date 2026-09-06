import { createSectionsStore } from '../store/store'

describe('createSectionsStore', () => {
  it('should initialise with provided pageId and searchTerm', () => {
    const store = createSectionsStore({ pageId: 'p1', searchTerm: 'q' })
    const state = store.getState()
    expect(state.pageId).toBe('p1')
    expect(state.searchTerm).toBe('q')
    expect(state.matched).toEqual({})
  })

  it('should notify subscribers when state changes', () => {
    const store = createSectionsStore({})
    let callCount = 0
    const unsubscribe = store.subscribe(() => { callCount += 1 })

    store.setSearchTerm('x')
    expect(callCount).toBe(1)

    unsubscribe()
    store.setSearchTerm('y')
    expect(callCount).toBe(1)
  })

  it('should update only pageId from setPageId', () => {
    const store = createSectionsStore({ searchTerm: 'keep' })
    store.setPageId('page-2')
    expect(store.getState().pageId).toBe('page-2')
    expect(store.getState().searchTerm).toBe('keep')
  })

  it('should tag match with current searchTerm', () => {
    const store = createSectionsStore({})
    store.setSearchTerm('ok')
    const range = document.createRange()
    store.commit('s1', { ranges: [range], hasMatch: true })
    expect(store.getState().matched.s1?.searchTerm).toBe('ok')
    expect(store.getState().matched.s1?.hasMatch).toBe(true)
    expect(store.getState().matched.s1?.ranges).toHaveLength(1)
  })

  it('should tag no-match result with current searchTerm', () => {
    const store = createSectionsStore({})
    store.setSearchTerm('ok')
    store.commit('s1', { ranges: [], hasMatch: false })
    expect(store.getState().matched.s1?.searchTerm).toBe('ok')
    expect(store.getState().matched.s1?.hasMatch).toBe(false)
  })

  it('should keep stale match when searchTerm changes', () => {
    const store = createSectionsStore({})
    store.setSearchTerm('ok')
    store.commit('s1', { ranges: [], hasMatch: true })
    store.setSearchTerm('ok2')
    expect(store.getState().matched.s1?.searchTerm).toBe('ok')
  })
})
