import React, { useRef, useLayoutEffect, useSyncExternalStore } from 'react'
import { useSectionsStore, SectionContext } from '../store/SectionsContext'
import { matchRanges, matchText } from '../utils'

export type SectionProps = React.ComponentProps<'section'> & {
  pageId: string
  sectionId: string
  keywords?: string
  description?: string
}

export function Section({ pageId, sectionId, description, keywords, children, ...props }: SectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const store = useSectionsStore()
  const snapshotCache = useRef<{ searchTerm: string; isVisible: boolean } | null>(null)

  const { searchTerm, isVisible } = useSyncExternalStore(store.subscribe, () => {
    const state = store.getState()
    const isSearchMode = state.searchTerm.length > 0
    const result = state.matched[sectionId]
    const isPending = !result || result.searchTerm !== state.searchTerm
    const next = {
      searchTerm: state.searchTerm,
      isVisible: isSearchMode ? isPending || result.hasMatch : state.pageId === pageId,
    }
    if (
      snapshotCache.current &&
      snapshotCache.current.searchTerm === next.searchTerm &&
      snapshotCache.current.isVisible === next.isVisible
    ) return snapshotCache.current
    snapshotCache.current = next
    return next
  })

  useLayoutEffect(() => {
    if (!searchTerm) return
    const ranges = matchRanges(sectionRef.current, searchTerm)
    const hasKeywordMatch = matchText(keywords, searchTerm)
    const hasDescriptionMatch = matchText(description, searchTerm)
    const hasMatch = ranges.length > 0 || hasKeywordMatch || hasDescriptionMatch
    store.commit(sectionId, { ranges, hasMatch })
  }, [sectionId, searchTerm, keywords, description, store])

  return (
    <SectionContext.Provider value={sectionId}>
      {isVisible && (
        <section {...props} ref={sectionRef}>
          {children}
        </section>
      )}
    </SectionContext.Provider>
  )
}
