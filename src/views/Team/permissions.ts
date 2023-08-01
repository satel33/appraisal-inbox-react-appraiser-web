import { UserIdentity } from 'react-admin';
import { elavatedRoles, rolesMapping, standardMutationRoles } from 'shared/constants/roles';
import { UserProfile } from './types';

export default function getTeamPermission(formData: UserProfile, identity: UserIdentity | undefined) {
  const role = identity?.role ?? '';
  const notCurrentUser = identity?.id !== formData?.user_account_id;
  if (elavatedRoles.includes(role)) {
    return {
      edit: true,
      create: true,
      delete: !formData.appraisals_count && notCurrentUser,
    };
  }

  const canEdit =
    elavatedRoles.includes(role) &&
    elavatedRoles.indexOf(role) >=
      elavatedRoles.indexOf(rolesMapping?.[formData?.user_account?.user_role_id ?? 0] ?? '');
  const create = standardMutationRoles.includes(role);

  if (create) {
    return {
      create,
      edit: canEdit,
      delete: canEdit && !formData.appraisals_count && notCurrentUser,
    };
  }

  return {
    edit: false,
    create: false,
  };
}
