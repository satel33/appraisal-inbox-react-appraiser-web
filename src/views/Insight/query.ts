import gql from 'graphql-tag';
import { Appraisals_Aggregate, Insights_Aggregate } from 'shared/generated/types';

export type StatsResponse = {
  stats: Appraisals_Aggregate;
};

export type InsightsResponse = {
  stats: Insights_Aggregate;
};

export const APPRAISAL_TOTAL_QUERY = gql`
  query AppraisalStats($where: appraisals_bool_exp) {
    stats: appraisals_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const APPRAISAL_STAT_QUERY = gql`
  query AppraisalStats($where: appraisals_bool_exp) {
    stats: appraisals_aggregate(where: $where) {
      aggregate {
        sum {
          report_fee
        }
      }
      nodes {
        id
      }
    }
  }
`;
export const INSIGHTS_QUERY = gql`
  query Insights($ids: [uuid!]) {
    stats: insights_aggregate(where: { id: { _in: $ids } }) {
      aggregate {
        avg {
          average_time_to_pay
          average_turn_around
        }
      }
    }
  }
`;

export const AVERAGE_FEE_QUERY = gql`
  query Insights($where: appraisals_bool_exp) {
    stats: appraisals_aggregate(where: $where) {
      aggregate {
        avg {
          report_fee
        }
      }
    }
  }
`;

export const REVENUE_QUERY = gql`
  query AppraisalStats($where: appraisals_bool_exp) {
    stats: appraisals_aggregate(where: $where) {
      aggregate {
        sum {
          report_fee
        }
      }
    }
  }
`;
export const AVERAGE_QUOTE_QUERY = gql`
  query Insights($where: appraisals_bool_exp) {
    stats: appraisals_aggregate(where: $where) {
      aggregate {
        avg {
          quote_fee
        }
      }
    }
  }
`;
