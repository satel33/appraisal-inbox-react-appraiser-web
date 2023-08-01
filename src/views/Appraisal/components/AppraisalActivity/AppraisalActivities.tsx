import { Box, Button, Card, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useGetIdentity } from 'react-admin';
import { ActivityLoadingSkeleton } from 'shared/components/AddressField/LoadingSkeleton/ActivitySkeleton';
import { activityRestrictedRoles } from 'shared/constants/roles';
import useAppraisalActivities from 'shared/hooks/useAppraisalActivities';
import { styleLeft, styleRight } from 'shared/hooks/useEditFormStyle';
import { groupDataByDay } from 'shared/utils';
import { AppraisalActivities as AppraisalActivitiesType } from 'views/Appraisal/types';
import { AppraisalActivityRow } from './AppraisalActivityRow';

interface Props {
  formData: any;
}

type GroupedData = {
  [key: string]: AppraisalActivitiesType[];
};

const LIMIT = 12;

export const AppraisalActivities = ({ formData }: Props) => {
  const identityState = useGetIdentity();

  const formClasses = styleRight();
  const classes = styleLeft();

  const appraisal = formData.values;

  const { data, fetchMore, refetch, loading } = useAppraisalActivities({
    appraisalId: appraisal.id,
    offset: 0,
    limit: LIMIT,
  });

  useEffect(() => {
    refetch();
  }, [appraisal]);

  const { sanitizedData, hasMore, offset, filterDataCount } = useMemo(() => {
    if (data?.appraisal_activities) {
      const dataLength = data?.appraisal_activities.length || 0;
      const count = data?.appraisal_activities_aggregate.aggregate.count || 0;

      const groupedData: GroupedData = groupDataByDay(data?.appraisal_activities);

      const sanitizedData: GroupedData = {};

      let filterDataCount = 0;

      Object.keys(groupedData).map((date) => {
        const filteredList = groupedData[date].filter((item) => {
          const { appraisal_status, contacts, assignees, fees, dates, notes, type, filename } = item;
          const hasContacts = contacts?.length > 0;
          const hasAssignees = assignees?.length > 0;
          const hasFees = Object.keys(fees).length > 0;
          const hasDates = Object.keys(dates).length > 0;
          const hasNotes = !!notes;
          const isInsert = type === 'insert';
          const hasFile = !!filename && isInsert;

          const shouldShowRow =
            appraisal_status || hasContacts || hasAssignees || hasFees || hasDates || hasNotes || isInsert || hasFile;

          return !!shouldShowRow;
        });

        const fileGroupedList: AppraisalActivitiesType[] = [];

        filteredList.map((filteredItem) => {
          const { filename, timestamp_group_by } = filteredItem;

          if (!filename) {
            fileGroupedList.push(filteredItem);
          } else {
            const splitWords = filename.split('.');
            splitWords.pop();
            const sanitizedFilename = splitWords.join('.');

            const index = fileGroupedList.findIndex((item) => item.timestamp_group_by === timestamp_group_by);
            if (index >= 0 && fileGroupedList[index].files) {
              fileGroupedList[index].files.push(sanitizedFilename);
            } else {
              fileGroupedList.push({ ...filteredItem, files: [sanitizedFilename] });
            }
          }
          return null;
        });

        if (fileGroupedList.length > 0) {
          sanitizedData[date] = fileGroupedList;
          filterDataCount += fileGroupedList.length;
        }
        return null;
      });

      return {
        hasMore: count > dataLength,
        offset: dataLength,
        sanitizedData,
        filterDataCount,
      };
    } else {
      return {
        hasMore: false,
        offset: 0,
        sanitizedData: {},
        filterDataCount: 0,
      };
    }
  }, [data?.appraisal_activities, data?.appraisal_activities_aggregate.aggregate.count]);

  useEffect(() => {
    if (hasMore && filterDataCount < LIMIT) {
      fetchMore({
        variables: {
          offset,
        },
      });
    }
  }, [hasMore, filterDataCount, offset]);

  if (activityRestrictedRoles.includes(identityState.identity?.role)) {
    return null;
  }

  return (
    <Card variant="outlined" classes={{ root: `${formClasses.card}` }} style={{ marginTop: '30px' }}>
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
                  return (
                    <Box mb={3} key={index}>
                      <Typography className={classes.uppercase}>{date}</Typography>
                      <Box pl={2} pt={2}>
                        {sanitizedData[date].map((cd: any, key: number) => {
                          const currentUser =
                            cd.user_account_id === identityState.identity?.id ? 'You' : cd.user_account_name;

                          const assignees = cd.assignees?.map((assignee: any) => {
                            if (assignee === cd.user_account_name) {
                              return 'yourself';
                            } else return assignee;
                          });
                          const currentData = { ...cd, assignees };

                          return (
                            <AppraisalActivityRow
                              row={currentData}
                              key={key}
                              currentUser={currentUser}
                              appraisal={appraisal}
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
