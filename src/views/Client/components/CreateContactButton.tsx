import React, { useState } from 'react';
import { Button, useCreate, useNotify, Record } from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import ContactDialog from 'views/Contact/components/ContactDialog';
import { Contact } from 'views/Contact/types';

type CreateContactButtonProps = {
  initialValues?: Partial<Contact>;
  onSuccess?(): void;
};

function CreateContactButton(props: CreateContactButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [create, { loading }] = useCreate('contact');
  const notify = useNotify();

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (values: Partial<Contact>) => {
    create(
      {
        payload: {
          data: values,
        },
      },
      {
        onSuccess: async ({ data }: { data: Record }) => {
          setShowDialog(false);
          notify('Contact successfully created');
          props.onSuccess?.();
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
      <ContactDialog
        initialValues={props.initialValues}
        isVisible={showDialog}
        onClose={handleCloseClick}
        title="Add Contact"
        onSubmit={handleSubmit}
        loading={loading}
        typeVisible
      />
    </>
  );
}

export default CreateContactButton;
