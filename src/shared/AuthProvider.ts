import gql from 'graphql-tag';
import { AuthProvider, UserIdentity } from 'ra-core';
import { gqlClient } from './ApolloClient';
import { Config } from './constants/config';
import history from 'shared/history';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { inProgressLink } from './constants/menu';
import { User_Account } from './generated/types';
import * as Sentry from '@sentry/react';
import openReplay from './openreplay';

export const XHasuraAdminSecret = 'X-Hasura-Admin-Secret';
export type UserID = string;
export type AuthPayload = JwtPayload & {
  'https://hasura.io/jwt/claims': {
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
    'x-hasura-organization-id': string;
    'x-hasura-allowed-roles': string[];
  };
};

type AuthResponse = {
  jwt_token: string;
  refresh_token: string;
};

const USER_QUERY = gql`
  query UserData($id: uuid!) {
    user_account_by_pk(id: $id) {
      id
      email
      user_profile {
        first_name
        last_name
      }
    }
  }
`;

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refresh_token: String!) {
    account_sign_in_refresh(args: { refresh_token: $refresh_token }) {
      jwt_token
      refresh_token
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation($refresh_token: String!) {
    account_sign_out(args: { refresh_token: $refresh_token }) {
      sign_out_at
    }
  }
`;
const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    account_sign_in(args: { email: $email, cleartext_password: $password }) {
      jwt_token
      refresh_token
    }
  }
`;

export type ExtendedAuthProvider = AuthProvider & {
  getRefreshToken(): Promise<AuthResponse>;
  decodeToken(): Promise<UserIdentity>;
  getUpdatedToken(): Promise<string>;
  accessToken: string;
};
export const authProvider: ExtendedAuthProvider = {
  accessToken: '',
  user: null,
  checkAuth: async function () {
    const refreshToken = localStorage.getItem(Config.refreshTokenKey);
    if (
      [
        '/account/signup',
        '/account/reset',
        '/account/reset_password',
        '/account/set_password',
        '/account/login',
        '/account/confirm',
        '/login',
      ].includes(window.location.pathname)
    ) {
      if (refreshToken) {
        history.push(inProgressLink);
      }
      return Promise.resolve();
    }
    if (!refreshToken) {
      history.replace('/login');
      return Promise.reject();
    }
    try {
      await this.decodeToken();
      if (window.location.pathname === '/') history.push(inProgressLink);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  },
  login: async function ({ username, password }) {
    const { data } = await gqlClient.mutate<{ account_sign_in: AuthResponse[] }>({
      mutation: LOGIN_MUTATION,
      variables: {
        password,
        email: username,
      },
    });

    const result = data?.account_sign_in[0];

    if (result) {
      this.accessToken = result.jwt_token;
      localStorage.setItem(Config.refreshTokenKey, result?.refresh_token);
      return Promise.resolve({});
    }
    return Promise.reject({});
  },
  async getIdentity() {
    try {
      return this.decodeToken();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async logout() {
    await gqlClient.mutate({
      mutation: LOGOUT_MUTATION,
      variables: {
        refresh_token: localStorage.getItem(Config.refreshTokenKey),
      },
    });
    localStorage.clear();
    history.push('/login');
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  async getPermissions() {
    try {
      if (!this.accessToken) {
        return Promise.resolve('anonymous');
      }
      const decoded = await this.decodeToken();
      if (!decoded) {
        return Promise.resolve('anonymous');
      }
      return Promise.resolve(decoded['https://hasura.io/jwt/claims']?.['x-hasura-default-role']);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async decodeToken() {
    try {
      let token = this.accessToken;
      if (!token) {
        const refreshResponse = await this.getRefreshToken();
        token = refreshResponse.jwt_token;
      }
      const decoded = jwtDecode<AuthPayload>(token);
      const identity = {
        id: decoded['https://hasura.io/jwt/claims']?.['x-hasura-user-id'],
        organization_id: decoded['https://hasura.io/jwt/claims']?.['x-hasura-organization-id'],
        role: decoded['https://hasura.io/jwt/claims']?.['x-hasura-default-role'],
      };
      if (!this.user) {
        const result = await gqlClient.query<{ user_account_by_pk: User_Account }>({
          query: USER_QUERY,
          variables: {
            id: identity.id,
          },
          fetchPolicy: 'cache-first',
        });
        const userProfile = result.data?.user_account_by_pk?.user_profile;
        const userData = {
          ...identity,
          email: result.data?.user_account_by_pk?.email ?? '',
          full_name: `${[userProfile?.first_name, userProfile?.last_name].join(' ')}`,
        };
        openReplay.setUserID(userData.id);
        openReplay.setMetadata('full_name', `${[userProfile?.first_name, userProfile?.last_name].join(' ')}`);
        openReplay.setMetadata('email', result.data?.user_account_by_pk?.email ?? '');
        Sentry.setContext('User Data', userData);
        this.user = userData;
      }
      return Promise.resolve(identity);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getUpdatedToken() {
    const refreshToken = localStorage.getItem(Config.refreshTokenKey);
    if (!refreshToken) {
      return '';
    }
    const token = this.accessToken;
    if (token) {
      try {
        const decoded = jwtDecode<AuthPayload>(token);
        if (decoded.exp !== undefined && Date.now() < decoded.exp * 1000) {
          return token;
        }
      } catch (error) {
        return '';
      }
    }
    const refreshTokenResponse = await this.getRefreshToken();
    return refreshTokenResponse.jwt_token;
  },
  async getRefreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(Config.refreshTokenKey);
    const { data } = await gqlClient.mutate<{ account_sign_in_refresh: AuthResponse[] }>({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refresh_token: refreshToken,
      },
    });
    const result = data?.account_sign_in_refresh[0];
    if (result) {
      localStorage.setItem(Config.refreshTokenKey, result.refresh_token);
      this.accessToken = result.jwt_token;
      return result;
    }
    localStorage.clear();
    history.push('/login');
    return Promise.reject();
  },
};
