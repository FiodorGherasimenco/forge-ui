import React, { useSyncExternalStore, useEffect, useState } from 'react'
import { createSectionsStore, SearchContentResult } from '../store/store'
import { SectionsStoreContext } from '../store/SectionsContext'
import { setHighlight, scrollFirstMatchIntoView, clearHighlight } from '../utils'
import { SEARCH_PARAM_KEY } from '../constants'

export type SectionsProps = React.ComponentProps<'div'> & {
  searchParamKey?: string
  defaultPageId?: string
}

export function Sections({ defaultPageId, children, className, searchParamKey = SEARCH_PARAM_KEY, ...props }: SectionsProps) {
  const [store] = useState(() => createSectionsStore({
    pageId: defaultPageId,
    searchTerm: typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get(searchParamKey) || ''
      : '',
  }));
  const searchTerm = useSyncExternalStore(store.subscribe, () => store.getState().searchTerm);

  const highlightName = `${searchParamKey}-highlight`;

  useEffect(() => {
    clearHighlight(highlightName);

    if (!searchTerm) {
      // reset hightlight
      return;
    }

    const promises = store.getSections()
      .map(([sectionId, { searchContent }]) =>
        Promise.resolve()
          .then(() => searchContent(searchTerm))
          .then((result) => ({ sectionId, ...result }))
      );

    Promise.allSettled(promises)
      .then((results) =>
        results
          .filter((result): result is PromiseFulfilledResult<SearchContentResult & { sectionId: string }> => {
            if (result.status !== 'fulfilled') {
              return false
            }

            const { ranges, keywords, description } = result.value;

            return ranges.length > 0 || keywords.length > 0 || description.length > 0;
          })
          .map((result) => result.value)
      ).then((matches) => {
        const ranges = matches.map((match) => match.ranges).flat();
        const sectionIds = matches.map((match) => match.sectionId);

        if (ranges.length > 0) {
          setHighlight(highlightName, ranges)
          scrollFirstMatchIntoView(ranges)
        }

        store.setVisibility(sectionIds);
      })
  }, [store, searchTerm]);

  return (
    <SectionsStoreContext.Provider value={store}>
      <style>{`::highlight(${highlightName}) { background-color: #fef08a; }`}</style>
      <div {...props} className={className}>
        {children}
      </div>
    </SectionsStoreContext.Provider>
  )
}
