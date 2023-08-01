import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { User_Role } from 'shared/generated/types';

const QUERY = gql`
  query {
    roles: user_role {
      id
      display
      description
    }
  }
`;
const PROFILE_QUERY = gql`
  query getProfile($id: uuid) {
    profile: user_profiles(where: { id: { _eq: $id } }) {
      id
      last_active_at
      appraisals_count
    }
  }
`;
export type TeamOptionsResponse = {
  roles: Pick<User_Role, 'id' | 'display' | 'description'>[];
};

export type ProfileOptionsResponse = {
  profile: { id: string; appraisals_count: number; last_active_at: string }[];
};

export default function useTeamOptions() {
  const options = useQuery<TeamOptionsResponse>(QUERY, { fetchPolicy: 'cache-first' });
  return [options] as const;
}

export function useProfileOptions(props: { id: string }) {
  const options = useQuery<ProfileOptionsResponse>(PROFILE_QUERY, { fetchPolicy: 'cache-first', variables: props });
  return [options] as const;
}
