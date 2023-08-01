import { makeStyles } from '@material-ui/core/styles';

export const useFilterStyles = makeStyles({
  form: {
    // width: '50%',
    '& .filter-field': {
      flexBasis: '25%',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
    },
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

export const useListStyles = makeStyles({
  root: {
    '& .MuiToolbar-root': {
      paddingTop: '20px',
    },
  },
});
