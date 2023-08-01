import Grid from '@material-ui/core/Grid/Grid';
import React from 'react';
import { TextInput } from 'react-admin';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from '../permission';

export default function LocationTab() {
  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  return (
    <Grid item md={12}>
      <PlacesAutocomplete
        prefix="property"
        height="calc(100vh - 345px)"
        xlCols={6}
        disabled={!permissions.edit}
        aside={
          <Grid item xl={6} lg={12}>
            <TextInput
              disabled={!permissions.edit}
              variant="standard"
              fullWidth
              source="property.subdivision"
              label="Subdivision"
            />
          </Grid>
        }
      />
    </Grid>
  );
}
