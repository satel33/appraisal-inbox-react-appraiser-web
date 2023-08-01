import { AppraisalEvent } from 'views/Appraisal/types';
import { EventProps } from 'react-big-calendar';
import React from 'react';
import EventWrapper from './EventWrapper';
import Typography from '@material-ui/core/Typography';

const EventView: React.FunctionComponent<EventProps<AppraisalEvent>> = (props) => {
  return (
    <EventWrapper event={props.event}>
      <Typography variant="body2">{props.event.appraisal_file_number}</Typography>
    </EventWrapper>
  );
};
export default EventView;
