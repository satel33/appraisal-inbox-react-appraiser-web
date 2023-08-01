import React from 'react';
import { Button, SaveButton, FormWithRedirect, FormWithRedirectSave } from 'react-admin';
import IconCancel from '@material-ui/icons/Cancel';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TransactionForm from './TransactionForm';
import { Transaction } from '../types';

type TransactionDialogProps = {
  isVisible: boolean;
  onClose(): void;
  typeVisible?: boolean;
  loading: boolean;
  title: string;
  initialValues?: Partial<Transaction>;
  onSubmit: FormWithRedirectSave;
  propertyTypeId?: number | null;
  readOnly?: boolean;
};

function TransactionDialog(props: TransactionDialogProps) {
  const { isVisible, onClose, title, onSubmit, loading, initialValues, propertyTypeId, readOnly } = props;
  return (
    <Dialog maxWidth="md" fullWidth open={isVisible} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <FormWithRedirect
        initialValues={initialValues}
        save={onSubmit}
        render={({ handleSubmitWithRedirect, saving }: any) => (
          <>
            <DialogContent>
              <TransactionForm propertyTypeId={propertyTypeId} />
            </DialogContent>
            <DialogActions>
              <Button label="ra.action.cancel" onClick={onClose} disabled={loading}>
                <IconCancel />
              </Button>
              {!readOnly && (
                <SaveButton handleSubmitWithRedirect={handleSubmitWithRedirect} saving={saving} disabled={loading} />
              )}
            </DialogActions>
          </>
        )}
      />
    </Dialog>
  );
}

export default TransactionDialog;
