import React from 'react';
import { SaveButton, Toolbar, Button } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import IconCancel from '@material-ui/icons/Cancel';
import { useHistory } from 'react-router-dom';

function TeamToolbar(props: any) {
  const history = useHistory();
  const useToolbarStyles = makeStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: '0px',
      margin: '5px',
      '@media (max-width: 600px)': {
        position: 'fixed',
        backgroundColor: '#F5F5F5',
        zIndex: 1000,
      },
    },
    saveButton: {
      marginRight: '10px',
      marginBottom: '10px',
      '@media (max-width: 600px)': {
        marginTop: '15px',
        marginRight: '20px',
      },
    },
  });
  const classes = useToolbarStyles();

  return (
    <Toolbar {...props} classes={{ toolbar: classes.toolbar }}>
      <Button label="ra.action.cancel" onClick={() => history.goBack()}>
        <IconCancel />
      </Button>
      <SaveButton
        className={classes.saveButton}
        disabled={props.invalid || props.saveDisabled}
        label="SAVE AND VIEW"
        redirect="show"
        submitOnEnter={false}
      />
    </Toolbar>
  );
}

export default TeamToolbar;
