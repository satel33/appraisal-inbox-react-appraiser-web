import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Record } from 'react-admin';

const QUERY = gql`
  query getUserPreferences($user_account_id: uuid) {
    preference: user_preference_notification(where: { user_account_id: { _eq: $user_account_id } }, limit: 1) {
      id
      user_account_id
      email_assigned
      email_daily_agenda
    }
    profile: user_profile(where: { user_account_id: { _eq: $user_account_id } }, limit: 1) {
      id
    }
  }
`;

type PreferenceResponse = {
  preference: Pick<Record, 'id' | 'user_account_id' | 'email_assigned' | 'email_daily_agenda'>[];
  profile: Pick<Record, 'id'>[];
};
export default function useProfileOptions(props: { user_account_id: string }) {
  const options = useQuery<PreferenceResponse>(QUERY, { fetchPolicy: 'cache-first', variables: props });
  return [options] as const;
}
