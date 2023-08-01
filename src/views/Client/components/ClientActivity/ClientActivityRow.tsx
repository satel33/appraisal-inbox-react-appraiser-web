import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box } from '@material-ui/core';
import { styleLeft } from 'shared/hooks/useEditFormStyle';
import { formatDateForActivity } from 'shared/utils';
import { ClientActivities } from 'views/Client/types';

interface Props {
  row: ClientActivities;
  currentUser: string;
}

export const ActivityDisplayRow = ({ row, currentUser }: Props) => {
  const classes = styleLeft();

  const {
    activity,
    activity_id,
    appraisal_assignees,
    appraisal_file_number,
    appraisal_location_address,
    appraisal_status,
    commit_timestamp,
    contact_id,
    contact_name,
    client_name,
    notes,
    type,
  } = row;

  const displayTime = formatDateForActivity(commit_timestamp, true);

  const CurrentUser = () => (
    <Typography className={classes.bold} component={'span'}>
      {currentUser}
    </Typography>
  );

  const Action = () => {
    return (
      <Typography component={'span'} className={classes.italic}>
        {type === 'insert' ? ' added ' : ' updated '}
      </Typography>
    );
  };

  const DisplayTime = () => <Typography color="textSecondary">{displayTime}</Typography>;

  if (activity === 'client') {
    if (type === 'insert') {
      return (
        <Box mb={2}>
          <CurrentUser />
          <Action />
          <Typography component={'span'}>Client {client_name}</Typography>
          <Typography color="textSecondary">{displayTime}</Typography>
        </Box>
      );
    } else if (type === 'update' && notes) {
      return (
        <Box mb={2}>
          <CurrentUser />

          <Action />

          <Typography component={'span'}>Client Notes </Typography>

          <DisplayTime />
        </Box>
      );
    }
  }

  if (activity === 'contact' && (type === 'insert' || (notes && type === 'update'))) {
    return (
      <Box mb={2}>
        <CurrentUser />
        <Action />
        <Typography component={'span'}>Client Contact </Typography>
        <Link className={classes.link} to={`/contacts/${contact_id}`}>
          {contact_name}
        </Link>
        {type === 'update' && notes && <Typography component={'span'}> Notes </Typography>}
        <DisplayTime />
      </Box>
    );
  }

  if (activity === 'appraisal') {
    return (
      <Box mb={2}>
        <CurrentUser />
        <Action />
        <Typography component={'span'}> Appraisal </Typography>
        <Link to={`/appraisals/${activity_id}`} className={classes.link}>
          {appraisal_file_number}
          {appraisal_file_number && appraisal_location_address && ' - '}
          {appraisal_location_address}
        </Link>
        <Typography component={'span'}> with </Typography>

        {appraisal_status && (
          <>
            <Typography component={'span'}> Status of </Typography>
            <Typography component={'span'}>{appraisal_status}</Typography>
          </>
        )}
        {appraisal_assignees?.length > 0 && (
          <>
            <Typography component={'span'}> and </Typography>
            {appraisal_assignees.map((assignee: string, index: number) => {
              return (
                <>
                  {index > 0 && <Typography component={'span'}> and </Typography>}
                  <Typography component={'span'}>{assignee}</Typography>
                </>
              );
            })}
            <Typography component={'span'}> as {appraisal_assignees?.length > 1 ? 'Assignees' : 'Assignee'}</Typography>
          </>
        )}
        <DisplayTime />
      </Box>
    );
  }
  return null;
};
