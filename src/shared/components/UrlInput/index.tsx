import * as React from 'react';
import { FunctionComponent } from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import { TextFieldProps } from '@material-ui/core/TextField';
import { InputProps } from 'ra-core';
import { TextInput } from 'react-admin';
import { useFormState } from 'react-final-form';
import IconButton from '@material-ui/core/IconButton';
import { useMemo } from 'react';
import { isValidURL } from 'shared/utils';

const useStyles = makeStyles(
  {
    input: {},
    btn: {},
  },
  { name: 'RaUrlInput' },
);

const UrlInput: FunctionComponent<InputProps<TextFieldProps> & Omit<TextFieldProps, 'label' | 'helperText'>> = (
  props,
) => {
  const { classes: classesOverride, InputProps, ...rest } = props;
  const classes = useStyles(props);
  const formData = useFormState<any>();
  const value = formData.values[props.source] ?? '';
  const isValidValue = useMemo(() => isValidURL(value), [value]);

  const formatURL = (url: string) => {
    if (url.match(/^http?:\/\//i) || url.match(/^https?:\/\//i)) {
      return url;
    }
    return 'https://' + url;
  };

  return (
    <TextInput
      label={props.label}
      resettable={false}
      InputProps={{
        ...InputProps,
        endAdornment: props?.InputProps?.endAdornment || (
          <InputAdornment position="end">
            <IconButton
              size="small"
              classes={{ root: props.btnUrl || classes.btn }}
              onClick={() => {
                if (!isValidValue) return;
                const newWindow = window.open(formatURL(value), '_blank', 'noopener,noreferrer');
                if (newWindow) newWindow.opener = null;
              }}
            >
              <LaunchIcon color={isValidValue ? 'inherit' : 'disabled'} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      className={classes.input}
      {...rest}
    />
  );
};

export default UrlInput;
