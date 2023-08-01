import * as React from 'react';
import { Datagrid, TextField, Record } from 'react-admin';
import ResourceCount from 'shared/components/ResourceCount';
import AddressField from 'shared/components/AddressField';
import DateInColumn from './components/DateInColumn';
import { withGridLoader } from 'shared/components/TablePreloader';

function TeamGrid() {
  return (
    <Datagrid rowClick="edit" optimized>
      <TextField label="Name" source="full_name" />
      <TextField source="email" />
      <TextField label="Phone" source="phone_number" />
      <AddressField source="location_address" label="Location" />
      <DateInColumn label="Last Active" source="last_active_at" align="left" />
      <ResourceCount
        label="Appraisals"
        basePath="/appraisals"
        filter={(record: Record) => ({
          assignee_user_account_ids: [record.user_account_id],
        })}
        countKey="appraisals_count"
        source="appraisals_count"
      />
    </Datagrid>
  );
}

export default withGridLoader()(TeamGrid);
