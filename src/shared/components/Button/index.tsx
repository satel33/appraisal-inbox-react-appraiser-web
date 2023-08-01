import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classnames from 'classnames';
import React, { cloneElement, ReactElement } from 'react';

type CustomButtonProps = ButtonProps & {
  isLoading: boolean;
  label: string;
  icon?: ReactElement;
};
function CustomButton(props: CustomButtonProps) {
  const { isLoading, label, icon, ...restProps } = props;
  const classes = useStyles(props);
  return (
    <Button {...restProps}>
      {isLoading ? (
        <CircularProgress size={18} thickness={2} className={classes.leftIcon} />
      ) : (
        icon &&
        cloneElement(icon, {
          className: classnames(classes.leftIcon, classes.icon),
        })
      )}
      {label}
    </Button>
  );
}

const useStyles = makeStyles(
  (theme) => ({
    button: {
      position: 'relative',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    icon: {
      fontSize: 18,
    },
  }),
  { name: 'CustomButton' },
);

export default CustomButton;
