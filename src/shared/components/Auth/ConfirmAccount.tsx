import React, { useEffect } from 'react';
import FormContainer from 'shared/components/Base/FormContainer';
import CircularProgress from '@material-ui/core/CircularProgress';
import history from 'shared/history';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import { useNotify } from 'react-admin';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { ApolloError } from 'apollo-client';

type VerifyAccountOutput = {
  verified: boolean;
};
const CONFIRM_MUTATION = gql`
  mutation($token: String!) {
    account_verify(args: { verification_token: $token }) {
      verified
    }
  }
`;
export default function ConfirmAccount() {
  const [onConfirm] = useMutation<{ account_verify: VerifyAccountOutput }>(CONFIRM_MUTATION, { onCompleted, onError });
  const notify = useNotify();
  const [query] = useLocationQuery();
  useEffect(() => {
    if (!query.key) {
      history.replace('/');
    } else {
      onConfirm({
        variables: {
          token: query.key,
        },
      });
    }
  }, []);
  return (
    <FormContainer title="Confirming account...">
      <div>
        <CircularProgress />
      </div>
    </FormContainer>
  );

  function onCompleted() {
    notify('Account successfully verified', 'info', {}, false, 3000);
    redirect();
  }

  function onError(error: ApolloError) {
    notify('Could not verify account.', 'warning', {}, false, 3000);
    redirect();
  }

  function redirect() {
    setTimeout(() => {
      history.replace('/login');
    }, 4000);
  }
}
