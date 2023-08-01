import * as React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import teal from '@material-ui/core/colors/teal';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';
import yellow from '@material-ui/core/colors/yellow';
// @ts-ignore
import { buildVariables } from 'ra-data-hasura';
import { fade } from '@material-ui/core/styles';
import introspectionResult from 'shared/dataProvider/instrospection';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import { Appraisals } from 'views/Appraisal/types';
import { Appraisals_Aggregate, Appraisal_Statuses } from 'shared/generated/types';

const APPRAISAL_STATUS_QUERY = gql`
  query($where: appraisals_bool_exp) {
    appraisals_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    appraisal_statuses {
      id
      status
      order
      appraisals_aggregate(where: $where) {
        aggregate {
          count
        }
      }
    }
  }
`;
type AppraisalStatusQueryResponse = {
  appraisal_statuses: Appraisal_Statuses[];
  appraisals_aggregate: Appraisals_Aggregate;
};

type StatusMap = {
  [key in string]: {
    name: AppraisalStatus;
    count: number;
    order: number;
  };
};

export enum AppraisalStatus {
  Quote = 'Quote',
  InProgress = 'In Progress',
  Submitted = 'Submitted',
  Completed = 'Completed',
  OnHold = 'On Hold',
  Canceled = 'Canceled',
  InReview = 'In Review',
  Revision = 'In Revision',
  All = 'All',
}

export enum BackGroundType {
  Cell,
  Tab,
}
export type GetBackgroundColor = (statusId: number, backgroundType: BackGroundType) => string;
export type GetColor = (statusId: string) => string;
const appraisalResource = introspectionResult.resources.find((e: any) => e.type.name === 'appraisals');
function useAppraisalRowStyle() {
  const location = useLocation();
  const qs = parse(location.search);
  const variables = buildVariables(null)(appraisalResource, 'GET_LIST', {
    filter: omit(JSON.parse(qs.filter || '{}'), 'appraisal_status_id'),
  });
  const response = useQuery<AppraisalStatusQueryResponse>(APPRAISAL_STATUS_QUERY, {
    variables: pick(variables, 'where'),
    fetchPolicy: 'network-only',
  });
  const { data, loading } = response;
  const statuses = data?.appraisal_statuses || [];
  const statusMap = React.useMemo(
    () =>
      statuses.reduce<StatusMap>(
        (acc, el) => ({
          ...acc,
          [`${el.id ?? ''}`]: {
            name: el.status as AppraisalStatus,
            count: el?.appraisals_aggregate?.aggregate?.count ?? 0,
            order: el.order ?? 0,
          },
        }),
        {
          '0': {
            name: AppraisalStatus.All,
            count: data?.appraisals_aggregate?.aggregate?.count ?? 0,
            order: 0,
          },
        },
      ),
    [statuses],
  );
  const getColor = (statusId: string) => getColorMapping(statusMap[statusId]?.name);
  const getBackgroundColor: GetBackgroundColor = (statusId, type = BackGroundType.Tab) =>
    getBackgroundColorMapping(statusMap[statusId]?.name, type);

  return [
    {
      statusMap,
      loading,
    },
    {
      rowStyle,
      getColor,
      getBackgroundColor,
    },
  ] as const;
  function rowStyle(record: Appraisals, index: number): any {
    const color = getBackgroundColor(record?.appraisal_status_id || 0, BackGroundType.Tab);
    if (!color) {
      return {};
    }
    return {
      borderLeftColor: color,
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
    };
  }
}

export function getColorMapping(status: AppraisalStatus): string {
  switch (status) {
    case AppraisalStatus.Quote:
      return orange[500];
    case AppraisalStatus.Canceled:
      return red[500];
    case AppraisalStatus.InProgress:
      return green[500];
    case AppraisalStatus.Submitted:
      return blue[500];
    case AppraisalStatus.InReview:
      return purple[500];
    case AppraisalStatus.Revision:
      return blue[500];
    case AppraisalStatus.Completed:
      return teal[500];
    case AppraisalStatus.OnHold:
      return '#d4af37';
    default:
      return '';
  }
}

export function getBackgroundColorMapping(status?: AppraisalStatus, type: BackGroundType = BackGroundType.Tab): string {
  switch (status) {
    case AppraisalStatus.Canceled:
    case AppraisalStatus.InProgress:
    case AppraisalStatus.Quote:
    case AppraisalStatus.Submitted:
    case AppraisalStatus.InReview:
    case AppraisalStatus.Revision:
      return type === BackGroundType.Cell ? fade(getColorMapping(status), 0.08) : getColorMapping(status);
    case AppraisalStatus.OnHold:
      return type === BackGroundType.Cell ? fade(yellow[500], 0.1) : getColorMapping(status);
    case AppraisalStatus.Completed:
      return type === BackGroundType.Cell ? '#e0f2f1' : teal[500];
    default:
      return fade(grey['A400'], 0.4);
  }
}

export default useAppraisalRowStyle;
