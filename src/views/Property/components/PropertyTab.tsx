import React from 'react';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getPropertyPermission from '../permission';
import PropertyForm from './PropertyForm';

export default function PropertyTab() {
  const [{ formData, permissions }] = useFormPermissions({ getPermission: getPropertyPermission });
  return <PropertyForm formData={formData} readOnly={!permissions.edit} />;
}
