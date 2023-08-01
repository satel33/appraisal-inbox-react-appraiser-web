import React from 'react';
import dayjs from 'dayjs';
import { Record, FieldProps } from 'react-admin';

type WithYear = Record & {
  location_address?: string;
};

function YearField(props: FieldProps<WithYear>) {
  const { source = 'year' } = props;
  return <>{dayjs(props.record?.[source]).format('YYYY')}</>;
}

export default YearField;
