import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  inProgressLink,
  inspectionLink,
  starredLink,
  rushLink,
  dueSoonLink,
  pastDueLink,
  unscheduledLink,
  unpaidLink,
} from 'shared/constants/menu';
import {
  DueSoonIcon,
  InProgressIcon,
  InspectionIcon,
  PastDueIcon,
  RushIcon,
  Starred,
  UnpaidIcon,
  UnscheduledIcon,
} from 'shared/constants/icons';
import StatsCard from 'shared/components/StatsCard';
// @ts-ignore
import { buildVariables } from 'ra-data-hasura';
import gql from 'graphql-tag';
import introspectionResult from 'shared/dataProvider/instrospection';
import { useQuery } from '@apollo/client';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import { Appraisal_Aggregate } from 'shared/generated/types';
import startOfDay from 'date-fns/startOfDay';
import add from 'date-fns/add';
import pick from 'lodash/pick';

type AggregateResult = {
  result: Appraisal_Aggregate;
};
const query = gql`
  query DashboardQuery($where: appraisals_bool_exp) {
    result: appraisals_aggregate(where: $where) {
      aggregate {
        count(distinct: true)
      }
    }
  }
`;
const currentDate = startOfDay(new Date()).toISOString();
const dueLimit = add(new Date(), { days: 7 }).toISOString();
const appraisalResource = introspectionResult.resources.find((e) => e.type.name === 'appraisals');
function Overview() {
  const [queryString] = useLocationQuery();
  const inProgressVariables = useMemo(() => getVariables({ appraisal_status_id: 1 }), [queryString.filter]);
  const inProgressQuery = useQuery<AggregateResult>(query, {
    variables: inProgressVariables,
  });
  const dueSoonVariables = useMemo(
    () =>
      getVariables({
        due_date: {
          format: 'raw-query',
          value: {
            _gte: currentDate,
            _lte: dueLimit,
          },
        },
      }),
    [queryString.filter],
  );
  const dueSoonQuery = useQuery<AggregateResult>(query, {
    variables: dueSoonVariables,
  });
  const inspectionVariables = useMemo(
    () =>
      getVariables({
        inspection_date: {
          format: 'raw-query',
          value: {
            _gte: currentDate,
          },
        },
      }),
    [queryString.filter],
  );
  const upcomingInspectionsQuery = useQuery<AggregateResult>(query, {
    variables: inspectionVariables,
  });
  const rushVariables = useMemo(
    () =>
      getVariables({
        appraisal_priority_id: 2,
      }),
    [queryString.filter],
  );
  const rushQuery = useQuery<AggregateResult>(query, {
    variables: rushVariables,
  });
  const pastDueVariables = useMemo(
    () =>
      getVariables({
        due_date: {
          format: 'raw-query',
          value: { _lt: currentDate },
        },
        appraisal_status_id: 1,
      }),
    [queryString.filter],
  );
  const pastDueQuery = useQuery<AggregateResult>(query, {
    variables: pastDueVariables,
  });
  const unpaidVariables = useMemo(
    () =>
      getVariables({
        completed_date: {
          format: 'raw-query',
          value: { _lt: currentDate },
        },
        appraisal_status_id: 5,
      }),
    [queryString.filter],
  );
  const unpaidQuery = useQuery<AggregateResult>(query, {
    variables: unpaidVariables,
  });
  const starredVariables = useMemo(() => getVariables({ starred: true }), [queryString.filter]);
  const starredQuery = useQuery<AggregateResult>(query, {
    variables: starredVariables,
  });
  const unscheduledVariables = useMemo(
    () =>
      getVariables({
        appraisal_status_id: 1,
        inspection_date: {
          format: 'raw-query',
          value: { _is_null: true },
        },
      }),
    [queryString.filter],
  );
  const unScheduledQuery = useQuery<AggregateResult>(query, {
    variables: unscheduledVariables,
  });

  const appraisalOverview = [
    {
      label: 'In Progress',
      stats: `${inProgressQuery?.data?.result?.aggregate?.count ?? 0}`,
      icon: InProgressIcon,
      to: inProgressLink,
      loading: inProgressQuery.loading,
    },
    {
      label: 'Rush',
      stats: `${rushQuery?.data?.result?.aggregate?.count ?? 0}`,
      to: rushLink,
      icon: RushIcon,
      loading: rushQuery.loading,
    },
    {
      label: 'Due Soon',
      stats: `${dueSoonQuery?.data?.result?.aggregate?.count ?? 0}`,
      to: dueSoonLink,
      icon: DueSoonIcon,
      loading: dueSoonQuery.loading,
    },
    {
      label: 'Inspections',
      stats: `${upcomingInspectionsQuery?.data?.result?.aggregate?.count ?? 0}`,
      to: inspectionLink,
      icon: InspectionIcon,
      loading: upcomingInspectionsQuery.loading,
    },
    {
      label: 'Unscheduled',
      stats: `${unScheduledQuery?.data?.result?.aggregate?.count ?? 0}`,
      to: unscheduledLink,
      icon: UnscheduledIcon,
      loading: unScheduledQuery.loading,
    },
    {
      label: 'Past Due',
      stats: `${pastDueQuery?.data?.result?.aggregate?.count ?? 0}`,
      to: pastDueLink,
      icon: PastDueIcon,
      loading: pastDueQuery.loading,
    },
    {
      label: 'Unpaid',
      to: unpaidLink,
      icon: UnpaidIcon,
      stats: `${unpaidQuery?.data?.result?.aggregate?.count ?? 0}`,
      loading: unpaidQuery.loading,
    },
    {
      label: 'Starred',
      stats: `${starredQuery?.data?.result?.aggregate?.count ?? 0}`,
      to: starredLink,
      icon: Starred,
      loading: starredQuery.loading,
    },
  ];

  return (
    <Grid spacing={1} container>
      {appraisalOverview.map((overview) => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard {...overview} />
        </Grid>
      ))}
    </Grid>
  );

  function getVariables(extraFilter: object) {
    const result = buildVariables(null)(appraisalResource, 'GET_LIST', {
      filter: {
        ...JSON.parse(queryString.filter || '{}'),
        ...extraFilter,
      },
    });
    return pick(result, 'where');
  }
}

export default Overview;
