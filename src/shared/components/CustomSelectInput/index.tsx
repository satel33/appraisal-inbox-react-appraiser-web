import React from 'react';
import { useInput } from 'ra-core';
import { InputHelperText, Labeled } from 'ra-ui-materialui/lib/input';
import { LinearProgress } from 'ra-ui-materialui/lib/layout';
import get from 'lodash/get';
import { FieldTitle } from 'react-admin';
import ChipItem from './ChipItem';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles((theme) => ({
  chips: (props: any) =>
    props?.customCSS?.chips || {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(3.5),
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(1.5),
      },
    },
  label: {
    transform: 'translate(0, 5px) scale(0.75)',
    transformOrigin: `top ${theme.direction === 'ltr' ? 'left' : 'right'}`,
    marginBottom: 10,
  },
}));
export default function CustomSelectInput(props: any) {
  const {
    choices = [],
    classes: classesOverride,
    format,
    helperText,
    label,
    loaded,
    loading,
    margin = 'dense',
    onBlur,
    onChange,
    onFocus,
    options,
    optionText,
    optionValue,
    parse,
    resource,
    row,
    source,
    translateChoice,
    validate,
    disabled,
    customCSS,
    ...rest
  } = props;
  const classes = useStyles(props);

  const { id, isRequired, meta, input } = useInput({
    format,
    onBlur,
    onChange,
    onFocus,
    parse,
    resource,
    source,
    validate,
    ...rest,
  });
  const { error, submitError, touched } = meta;

  if (loading) {
    return (
      <Labeled
        id={id}
        label={label}
        source={source}
        resource={resource}
        className={rest.className}
        isRequired={isRequired}
        meta={meta}
        input={input}
      >
        <LinearProgress />
      </Labeled>
    );
  }
  return (
    <FormControl component="fieldset" margin={margin} error={touched && !!(error || submitError)} {...rest}>
      <FormLabel component="legend" className={classes.label}>
        <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />
      </FormLabel>
      <div className={classes.chips}>
        {choices.map((choice: any) => (
          <ChipItem
            {...input}
            disabled={disabled}
            key={get(choice, 'id', optionValue)}
            choice={choice}
            optionText={optionText}
            optionValue={optionValue}
            source={source}
            translateChoice={translateChoice}
          />
        ))}
      </div>
      {error && (
        <FormHelperText>
          <InputHelperText touched={Boolean(touched)} error={error || submitError} helperText={helperText} />
        </FormHelperText>
      )}
    </FormControl>
  );
}
