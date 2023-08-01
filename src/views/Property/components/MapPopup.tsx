import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import AddressIcon from '@material-ui/icons/LocationOn';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import APNField from 'views/Transactions/components/APNField';
import { PropertyWithCoordinates } from '../types';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  spacing: {
    paddingBottom: 0,
    paddingTop: 0,
    paddingRight: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  card: {
    borderRadius: 0,
  },
});

type MapPopupProps = {
  selected: PropertyWithCoordinates;
};

export default function MapPopup(props: MapPopupProps) {
  const classes = useStyles();
  const { selected } = props;
  return (
    <Box minWidth="450px">
      <Grid container>
        <Grid item md={8}>
          <Card className={classes.card}>
            <CardHeader
              className={classes.spacing}
              subheaderTypographyProps={{ variant: 'caption' }}
              titleTypographyProps={{ variant: 'h6' }}
              title={
                <Grid container spacing={2}>
                  <Grid item md={7}>
                    <Link component={RouterLink} to={`/properties/${selected.id}`}>
                      <APNField record={selected} />
                    </Link>
                  </Grid>
                </Grid>
              }
              subheader={
                <Box display="flex">
                  <AddressIcon style={{ fontSize: '1rem', paddingTop: '6px' }} />
                  <Typography style={{ padding: '4px' }} variant="caption">
                    {selected.location_address}
                  </Typography>
                </Box>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
