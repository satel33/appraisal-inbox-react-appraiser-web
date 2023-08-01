import { Field } from 'shared/components/Resource/List';

export const STREET_FIELD: Field = {
  source: 'street',
  type: 'TextField',
};
export const LOCATION_FIELD: Field = {
  source: 'location_address',
  type: 'TextInput',
  variant: 'standard',
};
export const ZIP_FIELD: Field = {
  source: 'zip',
  type: 'TextField',
};
export const NAME_FIELD: Field = {
  source: 'name',
  type: 'TextInput',
  variant: 'standard',
};
export const STATE_FIELD: Field = {
  type: 'ReferenceInput',
  label: 'State',
  source: 'us_state_id',
  reference: 'us_states',
  filterToQuery: (searchText: string) => ({ state: searchText }),
  sort: { field: 'state_long', order: 'ASC' },
  children: [
    {
      type: 'AutocompleteInput',
      optionText: 'state',
    },
  ],
};
export const COUNTRY_FIELD: Field = {
  type: 'TextInput',
  source: 'country',
};
export const NOTES_FIELD: Field = {
  type: 'TextInput',
  source: 'notes',
  rows: 3,
  multiline: true,
};
const listFields: Field[] = [
  {
    source: 'name',
    type: 'TextField',
  },
  {
    source: 'location_address',
    type: 'TextField',
    label: 'Location',
  },
];

export const showFields = listFields;

export const editFields: Field[] = [
  {
    type: 'TextField',
    source: 'appraisal_file_number',
    label: 'File Number',
  },
  {
    type: 'TextField',
    source: 'street',
    label: 'Address',
  },
  {
    type: 'TextField',
    source: 'street',
    label: 'Address',
  },
  {
    type: 'ReferenceField',
    source: 'us_state_id',
    reference: 'us_states',
    label: 'State',
    link: false,
    children: [
      {
        type: 'TextField',
        source: 'state_short',
      },
    ],
  },
  {
    type: 'ReferenceField',
    source: 'appraisal_status_id',
    reference: 'appraisal_statuses',
    label: 'Status',
    link: false,
    children: [
      {
        type: 'TextField',
        source: 'state_short',
      },
    ],
  },
  {
    type: 'ReferenceField',
    source: 'appraisal_priority_id',
    reference: 'appraisal_priorities',
    label: 'Priority',
    link: false,
    children: [
      {
        type: 'TextField',
        source: 'priority',
      },
    ],
  },
  {
    type: 'DateField',
    source: 'inspection_date',
    label: 'Inspection',
  },
  {
    type: 'DateField',
    source: 'due_date',
    label: 'Due',
  },
];

export const createFields: Field[] = [
  {
    type: 'TextInput',
    source: 'name',
    variant: 'standard',
  },
  {
    type: 'TextInput',
    source: 'location_address',
    variant: 'standard',
  },
  {
    type: 'RichTextInput',
    source: 'notes',
    multiline: true,
    variant: 'standard',
  },
];

export const filterFields: Field[] = [
  {
    type: 'SearchInput',
    source: 'name,notes,location_address',
    label: 'Search Clients',
    alwaysOn: true,
    fullWidth: true,
    resettable: true,
  },
  {
    type: 'ReferenceInput',
    label: 'Type',
    source: 'client_type_id',
    reference: 'client_types',
    allowEmpty: false,
    fullWidth: true,
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
];

export const exportFields = [
  'id',
  'client_type',
  'name',
  'url',
  'location_address',
  'notes',
  'report_requirements',
  'created_at',
  'updated_at',
  'appraisals_count',
  'contacts_count',
];
export default listFields;
