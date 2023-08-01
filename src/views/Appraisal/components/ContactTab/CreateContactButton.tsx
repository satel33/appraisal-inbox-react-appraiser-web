import React, { useState } from 'react';
import { Button, useCreate, useNotify, useUpdate, Record } from 'react-admin';
import { useForm } from 'react-final-form';
import IconContentAdd from '@material-ui/icons/Add';
import ContactDialog from 'views/Contact/components/ContactDialog';
import { Appraisals } from 'views/Appraisal/types';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Contact } from 'views/Contact/types';

type CreateContactButtonProps = InjectedFieldProps<Appraisals> & PublicFieldProps;
function CreateContactButton(props: CreateContactButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const form = useForm();
  const [create, { loading }] = useCreate('contact');
  const [update] = useUpdate('appraisal', props.record?.id);
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
          const { contact_ids: contacts = [] } = props.record ?? {};
          await update({
            payload: {
              data: {
                contact_ids: contacts.concat([data.id]),
              },
            },
          });
          form.change('contact_ids', contacts.concat([data.id]));
          setShowDialog(false);
          notify('Contact successfully created');
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
