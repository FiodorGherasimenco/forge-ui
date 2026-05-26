import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'
import { SEARCH_DEBOUNCE_MS } from '../constants'
import { createSectionsStore } from '../store/store'
import { SectionsStoreContext } from '../store/SectionsContext'
import { Search } from '../Search/Search'

describe('Search', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  const renderSearch = (store: ReturnType<typeof createSectionsStore>) =>
    render(<SectionsStoreContext.Provider value={store}><Search /></SectionsStoreContext.Provider>)

  it('should push debounced input into the store as the search term', () => {
    const store = createSectionsStore({})
    renderSearch(store)
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: '  trimmed  ' } })
    act(() => { vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS) })
    expect(store.getState().searchTerm).toBe('trimmed')
  })

  it('should clear the store when the input is emptied', () => {
    const store = createSectionsStore({ searchTerm: 'previous' })
    renderSearch(store)
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: '' } })
    act(() => { vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS) })
    expect(store.getState().searchTerm).toBe('')
  })

  it('should clear the input when the store search term is reset externally', () => {
    const store = createSectionsStore({})
    renderSearch(store)
    const input = screen.getByRole('textbox', { name: 'Search' })
    fireEvent.change(input, { target: { value: 'typed' } })
    act(() => { vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS) })
    act(() => { store.setSearchTerm('') })
    expect(input).toHaveValue('')
  })

  it('should allow typing after external reset clears the input', () => {
    const store = createSectionsStore({})
    renderSearch(store)
    const input = screen.getByRole('textbox', { name: 'Search' })
    fireEvent.change(input, { target: { value: 'first' } })
    act(() => { vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS) })
    act(() => { store.setSearchTerm('') })
    fireEvent.change(input, { target: { value: 'second' } })
    act(() => { vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS) })
    expect(store.getState().searchTerm).toBe('second')
  })

  it('should show a clear control after the user types', () => {
    const store = createSectionsStore({})
    renderSearch(store)
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'typed' } })
    expect(screen.getAllByLabelText('Clear search').length).toBeGreaterThan(0)
  })
})
