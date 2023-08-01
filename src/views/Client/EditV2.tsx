import React from 'react';
import { useNotify, Edit, EditProps } from 'react-admin';
import Title from './Title';
import ClientForm from './ClientEditForm';

const EditClient = (props: EditProps): JSX.Element => {
  const notify = useNotify();
  const onSuccess = () => {
    notify('client.updated');
  };

  return (
    <Edit undoable={false} onSuccess={onSuccess} title={<Title />} {...props} resource="client">
      <ClientForm />
    </Edit>
  );
};

export default EditClient;
