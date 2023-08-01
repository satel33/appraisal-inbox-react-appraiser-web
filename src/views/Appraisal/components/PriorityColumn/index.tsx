import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import red from '@material-ui/core/colors/red';
import { FieldProps } from 'react-admin';
import { Appraisal } from 'views/Appraisal/types';

type StyleProps = {
  fontStyle: string;
  color: string;
};
const useStyles = makeStyles({
  root: {
    fontStyle: (props: StyleProps) => props.fontStyle,
    color: (props: StyleProps) => props.color,
  },
});

function PriorityColumn(props: FieldProps<Appraisal>) {
  const { record, source } = props;
  const value = get(record, source || '');
  const color = record?.appraisal_priority === 'Rush' ? red[500] : '#000000';
  const classes = useStyles({ fontStyle: record?.appraisal_priority === 'Rush' ? 'italic' : 'normal', color });

  return <span className={classes.root}>{value}</span>;
}

export default PriorityColumn;
