import { createContext } from 'react';
import { AppraisalTimeFilterResponse } from './types';
import { QueryResult } from '@apollo/client';

const appContext: { timeFilter: QueryResult<AppraisalTimeFilterResponse, Record<string, any>> | null } = {
  timeFilter: null,
};
const AppContext = createContext(appContext);
export default AppContext;
