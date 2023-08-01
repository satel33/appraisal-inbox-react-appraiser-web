import React from 'react';
import ListActions from 'shared/components/Resource/ListActions';
import { List, ListProps } from 'react-admin';
import AppraisalStats from './components/AppraisalStats';
import ListFilter from 'views/Appraisal/ListFilter';
import omit from 'lodash/omit';
import { useListStyles } from 'shared/components/Resource/styles';

function Insight(props: ListProps) {
  const classes = useListStyles();
  return (
    <List
      {...omit(props, 'staticContext')}
      hasShow={false}
      classes={classes}
      hasCreate={false}
      hasEdit={true}
      hasList={false}
      title="Insights"
      resource="appraisals"
      basePath="/appraisals/insights"
      syncWithLocation
      sort={{ field: 'due_date', order: 'DESC' }}
      filters={<ListFilter isInsight />}
      pagination={false}
      bulkActionButtons={false}
      perPage={0}
      empty={false}
      actions={<ListActions hasExport={false} />}
      filter={{
        appraisal_status_id: 5,
      }}
    >
      <AppraisalStats />
    </List>
  );
}

export default Insight;
