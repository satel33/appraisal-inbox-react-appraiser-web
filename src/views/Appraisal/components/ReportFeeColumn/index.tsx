import React from 'react';
import get from 'lodash/get';
import { FieldProps } from 'react-admin';
import { Appraisal } from 'views/Appraisal/types';

type StyleProps = {
  fontStyle: string;
  color: string;
};

function ReportFeeColumn(props: FieldProps<Appraisal>) {
  const { record, source } = props;
  const value = get(record, source || '');
  return <span>{value > 0 ? `$${value}` : ' '}</span>;
}

export default ReportFeeColumn;
