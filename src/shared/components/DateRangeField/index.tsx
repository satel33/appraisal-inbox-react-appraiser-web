import React from 'react';
import { FieldProps } from 'react-admin';

type DateRangeFieldProps = FieldProps & {
  locales?: string;
  options?: Intl.DateTimeFormatOptions;
  sourceFrom: string;
  sourceTo: string;
};

function DateRangeField(props: DateRangeFieldProps) {
  const { record, sourceFrom, locales, options, sourceTo } = props;
  return (
    <span>{`${new Date(record?.[sourceFrom]).toLocaleDateString(locales, options)} - ${new Date(
      record?.[sourceTo],
    ).toLocaleDateString(locales, options)}`}</span>
  );
}

export default DateRangeField;
