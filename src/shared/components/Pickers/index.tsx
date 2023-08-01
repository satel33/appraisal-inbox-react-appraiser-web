import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useInput, FieldTitle } from 'ra-core';
import { InputHelperText } from 'react-admin';
import {
  KeyboardDatePicker,
  TimePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
  DatePicker,
  KeyboardDatePickerProps,
  KeyboardDateTimePickerProps,
  TimePickerProps,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import omit from 'lodash/omit';
import { TextInputProps } from 'ra-ui-materialui/lib/input/TextInput';

type CustomPickerProps = TextInputProps & {
  PickerComponent:
    | React.ComponentType<KeyboardDatePickerProps>
    | React.ComponentType<KeyboardDateTimePickerProps>
    | React.ComponentType<TimePickerProps>;
};

const Picker = ({ PickerComponent, ...fieldProps }: CustomPickerProps) => {
  const {
    options,
    variant,
    label,
    source,
    resource,
    className,
    validate,
    providerOptions,
    fullWidth,
    helperText,
    InputProps,
    ...restProps
  } = fieldProps;

  const { input, meta, isRequired } = useInput({ source, validate });

  const { touched, error } = meta;

  const handleChange = useCallback((value) => {
    Date.parse(value) ? input.onChange(value.toISOString()) : input.onChange(null);
  }, []);

  return (
    <MuiPickersUtilsProvider {...providerOptions}>
      <PickerComponent
        {...omit(restProps, 'labelTime')}
        label={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
        margin="dense"
        clearable
        InputLabelProps={{ shrink: input.value ? true : false }}
        inputVariant={variant || 'standard'}
        fullWidth
        error={!!(touched && error)}
        helperText={<InputHelperText touched={Boolean(touched)} error={error} helperText={helperText} />}
        className={className}
        value={input.value ? new Date(input.value) : input.value}
        onChange={(date: any) => handleChange(date)}
        onBlur={() => input.onChange(input.value ? new Date(input.value).toISOString() : null)}
        InputProps={InputProps}
        keyboardIcon={restProps.disabled ? <></> : undefined}
      />
    </MuiPickersUtilsProvider>
  );
};

Picker.propTypes = {
  defaultValue: PropTypes.string,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.object,
  options: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string,
  labelTime: PropTypes.string,
  className: PropTypes.string,
  providerOptions: PropTypes.shape({
    utils: PropTypes.func,
    locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }),
};

Picker.defaultProps = {
  defaultValue: '',
  input: {},
  isRequired: false,
  meta: { touched: false, error: false },
  options: {},
  resource: '',
  source: '',
  labelTime: '',
  className: '',
  providerOptions: {
    utils: DateFnsUtils,
    locale: undefined,
  },
};

type PickerProps = TextInputProps;
export const YearInput = (props: PickerProps) => <Picker PickerComponent={DatePicker} views={['year']} {...props} />;
export const DateInput = (props: PickerProps) => (
  <Picker PickerComponent={KeyboardDatePicker} format="MM/dd/yyyy" {...props} />
);
export const TimeInput = (props: PickerProps) => <Picker PickerComponent={TimePicker} {...props} />;
export const DateTimeInput = (props: PickerProps) => (
  <Picker
    PickerComponent={KeyboardDateTimePicker}
    labelFunc={(date: any) => {
      if (new Date(date).toString() === 'Invalid Date') return '';
      if (isToday(date)) {
        return `Today @ ${getTime(date)}`;
      } else if (isTomorrow(date)) {
        return `Tomorrow @ ${getTime(date)}`;
      } else if (isYesterday(date)) {
        return `Yesterday @ ${getTime(date)}`;
      } else {
        return `${new Date(date).toLocaleDateString()} @ ${getTime(date)}`;
      }
    }}
    format="MM/dd/yyyy @ hh:mma"
    {...props}
  />
);

const isToday = (someDate: any) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const isTomorrow = (someDate: any) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    someDate.getDate() === tomorrow.getDate() &&
    someDate.getMonth() === tomorrow.getMonth() &&
    someDate.getFullYear() === tomorrow.getFullYear()
  );
};

const isYesterday = (someDate: any) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    someDate.getDate() === yesterday.getDate() &&
    someDate.getMonth() === yesterday.getMonth() &&
    someDate.getFullYear() === yesterday.getFullYear()
  );
};

const getTime = (someDate: any) => {
  return new Date(someDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};
