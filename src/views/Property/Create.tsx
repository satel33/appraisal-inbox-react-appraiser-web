import React from 'react';
import {
  useNotify,
  useRedirect,
  ResourceContextProvider,
  Create,
  SimpleForm,
  TextInput,
  required,
  useGetIdentity,
  CreateProps,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Toolbar from 'shared/components/Resource/Toolbar';
import EditAction from 'shared/components/Resource/EditAction';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import { Property } from './types';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getPropertyPermission from './permission';

function CreateProperty(props: CreateProps) {
  const notify = useNotify();
  const redirect = useRedirect();
  const { identity } = useGetIdentity();
  if (!identity) {
    return <span />;
  }
  return (
    <ResourceContextProvider value="property">
      <Create {...props} resource="property" actions={<EditAction />} onSuccess={onSuccess}>
        <SimpleForm toolbar={<Toolbar getPermission={getPropertyPermission} />}>
          <CreateFields />
        </SimpleForm>
      </Create>
    </ResourceContextProvider>
  );

  function onSuccess({ data }: Property) {
    notify('property.created');
    redirect(`/properties/${data.id}`);
  }
}

function CreateFields() {
  const [{ permissions }] = useFormPermissions({ getPermission: getPropertyPermission });
  const disabled = !permissions.create;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <PlacesAutocomplete
            prefix=""
            disabled={disabled}
            height="calc(100vh - 335px)"
            validate={required()}
            xlCols={4}
            lgCols={4}
            aside={
              <>
                <Grid item xl={4} lg={4}>
                  <TextInput
                    disabled={disabled}
                    variant="standard"
                    fullWidth
                    source="subdivision"
                    label="Subdivision"
                  />
                </Grid>
                <Grid item xl={4} lg={4}>
                  <TextInput
                    disabled={disabled}
                    variant="standard"
                    fullWidth
                    source="parcel_number"
                    label="Parcel Number (APN)"
                  />
                </Grid>
              </>
            }
          />
        </Grid>
      </Grid>
    </>
  );
}

export default CreateProperty;
