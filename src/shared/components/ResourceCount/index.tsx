import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { Record, FieldProps } from 'react-admin';
import { InjectedFieldProps } from 'ra-ui-materialui/lib/field/types';
import get from 'lodash/get';
import pluralize from 'pluralize';

const useStyles = makeStyles({
  icon: { paddingRight: '0.5em' },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
  },
});

type ResourceCountProps = FieldProps &
  InjectedFieldProps & {
    filterKey?: string;
    countKey: string;
    hideCount?: boolean;
    filter?(record: Record | undefined): { [key in string]: any };
  };

function ResourceCount({
  record,
  filterKey,
  label,
  countKey,
  basePath,
  hideCount = false,
  filter = () => ({ [filterKey ?? '']: record?.id ?? '' }),
}: ResourceCountProps) {
  const classes = useStyles();
  let display = label;
  const count = get(record, countKey) ?? 0;
  if (hideCount) {
  } else {
    display = pluralize(display as string, count, true);
  }
  // else if (count && count > 1) {
  //   display = `${count} ${display}s`;
  // } else if (count && count === 1) {
  //   display = `${count} ${display}`;
  // } else {
  //   display = `${count} ${display}`;
  // }
  return (
    <Button
      size="medium"
      color="primary"
      component={Link}
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
