import { gql, useQuery } from '@apollo/client';
import { TeamMemberActivities } from 'shared/types';

const QUERY = gql`
  query TeamMemberActivities(
    $userAccountId: uuid
    $activityId: uuid
    $appraisalAssigneeId: jsonb
    $offset: Int
    $limit: Int
  ) {
    user_profile_activities(
      where: {
        _or: [
          { activity_id: { _eq: $activityId } }
          { user_account_id: { _eq: $userAccountId } }
          { appraisal_assignee_ids: { _contains: $appraisalAssigneeId } }
        ]
      }
      offset: $offset
      limit: $limit
      order_by: { commit_timestamp: desc }
    ) {
      activity
      activity_id
      appraisal_assignee_ids
      appraisal_assignees
      appraisal_contact_ids
      appraisal_contacts
      appraisal_file_number
      appraisal_location_address
      appraisal_status
      changes
      client_name
      commit_timestamp
      contact_name
      notes
      organization_id
      timestamp_group_by
      type
      user_account_id
      user_account_name
    }
    user_profile_activities_aggregate(
      where: {
        _or: [
          { activity_id: { _eq: $activityId } }
          { user_account_id: { _eq: $userAccountId } }
          { appraisal_assignee_ids: { _contains: $appraisalAssigneeId } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export type TeamMemberActivitiesResponse = {
  user_profile_activities: TeamMemberActivities[];
  user_profile_activities_aggregate: { aggregate: { count: number } };
};

export default function useTeamMemberActivities(props: {
  userAccountId: string;
  activityId: string;
  appraisalAssigneeId: string;
  offset: number;
  limit: number;
}) {
  return useQuery<TeamMemberActivitiesResponse>(QUERY, {
    fetchPolicy: 'cache-first',
    variables: props,
  });
}
