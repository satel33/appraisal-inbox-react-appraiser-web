import { UserIdentity } from 'react-admin';
import { appraisalMutationRoles, elavatedRoles, standardMutationRoles } from 'shared/constants/roles';
import { Client } from './types';

export default function getClientPermission(formData: Client, identity: UserIdentity | undefined) {
  const role = identity?.role ?? '';
  if (elavatedRoles.includes(role)) {
    return {
      edit: true,
      create: true,
      delete: !formData.appraisals_count && !formData.contacts_count,
    };
  }
  const create = standardMutationRoles.includes(role);
  const edit = appraisalMutationRoles.includes(role);
  const isOwner = formData?.organization_id === identity?.organization_id && formData?.user_account_id === identity?.id;

  if (edit) {
    return {
      create,
      edit,
      delete: isOwner && !formData.appraisals_count && !formData.contacts_count,
    };
  }
  return {
    edit: false,
    create: false,
    delete: false,
  };
}
