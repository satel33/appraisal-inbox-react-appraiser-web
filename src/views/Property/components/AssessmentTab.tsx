import AssessmentList from 'views/Assessment/components/AssessmentList';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import React from 'react';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getPropertyPermission from '../permission';

function AssessmentTab(props: PublicFieldProps & InjectedFieldProps) {
  const [{ formData, permissions }] = useFormPermissions({ getPermission: getPropertyPermission });
  return <AssessmentList {...props} record={formData} readOnly={!permissions.edit} source="id" fullWidth />;
}

export default AssessmentTab;
