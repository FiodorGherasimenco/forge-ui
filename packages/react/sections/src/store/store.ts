export type Match = {
  ranges: Range[]
  hasMatch: boolean
  searchTerm: string
}

export type SectionsState = {
  searchTerm: string
  pageId?: string
  matched: Record<string, Match>
}

export type SectionsStore = ReturnType<typeof createSectionsStore>

export function createSectionsStore(initialState: { pageId?: string; searchTerm?: string }) {
  let state: SectionsState = {
    searchTerm: initialState.searchTerm ?? '',
    pageId: initialState.pageId,
    matched: {},
  }

  const listeners = new Set<() => void>()

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const getState = () => state

  const setState = (partial: Partial<SectionsState>) => {
    state = { ...state, ...partial }
    listeners.forEach((l) => l())
  }

  const commit = (sectionId: string, match: { ranges: Range[]; hasMatch: boolean }) => {
    setState({
      matched: {
        ...state.matched,
        [sectionId]: { ...match, searchTerm: state.searchTerm },
      },
    })
  }

  const setPageId = (pageId: string) => setState({ pageId })
  const setSearchTerm = (searchTerm: string) => setState({ searchTerm })

  return { subscribe, commit, getState, setState, setSearchTerm, setPageId }
}
