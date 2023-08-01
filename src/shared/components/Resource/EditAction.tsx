import { TopToolbar, Button } from 'react-admin';
import React from 'react';
import DeleteAction from 'shared/components/Resource/DeleteAction';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
export const styles = {
  toolbarButtons: {
    marginRight: 'auto',
  },
  justifyStartIMPORTANT: {
    justifyContent: 'flex-start !important',
    paddingTop: '5px',
  },
};
const useStyles = makeStyles(styles);

export default (props: any) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <TopToolbar className={classes.justifyStartIMPORTANT}>
      <Button onClick={() => history.goBack()} label="ra.action.back" className={classes.toolbarButtons}>
        <ArrowBack />
      </Button>
      {props.export}
      <DeleteAction {...props}></DeleteAction>
    </TopToolbar>
  );
};
