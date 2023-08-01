import React from 'react';
import { Admin, Resource, Error } from 'react-admin';
import buildHasuraProvider from 'ra-data-hasura';
import { authProvider } from 'shared/AuthProvider';
import GRAPHQL_SCHEMA from 'shared/generated/schema.json';
import { gqlClient } from 'shared/ApolloClient';
import i18nProvider from 'shared/i18n';
import pageResources, { customRoutes, customReducers, customSagas } from './views';
import LoginPage from 'shared/components/Auth/Login';
import Layout from 'shared/components/Base/Layout';
import theme from 'shared/constants/theme';
import { ApolloProvider } from '@apollo/client';
import history from 'shared/history';
import customBuildFields from 'shared/dataProvider/customBuildFields';
// import Dashboard from 'pages/Dashboard';
import { UserRole } from 'shared/constants/roles';
import PageLoader from 'shared/components/PageLoader';
import * as Sentry from '@sentry/react';

const App = () => {
  const [resolvedDataProvider, setResolvedDataProvider] = React.useState<any>();
  React.useEffect(() => {
    async function fetchProvider() {
      await authProvider.checkAuth(null).catch(console.error);
      const dp = await buildHasuraProvider(
        {
          client: gqlClient,
          introspection: { schema: GRAPHQL_SCHEMA.__schema },
        },
        {
          buildFields: customBuildFields,
        },
      );
      setResolvedDataProvider(() => dp);
    }
    fetchProvider();
  }, []);
  if (!resolvedDataProvider) {
    return <PageLoader />;
  }
  return (
    <Sentry.ErrorBoundary fallback={(error: any) => <Error error={error} />}>
      <ApolloProvider client={gqlClient}>
        <Admin
          // dashboard={Dashboard}
          disableTelemetry
          history={history}
          customSagas={customSagas}
          customReducers={customReducers}
          theme={theme}
          i18nProvider={i18nProvider}
          authProvider={authProvider}
          dataProvider={resolvedDataProvider}
          customRoutes={customRoutes}
          loginPage={LoginPage}
          layout={Layout}
        >
          {getPages}
        </Admin>
      </ApolloProvider>
    </Sentry.ErrorBoundary>
  );

  function getPages(permission: UserRole) {
    return pageResources.map((props) => React.createElement(Resource, { ...props, key: props.name }));
  }
};

export default Sentry.withProfiler(App);
