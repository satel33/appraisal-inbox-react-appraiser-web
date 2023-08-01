import React from 'react';
import { useInput, FieldTitle, InputHelperText } from 'react-admin';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { TextInputProps } from 'ra-ui-materialui/lib/input/TextInput';

export default (props: TextInputProps) => {
  const {
    label,
    format,
    helperText,
    onBlur,
    onFocus,
    onChange,
    options,
    parse,
    resource,
    source,
    validate,
    variant = 'standard',
    margin = 'dense',
    fullWidth = true,
    ...restProps
  } = props;
  const {
    id,
    input,
    isRequired,
    meta: { error, touched },
  } = useInput({
    format,
    onBlur,
    onChange,
    onFocus,
    parse,
    resource,
    source,
    type: 'number',
    validate,
  });

  return (
    <TextField
      {...restProps}
      id={id}
      {...input}
      InputProps={{
        inputProps: { min: 0 },
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        ...props.InputProps,
      }}
      variant={variant}
      fullWidth={fullWidth}
      margin={margin}
      error={!!(touched && error)}
      label={
        label !== '' &&
        label !== false && <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />
      }
      helperText={<InputHelperText touched={Boolean(touched)} error={error} helperText={helperText} />}
    />
  );
};
