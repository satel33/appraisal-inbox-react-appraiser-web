import { makeStyles } from '@material-ui/core/styles';
import { Filter, FilterProps } from 'react-admin';
import { displayFields } from 'shared/components/Resource/List';
import filterFields from './fields';

export const useFilterStyles = makeStyles({
  form: {
    // width: '50%',
    '& .filter-field:nth-of-type(1)': {
      flexBasis: '40%',
      maxWidth: 500,
      flexDirection: 'row',
    },
  },
  button: {
    width: 'max-content',
  },
});
function ListFilter(props: Omit<FilterProps, 'children'>) {
  const classes = useFilterStyles();
  return displayFields(Filter, { ...props, classes } as FilterProps, filterFields);
}

export default ListFilter;
