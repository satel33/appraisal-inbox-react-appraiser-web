import * as React from 'react';
import { FC, Fragment, ReactElement } from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  icon: { minWidth: theme.spacing(5) },
  sidebarIsOpen: {
    '& a': {
      paddingLeft: theme.spacing(4),
      transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
  },
  sidebarIsClosed: {
    '& a': {
      paddingLeft: theme.spacing(2),
      transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
  },
}));

interface Props {
  dense: boolean | undefined;
  handleToggle: () => void;
  icon: ReactElement;
  isOpen: boolean;
  name: string;
  sidebarIsOpen: boolean;
}

const SubMenu: FC<Props> = ({ handleToggle, sidebarIsOpen, isOpen, name, icon, children, dense }) => {
  const classes = useStyles();

  const header = (
    <MenuItem style={{ borderLeft: '3px solid #fff' }} dense={dense} button onClick={handleToggle}>
      <ListItemIcon className={classes.icon}>{isOpen ? <ExpandMore /> : icon}</ListItemIcon>
      <Typography variant="inherit" color="textPrimary">
        {name}
      </Typography>
    </MenuItem>
  );

  return (
    <Fragment>
      {sidebarIsOpen || isOpen ? (
        header
      ) : (
        <Tooltip title={name} placement="right">
          {header}
        </Tooltip>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          disablePadding
          className={sidebarIsOpen ? classes.sidebarIsOpen : classes.sidebarIsClosed}
        >
          {children}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default SubMenu;
