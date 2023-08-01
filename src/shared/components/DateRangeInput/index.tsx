import * as React from 'react';
import { DateRangePicker, DateRange } from 'materialui-daterange-picker';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import uniq from 'lodash/uniq';

import Popover from '@material-ui/core/Popover';
import { useInput, ResettableTextField, FieldTitle } from 'react-admin';
import InputHelperText from 'shared/components/AutocompleteInput/InputHelperText';
import { makeStyles } from '@material-ui/core/styles';
import { defaultRanges } from './defaults';
import { TextInputProps } from 'ra-ui-materialui/lib/input/TextInput';

const useStyles = makeStyles({
  root: {
    '& .MuiFilledInput-underline.Mui-disabled:before': {
      borderBottomStyle: 'solid',
    },
    '& .MuiInputBase-input': {
      color: '#000000',
    },
  },
});

function DateRangeInput(props: TextInputProps): JSX.Element {
  const classes = useStyles();
  const {
    label,
    format,
    helperText,
    onBlur,
    onFocus,
    onChange: onChangeProps,
    options,
    parse,
    resource,
    source,
    validate,
    ...rest
  } = props;
  const inputResult = useInput({
    format,
    onBlur,
    onChange: onChangeProps,
    onFocus,
    parse,
    resource,
    source,
    type: 'text',
    validate,
    ...rest,
  });
  const {
    input,
    isRequired,
    meta: { error, touched },
  } = inputResult;
  const {
    input: { onChange, value: inputValue },
  } = inputResult;
  React.useEffect(() => {
    if (!inputValue) {
      onChange({
        format: 'raw-query',
        value: {
          _lte: endOfDay(new Date()).toISOString(),
          _gte: startOfDay(new Date()).toISOString(),
        },
      });
    }
  }, []);
  const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <ResettableTextField
        {...input}
        resettable={false}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle date range">
                <DateRangeIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        id={`date-range-picker-${props.source}`}
        onClick={handleClick}
        disabled
        value={parseDisplayValue()}
        classes={classes}
        // @ts-ignore
        label={label && <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
        error={!!(touched && error)}
        // @ts-ignore
        helperText={<InputHelperText touched={Boolean(touched)} error={error} helperText={helperText} />}
        {...rest}
        {...options}
      />
      <Popover
        id="daterange-picker-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <DateRangePicker
          definedRanges={defaultRanges}
          initialDateRange={parseInitialValue()}
          open={open}
          toggle={() => {
            if (open) {
              handleClose();
            }
          }}
          onChange={({ startDate, endDate }) => {
            if (startDate && endDate)
              onChange({
                format: 'raw-query',
                value: { _lte: endDate.toISOString(), _gte: startDate.toISOString() },
              });
          }}
        />
      </Popover>
    </>
  );

  function parseInitialValue(): DateRange | undefined {
    if (inputValue) {
      return {
        startDate: new Date(inputValue.value._gte),
        endDate: new Date(inputValue.value._lte),
      };
    }
    return undefined;
  }

  function parseDisplayValue(): string {
    if (inputValue) {
      return uniq(
        [inputValue.value._gte, inputValue.value._lte].filter(Boolean).map((e) => new Date(e).toLocaleDateString()),
      ).join(' - ');
    }

    return '';
  }
}

export default DateRangeInput;
