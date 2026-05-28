import React, { useRef, useSyncExternalStore, useEffect } from 'react'
import { cn } from '@forge-ui/utils'
import { useSectionsStore, SectionContext } from '../store/SectionsContext'
import { matchRanges, matchText } from '../utils'

export type SectionProps = React.ComponentProps<'section'> & {
  pageId: string
  sectionId: string
  keywords?: string
  description?: string
}

export function Section({ pageId, sectionId, description, keywords, children, className, ...props }: SectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cacheRef = useRef<{ visible: boolean, loading: boolean } | null>(null);
  const store = useSectionsStore()

  const { visible, loading } = useSyncExternalStore(store.subscribe, () => {
    const state = store.getState()
    const next = {
      loading: false,
      visible: state.pageId === pageId
    }
    if (state.searchTerm.trim().length > 0) {
      next.visible = state.visible.includes(sectionId);
      next.loading = state.loading;
    }

    if (cacheRef.current?.visible !== next.visible || cacheRef.current?.loading !== next.loading) {
      cacheRef.current = next;
    }

    return cacheRef.current;
  })

  useEffect(() => {
    store.register(sectionId, {
      searchContent: (query) => {
        const matchedRanges = matchRanges(sectionRef.current, query)
        const matchedKeywords = matchText(keywords, query)
        const matchedDescription = matchText(description, query)

        return {
          ranges: matchedRanges,
          keywords: matchedKeywords,
          description: matchedDescription
        }
      }
    })

    return () => {
      store.unregister(sectionId)
    }
  }, [sectionId, keywords, description, store]);

  return (
    <SectionContext.Provider value={sectionId}>
      {(visible || loading) && (
        <section {...props} ref={sectionRef} className={cn({
          'hidden': loading && !visible
        }, className)}>
          {children}
        </section>
      )}
    </SectionContext.Provider>
  )
}
