import React from 'react';
import { SimpleForm, Edit, ResourceContextProvider, useNotify, TitleProps, EditProps } from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import Toolbar from 'shared/components/Resource/Toolbar';
import TransactionForm from '../components/TransactionForm';
import getTransactionPermission from '../permission';

const EditTitle = ({ record }: TitleProps) => (
  <span>
    Lease Comp: {record ? `${[record.parcel_number, record.location_address].filter(Boolean).join(' - ')}` : ''}
  </span>
);

function LeaseEdit(props: EditProps) {
  const { match } = props;
  const notify = useNotify();
  return (
    <ResourceContextProvider value="transaction">
      <Edit
        {...props}
        id={match?.url.split('/').pop()}
        basePath="/properties/lease-comps"
        resource="transaction"
        undoable={false}
        onSuccess={onSuccess}
        title={<EditTitle />}
        actions={<EditAction />}
      >
        <SimpleForm toolbar={<Toolbar getPermission={getTransactionPermission} />}>
          <TransactionForm />
        </SimpleForm>
      </Edit>
    </ResourceContextProvider>
  );

  function onSuccess() {
    notify('lease_comp.updated');
  }
}

export default LeaseEdit;
