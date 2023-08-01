import React, { ReactNode } from 'react';
import Popover from '@material-ui/core/Popover';
import MapPopup from 'views/Appraisal/components/AppraisalMap/MapPopup';
import { EventProps } from 'react-big-calendar';
import { AppraisalEvent } from 'views/Appraisal/types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  paper: {
    borderRadius: 0,
  },
});
type EventWrapperProps = Omit<EventProps<AppraisalEvent>, 'title'> & {
  children: ReactNode;
};
function EventWrapper(props: EventWrapperProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const classes = useStyles();
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <div aria-describedby={props.event.id} onClick={handleClick}>
        {props.children}
      </div>
      <Popover
        id={props.event.id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        classes={classes}
      >
        <MapPopup
          hideInspection={props.event.type === 'due_date'}
          hideDue={props.event.type === 'inspection_date'}
          selected={props.event}
        />
      </Popover>
    </>
  );
}

export default EventWrapper;
