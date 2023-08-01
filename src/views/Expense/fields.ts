import { Field } from 'shared/components/Resource/List';

const listFields: Field[] = [
  {
    type: 'TextField',
    source: 'expense_type',
    label: 'Type',
  },
  {
    type: 'TextField',
    source: 'appraisal_file_number',
    label: 'File #',
  },
  {
    type: 'TextField',
    source: 'description',
    label: 'Description',
  },
  {
    type: 'TextField',
    source: 'quantity',
    label: 'Quantity',
  },
  {
    type: 'DateField',
    source: 'expense_date',
    label: 'Date',
  },
];

export const createFields: Field[] = [];

export const filterFields: Field[] = [
  {
    type: 'SearchInput',
    source: 'appraisal_file_number,description',
    label: 'Search Expenses',
    alwaysOn: true,
    fullWidth: true,
    resettable: true,
  },
];

export const exportFields = [
  'id',
  'expense_type',
  'appraisal_file_number',
  'description',
  'rate',
  'quantity',
  'rate_type_id',
  'total_amount',
  'expense_date',
  'created_at',
  'updated_at',
];

export default listFields;
