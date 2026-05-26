import { createContext, useContext } from 'react'
import type { SectionsStore } from './store'

export const SectionsStoreContext = createContext<SectionsStore | null>(null)

export function useSectionsStore(): SectionsStore {
  const ctx = useContext(SectionsStoreContext)
  if (!ctx) throw new Error('useSectionsStore must be used within <Sections>')
  return ctx
}

export const SectionContext = createContext<string | null>(null)

export function useSectionId(): string {
  const ctx = useContext(SectionContext)
  if (!ctx) throw new Error('useSectionId must be used within <Section>')
  return ctx
}
