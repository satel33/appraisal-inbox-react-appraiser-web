import React, { useState, FormEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useLogin, useNotify } from 'react-admin';
import { validate } from 'validate.js';
import FormContainer from 'shared/components/Base/FormContainer';
import LoginIcon from '@material-ui/icons/Lock';
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

const constraints = {
  username: {
    email: {
      allowEmpty: false,
      message: '^Please enter a valid email address',
    },
  },
  password: {
    presence: {
      allowEmpty: false,
      message: '^Please enter password',
    },
  },
};

export default function LoginPage() {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login({ username, password }).catch(() => {
      notify(
        'Login Failed. Your email or password are invalid or your account has not yet been confirmed.',
        'warning',
        {},
        false,
        10000,
      );
    });
    setIsLoading(false);
  };

  return (
    <FormContainer title="Log In">
      <form className={classes.form} noValidate onSubmit={submit}>
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
          helperText={errors && errors.username ? errors.username[0] : ''}
          error={Boolean(errors && errors.username)}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors(validate({ username: e.target.value, password }, constraints));
          }}
        />
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
            setErrors(validate({ username, password: e.target.value }, constraints));
          }}
        />
        <CustomButton
          isLoading={isLoading}
          type="submit"
          fullWidth
          icon={<LoginIcon />}
          variant="contained"
          color="primary"
          disabled={Boolean(errors || (!password && !username) || isLoading)}
          className={classes.submit}
          label="Sign In"
        />
        <Grid container>
          <Grid item xs>
            <Link href="/account/reset" variant="body2">
              Reset your password
            </Link>
          </Grid>
          {/* <Grid item>
            <Link href="/account/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid> */}
        </Grid>
      </form>
    </FormContainer>
  );
}
