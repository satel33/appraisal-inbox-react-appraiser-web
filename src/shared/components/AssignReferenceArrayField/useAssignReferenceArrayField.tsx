import { useCallback, useEffect, useRef } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import {
  usePaginationState,
  useSelectionState,
  useSortState,
  useNotify,
  useSafeSetState,
  removeEmpty,
  Record,
  useGetList,
  ListControllerProps,
} from 'ra-core';

interface Option {
  basePath: string;
  filter?: any;
  page?: number;
  perPage?: number;
  record?: Record;
  reference: string;
  resource: string;
  sort?: any;
  source: string;
  type?: 'assign' | 'assigned';
  target?: string;
}

const defaultFilter = {};
const defaultSort = { field: 'id', order: 'asc' };

const useReferenceArrayFieldController = ({
  basePath,
  filter = defaultFilter,
  page: initialPage = 1,
  perPage: initialPerPage = 1000,
  record,
  reference,
  resource,
  sort: initialSort = defaultSort,
  source,
  type = 'assign',
  target = 'id',
}: Option): ListControllerProps => {
  const notify = useNotify();
  let ids = get(record, source);
  if (!ids) {
    ids = [];
  } else if (!Array.isArray(ids)) {
    ids = [ids];
  }
  // pagination logic
  const { page, setPage, perPage, setPerPage } = usePaginationState({
    page: initialPage,
    perPage: initialPerPage,
  });
  // sort logic
  const { sort, setSort: setSortObject } = useSortState(initialSort);
  const setSort = useCallback(
    (field: string, order = 'ASC') => {
      setSortObject({ field, order });
      setPage(1);
    },
    [setPage, setSortObject],
  );
  let filterKey = type === 'assign' ? '_nin' : '_in';
  if (target !== 'id') {
    filterKey = '_has_keys_any';
  }
  const { data, error, loading, loaded, total } = useGetList(
    reference,
    {
      page,
      perPage,
    },
    sort,
    {
      [target]: {
        format: 'raw-query',
        value: {
          [filterKey]: ids,
        },
      },
      ...filter,
    },
    {
      onFailure: (error: any) =>
        notify(typeof error === 'string' ? error : error.message || 'ra.notification.http_error', 'warning'),
    },
  );
  // selection logic
  const { selectedIds, onSelect, onToggleItem, onUnselectItems } = useSelectionState();

  // filter logic
  const filterRef = useRef(filter);
  const [displayedFilters, setDisplayedFilters] = useSafeSetState<{
    [key: string]: boolean;
  }>({});
  const [filterValues, setFilterValues] = useSafeSetState<{
    [key: string]: any;
  }>(filter);
  const hideFilter = useCallback(
    (filterName: string) => {
      setDisplayedFilters((previousState) => {
        const { [filterName]: _, ...newState } = previousState;
        return newState;
      });
      setFilterValues((previousState) => {
        const { [filterName]: _, ...newState } = previousState;
        return newState;
      });
    },
    [setDisplayedFilters, setFilterValues],
  );
  const showFilter = useCallback(
    (filterName: string, defaultValue: any) => {
      setDisplayedFilters((previousState) => ({
        ...previousState,
        [filterName]: true,
      }));
      setFilterValues((previousState) => ({
        ...previousState,
        [filterName]: defaultValue,
      }));
    },
    [setDisplayedFilters, setFilterValues],
  );
  const setFilters = useCallback(
    (filters, displayedFilters) => {
      setFilterValues(removeEmpty(filters));
      setDisplayedFilters(displayedFilters);
      setPage(1);
    },
    [setDisplayedFilters, setFilterValues, setPage],
  );
  // handle filter prop change
  useEffect(() => {
    if (!isEqual(filter, filterRef.current)) {
      filterRef.current = filter;
      setFilterValues(filter);
    }
  });

  return {
    basePath: basePath.replace(resource, reference),
    currentSort: sort,
    data: data as any,
    // defaultTitle: null,
    error,
    displayedFilters,
    filterValues,
    hasCreate: false,
    hideFilter,
    ids: Object.keys(data || {}),
    loaded,
    loading,
    onSelect,
    onToggleItem,
    onUnselectItems,
    page,
    perPage,
    resource,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSort,
    showFilter,
    total: total as number,
  };
};

export default useReferenceArrayFieldController;
