import React, { useEffect, useState } from 'react';
import {
  SimpleForm,
  TextInput,
  required,
  CreateProps,
  useNotify,
  useCreate,
  Create,
  useRedirect,
  ResourceContextProvider,
} from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import { Grid, Card, Divider, Typography, Box } from '@material-ui/core';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import RichTextInput from 'ra-input-rich-text';
import Toolbar from './components/Toolbar';
import getClientPermission from './permissions';
import CreateContactList from './components/CreateContactList';
import { Client } from './types';
import { useClientQuery, useContactQuery } from './components/hooks/useContactOptions';
import styles from './components/hooks/useContactCreateStyles';

function ClientCreate(props: CreateProps) {
  const classes = styles();
  const queryData = useClientQuery();
  const [clientTypeId, setClientTypeId] = useState(12);
  const contactQueryData = useContactQuery();
  const notify = useNotify();
  const redirect = useRedirect();

  const onContactAdd = (val: any) => {
    Object.assign(window, {
      contacts: val,
      queryData: queryData,
      contactQueryData: contactQueryData,
    });
  };

  const [createContact] = useCreate('contact');

  useEffect(() => {
    setTimeout(() => {
      const toolbar = document.querySelector('.ql-toolbar') as any;
      const container = document.querySelector('.ql-container') as any;
      const editor = document.querySelector('.ql-editor') as any;
      if (toolbar && container && editor) {
        container.append(toolbar);
        container.style.border = 'none';
        editor.style.border = '1px solid rgba(0, 0, 0, 0.12)';
        editor.style.borderRadius = '3px';
      }
    }, 20);
  }, []);

  const getOtherContactTypeId = () => {
    const type = ((window as any)?.contactQueryData?.data?.contactTypes ?? []).find(
      (item: any) => item.type === 'Other',
    );
    return type?.id;
  };

  const getContactType = (typeId: number) => {
    const type = ((window as any)?.contactQueryData?.data?.contactTypes ?? []).find(
      (item: any) => item.client_type_id === typeId,
    );
    return type?.id;
  };

  const createContacts = (clientId: number, typeId: number) => {
    const results: any = [];
    ((window as any)?.contacts || []).forEach((contact: any) => {
      results.push(
        new Promise((resolve, reject) => {
          const name = contact.name.split(' ');
          const contactTypeId = getContactType(typeId) || getOtherContactTypeId();
          createContact(
            {
              payload: {
                data: {
                  first_name: name[0],
                  last_name: name.slice(1).join(' '),
                  email: contact.email,
                  contact_type_id: contactTypeId,
                  phone_number: contact.phone_number,
                  client_id: clientId,
                },
              },
            },
            {
              onSuccess: ({ data }: any) => {
                resolve(data);
              },
              onFailure: ({ error }: any) => {
                notify(error.message, 'error');
                reject(error);
              },
            },
          );
        }),
      );
    });
    return Promise.all(results);
  };

  const onSuccess = ({ data }: { data: Client }) => {
    createContacts(data.id, Number(data.client_type_id)).then((createdContacts: any) => {
      notify('client.created');
      redirect(`/clients/${data.id}`);
    });
  };

  return (
    <Box>
      <EditAction />
      <Card variant="outlined" classes={{ root: classes.cardRoot }}>
        <ResourceContextProvider value="client">
          <Create basePath="/clients" {...props} onSuccess={onSuccess} resource="client">
            <SimpleForm toolbar={<Toolbar saveDisabled={false} getPermission={getClientPermission} />}>
              <Box className={classes.formContainer}>
                <Typography classes={{ root: classes.headingFirst }}>CLIENT</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <TextInput autoFocus validate={required()} source="name" variant="outlined" fullWidth />
                  </Grid>
                  <Grid container item md={4}>
                    <TextInput label="URL (Website)" source="url" variant="outlined" fullWidth />
                  </Grid>
                </Grid>
                <Grid container direction="row" alignItems="center">
                  <Grid container item md={4}></Grid>
                  <Grid container item md={8}>
                    <PlacesAutocomplete
                      variant="outlined"
                      autoFocus={false}
                      label="Biling Address"
                      source="location_address"
                      isMapVisible={false}
                    />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.headingFirst }}>TYPE</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <AutocompleteInput
                      fullWidth
                      defaultValue={12}
                      variant="outlined"
                      label="Client Type"
                      source="client_type_id"
                      optionText="type"
                      choices={queryData.data?.clientTypes ?? []}
                      onChange={(v: any) => setClientTypeId(v)}
                    />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.heading }}>CONTACTS</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="row">
                  <Grid container item md={4}></Grid>
                  <Grid container item md={8}>
                    <CreateContactList clientTypeId={clientTypeId} saveContacts={onContactAdd}></CreateContactList>
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.heading }}>NOTES</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="row">
                  <Grid container item md={4}></Grid>
                  <Grid container item md={8}>
                    <RichTextInput
                      options={{
                        readOnly: false,
                        placeholder: 'Additional Client information, report requirements, etc',
                      }}
                      fullWidth
                      source="notes"
                      multiline
                      variant="outlined"
                      label=""
                      key={`text-false`}
                    />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.heading }}>&nbsp;</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
              </Box>
            </SimpleForm>
          </Create>
        </ResourceContextProvider>
      </Card>
    </Box>
  );
}

export default ClientCreate;
