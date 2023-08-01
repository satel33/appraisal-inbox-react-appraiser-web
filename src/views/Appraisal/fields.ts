import { Field } from 'shared/components/Resource/List';

const listFields: Field[] = [
  {
    type: 'TextField',
    source: 'appraisal_file_number',
    label: 'File Number',
  },
  {
    type: 'TextField',
    source: 'location_address',
    label: 'Location',
  },
  {
    type: 'TextField',
    source: 'client_name',
    reference: 'client',
    label: 'Client',
  },
  {
    type: 'TextField',
    source: 'appraisal_priority',
    label: 'Priority',
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
  {
    type: 'TextField',
    source: 'appraisal_status',
    label: 'Status',
  },
];

export const createFields: Field[] = [
  {
    type: 'TextInput',
    source: 'appraisal_file_number',
    fullWidth: true,
  },
  {
    type: 'ReferenceInput',
    label: 'Status',
    source: 'appraisal_status_id',
    reference: 'appraisal_statuses',
    fullWidth: true,
    perPage: 100,
    variant: 'standard',
    sort: { field: 'order', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ status: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'status',
      },
    ],
  },
  {
    type: 'ReferenceInput',
    label: 'Client',
    source: 'client_id',
    reference: 'client',
    fullWidth: true,
    perPage: 2000,
    variant: 'standard',
    sort: { field: 'name', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ name: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'name',
      },
    ],
  },
  {
    type: 'DateInput',
    label: 'Due Date',
    source: 'due_date',
    fullWidth: true,
  },
];

export const filterFields: Field[] = [
  {
    type: 'SearchInput',
    label: 'Search Appraisals',
    source:
      'appraisal_file_number,organization_name,client_name,client_file_number,client_loan_number,appraisal_notes,property_notes,location_address,fha_case_number,va_case_number,parcel_number,universal_property_identifier,subdivision,tax_id,zoning',
    alwaysOn: true,
    fullWidth: true,
    resettable: true,
  },
  {
    type: 'ReferenceInput',
    label: 'Client',
    source: 'client_id',
    reference: 'client',
    alwaysOn: true,
    fullWidth: true,
    allowEmpty: false,
    perPage: 'Infinity',
    sort: { field: 'name', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ name: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'name',
        alwaysOn: true,
      },
    ],
  },
  {
    type: 'ReferenceArrayInput',
    label: 'Assignee',
    source: 'assignee_user_account_ids',
    reference: 'user_profiles',
    sort: { field: 'full_name', order: 'ASC' },
    fullWidth: true,
    alwaysOn: true,
    perPage: 100,
    variant: 'standard',
    children: [
      {
        type: 'AutocompleteArrayInput',
        optionValue: 'user_account_id',
        alwaysOn: true,
        optionText: (record: { first_name: string; last_name: string }) =>
          [record?.first_name, record?.last_name].join(' '),
      },
    ],
  },
  {
    type: 'ReferenceArrayInput',
    label: 'Contact',
    source: 'contact_ids',
    reference: 'contacts',
    fullWidth: true,
    perPage: 100,
    variant: 'standard',
    sort: { field: 'full_name', order: 'ASC' },
    children: [
      {
        type: 'AutocompleteArrayInput',
        optionText: (record: { first_name: string; last_name: string }) =>
          [record?.first_name, record?.last_name].join(' '),
      },
    ],
  },
  {
    type: 'ReferenceInput',
    label: 'Priority',
    source: 'appraisal_priority_id',
    reference: 'appraisal_priorities',
    allowEmpty: false,
    fullWidth: true,
    perPage: 2,
    sort: { field: 'order', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ priority: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'priority',
      },
    ],
  },
  {
    type: 'ReferenceInput',
    label: 'Appraisal Purpose',
    source: 'appraisal_purpose_id',
    reference: 'appraisal_purposes',
    allowEmpty: false,
    fullWidth: true,
    perPage: 100,
    sort: { field: 'order', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ purpose: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'purpose',
      },
    ],
  },
  {
    type: 'ReferenceInput',
    label: 'Property Type',
    source: 'property_type_id',
    reference: 'property_types',
    allowEmpty: false,
    fullWidth: true,
    perPage: 2,
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
    label: 'Commercial Property Type',
    source: 'commercial_property_type_id',
    reference: 'commercial_property_type',
    alwaysOn: true,
    fullWidth: true,
    perPage: 100,
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
    label: 'Commercial Property Subtype',
    source: 'commercial_property_subtype_id',
    reference: 'commercial_property_subtype',
    alwaysOn: true,
    fullWidth: true,
    perPage: 100,
    sort: { field: 'order', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ subtype: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'subtype',
      },
    ],
  },
  {
    type: 'ReferenceInput',
    label: 'Report Type',
    source: 'report_type_id',
    reference: 'report_types',
    allowEmpty: false,
    fullWidth: true,
    perPage: 100,
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
    label: 'Residential Ownership Type',
    source: 'residential_ownership_type_id',
    reference: 'residential_ownership_types',
    alwaysOn: true,
    allowEmpty: false,
    fullWidth: true,
    perPage: 100,
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
    label: 'Residential Style',
    source: 'residential_style_id',
    reference: 'residential_styles',
    alwaysOn: true,
    allowEmpty: false,
    fullWidth: true,
    perPage: 100,
    sort: { field: 'order', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ style: searchText }),
    children: [
      {
        type: 'AutocompleteInput',
        optionText: 'style',
      },
    ],
  },
  {
    type: 'ReferenceArrayInput',
    label: 'Residential Form Type',
    source: 'residential_form_type_ids',
    reference: 'residential_form_types',
    alwaysOn: true,
    allowEmpty: false,
    fullWidth: true,
    perPage: 100,
    sort: { field: 'order', order: 'ASC' },
    filterToQuery: (searchText: string) => ({ type: searchText }),
    children: [
      {
        type: 'AutocompleteArrayInput',
        optionText: 'type',
        // transformChoice: (arg: any) => ({ ...arg, id: `${arg.id}` }),
      },
    ],
  },
  {
    type: 'ReferenceInput',
    label: 'Loan Type',
    source: 'loan_type_id',
    reference: 'loan_types',
    allowEmpty: false,
    fullWidth: true,
    perPage: 100,
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
    type: 'DateRangeInput',
    source: 'inspection_date',
    label: 'Inspection Date',
    fullWidth: true,
    variant: 'standard',
  },
  {
    type: 'DateRangeInput',
    source: 'due_date',
    label: 'Due Date',
    fullWidth: true,
    variant: 'standard',
  },
  {
    type: 'DateRangeInput',
    source: 'quote_made_date',
    label: 'Quote Made Date',
    fullWidth: true,
    variant: 'standard',
  },
  {
    type: 'DateRangeInput',
    source: 'engagement_date',
    label: 'Engagement Date',
    fullWidth: true,
    variant: 'standard',
  },
  {
    type: 'DateRangeInput',
    source: 'completed_date',
    label: 'Completed Date',
    fullWidth: true,
    variant: 'standard',
  },
  {
    type: 'DateRangeInput',
    source: 'reviewed_date',
    label: 'Reviewed Date',
    fullWidth: true,
    variant: 'standard',
  },
  {
    type: 'DateRangeInput',
    source: 'paid_date',
    label: 'Paid Date',
    fullWidth: true,
    variant: 'standard',
  },
  {
    type: 'DateRangeInput',
    source: 'canceled_date',
    label: 'Canceled Date',
    fullWidth: true,
    variant: 'standard',
  },
];

