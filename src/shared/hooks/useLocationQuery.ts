import { useHistory, useLocation } from 'react-router-dom';
import { parse as parseQueryString, stringify } from 'query-string';

export default function useLocationQuery() {
  const location = useLocation();
  const history = useHistory();
  const query = parseQueryString(location.search);
  const handleChangeParams = (data: object) => {
    history.push({
      search: `?${stringify({
        ...query,
        ...data,
      })}`,
    });
  };
  return [query, handleChangeParams] as const;
}
