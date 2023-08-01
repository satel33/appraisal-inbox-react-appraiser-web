function assertEnv(value: string, key: string): string {
  if (!value) {
    throw new Error(`Environment ${key} doesn't exist`);
  }

  return value;
}

// const DATA_SCHEME = process.env.REACT_APP_DATA_SCHEME || 'http';
// const DATA_DOMAIN = assertEnv(process.env.REACT_APP_DATA_DOMAIN || '', 'DATA_DOMAIN');
// const WS_SCHEME = DATA_SCHEME === 'https' ? 'wss' : 'ws';

export const Config = {
  httpDataHost: process.env.REACT_APP_GRAPHQL_HTTP_HOST || '', //`${DATA_SCHEME}://${DATA_DOMAIN}/v1/graphql`,
  wsDataHost: process.env.REACT_APP_GRAPHQL_WS_HOST || '',
  sessionToken: assertEnv(process.env.REACT_APP_SESSION_TOKEN || '', 'SESSION_TOKEN'),
  hasuraClientName: assertEnv(process.env.REACT_APP_HASURA_CLIENT_NAME || '', 'HASURA_CLIENT_NAME'),
  version: process.env.REACT_APP_VERSION || '1.0.0',
  debug: process.env.NODE_ENV !== 'production',
  googleMapApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  sentryUrl: process.env.REACT_APP_SENTRY_URL || '',
  refreshTokenKey: 'refresh_token',
  openReplayId: process.env.REACT_APP_OPENREPLAY_ID || '',
};

export const INDEX_LIST_PER_PAGE = 25;
export const TAB_LIST_PER_PAGE = 15;
