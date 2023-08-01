import * as React from 'react';
import { Datagrid, TextField, useGetIdentity } from 'react-admin';
import AddressField from 'shared/components/AddressField';
import ResourceCount from 'shared/components/ResourceCount';
import APNField from 'views/Transactions/components/APNField';
import { withGridLoader } from 'shared/components/TablePreloader';

function PropertyGrid() {
  const { identity } = useGetIdentity();
  if (!identity) {
    return null;
  }
  return (
    <Datagrid rowClick="edit" optimized>
      <APNField source="parcel_number" label="Parcel Number" />
      <AddressField source="location_address" label="Location" />
      <TextField source="total_acres" />
      <TextField source="zoning" />
      <ResourceCount
        label="Sales Comp"
        basePath="/properties/sales-comps"
        filterKey="property_id"
        countKey="sales_comps_count"
        source="sales_comps_count"
      />
      <ResourceCount
        label="Lease Comp"
        basePath="/properties/lease-comps"
        filterKey="property_id"
        countKey="lease_comps_count"
        source="lease_comps_count"
      />
      {identity?.role !== 'appraisal_firm_limited_access' && (
        <ResourceCount
          label="Appraisal"
          basePath="/appraisals"
          filterKey="property_id"
          source="appraisals_count"
          countKey="appraisals_count"
        />
      )}
    </Datagrid>
  );
}
export default withGridLoader()(PropertyGrid);