export const exportFields = [
  'id',
  // 'property_id',
  // 'client_id',
  'client_name',
  // TODO: join in created_by_user_account full name
  // 'created_by_user_account_id',
  // 'assignee_user_account_ids',
  'assignee_user_account_names',
  // 'contact_ids',
  'appraisal_status',
  'appraisal_priority',
  // TODO: join in residential_form_type
  // 'residential_form_type_ids',
  // TODO: join in appraisal_purpose
  // 'appraisal_purpose_id',
  // TODO: join in loan_type
  // 'loan_type_id',
  'property_type',
  // TODO: join in commercial_property_type
  // 'commercial_property_type_id',
  // TODO: join in commercial_property_subtype
  // 'commercial_property_subtype_id',
  // TODO: join in residential_ownership_type
  // 'residential_ownership_type_id',
  // TODO: join in residential_style
  // 'residential_style_id',
  'starred',
  'appraisal_file_number',
  'client_file_number',
  'client_loan_number',
  'fha_case_number',
  'va_case_number',
  'usda_case_number',
  'sales_approach_value',
  'cost_approach_value',
  'income_approach_value',
  'quote_fee',
  'report_fee',
  'paid_fee',
  'quote_made_date',
  'quote_accepted_date',
  'quote_declined_date',
  'engagement_date',
  'due_date',
  'due_date_in',
  'inspection_date',
  'inspection_date_in',
  'submitted_date',
  'completed_date',
  'reviewed_date',
  'revision_request_date',
  'paid_date',
  'on_hold_date',
  'canceled_date',
  'appraisal_notes',
  'location_address',
  // 'location_components',
  // 'location_geography',
  // 'location_city',
  // 'location_county',
  // 'location_state',
  // 'location_postal_code',
  'parcel_number',
  'universal_property_identifier',
  'subdivision',
  'tax_id',
  'zoning',
  'total_acres',
  'year_built',
  'year_renovated',
  'site',
  'heating_cooling',
  'energy_efficient_items',
  'commercial_building_name',
  'commercial_buildings',
  'commercial_floors',
  'commercial_units',
  'commercial_gross_area',
  'residential_above_grade_bedrooms',
  'residential_above_grade_bathrooms',
  'residential_below_grade_bedrooms',
  'residential_below_grade_bathrooms',
  'residential_gross_living_area',
  'residential_basement_and_finished',
  'residential_functional_utility',
  'residential_garage_carport',
  'residential_porch_patio_deck',
  'residential_fireplaces',
  'residential_other',
  'property_notes',
  'created_at',
  'updated_at',
];
export default listFields;