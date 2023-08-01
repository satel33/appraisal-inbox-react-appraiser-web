import { Filter, FilterProps } from 'react-admin';
import { displayFields } from 'shared/components/Resource/List';
import { filterFields } from './fields';
import { useFilterStyles } from 'shared/components/Resource/styles';

export default (props: Omit<FilterProps, 'children'>) => {
  const classes = useFilterStyles();
  return displayFields(Filter, { ...props, classes } as FilterProps, filterFields);
};
