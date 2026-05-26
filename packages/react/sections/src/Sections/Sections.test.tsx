import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SEARCH_PARAM_KEY } from '../constants'
import { Sections } from '../Sections/Sections'
import { Section } from '../Section/Section'
import { Search } from '../Search/Search'

describe('Sections', () => {
  let originalCss: typeof globalThis.CSS | undefined
  let originalHighlight: unknown
  let originalScrollIntoView: typeof HTMLElement.prototype.scrollIntoView | undefined

  beforeEach(() => {
    originalCss = globalThis.CSS
    originalHighlight = Reflect.get(globalThis, 'Highlight')
    originalScrollIntoView = HTMLElement.prototype.scrollIntoView

    const registry = { delete: () => {}, set: () => {} }
    class StubHighlight {
      readonly ranges: Range[]
      constructor(...ranges: Range[]) { this.ranges = ranges }
    }

    globalThis.CSS = { highlights: registry } as unknown as typeof CSS
    Reflect.set(globalThis, 'Highlight', StubHighlight)
    HTMLElement.prototype.scrollIntoView = function stubScroll() {}
  })

  afterEach(() => {
    const highlightName = `${SEARCH_PARAM_KEY}-highlight`
    globalThis.CSS?.highlights?.delete(highlightName)

    if (originalCss === undefined) Reflect.deleteProperty(globalThis, 'CSS')
    else globalThis.CSS = originalCss

    if (originalHighlight === undefined) Reflect.deleteProperty(globalThis, 'Highlight')
    else Reflect.set(globalThis, 'Highlight', originalHighlight)

    if (originalScrollIntoView) HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  })

  it('should inject highlight styles for the search param key', () => {
    render(<Sections><span>child</span></Sections>)

    const highlightStyle = Array.from(document.querySelectorAll('style')).find(
      (el) => el.textContent?.includes(`::highlight(${SEARCH_PARAM_KEY}-highlight)`),
    )
    expect(highlightStyle).toBeTruthy()
  })

  it('should leave matching section content on screen after debounced search', async () => {
    render(
      <Sections defaultPageId="page-1">
        <Search />
        <Section pageId="page-1" sectionId="sec-1">unique-highlight-token</Section>
      </Sections>,
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: 'unique-highlight-token' },
    })

    await waitFor(() => {
      expect(screen.getByText('unique-highlight-token')).toBeInTheDocument()
    })
  })

  it('should honor defaultPageId for which section is visible while idle', () => {
    render(
      <Sections defaultPageId="shared">
        <Section pageId="shared" sectionId="main">default-panel</Section>
      </Sections>,
    )
    expect(screen.getByText('default-panel')).toBeInTheDocument()
  })
})
