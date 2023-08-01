import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps } from 'react-admin';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: (props: any) => props.align,
    marginTop: (props: any) => props.mt,
    marginLeft: (props: any) => props.ml,
    fontStyle: (props: any) => props.fontStyle,
  },
});

type DateInColumnProps = FieldProps & {
  locales?: string;
  options?: Intl.DateTimeFormatOptions;
  source: 'last_active_at' | 'updated_at';
  align?: 'left' | 'right';
  mt?: string;
  ml?: string;
  fontStyle?: string;
};

function DateInColumn(props: DateInColumnProps) {
  const { record, source, locales, options } = props;
  const classes = useStyles(props);
  if (!record || !record?.[source ?? '']) {
    return (
      <div className={classes.root}>
        <span>Hasn't signed in</span>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <span>
        {new Date(record[source]).toLocaleDateString(locales, options)} @{' '}
        {new Date(record[source]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
      </span>
    </div>
  );
}

export default DateInColumn;
