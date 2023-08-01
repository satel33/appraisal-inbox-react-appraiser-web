import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { Record, FieldProps } from 'react-admin';
import { InjectedFieldProps } from 'ra-ui-materialui/lib/field/types';
import get from 'lodash/get';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TodayIcon from '@material-ui/icons/Today';

const useStyles = makeStyles({
  icon: { paddingRight: '0.5em' },
  link: {
    display: 'inline-flex',
    alignItems: 'start',
  },
});

type ResourceCountProps = FieldProps &
  InjectedFieldProps & {
    filterKey?: string;
    countKey: string;
    hideCount?: boolean;
    filter?(record: Record | undefined): { [key in string]: any };
    startIcon: string;
  };

function ResourceCount({
  record,
  filterKey,
  label,
  countKey,
  basePath,
  hideCount = false,
  filter = () => ({ [filterKey ?? '']: record?.id ?? '' }),
  startIcon,
}: ResourceCountProps) {
  const classes = useStyles();
  let display = label;
  const count = get(record, countKey) ?? 0;
  if (hideCount) {
    display = label;
  } else if (count && count > 1) {
    display = `${label}s (${count})`;
  } else {
    display = `${label} (${count})`;
  }

  const getIcon = () => {
    switch (startIcon) {
      case 'assignment':
        return <AssignmentIcon />;
      case 'equalizer':
        return <EqualizerIcon />;
      case 'today':
        return <TodayIcon />;
    }
  };

  return (
    <Button
      size="medium"
      color="default"
      component={Link}
      startIcon={getIcon()}
      to={{
        pathname: basePath,
        search: stringify({
          page: 1,
          perPage: 25,
          filter: JSON.stringify(filter(record)),
          override: true,
        }),
      }}
      className={classes.link}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      {display}
    </Button>
  );
}

export default ResourceCount;
