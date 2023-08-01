import React from 'react';
import { Link } from 'react-router-dom';
import { User_Profile_Activities } from 'shared/generated/types';
import { Typography, Box } from '@material-ui/core';
import { styleLeft } from 'shared/hooks/useEditFormStyle';
import { formatDateForActivity } from 'shared/utils';

interface Props {
  row: User_Profile_Activities;
  member: any;
  currentUser: string;
}

export const TeamMemberActivityRow = ({ row, currentUser, member }: Props) => {
  const classes = styleLeft();

  const {
    activity,
    activity_id,
    appraisal_assignees,
    appraisal_contacts,
    appraisal_file_number,
    appraisal_location_address,
    appraisal_status,
    client_name,
    commit_timestamp,
    contact_name,
    notes,
    type,
  } = row;
  const displayTime = formatDateForActivity(commit_timestamp, true);

  const CurrentUser = () => (
    <Typography className={classes.bold} component={'span'}>
      {currentUser}
    </Typography>
  );

  const Action = () => (
    <Typography component={'span'} className={classes.italic}>
      {type === 'insert' ? ' added ' : ' updated '}
    </Typography>
  );

  const DisplayTime = () => <Typography color="textSecondary">{displayTime}</Typography>;

  const Contacts = () => {
    return (
      <>
        {appraisal_contacts.map((contact: string, index: number) => {
          return (
            <>
              {index > 0 && (
                <Typography component={'span'}>{index + 1 === appraisal_contacts.length ? ' and ' : ', '}</Typography>
              )}
              <Typography component={'span'}>{contact}</Typography>
            </>
          );
        })}

        <Typography component={'span'}> as {appraisal_contacts.length > 1 ? 'Contacts' : 'Contact'}</Typography>
      </>
    );
  };

  const AppraisalLink = () => (
    <Link to={`/appraisals/${activity_id}`} className={classes.link}>
      {appraisal_file_number}
      {appraisal_file_number && appraisal_location_address && ' - '}
      {appraisal_location_address}

      {!appraisal_file_number && !appraisal_location_address && <Typography component={'span'}> Appraisal </Typography>}
    </Link>
  );

  if (activity === 'appraisal') {
    return (
      <Box mb={2}>
        <CurrentUser />
        <Action />
        <Typography component={'span'}>Appraisal </Typography>

        <AppraisalLink />

        {notes && type === 'update' && <Typography component={'span'}> Notes</Typography>}

        {appraisal_status && (
          <>
            <Typography component={'span'}> with </Typography>
            <Typography component={'span'}> Status of </Typography>
            <Typography component={'span'}>{appraisal_status}</Typography>
          </>
        )}

        {appraisal_contacts.length > 0 && (
          <>
            {appraisal_status || notes ? (
              <Typography component={'span'}> and </Typography>
            ) : (
              <Typography component={'span'}> </Typography>
            )}
            <Contacts />
          </>
        )}

        {appraisal_assignees?.length > 0 && (
          <>
            {appraisal_contacts.length > 0 || appraisal_status || notes ? (
              <Typography component={'span'}> and </Typography>
            ) : (
              <Typography component={'span'}> </Typography>
            )}
            {appraisal_assignees.map((assignee: string, index: number) => {
              return (
                <>
                  {index > 0 && (
                    <Typography component={'span'}>
                      {index + 1 === appraisal_assignees.length ? ' and ' : ', '}
                    </Typography>
                  )}
                  <Typography component={'span'}>{assignee}</Typography>
                </>
              );
            })}
            <Typography component={'span'}>
              {` as ${appraisal_assignees?.length > 0 ? 'Assignees' : 'Assignee'}`}
            </Typography>
          </>
        )}

        <DisplayTime />
      </Box>
    );
  }
  if (activity === 'client') {
    if (type === 'insert') {
      return (
        <Box mb={2}>
          <CurrentUser />
          <Typography component={'span'} className={classes.italic}>
            {' added '}
          </Typography>
          <Typography component={'span'}>Client {client_name}</Typography>
          <DisplayTime />
        </Box>
      );
    } else if (type === 'update' && notes) {
      return (
        <Box mb={2}>
          <CurrentUser />
          <Typography component={'span'} className={classes.italic}>
            {' updated'}
          </Typography>
          <Typography component={'span'}> Client {client_name} Notes </Typography>
          <DisplayTime />
        </Box>
      );
    }
  }

  if (activity === 'contact') {
    if (type === 'insert' || (type === 'update' && notes))
      return (
        <Box mb={2}>
          <CurrentUser />

          <Action />

          <Typography component={'span'}>Client Contact {contact_name}</Typography>

          {type === 'update' && notes && <Typography component={'span'}> Notes </Typography>}
          <DisplayTime />
        </Box>
      );
  }

  if (notes && activity_id === member.id) {
    return (
      <Box mb={2}>
        <CurrentUser />

        {currentUser !== 'You' && type === 'insert' && <Typography component={'span'}> was </Typography>}

        <Action />

        {type === 'update' && <Typography component={'span'}>Team Member Notes</Typography>}

        <DisplayTime />
      </Box>
    );
  }
  if (type === 'insert')
    return (
      <Box mb={2}>
        <CurrentUser />

        <Typography component={'span'}> was </Typography>

        <Action />

        <DisplayTime />
      </Box>
    );

  return null;
};
