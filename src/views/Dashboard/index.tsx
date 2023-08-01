import * as React from 'react';
import Overview from './Overview';
import { List, ListProps } from 'react-admin';
import ListFilter from 'views/Appraisal/ListFilter';
import ListActions from 'shared/components/Resource/ListActions';
import omit from 'lodash/omit';
import AddButton from './AddButton';

export default function Dashboard(props: ListProps) {
  return (
    <List
      {...omit(props, 'staticContext')}
      hasShow={false}
      hasCreate={false}
      hasEdit={true}
      hasList={false}
      title="Inbox"
      resource="appraisals"
      basePath="/appraisals/insights"
      syncWithLocation
      sort={{ field: 'due_date', order: 'DESC' }}
      filters={<ListFilter isInsight />}
      actions={<ListActions customAction2={<AddButton />} hasCreate={false} />}
      pagination={false}
      bulkActionButtons={false}
      perPage={0}
      empty={false}
      filter={{
        appraisal_status_id: 5,
      }}
    >
      <Overview />
    </List>
  );
}
