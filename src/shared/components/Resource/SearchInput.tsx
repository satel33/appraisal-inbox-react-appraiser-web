import * as React from 'react';
import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { TextFieldProps } from '@material-ui/core/TextField';
import { InputProps } from 'ra-core';
import { TextInput } from 'react-admin';

const useStyles = makeStyles(
  {
    input: {
      marginTop: 32,
      // width: '500px',
      // minWidth: '400px',
      marginRight: '20px',
    },
  },
  { name: 'RaSearchInput' },
);

const SearchInput: FunctionComponent<InputProps<TextFieldProps> & Omit<TextFieldProps, 'label' | 'helperText'>> = (
  props,
) => {
  const { classes: classesOverride, ...rest } = props;
  const classes = useStyles(props);

  return (
    <TextInput
      label={props.label}
      resettable
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon color="disabled" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      className={classes.input}
      {...rest}
    />
  );
};

SearchInput.propTypes = {
  classes: PropTypes.object,
};

export default SearchInput;
