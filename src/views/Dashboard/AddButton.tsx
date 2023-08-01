import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Button } from 'react-admin';
import ContentAdd from '@material-ui/icons/Add';
import Appraisal from 'views/Appraisal';
import Client from 'views/Client';
import Contact from 'views/Contact';
import { Link } from 'react-router-dom';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));
const useMenuItemStyles = makeStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
  },
}));
const StyledMenuItem = (props: any) => {
  const classes = useMenuItemStyles();
  return <MenuItem className={classes.root} {...props} selected={false} />;
};

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="customized-menu" aria-haspopup="true" label="Add" onClick={handleClick}>
        <ContentAdd />
      </Button>
      <StyledMenu
        variant="menu"
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        autoFocus={false}
      >
        <StyledMenuItem key="appraisal" component={Link} to="/appraisals/create">
          <ListItemIcon>
            <Appraisal.icon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Appraisal" />
        </StyledMenuItem>
        <StyledMenuItem key="client" component={Link} to="/clients/create">
          <ListItemIcon>
            <Client.icon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Client" />
        </StyledMenuItem>
        <StyledMenuItem key="contact" component={Link} to="/contacts/create">
          <ListItemIcon>
            <Contact.icon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Contact" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
