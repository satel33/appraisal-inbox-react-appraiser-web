import React from 'react';
import { formatCurrency } from 'shared/utils';
import { FieldProps } from 'react-admin';

function CurrencyText(props: FieldProps) {
  const { record, source = '' } = props;
  return <>{formatCurrency(record?.[source])}</>;
}

export default CurrencyText;
