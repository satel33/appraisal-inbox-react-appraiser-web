import { UserIdentity } from 'react-admin';
import { elavatedRoles, appraisalMutationRoles } from 'shared/constants/roles';
import { Appraisal } from './types';

export default function getAppraisalPermission(formData: Appraisal, identity: UserIdentity | undefined) {
  const noPermissions = {
    edit: false,
    create: false,
    delete: false,
  };

  if (!identity) {
    return noPermissions;
  }
  const role = identity?.role ?? '';
  if (elavatedRoles.includes(role)) {
    return {
      edit: true,
      create: true,
      delete: true,
    };
  }
  const create = appraisalMutationRoles.includes(role);

  const isOwner =
    formData?.organization_id === identity?.organization_id &&
    (formData?.user_account_id === identity?.id || formData?.assignee_user_account_ids?.includes(identity?.id));

  if (create) {
    return {
      create,
      edit: isOwner || create,
      delete: isOwner,
    };
  }
  return noPermissions;
}
