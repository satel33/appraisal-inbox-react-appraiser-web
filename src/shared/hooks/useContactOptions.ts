import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Client } from 'views/Client/types';
import { ContactTypes } from 'views/Contact/types';

const QUERY = gql`
  query {
    clients: client(order_by: { name: asc }) {
      id
      name
      client_type_id
    }
    contactTypes: contact_types(order_by: { order: asc }) {
      id
      type
      client_type_id
    }
  }
`;
export type ContactOptionsResponse = {
  clients: Pick<Client, 'id' | 'name' | 'client_type_id'>[];
  contactTypes: Pick<ContactTypes, 'id' | 'type' | 'client_type_id'>[];
};
export default function useContactOptions() {
  const options = useQuery<ContactOptionsResponse>(QUERY, { fetchPolicy: 'cache-first' });
  return [options] as const;
}
