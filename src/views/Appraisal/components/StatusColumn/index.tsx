import * as React from 'react';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { BackGroundType, getBackgroundColorMapping, getColorMapping } from 'shared/hooks/useRowStyle';
import { FieldProps } from 'react-admin';
import { Appraisals } from 'views/Appraisal/types';

const useStatusColumnStyles = makeStyles({
  root: {
    height: '20px',
    padding: '4px 8px',
    flexGrow: 0,
    fontSize: '0.75rem',
    minWidth: '20px',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    borderRadius: '2px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // @ts-ignore
    fontWeight: 500,
    backgroundColor: (props: StyleProps) => props.backgroundColor,
    color: (props: StyleProps) => props.color,
  },
});
type StyleProps = {
  backgroundColor: string;
  color: string;
};
function TextField(props: FieldProps<Appraisals>) {
  const { source, record, emptyText } = props;
  const value = get(record, source || '');
  const classes = useStatusColumnStyles({
    color: (record?.appraisal_status && getColorMapping(record?.appraisal_status)) ?? '',
    backgroundColor:
      (record?.appraisal_status && getBackgroundColorMapping(record?.appraisal_status, BackGroundType.Cell)) ?? '',
  });
  return (
    <Typography component="span" variant="body2" className={classes.root}>
      {value != null && typeof value !== 'string' ? JSON.stringify(value) : value || emptyText}
    </Typography>
  );
}

TextField.displayName = 'TextField';

export default TextField;
