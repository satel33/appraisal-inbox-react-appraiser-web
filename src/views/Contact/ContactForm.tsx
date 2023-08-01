import React from 'react';
import { SimpleForm, TextInput, required, ReferenceInput, email, TabbedForm, FormTab } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import Grid from '@material-ui/core/Grid';
import Toolbar from 'shared/components/Resource/Toolbar';
import { QueryResult } from '@apollo/client';
import { ContactOptionsResponse } from 'shared/hooks/useContactOptions';
import getContactPermission from './permission';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import UrlInput from 'shared/components/UrlInput';
import AppraisalList from './components/AppraisalList';

type Props = {
  options: QueryResult<ContactOptionsResponse, Record<string, any>>;
  isCreate?: boolean;
};

function ContactForm(props: Props) {
  const { options, isCreate, ...restProps } = props;
  if (isCreate)
    return (
      <SimpleForm {...restProps} toolbar={<Toolbar getPermission={getContactPermission} />}>
        <ContactFields {...props} />
      </SimpleForm>
    );

  return (
    <TabbedForm {...restProps} toolbar={<Toolbar getPermission={getContactPermission} />}>
      <FormTab label="Overview">
        <ContactFields {...props} />
      </FormTab>
      <FormTab label="Appraisals">
        <AppraisalList fullWidth />
      </FormTab>
    </TabbedForm>
  );
}

function ContactFields(props: Props) {
  const { options } = props;
  const [{ permissions }] = useFormPermissions({ getPermission: getContactPermission });
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <TextInput
            disabled={!permissions.edit}
            variant="standard"
            validate={[required()]}
            fullWidth
            source="first_name"
          />
        </Grid>
        <Grid item md={6}>
          <TextInput disabled={!permissions.edit} variant="standard" fullWidth source="last_name" />
        </Grid>
        <Grid item md={6}>
          <TextInput disabled={!permissions.edit} label="Phone" variant="standard" fullWidth source="phone_number" />
        </Grid>
        <Grid item md={6}>
          <TextInput disabled={!permissions.edit} variant="standard" fullWidth source="email" validate={[email()]} />
        </Grid>
        <Grid item md={6}>
          <AutocompleteInput
            disabled={!permissions.edit}
            label="Client"
            source="client_id"
            fullWidth
            optionText="name"
            variant="standard"
            emptyText="Not Associated with Client"
            choices={(options.data?.clients ?? []).concat([
              {
                id: '',
                name: 'Not Associated with Client',
              },
            ])}
          />
        </Grid>
        <Grid item md={6}>
          <ReferenceInput
            label="Type"
            source="contact_type_id"
            reference="contact_types"
            allowEmpty={false}
            fullWidth
            perPage={100}
            variant="standard"
            sort={{ field: 'order', order: 'ASC' }}
            validate={[required()]}
            filterToQuery={(searchText: string) => ({ type: searchText })}
            disabled={!permissions.edit}
          >
            <AutocompleteInput disabled={!permissions.edit} source="contact_type_id" optionText="type" />
          </ReferenceInput>
        </Grid>
        <Grid item md={6}>
          <PlacesAutocomplete disabled={!permissions.edit} isMapVisible={false} />
        </Grid>
        <Grid item md={6}>
          <UrlInput label="URL (Website)" disabled={!permissions.edit} variant="standard" fullWidth source="url" />
        </Grid>
        <Grid item md={12}>
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
      </Grid>
    </>
  );
}

export default ContactForm;
