import React, { useCallback, FunctionComponent, useMemo, isValidElement } from 'react';
import { DownshiftProps } from 'downshift';
import Autocomplete from '@material-ui/lab/Autocomplete';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { InputHelperText } from 'react-admin';
import { useInput, FieldTitle, InputProps, useSuggestions, warning } from 'ra-core';
import Chip from '@material-ui/core/Chip';

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
 * <AutocompleteArrayInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutocompleteArrayInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutocompleteArrayInput source="author_id" choices={choices} optionText={optionRenderer} />
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
 * <AutocompleteArrayInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 *
 * @example
 * <AutocompleteArrayInput source="author_id" options={{ color: 'secondary' }} />
 */
type Props = InputProps<TextFieldProps & Options> &
  DownshiftProps<any> & {
    transformChoice?(arg: any): any;
  };
const AutocompleteArrayInput: FunctionComponent<Props> = (props) => {
  const {
    allowDuplicates,
    allowEmpty,
    classes: classesOverride,
    choices: choicesProps = [],
    disabled,
    emptyText,
    emptyValue,
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
    options: { suggestionsContainerProps, labelProps, InputProps, ...options } = {} as TextFieldProps & Options,
    optionText = 'name',
    optionValue = 'id',
    parse,
    resource,
    setFilter,
    shouldRenderSuggestions: shouldRenderSuggestionsOverride,
    source,
    suggestionLimit,
    translateChoice = true,
    validate,
    variant = 'filled',
    transformChoice = (a) => a,
    disableRemoveValues = [],
    FormHelperTextProps,
    ...rest
  } = props;
  warning(
    isValidElement(optionText) && !matchSuggestion,
    `If the optionText prop is a React element, you must also specify the matchSuggestion prop:
<AutocompleteInput
  matchSuggestion={(filterValue, suggestion) => true}
/>
      `,
  );
  const choices = useMemo(() => choicesProps.map(transformChoice), [choicesProps]);

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

  const values = input.value || [];

  const getSuggestionFromValue = useCallback(
    (value) => choices.find((choice: any) => get(choice, optionValue) === value),
    [choices, optionValue],
  );

  const selectedItems = useMemo(() => values.map(getSuggestionFromValue), [getSuggestionFromValue, values]);

  const { getChoiceText, getChoiceValue } = useSuggestions({
    allowDuplicates,
    allowEmpty,
    choices,
    emptyText,
    emptyValue,
    limitChoicesToValue,
    matchSuggestion,
    optionText,
    optionValue,
    selectedItem: selectedItems,
    suggestionLimit,
    translateChoice,
  });

  const handleChange = useCallback(
    (newValues: any) => {
      input.onChange(newValues.map(getChoiceValue));
    },
    [allowDuplicates, getChoiceValue, input, selectedItems],
  );
  return (
    <div className={classes.container}>
      <Autocomplete
        multiple
        disabled={disabled}
        value={selectedItems}
        filterSelectedOptions
        onChange={(e, value) => handleChange(value)}
        options={choices}
        getOptionLabel={(choice) => getChoiceText(choice) ?? ''}
        fullWidth={fullWidth}
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
            FormHelperTextProps={FormHelperTextProps}
            variant={variant}
            margin={margin}
            fullWidth={fullWidth}
            InputProps={{
              ...params.InputProps,
              ...(InputProps || {}),
            }}
            {...options}
          />
        )}
        renderTags={(value: string[], getTagProps) => {
          return value.filter(Boolean).map((option: any, index: number) => {
            return (
              <Chip
                label={getChoiceText(option)}
                {...getTagProps({ index })}
                {...(disableRemoveValues.includes(get(option, optionValue)) || disabled ? { onDelete: undefined } : {})}
                disabled={false}
              />
            );
          });
        }}
      />
    </div>
  );
};

const useStyles = makeStyles(
  (theme) => {
    const chipBackgroundColor = theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.09)';

    return {
      root: {
        flexGrow: 1,
        height: 250,
      },
      container: {
        flexGrow: 1,
        position: 'relative',
        marginRight: (props: any) => (props?.alwaysOn ? 20 : 0),
      },
      paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
      },
      chip: {
        margin: theme.spacing(0.5, 0.5, 0.5, 0),
      },
      chipContainerFilled: {
        margin: '27px 12px 10px 0',
      },
      inputRoot: {
        flexWrap: 'wrap',
      },
      inputRootFilled: {
        flexWrap: 'wrap',
        '& $chip': {
          backgroundColor: chipBackgroundColor,
        },
      },
      inputInput: {
        width: 'auto',
        flexGrow: 1,
      },
      divider: {
        height: theme.spacing(2),
      },
    };
  },
  { name: 'RaAutocompleteArrayInput' },
);

export default AutocompleteArrayInput;
