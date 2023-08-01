import { makeStyles } from '@material-ui/core/styles';
export const styleLeft = makeStyles({
  cursorType: {
    cursor: 'pointer',
  },
  formContainer: {
    display: 'flow-root',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingRight: '10px',
    '@media (max-width: 990px)': {
      paddingRight: '0px',
    },
  },
  divider: {
    marginBottom: '20px',
  },
  heading: {
    marginTop: '30px',
  },
  noBorder: {
    border: '1px solid transparent',
  },
  focused: {
    border: '1px solid transparent',
    outline: 'none !important',
  },
  editor: {
    root: {
      border: '5px solid red',
    },
  },
  notesEditButton: {
    position: 'absolute',
    right: '15px',
    zIndex: 100,
    top: '2px',
    '&:hover': {
      background: 'white !important',
    },
  },
  saveActionButton: {
    position: 'absolute',
    right: '45px',
    zIndex: 100,
    top: '2px',
    '&:hover': {
      background: 'white !important',
    },
  },
  notesEditButtonClose: {
    position: 'absolute',
    right: '15px',
    zIndex: 100,
    top: '2px',
    '&:hover': {
      background: 'transparent',
    },
  },
  notesEditButtonSave: {
    position: 'absolute',
    right: '40px',
    zIndex: 100,
    top: '-1px',
    '&:hover': {
      background: 'transparent',
    },
  },
  relative: {
    position: 'relative',
    overflow: 'visible',
  },

  italic: {
    fontStyle: 'italic',
  },

  uppercase: {
    // fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  bold: {
    fontWeight: 'bold',
  },
  underLined: {
    textDecoration: 'underLined',
  },
  link: {
    padding: '0px',
    fontWeight: 'bold',
    // textDecoration: 'underLined',
    color: '#434445',
    '&:hover': {
      color: '#2196f3',
    },
  },
});

