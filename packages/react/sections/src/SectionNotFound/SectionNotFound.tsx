import React, { useSyncExternalStore, useRef } from 'react'
import { useSectionsStore } from '../store/SectionsContext'

export function SectionNotFound({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  const queryRef = useRef<string | null>(null);
  const store = useSectionsStore()
  const isVisible = useSyncExternalStore(store.subscribe, () => {
    const state = store.getState();
    const query = state.searchTerm.trim();

    if ((queryRef.current !== query || !state.loading) && query.length > 0 && state.visible.length < 1) {
      queryRef.current = query;
      return true
    }

    return false
  })

  return isVisible ? <div className={className}>{children}</div> : null
}
