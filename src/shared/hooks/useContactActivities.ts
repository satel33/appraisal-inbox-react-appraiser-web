import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { ContactActivities } from 'views/Contact/types';
// import { Client } from 'views/Client/types';

const QUERY = gql`
  query ContactActivities($contactId: jsonb, $activityId: uuid, $offset: Int, $limit: Int) {
    contact_activities(
      where: { _or: [{ activity_id: { _eq: $activityId } }, { contact_ids: { _contains: $contactId } }] }
      offset: $offset
      limit: $limit
      order_by: { commit_timestamp: desc }
    ) {
      activity
      activity_id
      appraisal_file_number
      appraisal_location_address
      appraisal_status
      changes
      commit_timestamp
      contact_ids
      notes
      organization_id
      timestamp_group_by
      type
      user_account_id
      user_account_name
    }

    contact_activities_aggregate(where: { contact_ids: { _contains: $contactId } }) {
      aggregate {
        count
      }
    }
  }
`;

export type ContactActivitiesResponse = {
  contact_activities: ContactActivities[];
  contact_activities_aggregate: { aggregate: { count: number } };
};
export default function useContactActivities(props: { contactId: string; offset: number; limit: number }) {
  const variables = { ...props, activityId: props.contactId };
  return useQuery<ContactActivitiesResponse>(QUERY, { fetchPolicy: 'cache-first', variables });
}
