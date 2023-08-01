import TransactionsList from 'views/Transactions/components/TransactionsList';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import React from 'react';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getPropertyPermission from '../permission';

function TransactionTab(props: PublicFieldProps & InjectedFieldProps) {
  const [{ formData, permissions }] = useFormPermissions({ getPermission: getPropertyPermission });
  return <TransactionsList {...props} record={formData} readOnly={!permissions.edit} source="id" fullWidth />;
}

export default TransactionTab;
