import * as React from 'react';
import { Datagrid, TextField } from 'react-admin';
import AddressField from 'shared/components/AddressField';
import ResourceCount from 'shared/components/ResourceCount';
import TruncatedField from 'shared/components/TruncatedField';
import { withGridLoader } from 'shared/components/TablePreloader';

function ClientGrid(props: { role: string }) {
  const { role } = props;
  return (
    <Datagrid rowClick="edit" optimized>
      <TruncatedField source="name" />
      <AddressField source="location_address" label="Address" />
      <TextField source="client_type" label="Type" />
      <ResourceCount
        label="Contacts"
        basePath="/contacts"
        filterKey="client_id"
        countKey="contacts_count"
        source="contacts_count"
      />
      {role !== 'appraisal_firm_limited_access' && (
        <ResourceCount
          source="appraisals_count"
          label="Appraisal"
          basePath="/appraisals"
          filterKey="client_id"
          countKey="appraisals_count"
        />
      )}
    </Datagrid>
  );
}

export default withGridLoader()(ClientGrid);
