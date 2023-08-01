import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useGetIdentity } from 'react-admin';
import { ActivityLoadingSkeleton } from 'shared/components/AddressField/LoadingSkeleton/ActivitySkeleton';
import { activityRestrictedRoles } from 'shared/constants/roles';
import { User_Profile_Activities } from 'shared/generated/types';
import { styleLeft, styleRight } from 'shared/hooks/useEditFormStyle';
import useTeamMemberActivities from 'shared/hooks/useTeamMemberActivities';
import { groupDataByDay } from 'shared/utils';
import { TeamMemberActivityRow } from './TeamActivityRow';

interface Props {
  formData: any;
}

type GroupedData = {
  [key: string]: User_Profile_Activities[];
};

export const TeamActivity = ({ formData }: Props) => {
  const identityState = useGetIdentity();

  const formClasses = styleRight();
  const classes = styleLeft();
  const member = formData.values;

  const { data, fetchMore, refetch, loading } = useTeamMemberActivities({
    userAccountId: member.user_account_id,
    activityId: member.id,
    appraisalAssigneeId: member.user_account_id,
    offset: 0,
    limit: 12,
  });

  useEffect(() => {
    refetch();
  }, [member]);

  const { sanitizedData, hasMore, offset, count } = useMemo(() => {
    const count = data?.user_profile_activities_aggregate.aggregate.count || 0;
    const offset = data?.user_profile_activities.length || 0;

    const groupedData: GroupedData = groupDataByDay(data?.user_profile_activities);

    const sanitizedData: GroupedData = {};

    Object.keys(groupedData).map((date) => {
      const filteredList = groupedData[date].filter((item) => {
        const { notes, activity_id, appraisal_contacts, appraisal_assignees, type, activity } = item;
        const hasNotes = !!notes;
        const isNotOwnActivity = activity_id !== member.id;
        if (hasNotes && isNotOwnActivity) {
          return null;
        }
        const hasContacts = appraisal_contacts.length > 0;
        const hasAppraisalAssignees = appraisal_assignees?.length > 0;
        const isInsert = type === 'insert';

        const shouldShowContactActivity = activity === 'contact' && (type === 'insert' || (type === 'update' && notes));

        const shouldShow = hasContacts || hasNotes || hasAppraisalAssignees || isInsert || shouldShowContactActivity;

        return !!shouldShow;
      });

      if (filteredList.length > 0) {
        sanitizedData[date] = filteredList;
      }
      return null;
    });

    return {
      count,
      hasMore: count > offset,
      offset,
      sanitizedData,
    };
  }, [data?.user_profile_activities, data?.user_profile_activities_aggregate]);

  if (activityRestrictedRoles.includes(identityState.identity?.role)) {
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
            {!count ? (
              <Typography>No Activity</Typography>
            ) : (
              <>
                {Object.keys(sanitizedData).map((date, index) => {
                  return (
                    <Box mb={3} key={index}>
                      <Typography className={classes.uppercase}>{date}</Typography>
                      <Box pl={2} pt={2}>
                        {sanitizedData[date].map((cd: any, key: number) => {
                          const currentUser =
                            cd.user_account_id === identityState.identity?.id ? 'You' : cd.user_account_name;

                          const appraisal_assignees = cd.appraisal_assignees?.map((assignee: any) => {
                            if (assignee === cd.user_account_name) {
                              return 'yourself';
                            } else return assignee;
                          });

                          const currentData = { ...cd, appraisal_assignees };

                          return (
                            <TeamMemberActivityRow
                              row={currentData}
                              key={key}
                              currentUser={currentUser}
                              member={member}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}

                {hasMore && data && (
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
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
