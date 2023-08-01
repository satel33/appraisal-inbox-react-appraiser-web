import { UserIdentity } from 'react-admin';
import { standardMutationRoles, elavatedRoles } from 'shared/constants/roles';
import { Contact } from './types';

export default function getContactPermission(formData: Contact, identity: UserIdentity | undefined) {
  const role = identity?.role ?? '';
  if (elavatedRoles.includes(role)) {
    return {
      edit: true,
      create: true,
      delete: !formData.appraisals_count,
    };
  }
  const create = standardMutationRoles.includes(role);
  const isOwner =
    formData?.organization_id === identity?.organization_id && formData?.created_by_user_account_id === identity?.id;

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
  };
}
