import React, { useSyncExternalStore } from 'react'
import { useSectionsStore } from '../store/SectionsContext'

export function SectionNotFound({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  const store = useSectionsStore()
  const isVisible = useSyncExternalStore(store.subscribe, () => {
    const state = store.getState()
    return (
      state.searchTerm.length > 0 &&
      Object.values(state.matched).every(
        (match) => match?.searchTerm === state.searchTerm && !match.hasMatch,
      )
    )
  })

  return isVisible ? <div className={className}>{children}</div> : null
}
