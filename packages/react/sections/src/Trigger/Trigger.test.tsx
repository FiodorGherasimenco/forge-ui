import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createSectionsStore } from '../store/store'
import { SectionsStoreContext } from '../store/SectionsContext'
import { Search } from '../Search/Search'
import { Trigger } from '../Trigger/Trigger'

describe('Trigger', () => {
  it('should switch active tab and clear search term on click', () => {
    const store = createSectionsStore({ pageId: 'old', searchTerm: 'needle' })
    render(
      <SectionsStoreContext.Provider value={store}>
        <Trigger pageId="old">Old tab</Trigger>
        <Trigger pageId="new">New tab</Trigger>
      </SectionsStoreContext.Provider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'New tab' }))
    expect(store.getState().pageId).toBe('new')
    expect(store.getState().searchTerm).toBe('')
  })

  it('should run optional onClick after navigating', async () => {
    const store = createSectionsStore({})
    const Harness = () => {
      const [done, setDone] = React.useState(false)
      return (
        <SectionsStoreContext.Provider value={store}>
          <Search />
          <Trigger pageId="tab" onClick={() => setDone(true)}>Tab</Trigger>
          {done ? <span data-testid="ran">yes</span> : null}
        </SectionsStoreContext.Provider>
      )
    }
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Tab' }))
    expect(screen.getByTestId('ran')).toHaveTextContent('yes')
  })

  it('should mark the active page when there is no search term', () => {
    const store = createSectionsStore({ pageId: 'a' })
    render(
      <SectionsStoreContext.Provider value={store}>
        <Trigger pageId="a">A</Trigger>
      </SectionsStoreContext.Provider>,
    )
    expect(screen.getByRole('button').className).toContain('text-blue-800')
  })

  it('should not apply active styling when another page is active', () => {
    const store = createSectionsStore({ pageId: 'a' })
    render(
      <SectionsStoreContext.Provider value={store}>
        <Trigger pageId="b">B</Trigger>
      </SectionsStoreContext.Provider>,
    )
    expect(screen.getByRole('button').className).not.toContain('text-blue-800')
  })

  it('should not apply active styling while a search term is set', () => {
    const store = createSectionsStore({ pageId: 'a', searchTerm: 'q' })
    render(
      <SectionsStoreContext.Provider value={store}>
        <Trigger pageId="a">A</Trigger>
      </SectionsStoreContext.Provider>,
    )
    expect(screen.getByRole('button').className).not.toContain('text-blue-800')
  })

  it('should respect the disabled attribute', () => {
    const store = createSectionsStore({})
    render(
      <SectionsStoreContext.Provider value={store}>
        <Trigger pageId="p" disabled>P</Trigger>
      </SectionsStoreContext.Provider>,
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
