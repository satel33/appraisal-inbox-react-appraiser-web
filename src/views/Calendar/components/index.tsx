import React, { useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import introspectionResult from 'shared/dataProvider/instrospection';
import pick from 'lodash/pick';
import { Calendar as ReactBigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import AgendaDate from './AgendaDate';
import format from 'date-fns/format';
import parseDate from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
// import LinearProgress from '@material-ui/core/LinearProgress';
import TablePreloader from 'shared/components/TablePreloader';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// @ts-ignore
import { buildVariables } from 'ra-data-hasura';
import useMaxDimensions from 'shared/hooks/useMaxDimension';
import CalendarToolbar from './CalendarToolbar';
import MonthEvent from './MonthEvent';
import EventView from './EventView';
import { AppraisalEvent, AppraisalEventType, Appraisals as Appraisal } from 'views/Appraisal/types';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import endOfDay from 'date-fns/endOfDay';
import AgendaEvent from './AgendaEvent';
import AgendaTime from './AgendaTime';
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse: parseDate,
  startOfWeek,
  getDay,
  locales,
});

const useStyles = makeStyles((theme) => ({
  calendar: {
    boxShadow: 'none',
    '& .rbc-event-label': {
      display: 'none',
    },
    '& .rbc-header': {
      fontWeight: 500,
    },
    '& .rbc-event.inspection': {
      backgroundColor: '#9c27b0',
    },
    '& .rbc-event.due': {
      backgroundColor: '#ff9800',
    },
    '& .rbc-agenda-view': {
      '& .inspection': {
        '& .rbc-agenda-time-cell': {
          borderLeftColor: '#9c27b0',
          borderLeftStyle: 'solid',
          borderLeftWidth: '5px',
          textTransform: 'none',
        },
      },
      '& .due': {
        '& .rbc-agenda-time-cell': {
          borderLeftColor: '#ff9800',
          borderLeftStyle: 'solid',
          borderLeftWidth: '5px',
          textTransform: 'none',
        },
      },
      '& .rbc-agenda-table': {
        borderCollapse: 'separate',
        '& thead': {
          display: 'none',
        },
      },
      '& .rbc-agenda-date-cell, .rbc-agenda-time-cell, .rbc-agenda-event-cell': {
        borderBottom: '1px solid #DDD',
        padding: '12px',
      },
      '& .rbc-agenda-event-cell': {
        cursor: 'pointer',
      },
    },
  },
}));
type AppraisalScheduleResponse = {
  scheduleData: Appraisal[];
};

const APPRAISAL_SCHEDULE_QUERY = gql`
  query AppraisalMap($where: appraisals_bool_exp) {
    scheduleData: appraisals(where: $where) {
      id
      due_date
      appraisal_file_number
      inspection_date
      location_address
      appraisal_status
      location_geography
      property_type_id
      appraisal_status_id
      appraisal_status
      client_name
      location_address
      assignee_user_account_names
      due_date_in
      inspection_date_in
      completed_date
    }
  }
`;

function getEvents(response: AppraisalScheduleResponse | undefined, key: AppraisalEventType): AppraisalEvent[] {
  return (
    response?.scheduleData
      .filter((e) => e[key])
      .map((e) => ({
        title: `${e.appraisal_file_number} - ${e.location_address}`,
        start: new Date(e[key]),
        end: endOfDay(new Date(e[key])),
        allDay: false,
        type: key,
        ...e,
      })) ?? []
  );
}
const appraisalResource = introspectionResult.resources.find((e) => e.type.name === 'appraisals');
type CalendarProps = {
  defaultFilter: {
    [key in string]: any;
  };
  currentDate: Date;
  onChangeDate(date: Date): void;
};

function Calendar(props: CalendarProps) {
  const [queryString] = useLocationQuery();
  const variables = buildVariables(null)(appraisalResource, 'GET_LIST', {
    filter: {
      ...JSON.parse(queryString.filter || '{}'),
      ...props.defaultFilter,
    },
  });
  const defaultView: View = queryString.calendarView ?? 'agenda';
  const response = useQuery<AppraisalScheduleResponse>(APPRAISAL_SCHEDULE_QUERY, {
    variables: pick(variables, 'where'),
    fetchPolicy: 'cache-and-network',
  });
  const [selectedTypes, setSelectedTypes] = useState([AppraisalEventType.Inspection, AppraisalEventType.Due]);
  const classes = useStyles();
  const [currentView, setCurrentView] = useState<View>(defaultView);
  const events = useMemo(
    () => [
      ...(selectedTypes.includes(AppraisalEventType.Inspection)
        ? getEvents(response.data, AppraisalEventType.Inspection)
        : []),
      ...(selectedTypes.includes(AppraisalEventType.Due) ? getEvents(response.data, AppraisalEventType.Due) : []),
    ],
    [response.data?.scheduleData, selectedTypes, currentView],
  );
  const { loading } = response;
  const dimensions = useMaxDimensions();
  return (
    <div className={classes.calendar} style={{ width: dimensions.width, height: 'calc(100vh - 136px)' }}>
      {loading ? (
        <TablePreloader columns={3} />
      ) : (
        <>
          <ReactBigCalendar<AppraisalEvent>
            onNavigate={props.onChangeDate}
            date={props.currentDate}
            localizer={localizer}
            events={events}
            startAccessor="start"
            onView={(newView) => setCurrentView(newView)}
            view={currentView}
            endAccessor="end"
            popup
            style={{ height: '90%' }}
            eventPropGetter={(event) => ({
              className: event.type === 'due_date' ? 'due' : 'inspection',
            })}
            popupOffset={{ x: 30, y: 20 }}
            messages={{
              event: 'Appraisal File Number',
            }}
            components={{
              toolbar: CalendarToolbar,
              event: EventView,
              month: {
                event: MonthEvent,
              },
              agenda: {
                // @ts-ignore
                date: AgendaDate,
                time: AgendaTime,
                event: AgendaEvent,
              },
            }}
          />
          <Box display="flex">
            <FormControlLabel
              onChange={(_, value) => togggleTypeFilter(value, AppraisalEventType.Inspection)}
              checked={selectedTypes.includes(AppraisalEventType.Inspection)}
              control={<InspectionCheckbox name="checkedDue" />}
              label="Inspection"
            />
            <FormControlLabel
              onChange={(_, value) => togggleTypeFilter(value, AppraisalEventType.Due)}
              checked={selectedTypes.includes(AppraisalEventType.Due)}
              control={<DueCheckbox name="checkedDue" />}
              label="Due"
            />
          </Box>
        </>
      )}
    </div>
  );

  function togggleTypeFilter(value: boolean, type: AppraisalEventType) {
    if (!value) {
      setSelectedTypes((prev) => prev.filter((e) => e !== type));
    } else {
      setSelectedTypes((prev) => prev.concat([type]));
    }
  }
}

const DueCheckbox = withStyles({
  root: {
    color: '#ff9800',
    '&$checked': {
      color: '#ff9800',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);
const InspectionCheckbox = withStyles({
  root: {
    color: '#9c27b0',
    '&$checked': {
      color: '#9c27b0',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export default Calendar;
