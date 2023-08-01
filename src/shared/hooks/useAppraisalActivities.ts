import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { AppraisalActivities } from 'views/Appraisal/types';

const QUERY = gql`
  query AppraisalActivities($appraisalId: uuid, $offset: Int, $limit: Int) {
    appraisal_activities(
      where: { appraisal_id: { _eq: $appraisalId } }
      limit: $limit
      offset: $offset
      order_by: { commit_timestamp: desc }
    ) {
      appraisal_id
      appraisal_status
      assignee_ids
      assignees
      commit_timestamp
      contacts
      dates
      fees
      filename
      notes
      timestamp_group_by
      type
      user_account_id
      user_account_name
    }
    appraisal_activities_aggregate(where: { appraisal_id: { _eq: $appraisalId } }) {
      aggregate {
        count
      }
    }
  }
`;
export type AppraisalActivitiesResponse = {
  appraisal_activities: AppraisalActivities[];
  appraisal_activities_aggregate: { aggregate: { count: number } };
};

export default function useAppraisalActivities(props: { appraisalId: string; offset?: number; limit?: number }) {
  const variables = { ...props };
  return useQuery<AppraisalActivitiesResponse>(QUERY, { nextFetchPolicy: 'cache-first', variables });
}
