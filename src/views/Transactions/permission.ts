import { UserIdentity } from 'react-admin';
import { elavatedRoles, standardMutationRoles } from 'shared/constants/roles';
import { Transaction } from './types';

export default function getTransactionPermission(formData: Transaction, identity: UserIdentity | undefined) {
  const role = identity?.role ?? '';
  if (elavatedRoles.includes(role)) {
    return {
      edit: true,
      create: true,
    };
  }
  const create = standardMutationRoles.includes(role);
  const isOwner = formData?.organization_id === identity?.organization_id && formData?.user_account_id === identity?.id;

  if (create) {
    return {
      create,
      edit: isOwner,
      delete: isOwner,
    };
  }
  return {
    edit: false,
    create: false,
    delete: false,
  };
}
