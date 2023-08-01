import React from 'react';
import { FieldProps } from 'react-admin';
import { LeaseComps } from '../types';

type LeaseTypeFieldProps = FieldProps<LeaseComps>;
function LeaseTypeField(props: LeaseTypeFieldProps) {
  const { record } = props;
  return <>{record?.commercial_lease_type || record?.residential_lease_type}</>;
}
export default LeaseTypeField;
