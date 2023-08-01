import { Box, Typography } from '@material-ui/core';
import formatDate from 'date-fns/format';
import React from 'react';
import { styleLeft } from 'shared/hooks/useEditFormStyle';
import { formatDateForActivity } from 'shared/utils';
import { AppraisalActivities } from 'views/Appraisal/types';

interface Props {
  row: AppraisalActivities;
  currentUser: boolean;
  appraisal?: any;
}

export const AppraisalActivityRow = ({ row, currentUser }: Props) => {
  const classes = styleLeft();

  const { appraisal_status, assignees, commit_timestamp, contacts, dates, notes, type, fees, files } = row;

  const displayTime = formatDateForActivity(commit_timestamp, true);

  const CurrentUser = () => (
    <Typography className={classes.bold} component={'span'}>
      {currentUser}
    </Typography>
  );
  const DisplayTime = () => <Typography color="textSecondary">{displayTime}</Typography>;

  const Contacts = () => {
    return (
      <>
        {contacts.length > 0 && (
          <>
            {contacts.map((contact: string, index: number) => {
              return (
                <>
                  {index > 0 && (
                    <Typography component={'span'}>{index + 1 === contacts.length ? ' and ' : ', '}</Typography>
                  )}
                  <Typography component={'span'}>{contact}</Typography>
                </>
              );
            })}
            <Typography component={'span'}> as Contact{contacts.length > 1 ? 's' : ''}</Typography>
          </>
        )}
      </>
    );
  };

  const Assignees = () => {
    return (
      <>
        {assignees?.length > 0 && (
          <>
            {assignees.map((assignee: string, index: number) => {
              return (
                <>
                  {index > 0 && (
                    <Typography component={'span'}>{index + 1 === assignees.length ? ' and ' : ', '}</Typography>
                  )}
                  <Typography component={'span'}>{assignee}</Typography>
                </>
              );
            })}
            <Typography component={'span'}> as {assignees?.length > 1 ? 'Assignees' : 'Assignee'} </Typography>
          </>
        )}
      </>
    );
  };

  const Action = () => (
    <Typography component={'span'} className={classes.italic}>
      {type === 'insert' ? ' added ' : ' updated '}
    </Typography>
  );
  if (appraisal_status === 'Completed' && dates.completed_date) {
    const completedDate = new Date(dates.completed_date);
    const formattedCompletedDate = formatDate(completedDate, 'M/d/YYY @ h:mma');
    return (
      <Box mb={2}>
        <CurrentUser />
        <Action />
        <Typography component={'span'}>Status to Completed and Completed Date to {formattedCompletedDate}</Typography>
        {type === 'update' && notes && (
          <>
            <Typography component={'span'}> and Notes</Typography>
          </>
        )}
        <DisplayTime />
      </Box>
    );
  }

  const { due_date, inspection_date } = dates;
  const { quote_fee, report_fee } = fees;
  if (due_date || inspection_date) {
    return (
      <Box mb={2}>
        <CurrentUser />
        <Action />
        <Typography component="span">{'Appraisal '}</Typography>
        {notes && type === 'update' && <Typography component="span">Notes </Typography>}

        {appraisal_status && <Typography component={'span'}>with Status of {appraisal_status} </Typography>}

        {type === 'insert' && !notes ? (
          <Typography component="span">and set</Typography>
        ) : (
          appraisal_status && <Typography component="span">and</Typography>
        )}

        {inspection_date && (
          <>
            <Typography component="span">
              {' '}
              Inspection Date to {formatDate(new Date(inspection_date), 'M/d/YYY @ h:mma')}
            </Typography>

            {due_date && <Typography component="span"> and</Typography>}
          </>
        )}
        {due_date && (
          <Typography component="span"> Due Date to {formatDate(new Date(due_date), 'M/d/YYY @ h:mma')} </Typography>
        )}
        {!!quote_fee && <Typography component={'span'}> and Quote Fee to ${quote_fee}</Typography>}
        {!!report_fee && <Typography component={'span'}> and Report Fee to ${report_fee}</Typography>}

        {contacts?.length > 0 && <Typography component={'span'}>{appraisal_status ? ' and ' : ' with '}</Typography>}
        <Contacts />
        {(!!quote_fee || !!report_fee || contacts?.length > 0 || appraisal_status) && assignees?.length > 0 && (
          <Typography component="span"> and </Typography>
        )}
        <Assignees />

        <DisplayTime />
      </Box>
    );
  }

  if (files && files.length > 0) {
    return (
      <Box mb={2}>
        <CurrentUser />
        <Typography component={'span'} className={classes.italic}>
          {' uploaded '}
        </Typography>
        {files.map((file: string, index: number) => (
          <>
            {index > 0 && <Typography component={'span'}>{index + 1 === files.length ? ' and ' : ', '}</Typography>}
            <Typography component={'span'}>{file}</Typography>
          </>
        ))}
        <DisplayTime />
      </Box>
    );
  }

  if (
    appraisal_status ||
    contacts?.length > 0 ||
    assignees?.length > 0 ||
    quote_fee ||
    report_fee ||
    // type === 'insert' ||
    notes
  ) {
    return (
      <Box mb={2}>
        <CurrentUser />

        <Action />

        <Typography component={'span'}>Appraisal </Typography>
        {notes && type === 'update' && <Typography component={'span'}>Notes</Typography>}

        {appraisal_status && <Typography component={'span'}> with Status of {appraisal_status}</Typography>}

        {(contacts?.length > 0 || assignees?.length > 0 || !!quote_fee || !!report_fee) && (
          <Typography component="span">
            {type === 'insert' ? ' and set ' : appraisal_status ? ' and ' : ' with '}
          </Typography>
        )}

        <Contacts />
        {contacts?.length > 0 && assignees?.length > 0 && <Typography component="span"> and </Typography>}
        <Assignees />

        {(assignees?.length > 0 || contacts?.length > 0) && (!!quote_fee || !!report_fee) && (
          <Typography component={'span'}> and </Typography>
        )}

        {!!quote_fee && <Typography component={'span'}>Quote Fee to ${quote_fee}</Typography>}

        {(!!quote_fee || notes) && !!report_fee && <Typography component={'span'}> and </Typography>}
        {!!report_fee && <Typography component={'span'}>Report Fee to ${report_fee}</Typography>}
        <DisplayTime />
      </Box>
    );
  }

  if (type === 'update' && notes) {
    return (
      <Box mb={2}>
        <CurrentUser />
        <Action />
        <Typography component={'span'}>Appraisal Notes</Typography>
        <DisplayTime />
      </Box>
    );
  }

  return null;
};
