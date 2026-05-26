import React, { useState, useLayoutEffect, useSyncExternalStore } from 'react'
import { cn } from '@forge-ui/utils'
import { useSectionsStore } from '../store/SectionsContext'
import { useDebounce } from '../hooks/useDebounce'
import { SEARCH_DEBOUNCE_MS } from '../constants'

export type SearchProps = {
  className?: string
  placeholder?: string
}

export function Search({ className, placeholder = 'Search...' }: SearchProps) {
  const [value, setValue] = useState('')
  const store = useSectionsStore()
  const searchTerm = useSyncExternalStore(store.subscribe, () => store.getState().searchTerm)
  const debouncedValue = useDebounce(value, SEARCH_DEBOUNCE_MS)

  useLayoutEffect(() => {
    if (!value.trim()) {
      store.setSearchTerm('')
      return
    }
    if (!debouncedValue.trim()) return
    store.setSearchTerm(debouncedValue.trim())
  }, [value, debouncedValue, store])

  useLayoutEffect(() => {
    setValue((current) => (!searchTerm && current ? '' : current))
  }, [searchTerm])

  return (
    <div className={cn('relative flex items-center', className)}>
      <span className="absolute left-3 text-gray-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setValue('')}
          className="absolute right-2 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
