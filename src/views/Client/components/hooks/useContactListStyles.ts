import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  headCell: {
    fontWeight: 400,
    padding: '12px 12px',
    '@media (max-width: 600px)': {
      padding: '6px 6px',
    },
  },
  headFixedCell: {
    fontWeight: 400,
    padding: '12px 12px',
    width: '250px',
    '@media (max-width: 600px)': {
      padding: '6px 6px',
    },
  },
  cell: {
    fontWeight: 500,
    padding: '12px 12px',
    '@media (max-width: 600px)': {
      padding: '12px 6px',
    },
  },
  cellEdit: {
    width: '60px',
    padding: '12px 12px',
    '@media (max-width: 600px)': {
      padding: '12px 4px 0px 0px',
      width: '20px',
    },
  },
  cellBottom: {
    border: 'none !important',
    fontWeight: 500,
    padding: '14px 12px',
    '@media (max-width: 600px)': {
      padding: '14px 6px',
    },
  },
  note: {
    margin: '0',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  iconPadding: {
    paddingRight: '12px',
    '@media (max-width: 600px)': {
      paddingRight: '4px',
    },
  },
  activeCursor: {
    cursor: 'pointer',
  },
  disableCursor: {
    cursor: 'no-drop',
  },
  savedCell: {
    paddingBottom: '0px',
    minWidth: '64px',
  },
  paper: {
    position: 'absolute',
    width: 520,
    backgroundColor: 'white',
    padding: '20px',
    top: `${47}%`,
    left: `${47}%`,
    transform: `translate(-${47}%, -${47}%)`,
    outline: 'none',
  },
  heading: {
    fontWeight: 500,
    fontSize: '1.2rem',
  },
  confirmBtnBox: {
    textAlign: 'right',
  },
  addBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'end',
    padding: '10px 5px 8px 0px',
  },
  addFeeBox: {
    padding: '10px',
    marginBottom: '15px',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addContactBtn: {
    marginRight: '20px',
  },
  tableHead: {
    backgroundColor: '#e8e8e8',
  },
});
