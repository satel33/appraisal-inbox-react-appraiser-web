import * as React from 'react';
import { useNotify, Edit, EditProps } from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import Title from './Title';
import ClientForm from './ClientForm';

const EditClient = (props: EditProps): JSX.Element => {
  const notify = useNotify();
  const onSuccess = () => {
    notify('client.updated');
  };
  return (
    <Edit
      undoable={false}
      onSuccess={onSuccess}
      title={<Title />}
      actions={<EditAction />}
      {...props}
      resource="client"
    >
      <ClientForm />
    </Edit>
  );
};

export default EditClient;
