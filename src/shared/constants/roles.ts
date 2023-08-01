import { FormPermissions } from 'shared/hooks/useResourcePermissions';

export const elavatedRoles = ['appraisal_firm_full_access', 'appraisal_firm_account_owner', 'admin'];
export const standardMutationRoles = elavatedRoles.concat(['appraisal_firm_standard_access']);
export const appraisalMutationRoles = standardMutationRoles.concat(['appraisal_firm_limited_access']);

export const activityRestrictedRoles = ['appraisal_firm_restricted_access'];
export const activityRestrictedRolesForClientAndContact = activityRestrictedRoles.concat([
  'appraisal_firm_limited_access',
]);

export const rolesMapping: { [key in number]: string } = {
  0: '',
  1: 'admin',
  2: 'appraisal_firm_account_owner',
  3: 'appraisal_firm_full_access',
  4: 'appraisal_firm_standard_access',
  5: 'appraisal_firm_limited_access',
  6: 'appraisal_firm_restricted_access',
};

export type ResourcePermission = {
  [key in string]: FormPermissions | boolean;
};
export type RoleAccessMapping = {
  [key in UserRole]?: ResourcePermission;
};

export type UserRole =
  | 'appraisal_firm_full_access'
  | 'appraisal_firm_account_owner'
  | 'admin'
  | 'appraisal_firm_standard_access'
  | 'appraisal_firm_limited_access'
  | 'appraisal_firm_restricted_access';
