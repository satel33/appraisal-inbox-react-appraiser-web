import Grid from '@material-ui/core/Grid';
import React from 'react';
import { TextInput } from 'react-admin';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getPropertyPermission from '../permission';

function LocationTab() {
  const [{ permissions }] = useFormPermissions({ getPermission: getPropertyPermission });
  return (
    <Grid item md={12}>
      <PlacesAutocomplete
        prefix=""
        xlCols={6}
        lgCols={6}
        height="calc(100vh - 345px)"
        disabled={!permissions.edit}
        aside={
          <Grid item xl={6} lg={6}>
            <TextInput
              variant="standard"
              disabled={!permissions.edit}
              fullWidth
              source="subdivision"
              label="Subdivision"
            />
          </Grid>
        }
      />
    </Grid>
  );
}

export default LocationTab;
