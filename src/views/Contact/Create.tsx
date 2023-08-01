import React from 'react';
import { useNotify, Create, ResourceContextProvider, useRedirect, CreateProps, Record } from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import useContactOptions from 'shared/hooks/useContactOptions';
import ContactForm from './ContactForm';

const CreateContact = (props: CreateProps) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [options] = useContactOptions();
  return (
    <ResourceContextProvider value="contact">
      <Create {...props} actions={<EditAction />} resource="contact" onSuccess={onSuccess}>
        <ContactForm options={options} />
      </Create>
    </ResourceContextProvider>
  );

  function onSuccess({ data }: Record) {
    notify('contact.created');
    redirect(`/contacts/${data.id}`);
  }
};

export default CreateContact;
