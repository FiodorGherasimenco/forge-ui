import React, { useRef, useSyncExternalStore } from 'react'
import { cn } from '@forge-ui/utils'
import { useSectionsStore } from '../store/SectionsContext'

export type TriggerProps = {
  pageId: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
  classNameActive?: string
  onClick?: () => void
}

export function Trigger({ pageId, children, className, classNameActive = 'text-blue-800 font-semibold', onClick, disabled }: TriggerProps) {
  const store = useSectionsStore()
  const snapshotCache = useRef<{ activePageId: string | undefined; searchTerm: string } | null>(null)
  const { activePageId, searchTerm } = useSyncExternalStore(store.subscribe, () => {
    const state = store.getState()
    const next = { activePageId: state.pageId, searchTerm: state.searchTerm }
    if (
      snapshotCache.current &&
      snapshotCache.current.activePageId === next.activePageId &&
      snapshotCache.current.searchTerm === next.searchTerm
    ) return snapshotCache.current
    snapshotCache.current = next
    return next
  })

  const handleClick = () => {
    store.setPageId(pageId)
    store.setSearchTerm('')
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'bg-transparent border-none outline-none shadow-none cursor-pointer w-full text-left px-3 py-2 rounded hover:bg-gray-100',
        className,
        !searchTerm && activePageId === pageId ? classNameActive : '',
      )}
    >
      {children}
    </button>
  )
}
