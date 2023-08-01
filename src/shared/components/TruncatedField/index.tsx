import React from 'react';
import { FieldProps } from 'react-admin';

function TruncatedField(props: FieldProps<any>) {
  const { record, source = '' } = props;
  if (!record) return null;
  const display = record[source] ?? '';
  return <>{`${display?.substring(0, 28)}${display.length > 28 ? '...' : ''}`}</>;
}

export default TruncatedField;
