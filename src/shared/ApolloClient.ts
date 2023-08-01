import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Config } from './constants/config';
import { authProvider } from 'shared/AuthProvider';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import { recordGraphQL } from './openreplay';

export const XHasuraClientName = 'hasura-client-name';

export const AuthorizationHeader = 'Authorization';
export const AuthBearer = 'Bearer';

const retryLink = new RetryLink();

const errorLink = onError((err) => {
  const { graphQLErrors, networkError, operation } = err;
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`);
    });
  }
  if (networkError) {
    console.log(`[Network error ${operation.operationName}]: ${networkError.message}`);
  }
});

const authMiddleware = setContext(async (operation) => {
  let updatedToken = '';
  if (operation.operationName !== 'RefreshToken') {
    updatedToken = await authProvider.getUpdatedToken();
  }
  const newContext = {
    headers: {
      ...(updatedToken && {
        Authorization: `Bearer ${updatedToken}`,
      }),
    },
  };
  return newContext;
});

const httpLink = createHttpLink({
  uri: Config.httpDataHost,
  headers: {
    [XHasuraClientName]: Config.hasuraClientName,
  },
});

const merge = (existing = [], incoming: any) => {
  return [...existing, ...incoming];
};

export const gqlClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          client_activities: {
            keyArgs: false,
            merge,
            read(existing: any[], { args }) {
              const queryClientId = args?.where.client_id._eq;
              const filteredClientActivities = existing
                ? existing.filter((item) => item.client_id === queryClientId)
                : [];
              return filteredClientActivities;
            },
          },
          contact_activities: {
            keyArgs: false,
            merge,
            read(existing: any[], { args }) {
              const queryContactId = args?.where._or[1].contact_ids._contains;

              let filteredContactActivities = [];

              if (existing) {
                filteredContactActivities = existing.filter((item) => {
                  if (item.contact_ids) {
                    return item.contact_ids?.includes(queryContactId);
                  } else {
                    return item.activity_id === queryContactId;
                  }
                });
              }
              return filteredContactActivities;
            },
          },
          appraisal_activities: {
            keyArgs: false,
            merge,
            read(existing: any[], { args }) {
              const queryAppraisalId = args?.where.appraisal_id._eq;
              const filteredClientActivities = existing
                ? existing.filter((item) => item.appraisal_id === queryAppraisalId)
                : [];
              return filteredClientActivities;
            },
          },
          user_profile_activities: {
            keyArgs: false,
            merge,
            read(existing: any[], { args }) {
              const queryActivityId = args?.where._or[0].activity_id._eq;
              const queryUserAccountId = args?.where._or[1].user_account_id._eq;
              const appraisalAssigneeId = args?.where._or[2].appraisal_assignee_ids._contains;

              const filteredClientActivities = existing
                ? existing.filter((item) => {
                    const condition =
                      item.user_account_id === queryUserAccountId ||
                      item.activity_id === queryActivityId ||
                      item.appraisal_assignee_ids?.includes(appraisalAssigneeId);
                    return condition;
                  })
                : [];
              return filteredClientActivities;
            },
          },
        },
      },
    },
  }),
  link: ApolloLink.from([
    new ApolloLink((operation: any, forward) => {
      return forward(operation).map((result) =>
        recordGraphQL(operation.query.definitions[0]?.operation, operation.operationName, operation.variables, result),
      );
    }),
    errorLink,
    retryLink,
    authMiddleware,
    httpLink,
  ]),
});
