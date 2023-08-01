import React, { useCallback, FunctionComponent, useMemo, isValidElement } from 'react';
import { DownshiftProps } from 'downshift';
import get from 'lodash/get';
import { makeStyles } from '@material-ui/core/styles';
import { TextFieldProps } from '@material-ui/core/TextField';
import { useInput, InputProps, useSuggestions, warning } from 'ra-core';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { getColorMapping, BackGroundType, getBackgroundColorMapping } from 'shared/hooks/useRowStyle';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

interface Options {
  suggestionsContainerProps?: any;
  labelProps?: any;
}

/**
 * An Input component for an menubutton field, using an array of objects for the options
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
 * <MenuButtonInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <MenuButtonInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <MenuButtonInput source="author_id" choices={choices} optionText={optionRenderer} />
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
 * <MenuButtonInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 *
 * @example
 * <MenuButtonInput source="author_id" options={{ color: 'secondary', FormLabelProps: { shrink: true } }} />
 */
const useButtonStyle = makeStyles({
  root: {
    width: '100%',
    textTransform: 'uppercase',
    justifyContent: 'space-between',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // @ts-ignore
    fontWeight: 500,
    fontSize: '0.8rem',
    backgroundColor: (props: any) => props.backgroundColor,
    color: (props: any) => props.color,
  },
});
const MenuButtonInput: FunctionComponent<InputProps<TextFieldProps & Options> & DownshiftProps<any>> = (props) => {
  const {
    allowEmpty,
    className,
    classes: classesOverride,
    choices = [],
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
    matchSuggestion,
    meta: metaOverride,
    onBlur,
    onChange,
    onFocus,
    optionText = 'name',
    inputText,
    optionValue = 'id',
    parse,
    resource,
    setFilter,
    shouldRenderSuggestions: shouldRenderSuggestionsOverride,
    source,
    suggestionLimit,
    translateChoice = true,
    validate,
    startDisplay,
    ...rest
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isValidElement(optionText) && !inputText) {
    throw new Error(`If the optionText prop is a React element, you must also specify the inputText prop:
      <MenuButtonInput
          inputText={(record) => record.title}
      />`);
  }

  warning(
    isValidElement(optionText) && !matchSuggestion,
    `If the optionText prop is a React element, you must also specify the matchSuggestion prop:
<MenuButtonInput
  matchSuggestion={(filterValue, suggestion) => true}
/>
      `,
  );

  const classes = useStyles(props);

  const { id, input, isRequired } = useInput({
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
    [choices, optionValue],
  );

  const selectedItem = useMemo(() => getSuggestionFromValue(input.value) || null, [
    input.value,
    getSuggestionFromValue,
  ]);

  const { getChoiceText, getChoiceValue } = useSuggestions({
    allowEmpty: false,
    choices,
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
      handleClose();
    },
    [getChoiceValue, input],
  );

  const buttonClasses = useButtonStyle({
    color: getColorMapping(getChoiceText(selectedItem)),
    backgroundColor: getBackgroundColorMapping(getChoiceText(selectedItem), BackGroundType.Cell),
  });
  return (
    <FormControl disabled={disabled} className={classes.container} fullWidth={fullWidth} style={{ marginLeft: '10px' }}>
      <FormLabel
        component="legend"
        style={{ fontSize: '0.75rem' }}
        required={typeof isRequiredOverride !== 'undefined' ? isRequiredOverride : isRequired}
      >
        {label}
      </FormLabel>
      <Button className={buttonClasses.root} aria-controls={id} aria-haspopup="true" onClick={handleClick}>
        {selectedItem !== null ? getChoiceText(selectedItem) : label}
        {!disabled && <ArrowDropDownIcon />}
      </Button>
      <Menu id={id} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {choices.map((choice: any) => (
          <MenuItem key={choice.id} onClick={() => handleChange(choice)}>
            {getChoiceText(choice)}
          </MenuItem>
        ))}
      </Menu>
    </FormControl>
  );
};

const useStyles = makeStyles(
  {
    root: {
      flexGrow: 1,
    },
    container: {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
  { name: 'RaMenuButtonInput' },
);

export default MenuButtonInput;
