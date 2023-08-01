import React from 'react';
import Card from '@material-ui/core/Card';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LabelWithLoading from 'shared/components/LabelWithLoading';
import { SvgIconProps } from '@material-ui/core/SvgIcon/SvgIcon';

const useStyles = makeStyles((theme) => ({
  card: {
    minHeight: 52,
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
    borderRadius: 0,
    color: 'green',
  },
  main: {
    overflow: 'inherit',
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '1rem',
  },
  count: {
    fontSize: '2.0rem',
  },
}));

type StatsCardProps = {
  to?: LinkProps['to'];
  icon: React.FunctionComponent<SvgIconProps>;
  loading: boolean;
  stats: string;
  label: string;
};

function StatsCard(props: StatsCardProps) {
  const { icon, label, to, loading, stats } = props;
  const classes = useStyles();
  const child = (
    <div className={classes.main}>
      <Box width="3em" className="icon">
        {React.createElement(icon, { fontSize: 'large', color: 'action' })}
      </Box>
      <Box textAlign="right">
        <Typography className={classes.label} component="h3" gutterBottom variant="overline" color="textSecondary">
          {label}
        </Typography>
        <LabelWithLoading label={stats} loading={loading} className={classes.count} />
      </Box>
    </div>
  );
  return <Card className={classes.card}>{to ? <RouterLink to={to}>{child}</RouterLink> : child}</Card>;
}

export default StatsCard;
