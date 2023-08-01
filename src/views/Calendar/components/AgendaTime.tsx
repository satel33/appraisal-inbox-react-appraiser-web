import React from 'react';
import Typography from '@material-ui/core/Typography';
import format from 'date-fns/format';
import { AppraisalEvent } from 'views/Appraisal/types';

type AgendaTimeProps = {
  event: AppraisalEvent;
};

function AgendaTime(props: any) {
  const { event } = props;
  return (
    <Typography variant="body2">
      {event.type === 'due_date'
        ? `Due @ ${format(new Date(event.due_date), 'hh:mm a')}`
        : `Inspection @ ${format(new Date(event.inspection_date), 'hh:mm a')}`}
    </Typography>
  );
}
export default AgendaTime;
