import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps, Record } from 'react-admin';

const useStyles = makeStyles({
  main: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: -8,
    marginBottom: -8,
  },
  chip: { margin: 3 },
});

type WithAssignees = Record & {
  assignee_user_account_names?: string[];
};

const AssigneeField: React.FC<FieldProps<WithAssignees>> = ({ record = {} }) => {
  const classes = useStyles();

  return record ? (
    <span className={classes.main}>
      {record.assignee_user_account_names &&
        record.assignee_user_account_names.map((name) => {
          const [firstName, lastName] = name.split(' ');
          return name ? (
            <Chip className={classes.chip} size="small" key={name} label={`${firstName} ${lastName.charAt(0)}.`} />
          ) : null;
        })}
    </span>
  ) : null;
};

AssigneeField.defaultProps = {
  addLabel: true,
  source: 'assignee_user_account_names',
};

export default AssigneeField;
