import React, { useState, FormEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useNotify } from 'react-admin';
import gql from 'graphql-tag';
import FormContainer from 'shared/components/Base/FormContainer';
import history from 'shared/history';
import { useMutation } from '@apollo/client';
import { ApolloError } from 'apollo-client/errors/ApolloError';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import CustomButton from 'shared/components/Button';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
type PasswordResetRequestOutput = {
  reset_password_requested_at: string;
};
const UPDATE_USER = gql`
  mutation($email: String!) {
    result: account_password_reset_request(args: { email: $email }) {
      reset_password_requested_at
    }
  }
`;
export default function RequestResetPasswordPage() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const notify = useNotify();
  const [onUpdate, updateState] = useMutation<{ result: PasswordResetRequestOutput }>(UPDATE_USER, {
    onCompleted,
    onError,
  });

  return (
    <FormContainer title="Password Reset">
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomButton
          isLoading={updateState.loading}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          icon={<SettingsBackupRestoreIcon />}
          disabled={Boolean(updateState.loading)}
          className={classes.submit}
          label="Reset Password"
        />
        <Grid container>
          <Grid item>
            <Link href="/account/login" variant="body2">
              Already have an account? Log In
            </Link>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    onUpdate({
      variables: {
        email,
      },
    });
  }

  function onCompleted(data: { result: PasswordResetRequestOutput }) {
    notify('Password Reset Requested successfully', 'info', {}, false, 3000);
    redirect();
  }

  function onError(error: ApolloError) {
    notify('Password Reset Request Failed.', 'warning', {}, false, 3000);
  }

  function redirect() {
    setTimeout(() => {
      history.replace('/login');
    }, 4000);
  }
}
