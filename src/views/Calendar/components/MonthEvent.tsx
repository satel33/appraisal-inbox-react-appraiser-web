import { AppraisalEvent } from 'views/Appraisal/types';
import { EventProps } from 'react-big-calendar';
import React from 'react';
import formatDate from 'date-fns/format';
import EventWrapper from './EventWrapper';
import Typography from '@material-ui/core/Typography';

const MonthEvent: React.FunctionComponent<EventProps<AppraisalEvent>> = (props) => {
  return (
    <EventWrapper event={props.event}>
      <Typography variant="body2">
        {[props.event.appraisal_file_number, formatDate(props.event.start, 'hh:mm a')].filter(Boolean).join(' @ ')}
      </Typography>
    </EventWrapper>
  );
};
export default MonthEvent;
