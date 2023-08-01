import { AppraisalEvent } from 'views/Appraisal/types';
import { EventProps } from 'react-big-calendar';
import React from 'react';
import EventWrapper from './EventWrapper';
import Typography from '@material-ui/core/Typography';

type AgendaEventProps = Omit<EventProps<AppraisalEvent>, 'title'>;
function AgendaEvent(props: AgendaEventProps) {
  return (
    <EventWrapper event={props.event}>
      <Typography variant="body2">{`${props.event.appraisal_file_number} - ${props.event.location_address}`}</Typography>
    </EventWrapper>
  );
}
export default AgendaEvent;
