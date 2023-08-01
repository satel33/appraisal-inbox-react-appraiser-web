import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Notification } from 'react-admin';
import theme from 'shared/constants/theme';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

type FormContainerProps = {
  children: React.ReactNode;
  title: string;
};

export default function FormContainer(props: FormContainerProps) {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img width="85%" alt="Appraisal Inbox" src="https://www.appraisalinbox.com/img/logo.png" />
          {props.children}
        </div>
        <Notification />
      </Container>
    </ThemeProvider>
  );
}
