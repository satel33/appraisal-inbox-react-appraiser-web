import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Starred from '@material-ui/icons/Grade';
import NotStarred from '@material-ui/icons/StarBorder';
import { makeStyles } from '@material-ui/styles';
import { useUpdate, useRefresh, FieldProps, useGetIdentity } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FetchMenuCount } from 'views/Appraisal/reducer';
import { Appraisal, Appraisals } from 'views/Appraisal/types';
import getAppraisalPermission from 'views/Appraisal/permission';

const useStyles = makeStyles({
  notStarred: {
    padding: '0px',
  },
  starred: {
    padding: '0px',
    '& svg': { color: '#ffca28' },
  },
});

function StarColumn(props: FieldProps<Appraisals>) {
  const dispatch = useDispatch();
  const refresh = useRefresh();
  const location = useLocation();
  const { record } = props;
  const [isStarred, setIsStarred] = useState(Boolean(record?.starred));
  const classes = useStyles({ isStarred });
  const [update] = useUpdate('appraisal', record?.id || '');
  const { identity } = useGetIdentity();
  const permission = getAppraisalPermission(record as Appraisal, identity);
  return (
    <IconButton className={isStarred ? classes.starred : classes.notStarred} color="inherit" onClick={onClick}>
      {isStarred ? <Starred /> : <NotStarred />}
    </IconButton>
  );

  async function onClick(event: any) {
    event.stopPropagation();
    if (!permission.edit) {
      return;
    }
    setIsStarred((prev) => !prev);
    await update({
      payload: {
        data: {
          starred: !isStarred,
        },
      },
    });
    if (location.pathname === '/appraisals/starred') {
      refresh();
    }
    dispatch(FetchMenuCount());
  }
}

export default StarColumn;
