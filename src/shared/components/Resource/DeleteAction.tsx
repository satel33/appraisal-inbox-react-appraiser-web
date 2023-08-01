import { DeleteWithConfirmButton, useNotify, useRedirect } from 'react-admin';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { sentaneCase } from 'shared/utils';

export const styles = {
  box: {
    justifyContent: 'flex-start',
    paddingLeft: '10px',
    paddingBottom: '10px',
  },
  deleteBtn: {
    color: '#2196f3 !important',
    fontWeight: 500,
    fontSize: '0.8125rem',
    '&:hover': {
      backgroundColor: '#e8e8e8 !important',
    },
  },
  deleteBtnDisabled: {
    fontWeight: 500,
    fontSize: '0.8125rem',
    '&:hover': {
      backgroundColor: '#e8e8e8 !important',
    },
  },
};
const useStyles = makeStyles(styles);

export default (props: any) => {
  const classes = useStyles();
  const notify = useNotify();
  const redirect = useRedirect();
  const isDisabled = () => !props.permissions.delete || props.resourceCount;
  const getLabel = () => {
    if (props.resource === 'team') return 'team member';
    return props.resource;
  };
  const onSuccess = () => {
    notify(`${props.resource}.deleted`);
    redirect(props.basePath);
  };

  const getConfirmTitle = () => {
    return `Delete ${sentaneCase(getLabel())}: ${
      (props.record.name && props.record.name.toUpperCase()) || props.record.id
    }`;
  };
  console.log(getLabel());

  if (!props.permissions) return <Box className={classes.box}></Box>;

  if (isDisabled()) return <Box className={classes.box}></Box>;

  return (
    <Box className={classes.box}>
      <Box>
        <DeleteWithConfirmButton
          onSuccess={onSuccess}
          className={isDisabled() ? classes.deleteBtnDisabled : classes.deleteBtn}
          disabled={isDisabled()}
          basePath={props.basePath}
          confirmTitle={getConfirmTitle()}
          record={props.record}
          resource={props.resource}
          label={`DELETE ${getLabel()}`}
        />
      </Box>
    </Box>
  );
};
