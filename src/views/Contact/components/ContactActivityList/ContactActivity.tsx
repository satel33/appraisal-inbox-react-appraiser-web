import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useGetIdentity } from 'react-admin';
import { ActivityLoadingSkeleton } from 'shared/components/AddressField/LoadingSkeleton/ActivitySkeleton';
import { activityRestrictedRolesForClientAndContact } from 'shared/constants/roles';
import useContactActivities from 'shared/hooks/useContactActivities';
import { styleLeft, styleRight } from 'shared/hooks/useEditFormStyle';
import { groupDataByDay } from 'shared/utils';
import { ContactActivityRow } from './ContactActivityRow';

interface Props {
  formData: any;
}
export const ContactActivity = ({ formData }: Props) => {
  const identityState = useGetIdentity();

  const classes = styleLeft();
  const formClasses = styleRight();
  const contact = formData.values;

  const { data, refetch, fetchMore, loading } = useContactActivities({ contactId: contact.id, offset: 0, limit: 12 });

  useEffect(() => {
    refetch();
  }, [contact]);

  const { sanitizedData, hasMore, offset } = useMemo(() => {
    const dataLength = data?.contact_activities.length || 0;
    return {
      sanitizedData: groupDataByDay(data?.contact_activities),
      hasMore: data && data?.contact_activities_aggregate.aggregate.count > dataLength,
      offset: dataLength,
    };
  }, [data?.contact_activities, data?.contact_activities_aggregate]);

  if (activityRestrictedRolesForClientAndContact.includes(identityState.identity?.role)) {
    return null;
  }

  return (
    <Card
      variant="outlined"
      classes={{ root: `${formClasses.card} ${classes.relative}` }}
      style={{ marginTop: '30px' }}
    >
      <CardContent>
        {loading ? (
          <ActivityLoadingSkeleton />
        ) : (
          <>
            {!offset ? (
              <Typography>No Activity</Typography>
            ) : (
              <>
                {Object.keys(sanitizedData).map((date, index) => {
                  if (sanitizedData[date].length === 1) {
                    const singleRowData = sanitizedData[date][0];
                    const { activity, appraisal_file_number, notes, type } = singleRowData;
                    const hasNotes = !!notes;
                    const isInsert = type === 'insert';

                    // const isAppraisalOrContactActivity = activity === 'appraisal' || activity === 'contact';
                    const isAppraisalActivity = activity === 'appraisal' && !!appraisal_file_number;

                    const shouldShow = hasNotes || isInsert || isAppraisalActivity;

                    if (!shouldShow) {
                      return null;
                    }
                  }

                  return (
                    <Box mb={3} key={index}>
                      <Typography className={classes.uppercase}>{date}</Typography>
                      <Box pl={2} pt={2}>
                        {sanitizedData[date].map((cd: any, key: number) => {
                          const isCurrentUser = cd.user_account_id === identityState.identity?.id;

                          return (
                            <ContactActivityRow row={cd} key={key} isCurrentUser={isCurrentUser} contact={contact} />
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}
              </>
            )}
          </>
        )}

        {hasMore && data && (
          <Box textAlign={'center'}>
            <Button
              onClick={() =>
                fetchMore({
                  variables: { offset },
                })
              }
            >
              Show Older
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
