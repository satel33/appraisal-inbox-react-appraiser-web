import React from 'react';
import { useNotify, Create, ResourceContextProvider, useRedirect, CreateProps } from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import ClientForm from './ClientForm';
import { Client } from './types';

const ClientCreate = (props: CreateProps) => {
  const notify = useNotify();
  const redirect = useRedirect();
  return (
    <ResourceContextProvider value="client">
      <Create {...props} actions={<EditAction />} onSuccess={onSuccess} resource="client">
        <ClientForm isCreate />
      </Create>
    </ResourceContextProvider>
  );

  function onSuccess({ data }: { data: Client }) {
    notify('client.created');
    redirect(`/clients/${data.id}`);
  }
};

export default ClientCreate;
