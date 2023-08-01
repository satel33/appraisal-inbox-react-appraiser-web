import React, { useState, FormEvent, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useNotify } from 'react-admin';
import { validate } from 'validate.js';
import { useMutation } from '@apollo/client';
import FormContainer from 'shared/components/Base/FormContainer';
import gql from 'graphql-tag';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import history from 'shared/history';
import { ApolloError } from 'apollo-client';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import CustomButton from 'shared/components/Button';
import { useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const constraints = {
  confirmPassword: {
    equality: 'password',
    presence: {
      allowEmpty: false,
      message: '^Please confirm password',
    },
  },
  password: {
    presence: {
      allowEmpty: false,
      message: '^Please enter password',
    },
  },
};

type PasswordResetOutput = {
  reset_password_updated_at: string;
};

type PasswordSetOutput = {
  verified: boolean;
};

const RESET_MUTATION = gql`
  mutation($token: String!, $password: String!) {
    result: account_password_reset(args: { reset_password_token: $token, password: $password }) {
      reset_password_updated_at
    }
  }
`;

const SET_PASSWORD_MUTATION = gql`
  mutation($token: String!, $password: String!) {
    result: account_password_set(args: { verification_token: $token, password: $password }) {
      verified
    }
  }
`;

export default function ResetPassword() {
  const location = useLocation();
  const label = location.pathname === '/account/reset_password' ? 'Reset Password' : 'Set Password';
  const classes = useStyles();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const notify = useNotify();
  const [onUpdate, updateState] = useMutation<{ result: PasswordResetOutput }>(RESET_MUTATION, {
    onCompleted,
    onError,
  });
  const [onSetPassword, setPasswordState] = useMutation<{ result: PasswordSetOutput }>(SET_PASSWORD_MUTATION, {
    onCompleted: onCompletedSetPassword,
    onError,
  });
  const [query] = useLocationQuery();
  useEffect(() => {
    if (!query.key) {
      history.push('/');
    }
  }, []);
  return (
    <FormContainer title={label}>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors(validate({ confirmPassword, password: e.target.value }, constraints));
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirm_password"
          label="Confirm Password"
          type="password"
          id="confirm_password"
          autoComplete="confirm_password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors(validate({ password, confirmPassword: e.target.value }, constraints));
          }}
        />
        <CustomButton
          isLoading={updateState.loading || setPasswordState.loading}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          icon={<SettingsBackupRestoreIcon />}
          disabled={Boolean(
            updateState.loading || setPasswordState.loading || errors || (!password && !confirmPassword),
          )}
          className={classes.submit}
          label={label}
        />
      </form>
    </FormContainer>
  );

  function onSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      if (label === 'Reset Password') {
        onUpdate({
          variables: {
            token: query.key,
            password,
          },
        });
      } else {
        onSetPassword({
          variables: {
            token: query.key,
            password,
          },
        });
      }
    } catch (err) {}
  }

  function onCompleted(data: { result: PasswordResetOutput }) {
    notify('Password successfully reset', 'info', {}, false, 3000);
    redirect();
  }

  function onCompletedSetPassword(data: { result: PasswordSetOutput }) {
    notify('Password successfully Set', 'info', {}, false, 3000);
    redirect();
  }

  function onError(error: ApolloError) {
    notify(`Could not ${label.toLowerCase()}.`, 'warning', {}, false, 3000);
  }

  function redirect() {
    setTimeout(() => {
      history.replace('/login');
    }, 4000);
  }
}
