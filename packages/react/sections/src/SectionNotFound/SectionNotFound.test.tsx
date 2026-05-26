import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Sections } from '../Sections/Sections'
import { Section } from '../Section/Section'
import { Search } from '../Search/Search'
import { SectionNotFound } from '../SectionNotFound/SectionNotFound'

describe('SectionNotFound', () => {
  it('should not render when there is no search term', () => {
    render(
      <Sections defaultPageId="p1">
        <Section pageId="p1" sectionId="s1" keywords="alpha">content</Section>
        <SectionNotFound>no results</SectionNotFound>
      </Sections>,
    )
    expect(screen.queryByText('no results')).not.toBeInTheDocument()
  })

  it('should not render when search term matches at least one section', async () => {
    render(
      <Sections defaultPageId="p1">
        <Search />
        <Section pageId="p1" sectionId="s1" keywords="alpha">content</Section>
        <SectionNotFound>no results</SectionNotFound>
      </Sections>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'alpha' } })
    await waitFor(() => {
      expect(screen.queryByText('no results')).not.toBeInTheDocument()
    })
  })

  it('should render when search term matches no sections', async () => {
    render(
      <Sections defaultPageId="p1">
        <Search />
        <Section pageId="p1" sectionId="s1" keywords="alpha">content</Section>
        <SectionNotFound>no results</SectionNotFound>
      </Sections>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'zzz' } })
    await waitFor(() => {
      expect(screen.getByText('no results')).toBeInTheDocument()
    })
  })

  it('should hide again when search term is cleared', async () => {
    render(
      <Sections defaultPageId="p1">
        <Search />
        <Section pageId="p1" sectionId="s1" keywords="alpha">content</Section>
        <SectionNotFound>no results</SectionNotFound>
      </Sections>,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'zzz' } })
    await waitFor(() => { expect(screen.getByText('no results')).toBeInTheDocument() })
    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: '' } })
    await waitFor(() => { expect(screen.queryByText('no results')).not.toBeInTheDocument() })
  })
})
