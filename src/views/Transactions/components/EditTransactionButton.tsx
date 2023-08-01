import React from 'react';
import ContentCreate from '@material-ui/icons/Create';
import ViewIcon from '@material-ui/icons/Visibility';
import { Button, useUpdate, useNotify, FieldProps } from 'react-admin';
import omit from 'lodash/omit';
import TransactionDialog from './TransactionDialog';
import { Transaction } from '../types';

type EditTransactionButtonProps = FieldProps<Transaction> & {
  onSuccess?(): void;
  readOnly?: boolean;
};

function EditTransactionButton(props: EditTransactionButtonProps) {
  const { readOnly } = props;
  const [showDialog, setShowDialog] = React.useState(false);
  const [update, { loading }] = useUpdate('transaction', props.record?.id);
  const notify = useNotify();

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (values: Partial<Transaction>) => {
    update(
      {
        payload: {
          data: omit(values, 'updated_at', 'created_at', 'id', 'organization_id', 'user_account_id'),
        },
      },
      {
        onSuccess: async () => {
          setShowDialog(false);
          notify('Transaction successfully updated');
          props?.onSuccess?.();
        },
        onFailure: ({ error }) => {
          notify(error.message, 'error');
        },
      },
    );
  };
  const action = readOnly ? 'View' : 'Edit';
  const title = `${action} ${props.record?.transaction_type_id === 1 ? 'Sales' : 'Lease'} Transaction`;
  return (
    <>
      <Button onClick={handleClick}>{readOnly ? <ViewIcon /> : <ContentCreate />}</Button>
      <TransactionDialog
        readOnly={readOnly}
        propertyTypeId={props.record?.property_type_id}
        isVisible={showDialog}
        onClose={handleCloseClick}
        title={title}
        onSubmit={handleSubmit}
        loading={loading}
        initialValues={props.record}
      />
    </>
  );
}

export default EditTransactionButton;
