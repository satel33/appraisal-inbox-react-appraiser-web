import * as React from 'react';
import { Datagrid, TextField, Record, FunctionField } from 'react-admin';
import ResourceCount from 'shared/components/ResourceCount';
import { withGridLoader } from 'shared/components/TablePreloader';
import TruncatedField from 'shared/components/TruncatedField';

function ContactGrid(props: { role: string }) {
  const { role } = props;
  return (
    <Datagrid rowClick="edit" optimized>
      <TextField label="Name" source="full_name" />
      <TextField source="email" />
      <TextField label="Phone" source="phone_number" />
      <TruncatedField label="Client" source="client_name" />
      <TextField source="type" />
      <FunctionField label="Primary" render={(record: any) => `${record.primary ? 'Yes' : 'No'}`} />
      {role !== 'appraisal_firm_limited_access' && (
        <ResourceCount
          label="Appraisals"
          filter={(record: Record) => ({
            contact_ids: [record.id],
          })}
          basePath="/appraisals"
          countKey="appraisals_count"
          source="appraisals_count"
        />
      )}
    </Datagrid>
  );
}

export default withGridLoader()(ContactGrid);
