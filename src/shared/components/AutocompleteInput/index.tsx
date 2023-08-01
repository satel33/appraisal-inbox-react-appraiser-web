import React, { useCallback, FunctionComponent, useMemo, isValidElement } from 'react';
import { DownshiftProps } from 'downshift';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useInput, FieldTitle, InputProps, useSuggestions, warning } from 'ra-core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link } from 'react-router-dom';
import { InputHelperText } from 'react-admin';

interface Options {
  suggestionsContainerProps?: any;
  labelProps?: any;
}

/**
 * An Input component for an autocomplete field, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <AutocompleteInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutocompleteInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutocompleteInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * Note that you must also specify the `matchSuggestion` prop
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const matchSuggestion = (filterValue, choice) => choice.first_name.match(filterValue) || choice.last_name.match(filterValue);
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <SelectInput source="gender" choices={choices} optionText={<FullNameField />} matchSuggestion={matchSuggestion} />
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <AutocompleteInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 *
 * @example
 * <AutocompleteInput source="author_id" options={{ color: 'secondary', InputLabelProps: { shrink: true } }} />
 */
const AutocompleteInput: FunctionComponent<InputProps<TextFieldProps & Options> & DownshiftProps<any>> = (props) => {
  const {
    allowEmpty,
    className,
    classes: classesOverride,
    choices = [],
    disabled,
    emptyText = '',
    emptyValue = null,
    format,
    fullWidth,
    helperText,
    id: idOverride,
    input: inputOverride,
    isRequired: isRequiredOverride,
    label,
    limitChoicesToValue,
    margin = 'dense',
    matchSuggestion,
    meta: metaOverride,
    onBlur,
    onChange,
    onFocus,
    options: { suggestionsContainerProps, labelProps, InputProps, ...options } = {
      suggestionsContainerProps: undefined,
      labelProps: undefined,
      InputProps: undefined,
    },
    optionText = 'name',
    inputText,
    optionValue = 'id',
    parse,
    resource,
    setFilter,
    shouldRenderSuggestions: shouldRenderSuggestionsOverride,
    source,
    suggestionLimit,
    translateChoice = false,
    validate,
    variant = 'filled',
    startDisplay,
    reference,
    clientEdit,
    clientId,
    ...rest
  } = props;
  if (isValidElement(optionText) && !inputText) {
    throw new Error(`If the optionText prop is a React element, you must also specify the inputText prop:
      <AutocompleteInput
          inputText={(record) => record.title}
      />`);
  }

  warning(
    isValidElement(optionText) && !matchSuggestion,
    `If the optionText prop is a React element, you must also specify the matchSuggestion prop:
<AutocompleteInput
  matchSuggestion={(filterValue, suggestion) => true}
/>
      `,
  );

  const classes = useStyles(props);
  const {
    id,
    input,
    isRequired,
    meta: { touched, error },
  } = useInput({
    format,
    id: idOverride,
    input: inputOverride,
    meta: metaOverride,
    onBlur,
    onChange,
    onFocus,
    parse,
    resource,
    source,
    validate,
    ...rest,
  });

  const getSuggestionFromValue = useCallback(
    (value) => choices.find((choice: any) => get(choice, optionValue) === value),
    [choices, optionValue, allowEmpty],
  );

  const selectedItem = useMemo(() => getSuggestionFromValue(input.value || emptyValue) || null, [
    input.value,
    getSuggestionFromValue,
    emptyValue,
  ]);
  const { getChoiceText, getChoiceValue } = useSuggestions({
    allowEmpty,
    choices: choices,
    emptyText,
    emptyValue,
    limitChoicesToValue,
    matchSuggestion,
    optionText,
    optionValue,
    selectedItem,
    suggestionLimit,
    translateChoice,
  });
  const handleChange = useCallback(
    (item: any) => {
      input.onChange(getChoiceValue(item));
    },
    [getChoiceValue, input],
  );
  return (
    <div className={classes.container}>
      {reference === 'client' && !clientEdit && clientId ? (
        <Link to={`/clients/${selectedItem?.id}`} style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <Autocomplete
            filterOptions={props.filterOptions}
            freeSolo={props.freeSolo}
            renderOption={props.renderOption}
            classes={props.css ? props.css : {}}
            value={selectedItem}
            onChange={(e, value) => handleChange(value)}
            options={choices}
            getOptionLabel={(choice) => getChoiceText(choice)}
            getOptionDisabled={props.getOptionDisabled}
            fullWidth={fullWidth}
            disabled={disabled}
            // onBlur={handleBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                id={id}
                name={input.name}
                error={!!(touched && error)}
                label={
                  <FieldTitle
                    label={label}
                    {...labelProps}
                    source={source}
                    resource={resource}
                    isRequired={typeof isRequiredOverride !== 'undefined' ? isRequiredOverride : isRequired}
                  />
                }
                helperText={<InputHelperText touched={Boolean(touched)} error={error} helperText={helperText} />}
                variant={variant}
                FormHelperTextProps={props.FormHelperTextProps}
                margin={margin}
                fullWidth={fullWidth}
                InputProps={{
                  ...params.InputProps,
                  ...(InputProps || {}),
                }}
                {...options}
              />
            )}
          />
        </Link>
      ) : (
        <Autocomplete
          filterOptions={props.filterOptions}
          freeSolo={props.freeSolo}
          renderOption={props.renderOption}
          classes={props.css ? props.css : {}}
          value={selectedItem}
          onChange={(e, value) => handleChange(value)}
          options={choices}
          getOptionLabel={(choice) => getChoiceText(choice) ?? ''}
          getOptionDisabled={props.getOptionDisabled}
          fullWidth={fullWidth}
          disabled={disabled}
          // onBlur={handleBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              id={id}
              name={input.name}
              error={!!(touched && error)}
              label={
                <FieldTitle
                  label={label}
                  {...labelProps}
                  source={source}
                  resource={resource}
                  isRequired={typeof isRequiredOverride !== 'undefined' ? isRequiredOverride : isRequired}
                />
              }
              helperText={<InputHelperText touched={Boolean(touched)} error={error} helperText={helperText} />}
              variant={variant}
              FormHelperTextProps={props.FormHelperTextProps}
              margin={margin}
              fullWidth={fullWidth}
              InputProps={{
                ...params.InputProps,
                ...(InputProps || {}),
              }}
              {...options}
            />
          )}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(
  {
    root: {
      flexGrow: 1,
      height: 250,
    },
    container: {
      flexGrow: 1,
      position: 'relative',
      marginRight: (props: any) => (props?.alwaysOn ? 20 : 0),
    },
  },
  { name: 'RaAutocompleteInput' },
);

export default AutocompleteInput;
