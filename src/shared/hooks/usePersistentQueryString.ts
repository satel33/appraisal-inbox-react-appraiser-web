import { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { parse as parseQueryString, stringify } from 'query-string';
import createPersistedState from 'use-persisted-state';
import merge from 'lodash/merge';

type Props = {
  onChangeFilter?: (arg: any) => any;
};
const noOp = (arg: any) => arg;
export default function usePersistentQueryString(props: Props) {
  const { onChangeFilter = noOp } = props;
  const location = useLocation();
  const history = useHistory();
  const usePersistedState = useMemo(() => createPersistedState(location.pathname), []);
  const query = parseQueryString(location.search);
  const [state, setState] = usePersistedState<string>();
  useEffect(() => {
    const data = parseQueryString(state || '');
    const persistedFilter = data.filter || '{}';
    const currentFilter = query?.filter ?? '{}';
    let filter = JSON.parse(currentFilter);
    if (!query.override) {
      filter = Object.entries(merge(JSON.parse(persistedFilter), filter)).reduce((acc, el) => {
        const [key, value] = el;
        // remove search value
        if (key.includes(',')) {
          return acc;
        }
        return {
          ...acc,
          [key]: value,
        };
      }, {});
    }
    history.replace({
      search: `?${stringify({
        ...data,
        ...query,
        filter: JSON.stringify(onChangeFilter(filter)),
      })}`,
    });
  }, []);
  useEffect(() => {
    setState(location.search);
  }, [location.search]);
  return [state] as const;
}
