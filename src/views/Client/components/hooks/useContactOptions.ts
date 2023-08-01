import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

const CONTACT_TYPE_QUERY = gql`
  query ContactTypeQuery {
    contactTypes: contact_types(order_by: { order: asc }) {
      id
      type
      client_type_id
    }
  }
`;

const CLIENT_TYPE_QUERY = gql`
  query ClientTypeQuery {
    clientTypes: client_types(order_by: { order: asc }) {
      id
      type
    }
  }
`;

export const useContactQuery = () =>
  useQuery<{
    contactTypes: {
      id: string;
      type: string;
      client_type_id: string;
    }[];
  }>(CONTACT_TYPE_QUERY, { fetchPolicy: 'cache-first' });

export const useClientQuery = () =>
  useQuery<{
    clientTypes: {
      id: string;
      type: string;
    }[];
  }>(CLIENT_TYPE_QUERY, { fetchPolicy: 'cache-first' });
