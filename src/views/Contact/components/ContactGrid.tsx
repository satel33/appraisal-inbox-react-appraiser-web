import React from 'react';
import { Datagrid, DatagridProps, TextField } from 'react-admin';
import { withGridLoader } from 'shared/components/TablePreloader';

type ContactGridProps = DatagridProps & {
  actionsRenderer?: React.FC<{ onSuccess?(): void }>;
  onSuccess?(): void;
};

function ContactGrid(props: ContactGridProps) {
  const { actionsRenderer: Actions = null } = props;
  return (
    <Datagrid>
      <TextField label="Name" source="full_name" />
      <TextField source="type" />
      <TextField source="email" />
      <TextField label="Phone" source="phone_number" sortable={false} />
      {Actions && <Actions onSuccess={props.onSuccess} />}
    </Datagrid>
  );
}

export default withGridLoader()(ContactGrid);
