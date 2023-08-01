import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';

export default createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
      dark: blue[500],
    },
    secondary: {
      light: '#5f5fc4',
      main: '#283593',
      dark: '#001064',
      contrastText: '#fff',
    },
    error: red,
    text: {
      primary: '#434445',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  // shadows: Array(25).fill('none') as Shadows,
  overrides: {
    MuiTabs: {
      indicator: {
        height: '3px',
      },
    },
    MuiTab: {
      root: {
        '@media (min-width: 600px)': {
          minWidth: '140px',
        },
      },
    },
    // @ts-ignore
    RaMenuItemLink: {
      root: {
        borderLeft: '3px solid #fff',
        color: '#434445',
      },
      active: {
        borderLeft: '3px solid #2196f3',
        fontWeight: 700,
        background: '#e8e8e8',
      },
    },
    MuiListItemIcon: {
      root: {
        color: '#4a4a4a',
      },
    },
    RaFilterForm: {
      form: {
        width: '100%',
      },
    },
    RaFilterFormInput: {
      spacer: {
        width: '3px',
      },
      body: {
        // minWidth: 250,
        // maxWidth: 300,
      },
    },
    RaEdit: {
      card: {
        boxShadow: 'none',
      },
    },
    RaCreate: {
      card: {
        boxShadow: 'none',
      },
    },
    RaTabbedForm: {
      fixedDisplay: {
        boxShadow: 'none',
      },
      content: {
        boxShadow: 'none',
        paddingTop: '18px',
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none',
      },
    },
    RaList: {
      content: {
        boxShadow: 'none',
      },
    },
    MuiInputBase: {
      root: {
        color: '#434445',
      },
      input: {
        '&$disabled': {
          color: '#434445',
        },
      },
    },
  },
});
