import PropertyForm from 'views/Property/components/PropertyForm';
import React from 'react';
import { standardMutationRoles } from 'shared/constants/roles';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from '../permission';

export default function PropertyTab() {
  const [{ formData, permissions, identity }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const canMutate = standardMutationRoles.includes(identity?.role ?? '');
  return <PropertyForm formData={formData.property} prefix="property" readOnly={!permissions.edit || !canMutate} />;
}
