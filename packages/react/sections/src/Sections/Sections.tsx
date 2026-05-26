import React, { useRef, useLayoutEffect, useSyncExternalStore } from 'react'
import { cn } from '@forge-ui/utils'
import { createSectionsStore } from '../store/store'
import { SectionsStoreContext } from '../store/SectionsContext'
import { setHighlight, scrollFirstMatchIntoView } from '../utils'
import { SEARCH_PARAM_KEY } from '../constants'

export type SectionsProps = React.ComponentProps<'div'> & {
  searchParamKey?: string
  defaultPageId?: string
}

export function Sections({ defaultPageId, children, className, searchParamKey = SEARCH_PARAM_KEY, ...props }: SectionsProps) {
  const storeRef = useRef<ReturnType<typeof createSectionsStore> | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createSectionsStore({
      pageId: defaultPageId,
      searchTerm: typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get(searchParamKey) || ''
        : '',
    })
  }
  const store = storeRef.current
  const highlightName = `${searchParamKey}-highlight`
  const rangesCache = useRef<Range[]>([])

  const ranges = useSyncExternalStore(store.subscribe, () => {
    const state = store.getState()
    if (!state.searchTerm) {
      if (rangesCache.current.length === 0) return rangesCache.current
      rangesCache.current = []
      return rangesCache.current
    }
    const next = Object.values(state.matched).flatMap((match) =>
      match?.searchTerm === state.searchTerm ? match.ranges : []
    )
    const prev = rangesCache.current
    if (prev.length === next.length && next.every((r, i) => r === prev[i])) return prev
    rangesCache.current = next
    return next
  })

  useLayoutEffect(() => {
    setHighlight(highlightName, ranges)
    scrollFirstMatchIntoView(ranges)
  }, [ranges, highlightName])

  return (
    <SectionsStoreContext.Provider value={store}>
      <style>{`::highlight(${highlightName}) { background-color: #fef08a; }`}</style>
      <div {...props} className={cn('flex gap-6', className)}>
        {children}
      </div>
    </SectionsStoreContext.Provider>
  )
}
