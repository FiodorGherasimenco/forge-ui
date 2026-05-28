export type SectionsState = {
  searchTerm: string
  pageId?: string
  visible: string[]
  loading: boolean
}

export type SearchContentResult = {
  ranges: Range[]
  keywords: string[]
  description: string[]
}
type SearchContent = (query: string) => SearchContentResult | Promise<SearchContentResult>;
type SectionProps = {
  searchContent: SearchContent
}

export type SectionsStore = ReturnType<typeof createSectionsStore>

export function createSectionsStore(initialState: { pageId?: string; searchTerm?: string }) {
  let state: SectionsState = {
    searchTerm: initialState.searchTerm ?? '',
    pageId: initialState.pageId,
    loading: false,
    visible: [],
  }

  const listeners = new Set<() => void>()
  const sections = new Map<string, SectionProps>()

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const getState = () => state

  const setState = (partial: Partial<SectionsState>) => {
    state = { ...state, ...partial }
    listeners.forEach((l) => l())
  }

  const getSections = () => Array.from(sections.entries());

  const setPageId = (pageId: string) => setState({ pageId })
  const setSearchTerm = (searchTerm: string) => setState({ searchTerm, loading: true })
  const setVisibility = (sectionIds: string[]) => setState({ visible: sectionIds, loading: false })

  const register = (sectionId: string, sectionProps: SectionProps) => {
    sections.set(sectionId, sectionProps)
  }

  const unregister = (sectionId: string) => {
    sections.delete(sectionId)
  }

  return { subscribe, getSections, getState, setState, setSearchTerm, setPageId, setVisibility, register, unregister }
}
