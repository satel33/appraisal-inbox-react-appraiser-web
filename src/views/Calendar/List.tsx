import React, { useMemo, useState, useEffect } from 'react';
import ListActions from 'shared/components/Resource/ListActions';
import { List, ListProps, useGetIdentity } from 'react-admin';
import Calendar from './components';
import ListFilter from 'views/Appraisal/ListFilter';
import dayjs from 'dayjs';
import omit from 'lodash/omit';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import { useListStyles } from 'shared/components/Resource/styles';
import { standardMutationRoles } from 'shared/constants/roles';

function CalendarView(props: ListProps) {
  const { identity } = useGetIdentity();
  const classes = useListStyles();
  const [queryString, onChangeQuery] = useLocationQuery();
  const [currentDate, setCurrentDate] = useState(
    queryString.currentDate ? new Date(queryString.currentDate) : new Date(),
  );
  useEffect(() => {
    setCurrentDate(queryString.currentDate ? new Date(queryString.currentDate) : new Date());
  }, [queryString.currentDate]);
  const dateRange = useMemo(
    () => ({
      startDate: dayjs(currentDate).subtract(1, 'month').toDate(),
      endDate: dayjs(currentDate).add(1, 'month').toDate(),
    }),
    [currentDate],
  );
  const defaultFilter = {
    _or: {
      format: 'raw-query',
      value: [
        {
          inspection_date: { _lte: dateRange.endDate.toISOString(), _gte: dateRange.startDate.toISOString() },
        },
        {
          due_date: { _lte: dateRange.endDate.toISOString(), _gte: dateRange.startDate.toISOString() },
        },
      ],
    },
  };

  if (!identity) return <span />;

  const { role } = identity;

  return (
    <List
      {...omit(props, 'staticContext')}
      hasShow={false}
      classes={classes}
      hasCreate={standardMutationRoles.includes(role ?? '')}
      hasEdit={true}
      hasList={false}
      title="Schedule"
      resource="appraisals"
      basePath="/appraisals"
      syncWithLocation
      sort={{ field: 'due_date', order: 'DESC' }}
      filters={<ListFilter isCalendar />}
      pagination={false}
      bulkActionButtons={false}
      perPage={1}
      actions={<ListActions hasExport={false} />}
      filter={defaultFilter}
      empty={false}
    >
      <Calendar defaultFilter={defaultFilter} onChangeDate={onChangeDate} currentDate={currentDate} />
    </List>
  );

  function onChangeDate(currentDate: Date) {
    onChangeQuery({ currentDate: currentDate.toISOString() });
    setCurrentDate(currentDate);
  }
}

export default CalendarView;
