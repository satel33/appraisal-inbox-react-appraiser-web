import React from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import HomeIcon from '@material-ui/icons/Home';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps, InjectedFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Property } from 'views/Property/types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '46px',
    alignItems: 'center',
  },
  text: {
    padding: '3px',
  },
});

type APNFieldProps = InjectedFieldProps<Property> & FieldProps;
function APNField(props: APNFieldProps) {
  const classes = useStyles();
  const { record } = props;
  let icon: JSX.Element | null = null;
  if (record?.residential_ownership_type_id !== null) {
    if (record?.residential_ownership_type_id === 1) {
      icon = <HomeIcon />;
    } else {
      icon = <ApartmentIcon />;
    }
  } else {
    icon = <BusinessIcon />;
  }

  return (
    <span className={classes.root}>
      {icon}
      <span className={classes.text}>{record?.parcel_number}</span>
    </span>
  );
}

export default APNField;
