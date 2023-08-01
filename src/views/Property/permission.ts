import { UserIdentity } from 'react-admin';
import { elavatedRoles, standardMutationRoles } from 'shared/constants/roles';
import { Property } from './types';

export default function getPropertyPermission(formData: Property, identity: UserIdentity | undefined) {
  const role = identity?.role ?? '';
  if (elavatedRoles.includes(role)) {
    return {
      edit: true,
      create: true,
      delete: true && !formData.appraisals_count,
    };
  }
  const create = standardMutationRoles.includes(role);
  const isOwner = formData?.organization_id === identity?.organization_id && formData?.user_account_id === identity?.id;

  if (create) {
    return {
      create,
      edit: isOwner,
      delete: isOwner && !formData.appraisals_count,
    };
  }
  return {
    edit: false,
    create: false,
    delete: false,
  };
}
