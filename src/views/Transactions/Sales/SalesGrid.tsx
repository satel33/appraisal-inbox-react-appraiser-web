import React from 'react';
import { Datagrid, DatagridProps, DateField, TextField } from 'react-admin';
import AddressField from 'shared/components/AddressField';
import CurrencyText from 'shared/components/CurrencyText';
import { withGridLoader } from 'shared/components/TablePreloader';
import APNField from '../components/APNField';
import TransactionListRowActions from '../components/TransactionListRowActions';

type SalesGridProps = DatagridProps & {
  isMainMenu?: boolean;
  onSuccess?(): void;
  readOnly?: boolean;
};

function SalesGrid(props: SalesGridProps) {
  return (
    <Datagrid {...props}>
      {props.isMainMenu && <APNField source="parcel_number" label="Parcel Number" />}
      {props.isMainMenu && <AddressField source="location_address" label="Location" />}
      <DateField source="sale_date" label="Sale Date" />
      <CurrencyText source="sale_price" label="Sale Price" />
      <TextField source="grantor" label="Grantor" />
      <TextField source="grantee" label="Grantee" />
      {!props.isMainMenu && <TransactionListRowActions readOnly={props.readOnly} onSuccess={props.onSuccess} />}
    </Datagrid>
  );
}

export default withGridLoader({ showEmpty: false })(SalesGrid);
