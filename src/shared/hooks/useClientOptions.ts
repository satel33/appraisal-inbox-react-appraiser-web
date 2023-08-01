import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Client } from 'views/Client/types';

const QUERY = gql`
  query getContacts($client_id: uuid) {
    contacts: contacts(where: { client_id: { _eq: $client_id } }) {
      id
      first_name
      last_name
      email
      phone_number
      appraisals_count
      type
      primary
    }
  }
`;

export type ContactOptionsResponse = {
  contacts: Pick<
    Client,
    'id' | 'email' | 'primary' | 'phone_number' | 'first_name' | 'last_name' | 'appraisals_count'
  >[];
};
export default function useContactOptions(props: { client_id: string }) {
  const options = useQuery<ContactOptionsResponse>(QUERY, { fetchPolicy: 'cache-first', variables: props });
  return [options] as const;
}
