import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { displayDateIn } from 'shared/utils';
import { FieldProps } from 'react-admin';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

type DateInColumnProps = FieldProps & {
  locales?: string;
  options?: Intl.DateTimeFormatOptions;
  source:
    | 'inspection_date'
    | 'due_date'
    | 'quote_made_date'
    | 'reviewed_date'
    | 'revision_request_date'
    | 'on_hold_date'
    | 'canceled_date'
    | 'completed_date';
};

function DateInColumn(props: DateInColumnProps) {
  const { record, source, locales, options } = props;
  const classes = useStyles();
  if (!record || !record?.[source ?? '']) {
    return null;
  }
  return (
    <div className={classes.root}>
      <span>{new Date(record[source]).toLocaleDateString(locales, options)}</span>
      {record[`${source}_in`] && <span>{`(${displayDateIn(record[`${source}_in`])})`}</span>}
    </div>
  );
}

export default DateInColumn;
