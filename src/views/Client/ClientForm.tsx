import React from 'react';
import { SimpleForm, TextInput, ReferenceInput, required, TabbedForm, FormTab } from 'react-admin';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import RichTextInput from 'ra-input-rich-text';
import Grid from '@material-ui/core/Grid';
import Toolbar from 'shared/components/Resource/Toolbar';
import getClientPermission from './permissions';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import UrlInput from 'shared/components/UrlInput';
import AppraisalList from './components/AppraisalList';
import ContactList from './components/ContactList';

type ClientFormProps = {
  isCreate?: boolean;
};
function ClientForm(props: ClientFormProps = { isCreate: false }) {
  const { isCreate, ...restProps } = props;

  if (isCreate) {
    return (
      <SimpleForm {...props} toolbar={<Toolbar getPermission={getClientPermission} />}>
        <ClientFields isCreate />
      </SimpleForm>
    );
  }
  return (
    <TabbedForm {...restProps} redirect={false} toolbar={<Toolbar getPermission={getClientPermission} />}>
      <FormTab label="Overview">
        <ClientFields />
      </FormTab>
      <FormTab label="Appraisals">
        <AppraisalList fullWidth />
      </FormTab>
      <FormTab label="Contacts">
        <ContactList fullWidth />
      </FormTab>
    </TabbedForm>
  );
}

// separate to acces context
function ClientFields(props: ClientFormProps) {
  const [{ permissions }] = useFormPermissions({ getPermission: getClientPermission });
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <TextInput disabled={!permissions.edit} variant="standard" validate={required()} fullWidth source="name" />
        </Grid>
        <Grid item md={6}>
          <ReferenceInput
            label="Client Type"
            source="client_type_id"
            reference="client_types"
            fullWidth
            perPage={100}
            variant="standard"
            validate={required()}
            disabled={!permissions.edit}
            sort={{ field: 'order', order: 'ASC' }}
            filterToQuery={(searchText: string) => ({ type: searchText })}
          >
            <AutocompleteInput source="client_type_id" optionText="type" disabled={!permissions.edit} />
          </ReferenceInput>
        </Grid>
        <Grid item md={6}>
          <PlacesAutocomplete disabled={!permissions.edit} isMapVisible={false} />
        </Grid>
        <Grid item md={6}>
          <UrlInput label="URL (Website)" disabled={!permissions.edit} variant="standard" fullWidth source="url" />
        </Grid>
        {!props.isCreate && (
          <>
            <Grid item md={6}>
              <RichTextInput
                key={`text-${!permissions.edit}`}
                fullWidth
                source="report_requirements"
                multiline
                variant="standard"
                label="Report Requirements"
                options={{ readOnly: !permissions.edit }}
              />
            </Grid>
            <Grid item md={6}>
              <RichTextInput
                options={{ readOnly: !permissions.edit }}
                fullWidth
                source="notes"
                multiline
                variant="standard"
                label="Notes"
                key={`text-${!permissions.edit}`}
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

export default ClientForm;
