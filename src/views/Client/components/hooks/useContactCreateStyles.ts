import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
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
  headingFirst: {
    marginTop: '0px',
  },
  formContainer: {
    display: 'flow-root',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  cardRoot: {
    paddingRight: '10px',
    paddingLeft: '10px',
    marginBottom: '30px',
    paddingTop: '0px !important',
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
});
