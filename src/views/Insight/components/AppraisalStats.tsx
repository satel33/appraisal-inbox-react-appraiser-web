import React from 'react';
import Grid from '@material-ui/core/Grid';
import StatsCard from 'shared/components/StatsCard';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import introspectionResult from 'shared/dataProvider/instrospection';
// @ts-ignore
import { buildVariables } from 'ra-data-hasura';
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Assignment from '@material-ui/icons/Assignment';
import RotateRight from '@material-ui/icons/RotateRight';
import Schedule from '@material-ui/icons/Schedule';
import Gavel from '@material-ui/icons/Gavel';
import { useQuery } from '@apollo/client';
import { formatCurrency } from 'shared/utils';
import {
  StatsResponse,
  InsightsResponse,
  APPRAISAL_STAT_QUERY,
  INSIGHTS_QUERY,
  AVERAGE_FEE_QUERY,
  AVERAGE_QUOTE_QUERY,
  REVENUE_QUERY,
  APPRAISAL_TOTAL_QUERY,
} from '../query';
import { ErrorOutline, MoneyOff } from '@material-ui/icons';

const appraisalResource = introspectionResult.resources.find((e: any) => e.type.name === 'appraisals');
function AppraisalStats() {
  const [queryString] = useLocationQuery();
  const statsVariables = buildVariables(null)(appraisalResource, 'GET_LIST', {
    filter: {
      ...JSON.parse(queryString.filter || '{}'),
      appraisal_status_id: 5,
    },
  });
  const totalAppraisalVariables = buildVariables(null)(appraisalResource, 'GET_LIST', {
    filter: JSON.parse(queryString.filter || '{}'),
  });
  const totalAppraisalResponse = useQuery<StatsResponse>(APPRAISAL_TOTAL_QUERY, {
    variables: {
      where: totalAppraisalVariables.where,
    },
    fetchPolicy: 'cache-and-network',
  });
  const unpaidAppraisalResponse = useQuery<StatsResponse>(APPRAISAL_TOTAL_QUERY, {
    variables: {
      where: {
        ...totalAppraisalVariables.where,
        appraisal_status_id: { _eq: 5 },
        paid_date: {
          _is_null: true,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const appraisalResponse = useQuery<StatsResponse>(APPRAISAL_STAT_QUERY, {
    variables: {
      where: statsVariables.where,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { data: appraisals } = appraisalResponse;
  const insightsResponse = useQuery<InsightsResponse>(INSIGHTS_QUERY, {
    skip: !appraisals,
    variables: {
      ids: appraisals?.stats?.nodes?.map((e) => e.id) ?? [],
    },
    fetchPolicy: 'cache-and-network',
  });
  const revenueResponse = useQuery<StatsResponse>(REVENUE_QUERY, {
    variables: {
      where: statsVariables.where,
    },
    fetchPolicy: 'cache-and-network',
  });
  const unpaidRevenueResponse = useQuery<StatsResponse>(REVENUE_QUERY, {
    variables: {
      where: {
        ...statsVariables.where,
        paid_date: {
          _is_null: true,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const feeResponse = useQuery<StatsResponse>(AVERAGE_FEE_QUERY, {
    variables: {
      where: {
        ...statsVariables.where,
        report_fee: {
          _gt: 0,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const quoteResponse = useQuery<StatsResponse>(AVERAGE_QUOTE_QUERY, {
    variables: {
      where: {
        ...statsVariables.where,
        quote_fee: {
          _gt: 0,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
  });
  const { data: quoteStats } = quoteResponse;
  const { data: feeStats } = feeResponse;
  const { data: insights } = insightsResponse;
  const { data: revenue } = revenueResponse;
  const { data: totalAppraisal } = totalAppraisalResponse;
  const { data: unpaidAppraisal } = unpaidAppraisalResponse;
  const { data: unpaidRevenue } = unpaidRevenueResponse;
  const loading =
    appraisalResponse.loading ||
    insightsResponse.loading ||
    feeResponse.loading ||
    quoteResponse.loading ||
    revenueResponse.loading ||
    unpaidRevenueResponse.loading ||
    totalAppraisalResponse.loading ||
    unpaidAppraisalResponse.loading;
  const appraisalStats = [
    {
      label: 'Total Appraisals',
      stats: `${totalAppraisal?.stats?.aggregate?.count ?? 0}`,
      icon: Assignment,
    },
    {
      label: 'Total Revenue',
      stats: `${formatCurrency(revenue?.stats?.aggregate?.sum?.report_fee ?? 0)}`,
      icon: AccountBalanceWallet,
    },
    {
      label: 'Average Fee',
      stats: `${formatCurrency(feeStats?.stats?.aggregate?.avg?.report_fee ?? 0)}`,
      icon: AttachMoney,
    },
    {
      label: 'Average Turn Around',
      stats: `${Number(insights?.stats?.aggregate?.avg?.average_turn_around ?? 0).toFixed(2)} Days`,
      icon: RotateRight,
    },
    {
      label: 'Average Time To Pay',
      stats: `${Number(insights?.stats?.aggregate?.avg?.average_time_to_pay ?? 0).toFixed(2)} Days`,
      icon: Schedule,
    },
    {
      label: 'Average Quote Fee',
      stats: `${formatCurrency(quoteStats?.stats?.aggregate?.avg?.quote_fee ?? 0)}`,
      icon: Gavel,
    },
    {
      label: 'Unpaid Appraisals',
      stats: `${unpaidAppraisal?.stats?.aggregate?.count ?? 0}`,
      icon: ErrorOutline,
    },
    {
      label: 'Total Unpaid',
      stats: `${formatCurrency(unpaidRevenue?.stats?.aggregate?.sum?.report_fee ?? 0)}`,
      icon: MoneyOff,
    },
  ];
  return (
    <Grid spacing={1} container>
      {appraisalStats.map((overview) => (
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <StatsCard key={overview.label} {...overview} loading={loading} />
        </Grid>
      ))}
    </Grid>
  );
}

export default AppraisalStats;
