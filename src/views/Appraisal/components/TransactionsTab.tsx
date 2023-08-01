import AssessmentList from 'views/Assessment/components/AssessmentList';
import TransactionsList from 'views/Transactions/components/TransactionsList';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import React from 'react';
import { standardMutationRoles } from 'shared/constants/roles';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from '../permission';
import { Appraisal } from '../types';

type TransactionsTabProps = PublicFieldProps & InjectedFieldProps<Appraisal>;
export default function TransactionsTab(props: TransactionsTabProps) {
  const [{ formData, permissions, identity }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const canMutate = standardMutationRoles.includes(identity?.role ?? '');
  return (
    <>
      <TransactionsList {...props} record={formData.property} fullWidth readOnly={!canMutate || !permissions.edit} />
      <AssessmentList {...props} record={formData.property} fullWidth readOnly={!canMutate || !permissions.edit} />
    </>
  );
}
