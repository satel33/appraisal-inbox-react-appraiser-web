import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box } from '@material-ui/core';
import { formatDateForActivity } from 'shared/utils';
import { styleLeft } from 'shared/hooks/useEditFormStyle';
import { ContactActivities } from 'views/Contact/types';

interface Props {
  row: ContactActivities;
  isCurrentUser: boolean;
  contact: any;
}
export const ContactActivityRow = ({ row, isCurrentUser, contact }: Props) => {
  const classes = styleLeft();

  const {
    activity,
    activity_id,
    appraisal_file_number,
    type,
    commit_timestamp,
    user_account_name,
    appraisal_location_address,
    notes,
  } = row;
  const { name } = contact;
  const displayTime = formatDateForActivity(commit_timestamp, true);

  const CurrentUser = () => {
    return (
      <>
        {isCurrentUser ? (
          <Typography className={classes.bold} component={'span'}>
            You
          </Typography>
        ) : (
          <Typography component={'span'} className={classes.bold}>
            {user_account_name || 'Team Member'}
          </Typography>
        )}
      </>
    );
  };

  const DisplayTime = () => <Typography color="textSecondary">{displayTime}</Typography>;

  if (activity === 'contact' && ((type === 'update' && notes) || type === 'insert')) {
    return (
      <Box mb={2}>
        <CurrentUser />
        <Typography component={'span'} className={classes.italic}>
          {type === 'update' ? ' updated ' : ' added '}
        </Typography>
        <Typography component={'span'}>{'Contact'}</Typography>
        {notes && type !== 'insert' && <Typography component={'span'}>{' Notes'}</Typography>}

        <DisplayTime />
      </Box>
    );
  }

  if (activity === 'appraisal') {
    return (
      <Box mb={2}>
        <CurrentUser />

        <Typography component={'span'} className={classes.italic}>
          {' added '}
        </Typography>
        <Typography component={'span'}>{name} to Appraisal </Typography>
        <Link to={`/appraisals/${activity_id}`} className={classes.link}>
          {appraisal_file_number}
          {appraisal_file_number && appraisal_location_address && ' - '}
          {appraisal_location_address}
        </Link>
        <DisplayTime />
      </Box>
    );
  }

  return null;
};
