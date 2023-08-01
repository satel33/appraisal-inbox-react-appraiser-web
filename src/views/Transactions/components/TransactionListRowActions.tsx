import React from 'react';
import {
  DeleteWithConfirmButton,
  ResourceContextProvider,
  FieldProps,
  DeleteWithConfirmButtonProps,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import EditTransactionButton from './EditTransactionButton';
import { Transaction } from '../types';

type TransactionListRowActionsProps = DeleteWithConfirmButtonProps &
  FieldProps<Transaction> & {
    propertyTypeId?: number;
    onSuccess?(): void;
    readOnly?: boolean;
  };
function TransactionListRowActions(props: TransactionListRowActionsProps) {
  if (!props.record) return null;
  const { record, onSuccess, readOnly } = props;
  return (
    <Grid container>
      <Grid item>
        <EditTransactionButton readOnly={readOnly} onSuccess={onSuccess} record={record} />
      </Grid>
      {!readOnly && (
        <Grid item>
          <ResourceContextProvider value="transaction">
            <DeleteWithConfirmButton {...props} />
          </ResourceContextProvider>
        </Grid>
      )}
    </Grid>
  );
}

export default TransactionListRowActions;
