import * as React from 'react';
import {
  TextField,
  DateField,
  TextInput,
  ReferenceField,
  ReferenceInput,
  ReferenceArrayInput,
  SelectArrayInput,
  BooleanInput,
} from 'react-admin';
import { DateInput, DateTimeInput } from 'shared/components/Pickers';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import AutocompleteArrayInput from 'shared/components/AutocompleteArrayInput';
import DateRangeInput from 'shared/components/DateRangeInput';
import RichTextInput from 'ra-input-rich-text';
import omit from 'lodash/omit';
import CurrencyInput from 'shared/components/CurrencyInput';
import RangeInput from 'shared/components/RangeInput';
import SearchInput from './SearchInput';

type FieldType =
  | 'TextField'
  | 'DateField'
  | 'TextInput'
  | 'ReferenceField'
  | 'AutocompleteInput'
  | 'ReferenceInput'
  | 'CurrencyInput'
  | 'DateInput'
  | 'DateTimeInput'
  | 'RichTextInput'
  | 'DateRangeInput'
  | 'ReferenceArrayInput'
  | 'SelectArrayInput'
  | 'AutocompleteArrayInput'
  | 'RangeInput'
  | 'SearchInput'
  | 'BooleanInput';
export type Field = {
  type: FieldType;
  source?: string;
  children?: Field[];
  [k: string]: any | undefined;
};

type Mapping = {
  [key in FieldType]: React.ComponentType<any>;
};
const mapping: Mapping = {
  TextField,
  DateField,
  TextInput,
  ReferenceField,
  AutocompleteInput,
  ReferenceInput,
  CurrencyInput,
  DateInput,
  DateTimeInput,
  RichTextInput,
  DateRangeInput,
  ReferenceArrayInput,
  SelectArrayInput,
  AutocompleteArrayInput,
  RangeInput,
  SearchInput,
  BooleanInput,
};

export function displayFields<T = any>(
  Parent: React.ComponentType<T>,
  parentProps: T,
  fields: readonly Field[],
): JSX.Element {
  return (
    <Parent {...parentProps}>
      {fields.map((field: Field) => {
        const { children = [] } = field;
        const childNodes = children.map((child) => displayFields(mapping[child.type], child, []));
        return React.createElement(mapping[field.type], omit({ ...field, key: field?.source }, 'type'), ...childNodes);
      })}
    </Parent>
  );
}
