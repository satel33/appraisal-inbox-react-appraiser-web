import { Filter, FilterProps } from 'react-admin';
import { displayFields } from 'shared/components/Resource/List';
import { useFilterStyles } from 'shared/components/Resource/styles';
import filterFields from './fields';

function ListFilter(props: Omit<FilterProps, 'children'>) {
  const classes = useFilterStyles();
  return displayFields(Filter, { ...props, classes } as FilterProps, filterFields);
}

export default ListFilter;
