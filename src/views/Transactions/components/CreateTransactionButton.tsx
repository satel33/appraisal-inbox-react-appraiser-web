import React, { useState } from 'react';
import { Button, useCreate, useNotify } from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import TransactionDialog from './TransactionDialog';
import { Transaction } from '../types';
import { InjectedFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Property } from 'views/Property/types';

type CreateTransactionButtonProps = InjectedFieldProps<Property> & {
  initialValues?: Partial<Transaction>;
  title: string;
  onSuccess(): void;
};

function CreateTransactionButton(props: CreateTransactionButtonProps) {
  const { title, initialValues, record } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [create, { loading }] = useCreate('transaction');
  const notify = useNotify();

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (values: Partial<Transaction>) => {
    create(
      {
        payload: {
          data: {
            ...values,
            property_id: record?.id,
            property_type_id: record?.property_type_id,
          },
        },
      },
      {
        onSuccess: async () => {
          setShowDialog(false);
          notify('Assessment successfully created');
          props.onSuccess();
        },
        onFailure: ({ error }) => {
          notify(error.message, 'error');
        },
      },
    );
  };

  return (
    <>
      <Button onClick={handleClick} label="ra.action.create">
        <IconContentAdd />
      </Button>
      <TransactionDialog
        propertyTypeId={record?.property_type_id}
        initialValues={initialValues}
        isVisible={showDialog}
        onClose={handleCloseClick}
        title={title}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
}

export default CreateTransactionButton;
