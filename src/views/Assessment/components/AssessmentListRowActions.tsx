import React from 'react';
import { DeleteWithConfirmButton, DeleteWithConfirmButtonProps, FieldProps } from 'react-admin';
import Grid from '@material-ui/core/Grid';
import EditAssessmentButton from './EditAssessmentButton';
import { Assessment } from '../types';

type AssessmentListRowActionsProps = DeleteWithConfirmButtonProps &
  FieldProps<Assessment> & {
    onSuccess?(): void;
    readOnly?: boolean;
  };
function AssessmentListRowActions(props: AssessmentListRowActionsProps) {
  if (!props.record) return null;
  return (
    <Grid container>
      <Grid item>
        <EditAssessmentButton {...props} />
      </Grid>
      {!props.readOnly && (
        <Grid item>
          <DeleteWithConfirmButton {...props} />
        </Grid>
      )}
    </Grid>
  );
}

export default AssessmentListRowActions;
