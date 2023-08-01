import React, { useEffect } from 'react';
import { Card } from '@material-ui/core';
import FeeListEditable from 'views/Client/components/FeeListEditable';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import { FeesLoadingSkeleton } from 'shared/components/AddressField/LoadingSkeleton/FeesSkeleton';
import useAppraisalFee, { useAppraisalCommission, useAppraisalExpense } from 'shared/hooks/useAppraisalFees';
import getAppraisalPermission from 'views/Appraisal/permission';

import { styleRight } from 'shared/hooks/useEditFormStyle';

export interface FeesProps {
  formData: any;
}
export const Fees = ({ formData }: FeesProps) => {
  const formClasses = styleRight();
  const appraisal = formData.values;

  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const { data, refetch, loading } = useAppraisalFee({
    appraisalId: appraisal.id,
  });
  const [expenseData] = useAppraisalExpense({ appraisalId: appraisal.id });
  const [commissionData] = useAppraisalCommission({ appraisalId: appraisal.id });

  useEffect(() => {
    refetch();
    expenseData.refetch();
  }, [appraisal, refetch, data, expenseData]);

  return (
    <Card variant="outlined" classes={{ root: formClasses.card }} style={{ marginTop: '30px' }}>
      {(loading && expenseData.loading) || commissionData.loading ? (
        <FeesLoadingSkeleton />
      ) : (
        <FeeListEditable
          initialFees={data}
          initialExpenses={expenseData.data}
          initialCommissions={commissionData.data}
          appraisal={formData.values}
          clientId={formData.values.client_id}
          edit={permissions.edit}
          delet={permissions.delete}
        />
      )}
    </Card>
  );
};
