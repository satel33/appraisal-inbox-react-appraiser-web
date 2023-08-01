import React from 'react';
import { Datagrid, DatagridProps, TextField } from 'react-admin';
import AddressField from 'shared/components/AddressField';
import DateRangeField from 'shared/components/DateRangeField';
import { withGridLoader } from 'shared/components/TablePreloader';
import APNField from '../components/APNField';
import LeaseTypeField from '../components/LeaseTypeField';
import TransactionListRowActions from '../components/TransactionListRowActions';

type LeaseGridProps = DatagridProps & {
  isMainMenu?: boolean;
  onSuccess?(): void;
  readOnly?: boolean;
};

function LeaseGrid(props: LeaseGridProps) {
  return (
    <Datagrid {...props}>
      {props.isMainMenu && <APNField source="parcel_number" label="Parcel Number" />}
      {props.isMainMenu && <AddressField source="location_address" label="Location" />}
      <LeaseTypeField label="Lease Type" />
      <DateRangeField label="Terms" sourceFrom="lease_date_start" sourceTo="lease_date_end" />
      <TextField source="tenant" />
      {!props.isMainMenu && <TransactionListRowActions readOnly={props.readOnly} onSuccess={props.onSuccess} />}
    </Datagrid>
  );
}

export default withGridLoader({ showEmpty: false })(LeaseGrid);
