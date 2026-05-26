import { IGNORED_ELEMENTS, SKIP_SEARCH_DATA_ATTRIBUTE } from './constants'

function shouldSkipElement(element: Element | null | undefined): boolean {
  return (
    element?.nodeType === Node.ELEMENT_NODE &&
    (IGNORED_ELEMENTS.has(element.nodeName) ||
      element.hasAttribute(SKIP_SEARCH_DATA_ATTRIBUTE) ||
      element.hasAttribute('hidden') ||
      (element instanceof HTMLElement && element.style.display === 'none'))
  )
}

function appendRangesFromDomNode(node: Node, needleLowercase: string, needleLength: number, ranges: Range[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const raw = node.nodeValue ?? ''
    if (raw.trim().length === 0) return
    const haystack = raw.toLowerCase()
    let fromIndex = 0
    let matchIndex = haystack.indexOf(needleLowercase, fromIndex)
    while (matchIndex !== -1) {
      const range = document.createRange()
      range.setStart(node, matchIndex)
      range.setEnd(node, matchIndex + needleLength)
      ranges.push(range)
      fromIndex = matchIndex + needleLength
      matchIndex = haystack.indexOf(needleLowercase, fromIndex)
    }
    return
  }
  if (node.nodeType === Node.ELEMENT_NODE && shouldSkipElement(node as Element)) return
  const children = node.childNodes
  for (let i = 0; i < children.length; i++) {
    appendRangesFromDomNode(children[i], needleLowercase, needleLength, ranges)
  }
}

export function matchRanges(root: Node | null | undefined, query: string): Range[] {
  if (!root || !query) return []
  if (root.nodeType === Node.ELEMENT_NODE && shouldSkipElement(root as Element)) return []
  const ranges: Range[] = []
  appendRangesFromDomNode(root, query.toLowerCase(), query.length, ranges)
  return ranges
}

export function matchText(texts: string | readonly string[] | undefined, query: string): boolean {
  if (!query || texts === undefined) return false
  const q = query.toLowerCase()
  if (typeof texts === 'string') return texts.toLowerCase().includes(q)
  return texts.some((t) => t.toLowerCase().includes(q))
}

function readHighlightRegistry(): HighlightRegistry | undefined {
  const css = Reflect.get(globalThis, 'CSS') as { highlights?: HighlightRegistry } | undefined
  return css?.highlights
}

function readHighlightConstructor(): (new (...ranges: Range[]) => Highlight) | undefined {
  const Ctor = Reflect.get(globalThis, 'Highlight')
  if (typeof Ctor !== 'function') return undefined
  return Ctor as new (...ranges: Range[]) => Highlight
}

export function clearHighlight(highlightName: string): void {
  readHighlightRegistry()?.delete(highlightName)
}

export function setHighlight(highlightName: string, ranges: Range[]): void {
  const registry = readHighlightRegistry()
  const HighlightCtor = readHighlightConstructor()
  if (!registry || !HighlightCtor || ranges.length === 0) {
    clearHighlight(highlightName)
    return
  }
  const highlight = new HighlightCtor(...ranges)
  registry.set(highlightName, highlight)
}

function elementFromRangeStart(range: Range): Element | null {
  const node = range.startContainer
  if (node.nodeType === Node.TEXT_NODE) return node.parentElement
  return node instanceof Element ? node : null
}

export function scrollFirstMatchIntoView(ranges: readonly Range[]): void {
  const firstRange = ranges[0]
  if (!firstRange?.commonAncestorContainer.isConnected) return
  const element = elementFromRangeStart(firstRange)
  if (!element) return
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  element.scrollIntoView({ behavior, block: 'end' })
}
