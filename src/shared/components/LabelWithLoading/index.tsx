import React from 'react';
import Typography from '@material-ui/core/Typography';
// import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

type LabelWithLoadingProps = {
  loading?: boolean;
  className: string;
  label: string;
};
export default function LabelWithLoading(props: LabelWithLoadingProps) {
  if (props.loading) {
    return <Skeleton />;
  }
  return (
    <Typography className={props.className} variant="h3" color="textPrimary">
      {props.label}
    </Typography>
  );
}
