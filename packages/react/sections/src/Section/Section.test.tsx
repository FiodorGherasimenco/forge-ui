import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { createSectionsStore } from '../store/store'
import { SectionsStoreContext } from '../store/SectionsContext'
import { Section } from '../Section/Section'
import { useSectionId } from '../store/SectionsContext'

describe('Section', () => {
  const renderWithStore = (store: ReturnType<typeof createSectionsStore>, ui: React.ReactElement) =>
    render(<SectionsStoreContext.Provider value={store}>{ui}</SectionsStoreContext.Provider>)

  it('should render when idle and pageId matches active page', () => {
    const store = createSectionsStore({ pageId: 'p1' })
    renderWithStore(store, <Section pageId="p1" sectionId="s1">content</Section>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('should not render when idle and pageId does not match', () => {
    const store = createSectionsStore({ pageId: 'p2' })
    renderWithStore(store, <Section pageId="p1" sectionId="s1">hidden</Section>)
    expect(screen.queryByText('hidden')).not.toBeInTheDocument()
  })

  it('should show section when search term matches its keywords', () => {
    const store = createSectionsStore({ pageId: 'p1' })
    renderWithStore(store, <Section pageId="p1" sectionId="sec-kw" keywords="keyword kw">body</Section>)
    act(() => { store.setSearchTerm('kw') })
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('should hide non-matching section when search is active', () => {
    const store = createSectionsStore({ pageId: 'p1' })
    renderWithStore(store,
      <>
        <Section pageId="p1" sectionId="a" keywords="alpha">only-a</Section>
        <Section pageId="p1" sectionId="b" keywords="beta">only-b</Section>
      </>,
    )
    act(() => { store.setSearchTerm('alpha') })
    expect(screen.getByText('only-a')).toBeInTheDocument()
    expect(screen.queryByText('only-b')).not.toBeInTheDocument()
  })

  it('should show sections across pages when search matches both', () => {
    const store = createSectionsStore({ pageId: 'p1' })
    renderWithStore(store,
      <>
        <Section pageId="p1" sectionId="s1" keywords="alpha">page-one</Section>
        <Section pageId="p2" sectionId="s2" keywords="alpha">page-two</Section>
      </>,
    )
    act(() => { store.setSearchTerm('alpha') })
    expect(screen.getByText('page-one')).toBeInTheDocument()
    expect(screen.getByText('page-two')).toBeInTheDocument()
  })

  it('should expose sectionId through SectionContext for descendants', () => {
    const store = createSectionsStore({ pageId: 'p1' })
    const Consumer = () => {
      const id = useSectionId()
      return <span data-testid="sid">{id}</span>
    }
    renderWithStore(store,
      <Section pageId="p1" sectionId="ctx-section"><Consumer /></Section>,
    )
    expect(screen.getByTestId('sid')).toHaveTextContent('ctx-section')
  })
})
