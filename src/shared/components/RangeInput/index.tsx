import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useInput } from 'react-admin';
import Slider, { ValueLabelProps } from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import { formatCurrency } from 'shared/utils';
import gql from 'graphql-tag';
import { Labeled, LinearProgress } from 'ra-ui-materialui';
import { TextInputProps } from 'ra-ui-materialui/lib/input/TextInput';
import { useQuery } from '@apollo/client';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

export default function RangeInput(props: TextInputProps) {
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
    formatter = formatCurrency,
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
    input: { onChange, value: inputValue },
  } = inputResult;
  const [range, setRange] = useState({ max: 0, min: 0 });
  const query = useMemo(
    () => gql`
  query {
    ${resource}_aggregate {
      aggregate {
        max {
          ${source}
        }
        min {
          ${source}
        }
      }
    }
  }
`,
    [resource],
  );
  const { loading, data } = useQuery(query);
  React.useEffect(() => {
    if (data) {
      const { aggregate } = data[`${resource}_aggregate`];
      const max = aggregate.max[source];
      const min = aggregate.min[source];
      setRange({ min, max });
      onChange({
        format: 'raw-query',
        value: {
          _lte: max,
          _gte: min,
        },
      });
    }
  }, [data]);
  if (loading || !data) {
    return (
      <Labeled label={label} source={source} resource={resource} input={inputResult.input}>
        <LinearProgress />
      </Labeled>
    );
  }

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {label}
      </Typography>
      <Slider
        ValueLabelComponent={ValueLabelComponent}
        value={parseValue()}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        valueLabelFormat={valuetext}
      />
    </div>
  );

  function valuetext(value: number) {
    return formatter(getRaw(value));
  }

  function handleChange(event: any, newValue: any) {
    onChange({
      format: 'raw-query',
      value: { _lte: getRaw(newValue[1]), _gte: getRaw(newValue[0]) },
    });
  }

  function parseValue() {
    if (!inputValue) {
      return [getPercentage(range.min), getPercentage(range.max)];
    }
    return [getPercentage(inputValue.value._lte), getPercentage(inputValue.value._gte)];
  }

  function getPercentage(value: number) {
    const diff = range.max - range.min;
    return ((value - range.min) / diff) * 100;
  }

  function getRaw(percentage: number) {
    const diff = range.max - range.min;
    return (percentage / 100) * diff + range.min;
  }
}

function ValueLabelComponent(props: ValueLabelProps) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}
