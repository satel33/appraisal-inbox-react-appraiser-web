import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useGetIdentity } from 'react-admin';
import { ActivityLoadingSkeleton } from 'shared/components/AddressField/LoadingSkeleton/ActivitySkeleton';
import { activityRestrictedRolesForClientAndContact } from 'shared/constants/roles';
import useClientActivities from 'shared/hooks/useClientActivities';
import { styleLeft, styleRight } from 'shared/hooks/useEditFormStyle';
import { groupDataByDay } from 'shared/utils';
import { ClientActivities } from 'views/Client/types';
import { ActivityDisplayRow } from './ClientActivityRow';

interface ActivityProps {
  formData: any;
}

type GroupedData = {
  [key: string]: ClientActivities[];
};

export const ClientActivity = ({ formData }: ActivityProps) => {
  const identityState = useGetIdentity();

  const formClasses = styleRight();
  const classes = styleLeft();
  const client = formData.values;

  const { data, fetchMore, refetch, loading } = useClientActivities({
    clientId: client.id,
    offset: 0,
    limit: 12,
  });

  useEffect(() => {
    refetch();
  }, [client]);

  const { sanitizedData, hasMore, offset } = useMemo(() => {
    const groupedDate: GroupedData = groupDataByDay(data?.client_activities);
    const sanitizedData: GroupedData = {};

    Object.keys(groupedDate).map((date, index) => {
      const filteredList = groupedDate[date].filter((item) => {
        const { activity, appraisal_assignees, appraisal_status, notes, type } = item;

        const hasNotes = !!notes;
        const shouldShowType = type === 'insert' || (hasNotes && type === 'update');
        const hasContactActivity = activity === 'contact' && shouldShowType;
        const hasAppraisalActivity =
          activity === 'appraisal' && (!!appraisal_status || appraisal_assignees?.length > 0);

        const hasClientActivity = activity === 'client' && shouldShowType;

        const shouldShowActivity = hasContactActivity || hasAppraisalActivity || hasClientActivity;
        return !!shouldShowActivity;
      });

      if (filteredList.length > 0) {
        sanitizedData[date] = filteredList;
      }
      return null;
    });

    const offset = data?.client_activities?.length || 0;
    const count = data?.client_activities_aggregate.aggregate.count || 0;

    const hasMore = count > offset;

    return {
      sanitizedData,
      hasMore,
      offset,
    };
  }, [data?.client_activities, data?.client_activities_aggregate]);

  if (activityRestrictedRolesForClientAndContact.includes(identityState.identity?.role)) {
    return null;
  }

  return (
    <Card variant="outlined" classes={{ root: `${formClasses.card}` }} style={{ marginTop: '30px' }}>
      <Box>
        <CardContent>
          {loading ? (
            <ActivityLoadingSkeleton />
          ) : (
            Object.keys(sanitizedData).map((date, index) => {
              // to show the creation of client at first activity

              sanitizedData[date].map((value: any, index: number) => {
                if (sanitizedData[date].length > 1 && value.activity === 'client' && value.type === 'insert') {
                  sanitizedData[date].push(value);
                  sanitizedData[date].splice(index, 1);
                }
                return null;
              });

              return (
                <Box mb={3} key={index}>
                  <Typography className={classes.uppercase}>{date}</Typography>
                  <Box pl={2} pt={2}>
                    {sanitizedData[date].map((cd: any, key: number) => {
                      const currentUser =
                        cd.user_account_id === identityState.identity?.id ? 'You' : cd.user_account_name;

                      if (cd.activity) {
                        return <ActivityDisplayRow row={cd} currentUser={currentUser} key={key} />;
                      }
                      return null;
                    })}
                  </Box>
                </Box>
              );
            })
          )}

          {!loading && hasMore && data && (
            <Box textAlign={'center'}>
              <Button
                onClick={() =>
                  fetchMore({
                    variables: {
                      offset,
                    },
                  })
                }
              >
                Show Older
              </Button>
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};
