import React from 'react';
import { ToolbarProps, View } from 'react-big-calendar';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import { AppraisalEvent } from 'views/Appraisal/types';
import formatDate from 'date-fns/format';
import add from 'date-fns/add';
import useLocationQuery from 'shared/hooks/useLocationQuery';

type ViewIcon = {
  view: View;
};
const viewIcons: ViewIcon[] = [
  {
    view: 'agenda',
  },
  {
    view: 'month',
  },
];

function CalendarToolbar(props: ToolbarProps<AppraisalEvent>) {
  const { view, date } = props;
  const [, onChangeQuery] = useLocationQuery();
  let display = formatDate(date, 'MMMM yyyy');
  if (view === 'agenda') {
    display = `${formatDate(date, 'MMM dd yyyy')} - ${formatDate(add(date, { months: 1 }), 'MMM dd yyyy')}`;
  } else if (view === 'day') {
    display = formatDate(date, 'EEEE MMM dd');
  }
  return (
    <Grid alignItems="center" container justify="space-between" spacing={3}>
      <Grid item>
        <Box color="text.primary">
          <IconButton color="inherit" onClick={() => props.onNavigate('PREV')}>
            <ChevronLeft />
          </IconButton>
          <Button size="small" onClick={() => props.onNavigate('TODAY')}>
            {props.localizer.messages.today}
          </Button>
          <IconButton color="inherit" onClick={() => props.onNavigate('NEXT')}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Grid>
      <Hidden smDown>
        <Grid item>
          <Typography variant="h6" color="textPrimary">
            {display}
          </Typography>
        </Grid>
        <Grid item>
          <ButtonGroup>
            {viewIcons.map(({ view }) => (
              <Button
                key={view}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onView(view);
                  onChangeQuery({ calendarView: view });
                }}
              >
                {props.localizer.messages[view] ?? ''}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
      </Hidden>
    </Grid>
  );
}

export default CalendarToolbar;
