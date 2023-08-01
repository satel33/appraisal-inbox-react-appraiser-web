import React from 'react';
/*import BusinessIcon from '@material-ui/icons/Business';
import HomeIcon from '@material-ui/icons/Home';
import ApartmentIcon from '@material-ui/icons/Apartment';*/
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps } from 'react-admin';

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

function FileNumber(props: FieldProps) {
  const classes = useStyles();
  const { record } = props;
  /*let icon: JSX.Element | null = null;
  if (record?.property_type_id === 1) {
    if (record?.residential_ownership_type_id === 1) {
      icon = <HomeIcon />;
    } else {
      icon = <ApartmentIcon />;
    }
  } else {
    icon = <BusinessIcon />;
  }
  */
  return (
    <span className={classes.root}>
      <span className={classes.text}>{record?.appraisal_file_number}</span>
    </span>
  );
}

export default FileNumber;
