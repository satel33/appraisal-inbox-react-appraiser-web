import React, { useState, FormEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useRedirect, useNotify } from 'react-admin';
import FormContainer from 'shared/components/Base/FormContainer';
import { validate } from 'validate.js';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
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
  email: {
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
    length: {
      minimum: 8,
      tooShort: '^Password must be at least 8 characters long',
    },
  },
  passwordConfirmation: {
    equality: 'password',
  },
  companyName: {
    presence: {
      allowEmpty: false,
      message: '^Please enter a company name',
    },
  },
  firstName: {
    presence: {
      allowEmpty: false,
      message: '^Please enter a first name',
    },
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: '^Please enter a last name',
    },
  },
};

const SIGN_UP_MUTATION = gql`
  mutation($companyName: String!, $firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    insert_organization(
      objects: [
        {
          name: $companyName
          user_accounts: {
            data: { first_name: $firstName, last_name: $lastName, email: $email, cleartext_password: $password }
          }
        }
      ]
    ) {
      affected_rows
    }
  }
`;

export default function SignupPage() {
  const classes = useStyles();
  const redirect = useRedirect();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isDirty, setDirty] = useState<{ [key: string]: boolean }>({});
  const [onSignup, signupState] = useMutation(SIGN_UP_MUTATION, {
    onCompleted,
    onError,
  });
  const notify = useNotify();
  return (
    <FormContainer title="Sign Up">
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="company_name"
          label="Company Name"
          name="company_name"
          autoFocus
          helperText={errors && errors.companyName && isDirty.companyName ? errors.companyName[0] : ''}
          error={Boolean(errors && errors.companyName) && isDirty.companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            setDirty({ ...isDirty, companyName: true });
            setErrors(
              validate(
                { email, password, passwordConfirmation, companyName: e.target.value, firstName, lastName },
                constraints,
              ),
            );
          }}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          // display="inline"
          id="first_name"
          label="First Name"
          name="first_name"
          helperText={errors && errors.firstName && isDirty.firstName ? errors.firstName[0] : ''}
          error={Boolean(errors && errors.firstName) && isDirty.firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setDirty({ ...isDirty, firstName: true });
            setErrors(
              validate(
                { email, password, passwordConfirmation, companyName, firstName: e.target.value, lastName },
                constraints,
              ),
            );
          }}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          // display="inline"
          id="last_name"
          label="Last Name"
          name="last_name"
          helperText={errors && errors.lastName && isDirty.lastName ? errors.lastName[0] : ''}
          error={Boolean(errors && errors.lastName) && isDirty.lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setDirty({ ...isDirty, lastName: true });
            setErrors(
              validate(
                { email, password, passwordConfirmation, companyName, firstName, lastName: e.target.value },
                constraints,
              ),
            );
          }}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          helperText={errors && errors.email && isDirty.email ? errors.email[0] : ''}
          error={Boolean(errors && errors.email && isDirty.email)}
          onChange={(e) => {
            setEmail(e.target.value);
            setDirty({ ...isDirty, email: true });
            setErrors(
              validate(
                { email: e.target.value, companyName, password, passwordConfirmation, firstName, lastName },
                constraints,
              ),
            );
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
          helperText={errors && errors.password && password ? errors.password[0] : ''}
          error={Boolean(errors && errors.password && password)}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors(
              validate(
                { email, password: e.target.value, passwordConfirmation, companyName, firstName, lastName },
                constraints,
              ),
            );
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="passwordConfirmation"
          label="Confirm Password"
          type="password"
          id="password_confirmation"
          helperText={
            errors && errors.passwordConfirmation && passwordConfirmation ? errors.passwordConfirmation[0] : ''
          }
          error={Boolean(errors && errors.passwordConfirmation && passwordConfirmation)}
          onChange={(e) => {
            setPasswordConfirmation(e.target.value);
            setErrors(
              validate(
                { email, password, passwordConfirmation: e.target.value, companyName, firstName, lastName },
                constraints,
              ),
            );
          }}
        />
        <CustomButton
          isLoading={signupState.loading}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          icon={<PersonAddIcon />}
          disabled={Boolean(signupState.loading || errors || (!password && !email && !passwordConfirmation))}
          className={classes.submit}
          label="CREATE FREE ACCOUNT"
        />
        {/* <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={Boolean(errors || (!password && !email && !passwordConfirmation))}
        >
          CREATE FREE ACCOUNT
        </Button> */}
        <Grid container>
          <Grid item xs>
            <Link href="#account/reset" variant="body2">
              Reset your password
            </Link>
          </Grid>
          <Grid item>
            <Link href="#login" variant="body2">
              {'Already have an account? Log In'}
            </Link>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    onSignup({
      variables: {
        companyName,
        firstName,
        lastName,
        email,
        password,
      },
    });
  }

  function onCompleted(data: any) {
    if (!data.insert_user_account.returning[0]) {
      notify(
        `
        Sorry, there was a problem creating your Appraisal Inbox account. Please try again.
        `,
        'warning',
        {},
        false,
        10000,
      );
    } else {
      notify(
        `
        Congratulations, you've just created an Appraisal Inbox account!

        The next step is to click the confirmation link in the email that we just sent you. (If you don't see the email, be sure to check your junk/spam folder).
        `,
        'info',
        {},
        false,
        10000,
      );

      redirect('/account/login');
    }
  }

  function onError(error: any) {
    if (error.message.includes('Uniqueness violation')) {
      notify(
        `
        Account Already Exists!

        It looks like you already have an account. Sign in now.
        `,
        'info',
        {},
        false,
        10000,
      );
      redirect('/account/login');
    }
  }
}
