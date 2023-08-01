import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { ClientActivities } from 'views/Client/types';
// import { Client } from 'views/Client/types';

const QUERY = gql`
  query ClientActivities($clientId: uuid, $offset: Int, $limit: Int) {
    client_activities(
      where: { client_id: { _eq: $clientId } }
      offset: $offset
      limit: $limit
      order_by: { commit_timestamp: desc }
    ) {
      activity
      activity_id
      appraisal_assignees
      appraisal_assignee_ids
      appraisal_file_number
      appraisal_location_address
      appraisal_status
      commit_timestamp
      contact_id
      contact_name
      client_id
      client_name
      notes
      timestamp_group_by
      type
      user_account_name
      user_account_id
    }
    client_activities_aggregate(where: { client_id: { _eq: $clientId } }) {
      aggregate {
        count
      }
    }
  }
`;

export type ClientActivitiesResponse = {
  client_activities: ClientActivities[];
  client_activities_aggregate: { aggregate: { count: number } };
};

export default function useClientActivities(props: { clientId: string; offset: number; limit: number }) {
  return useQuery<ClientActivitiesResponse>(QUERY, { fetchPolicy: 'cache-first', variables: props });
}