export const styleRight = makeStyles({
  card: {
    width: '100%',
  },

  overflow: {
    overflow: 'unset',
  },
  cursorType: {
    cursor: 'pointer',
  },
  formContainer: {
    display: 'flow-root',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  gap: {
    marginTop: '30px',
    marginBottom: '30px',
  },
  divider: {
    marginBottom: '20px',
  },
  icon: {
    color: '#434445',
  },
  selectDivider: {
    marginBottom: '5px',
  },
  dividerSub: {
    marginBottom: '12px',
  },
  dividerSubSelect: {
    marginBottom: '5px',
    marginTop: '10px',
  },
  dividerLast: {
    marginTop: '10px',
  },
  profileSectionMT: {
    marginTop: '15px',
  },
  dividerMB: {
    marginBottom: '25px',
  },
  dividerEnd: {
    marginBottom: '3px',
    marginTop: '8px',
  },
  saveActionButton: {
    position: 'absolute',
    right: '45px',
    zIndex: 100,
    top: '0px',
    '&:hover': {
      background: 'white !important',
    },
  },
  labelWidth: {
    width: '117px',
  },
  heading: {
    marginTop: '12px',
    marginLeft: '15px',
    whiteSpace: 'nowrap',
  },
  fontLarge: {
    fontSize: '1.2rem',
  },
  heading500: {
    fontWeight: 500,
  },
  heading400: {
    fontWeight: 400,
  },
  subheading: {
    marginLeft: '15px',
  },
  topEditBtn: {
    padding: '0px',
    background: 'white',
    marginTop: '8px',
    marginRight: '14px',
    '&:hover': {
      background: 'white !important',
    },
  },
  topEditBtnProfile: {
    padding: '0px',
    background: 'white',
    marginRight: '14px',
    '&:hover': {
      background: 'white !important',
    },
  },
  fieldEditBtn: {
    background: 'white',
    '&:hover': {
      background: 'white !important',
    },
  },
  fieldEditBtnMultiSelect: {
    position: 'absolute',
    right: '0px',
    background: 'white',
    '&:hover': {
      background: 'white !important',
    },
  },
  fieldEditStatusBtn: {
    marginTop: '13px',
    marginLeft: '5px',
    position: 'absolute',
    right: '65px',
  },
  fieldEditDateBtn: {
    marginTop: '10px',
    marginLeft: '5px',
    position: 'absolute',
    right: '65px',
  },
  addToCalendarBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '40px',
    position: 'relative',
    // alignItems: 'center',
  },
  flexBoxAuto: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  flexBoxCenter: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  countBtn: {
    cursor: 'pointer',
    padding: '2px 0px',
  },
  roleInfo: {
    color: '#000000',
    fontSize: '0.8rem',
    fontStyle: 'italic',
    position: 'relative',
    top: '0px',
    marginLeft: '2px',
  },
  resourceSection: {
    paddingLeft: '10px',
    paddingTop: '10px',
    backgroundColor: '#e8e8e8',
    marginTop: '4px',
  },
  inputFontWeight: {
    fontWeight: 500,
  },
  inputFontSize: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  priorityRush: {
    color: '#FF6347 !important',
    '& input': {
      color: '#FF6347 !important',
      fontStyle: 'italic',
    },
  },
  priorityNormal: {
    color: '#000000',
  },
  addressInput: {
    width: '100%',
    paddingRight: '5px !important',
  },
  inputLabelNone: {
    display: 'none',
  },
  inputContainer: {
    width: '65%',
    '& .MuiFormControl-marginDense': {
      marginTop: '3px',
      marginBottom: '3px',
    },
    '@media (max-width: 1300px)': {
      width: '62%',
    },
    '@media (max-width: 1200px)': {
      width: '60%',
    },
    '@media (max-width: 1100px)': {
      width: '55%',
    },
    '@media (max-width: 1000px)': {
      width: '50%',
    },
    '@media (max-width: 900px)': {
      width: '65%',
    },
  },
  inputContainerRole: {
    display: 'flex',
    justifyContent: 'start',
    width: '65%',
    marginTop: '8px',
  },
  btnUrl: { paddingRight: '1px', '& svg': { fontSize: '1.1rem' } },
  popupIndicator: {
    display: 'none',
  },
  popupIndicatorOpen: {
    display: 'inline-flex',
  },
  hideAdornmentBackground: {
    background: 'transparent',
  },
  cssOutlinedActive: {
    '&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.12)', //hovered
    },
  },
  cssOutlinedDisabled: {
    '&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline': {
      borderColor: 'transparent', //hovered
    },
  },
  cssOutlinedInput: {
    paddingRight: '0px !important',
    '& legend': {
      width: '0px',
    },
    '&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline': {
      borderColor: 'transparent', //default
    },
    '&$cssFocused $notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.12)', //focused
    },
    '& input': {
      paddingRight: '2px',
      textUnderlineOffset: '4px',
      textOverflow: 'ellipsis',
      lineHeight: '30px',
      cursor: 'pointer !important',
    },
    '& textarea': {
      paddingRight: '2px',
      textOverflow: 'ellipsis',
    },
  },
  notchedOutline: {},
  cssFocused: {},
});

export const simpleFormContainer = makeStyles({
  formContainer: {
    display: 'flow-root',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginBottom: '120px',
  },
  formContainerOrganization: {
    display: 'flow-root',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  simpleForm: {
    '& .MuiCardContent-root': {
      padding: '0px',
    },
  },
  emailField: {
    marginTop: '-14px',
  },
  edit: {
    '& .RaEdit-noActions-67': {
      margin: '0px',
    },
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow:
      '0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)',
  },
  modalHeading: {
    padding: '16px 24px',
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
    color: '#434445',
  },
  modalBody: {
    padding: '8px 24px',
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  modalActions: {
    flex: '0 0 auto',
    display: 'flex',
    padding: '8px',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export const profileStyles = makeStyles({
  userAccountBox: {
    margin: '0.5rem 0px 0.5rem 0px',
  },
  userAccountHeading: {
    paddingTop: '8px',
    paddingLeft: '14px',
  },
  userAccountCard: {
    marginTop: '5px',
  },
  orgMB: {
    marginBottom: '25px',
  },
  toggle: {
    marginTop: '-20px',
    marginLeft: '10px',
  },
  subscription: {
    paddingLeft: '14px',
  },
  paymentLink: {
    paddingBottom: '20px',
    paddingLeft: '14px',
  },
  viewSubscription: {
    marginTop: '1px',
    paddingLeft: '14px',
    marginBottom: '20px',
    display: 'block',
  },
  subscriptionContainer: {
    paddingTop: '14px',
    paddingLeft: '18px',
  },
  accessLabel: {
    marginTop: '15px',
  },
  toggleDisabled: {
    '& .Mui-disabled': {
      color: '#434445',
    },
  },
});
