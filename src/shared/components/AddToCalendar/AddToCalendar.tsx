import React from 'react';
import AddToCalendarHOC from 'react-add-to-calendar-hoc';

import { Box, IconButton, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AlarmAdd } from '@material-ui/icons';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  scheduleBtn: {
    cursor: 'pointer',
  },
  linkStyles: {
    textDecoration: 'none',
    padding: '.5rem 1rem',
    color: '#434445',
  },
  dropDownContainer: {
    padding: 0,
    margin: 0,
    position: 'absolute',
    zIndex: 100,
    left: '-5rem',

    border: '1px solid #cecece',

    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    backgroundColor: 'white',
  },
});

interface Props {
  date: string;
  title: string;
  location: string;
}

const DropDownComponent = (args: { children: any[] }) => {
  const classes = useStyles();
  return (
    <Box className={classes.dropDownContainer}>
      {args.children.map((link, i) => {
        return <MenuItem key={i}>{link}</MenuItem>;
      })}
    </Box>
  );
};
const ButtonComponent = (args: any) => {
  return (
    <IconButton onClick={args.onClick}>
      <AlarmAdd />
    </IconButton>
  );
};

export const AddToCalendar = (props: Props) => {
  const { date, title, location } = props;

  const classes = useStyles();
  const url = useLocation();
  const AddToCalendarDropdown = AddToCalendarHOC(ButtonComponent, DropDownComponent);

  const startDatetime = moment(date).utc();
  const endDatetime = startDatetime.clone();
  const duration = moment.duration(endDatetime.diff(startDatetime)).asHours();

  const description = window.location.href.replace(url.hash, '');

  const event = {
    description,
    duration,
    endDatetime: endDatetime.format('YYYYMMDDTHHmmssZ'),
    location: location?.replace(/[\r\n]/gm, ''),
    startDatetime: startDatetime.format('YYYYMMDDTHHmmssZ'),
    title,
  };

  return (
    <AddToCalendarDropdown
      event={event}
      linkProps={{
        className: classes.linkStyles,
      }}
      filename={title}
    />
  );
};
