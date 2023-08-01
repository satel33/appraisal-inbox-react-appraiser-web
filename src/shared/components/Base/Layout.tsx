import React from 'react';
import { UserMenu, MenuItemLink, AppBar, Layout, LayoutProps, AppBarProps } from 'react-admin';
import Menu from './Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import HelpOutline from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const MyUserMenu = (props: React.ComponentProps<typeof UserMenu>) => {
  return (
    <UserMenu {...props}>
      <MenuItemLink sidebarIsOpen={false} to="/account/my-profile" primaryText="Settings" leftIcon={<SettingsIcon />} />
    </UserMenu>
  );
};
const useLayoutStyles = makeStyles({
  content: {
    padding: '0px 35px',
    backgroundColor: '#ffffff',
    '@media (max-width: 600px)': {
      padding: '0px 5px',
    },
  },
});

const useStyles = makeStyles({
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  spacer: {
    flex: 1,
  },
});

const MyAppBar = (props: AppBarProps) => {
  const classes = useStyles();
  return (
    <AppBar {...props} color="primary" userMenu={<MyUserMenu />}>
      <Typography variant="h6" color="inherit" className={classes.title} id="react-admin-title" />
      <IconButton
        onClick={() => {
          const newWindow = window.open(process.env.REACT_APP_SUPPORT_LINK, '_blank', 'noopener,noreferrer');
          if (newWindow) newWindow.opener = null;
        }}
      >
        <HelpOutline style={{ color: 'white' }} />
      </IconButton>
    </AppBar>
  );
};
const CustomLayout = (props: LayoutProps) => {
  const classes = useLayoutStyles();
  return (
    <Layout
      {...props}
      menu={Menu}
      classes={classes}
      // @ts-ignore
      appBar={MyAppBar}
    />
  );
};

export default CustomLayout;
