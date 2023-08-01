import { Field } from 'shared/components/Resource/List';

export const exportFields = [
  'id',
  'default_role',
  'email',
  'full_name',
  'phone_number',
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
    label: 'Search Team',
    alwaysOn: true,
    fullWidth: true,
    resettable: true,
  },
  {
    type: 'BooleanInput',
    label: 'Active',
    source: 'enabled',
    alwaysOn: true,
    fullWidth: true,
  },
];

export default filterFields;
