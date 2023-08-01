import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import FileNumber from '../FileNumber';
import StatusColumn from '../StatusColumn';
import { getBackgroundColorMapping } from 'shared/hooks/useRowStyle';
import ClientIcon from '@material-ui/icons/AccountBalance';
import AssigneeIcon from '@material-ui/icons/People';
import AddressIcon from '@material-ui/icons/LocationOn';
import Link from '@material-ui/core/Link';
import formatDate from 'date-fns/format';
import isPast from 'date-fns/isPast';
import isToday from 'date-fns/isToday';
import { Link as RouterLink } from 'react-router-dom';

import AssigneeField from '../AssigneeField';
import { displayDateIn } from 'shared/utils';
import { Appraisals } from 'views/Appraisal/types';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  card: {
    borderLeftWidth: 5,
    borderLeftStyle: 'solid',
    borderLeftColor: (props: { color: string }) => props.color,
    boxShadow: 'none',
    borderRadius: 0,
  },
  spacing: {
    paddingBottom: 0,
    paddingTop: 0,
    paddingRight: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  iconContainer: {
    paddingLeft: '0px',
  },
  icon: {
    padding: '8px 8px 8px 0px',
  },
  dateWrapper: {
    height: '100%',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
});

type MapPopupProps = {
  selected: Appraisals;
  hideInspection?: boolean;
  hideDue?: boolean;
};

export default function MapPopup(props: MapPopupProps) {
  const { selected, hideDue, hideInspection } = props;
  const isPastDue = Boolean(
    !selected.completed_date &&
      selected.due_date &&
      isPast(new Date(selected.due_date)) &&
      !isToday(new Date(selected.due_date)),
  );
  const classes = useStyles({ color: getBackgroundColorMapping(selected.appraisal_status) });
  return (
    <Box minWidth="450px">
      <Grid container>
        <Grid item md={12}>
          <Card className={classes.card}>
            <CardHeader
              className={classes.spacing}
              subheaderTypographyProps={{ variant: 'caption' }}
              titleTypographyProps={{ variant: 'h6' }}
              title={
                <Box alignItems="center" display="flex">
                  <Link component={RouterLink} to={`/appraisals/${selected.id}`}>
                    <FileNumber record={selected} />
                  </Link>
                  <StatusColumn source="appraisal_status" record={selected} />
                </Box>
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
            <CardContent className={classes.spacing}>
              <Grid container>
                <Grid item md={8}>
                  <Grid container alignItems="center" spacing={0}>
                    <Grid item md={2} className={classes.iconContainer}>
                      <IconButton className={classes.icon}>
                        <ClientIcon />
                      </IconButton>
                    </Grid>
                    <Grid item md={10}>
                      <Typography variant="body2" color="inherit">
                        {selected.client_name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item md={2} className={classes.iconContainer}>
                      <IconButton className={classes.icon}>
                        <AssigneeIcon />
                      </IconButton>
                    </Grid>
                    <Grid item md={10}>
                      <AssigneeField record={selected} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4}>
                  <Grid className={classes.dateWrapper} spacing={0} container direction="column">
                    {selected.due_date && !hideDue && (
                      <Box
                        fontStyle={isPastDue ? 'italic' : 'normal'}
                        flexDirection="column"
                        display="flex"
                        // alignItems="center"
                        justifyContent="center"
                        flex="1"
                      >
                        <Typography color={isPastDue ? 'error' : 'textPrimary'} variant="h6">
                          {isPastDue ? 'Past Due' : 'Due'}
                        </Typography>
                        <Typography color={isPastDue ? 'error' : 'textSecondary'} variant="caption">{`${
                          isPastDue
                            ? formatDate(new Date(selected.due_date), 'MM/dd/yyyy @ hh:mma')
                            : displayDateIn(selected.due_date_in || '')
                        }`}</Typography>
                      </Box>
                    )}
                    {selected.inspection_date && !hideInspection && (
                      <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" flex="1">
                        <Typography variant="h6">Inspection</Typography>
                        <Typography color="textSecondary" variant="caption">
                          {`${
                            isPast(new Date(selected.inspection_date))
                              ? formatDate(new Date(selected.inspection_date), 'MM/dd/yyyy @ hh:mma')
                              : displayDateIn(selected.inspection_date_in || '')
                          }`}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
