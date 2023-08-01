import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Integrations, Integration_Authentication } from 'shared/generated/types';

const INTEGRATIONS_QUERY = gql`
  query {
    integrations {
      id
      name
      description
      active
      integration_type
    }
    integration_authentication {
      integration_id
    }
  }
`;

export const ADD_INTEGRATION_AUTHENTICATION = gql`
  mutation integrationAuthentication($integrationId: Int!, $integrationType: integration_type, $authId: String!) {
    insert_integration_authentication(
      objects: { integration_id: $integrationId, integration_type: $integrationType, auth_id: $authId }
    ) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_INTEGRATION_AUTHENTICATION = gql`
  mutation deleteIntegrationAuthentication($integrationId: Int!) {
    delete_integration_authentication(where: { integration_id: { _eq: $integrationId } }) {
      affected_rows
    }
  }
`;

export type IntegrationsResponse = {
  integrations: Integrations[];
  integration_authentication: Integration_Authentication[];
};

export default function useIntegrationResponse() {
  const options = useQuery<IntegrationsResponse>(INTEGRATIONS_QUERY, { fetchPolicy: 'cache-first' });
  return [options] as const;
}
