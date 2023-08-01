import React from 'react';
import { DeleteWithConfirmButton, DeleteWithConfirmButtonProps, FieldProps, usePermissions } from 'react-admin';
import { Team } from '../types';

type TeamListActionsProps = FieldProps<Team> & DeleteWithConfirmButtonProps;
function TeamListActions(props: TeamListActionsProps) {
  const { record } = props;
  const { permissions = [] } = usePermissions();
  if (record?.appraisals_count === 0 || !permissions.includes('appraisal_firm_account_owner')) {
    return null;
  }
  return (
    <>
      <DeleteWithConfirmButton {...props} />
    </>
  );
}

export default TeamListActions;
