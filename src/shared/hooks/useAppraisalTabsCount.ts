import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Assessment_Aggregate, Transaction_Aggregate } from 'shared/generated/types';

export type AppraisalTabCountsResponse = {
  assessments: Assessment_Aggregate;
  transactions: Transaction_Aggregate;
  contacts: string[];
};

const QUERY = gql`
  query AppraisalTabsCount($appraisal_id: uuid!) {
    assessments: assessment_aggregate(where: { appraisal_id: { _eq: $appraisal_id } }) {
      aggregate {
        count(distinct: true)
      }
    }
    transactions_aggregate(where: { appraisal_id: { _eq: $appraisal_id } }) {
      aggregate {
        count(distinct: true)
      }
    }
    contacts: appraisal_by_pk(id: $appraisal_id) {
      contact_ids
    }
  }
`;

export default function useAppraisalTabsCount(props: { appraisalId: string }) {
  const response = useQuery<AppraisalTabCountsResponse>(QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: props,
  });
  return [response] as const;
}
