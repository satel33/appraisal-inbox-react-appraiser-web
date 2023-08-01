import { Field } from 'shared/components/Resource/List';

export const exportFields = [
  'id',
  // 'client_id',
  'client_name',
  'type',
  'full_name',
  'phone_number',
  'email',
  'url',
  'location_address',
  'notes',
  'created_at',
  'updated_at',
  'appraisals_count',
];

const filterFields: Field[] = [
  {
    type: 'SearchInput',
    source: 'full_name,phone_number,location_address,email',
    label: 'Search Contacts',
    alwaysOn: true,
    fullWidth: true,
    resettable: true,
  },
  {
    type: 'BooleanInput',
    label: 'Primary',
    source: 'primary',
    alwaysOn: false,
    fullWidth: false,
  },
  {
    type: 'ReferenceInput',
    label: 'Type',
    source: 'contact_type_id',
    reference: 'contact_types',
    fullWidth: true,
    allowEmpty: false,
    perPage: 200,
    sort: { field: 'order', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ type: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'type',
      },
    ],
  },
  {
    type: 'ReferenceInput',
    label: 'Client',
    source: 'client_id',
    reference: 'client',
    allowEmpty: false,
    fullWidth: true,
    perPage: 200,
    sort: { field: 'name', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ name: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'name',
      },
    ],
  },
];

export default filterFields;
