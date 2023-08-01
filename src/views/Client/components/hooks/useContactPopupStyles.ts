import { makeStyles } from '@material-ui/core/styles';
export const styles = {
  divider: {
    marginBottom: '20px',
  },
  formBottom: {
    marginBottom: '15px',
    border: 'none',
  },
  heading: {
    marginTop: '30px',
  },
  headingSecondary: {
    marginTop: '15px',
  },
  formContainer: {
    paddingLeft: '35px',
    paddingRight: '35px',
    '@media (max-width: 600px)': {
      paddingLeft: '5px',
      paddingRight: '5px',
    },
  },
  dialogContent: {
    padding: '8px 12px 12px 12px !important',
  },
  cardHeader: {
    marginLeft: '20px',
    '@media (max-width: 600px)': {
      display: 'none',
    },
  },
  editActions: {
    marginTop: '16px',
    justifyContent: 'space-between',
  },
  primaryToggle: {
    marginLeft: '20px',
    marginTop: '8px',
  },
};
export default makeStyles(styles);
