import React, { useState, useEffect } from 'react';
import { Grid, Card, Divider, Typography, Box } from '@material-ui/core';
import { validatePhone } from 'shared/utils';
import {
  useNotify,
  Create,
  ResourceContextProvider,
  useRedirect,
  CreateProps,
  Record,
  SimpleForm,
  TextInput,
  required,
  ReferenceInput,
  BooleanInput,
  email,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import EditAction from 'shared/components/Resource/EditAction';
import useContactOptions from 'shared/hooks/useContactOptions';
import { makeStyles } from '@material-ui/core/styles';
import getContactPermission from './permission';
import Toolbar from './components/Toolbar';
import ClientReferenceInput from '../Client/ClientReferenceInputV2';
import { Contact } from './types';

const CreateContact = (props: CreateProps) => {
  const styles = makeStyles({
    divider: {
      marginBottom: '20px',
    },
    formBottom: {
      marginBottom: '15px',
      border: 'none',
    },
    heading: {
      marginTop: '30px',
    },
    headingFirst: {
      marginTop: '0px',
    },
    formContainer: {
      display: 'flow-root',
      width: '100%',
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
    cardRoot: {
      paddingRight: '10px',
      paddingLeft: '10px',
      marginBottom: '30px',
      paddingTop: '0px !important',
    },
    dialogContent: {
      padding: '8px 12px 12px 12px !important',
    },
    cardHeader: {
      marginLeft: '20px',
      '@media (max-width: 600px)': {
        display: 'none',
      },
    },
    editActions: {
      marginTop: '16px',
      justifyContent: 'space-between',
    },
    primaryInput: {
      marginLeft: 'auto',
      marginRight: '-15px',
      marginTop: '-6px',
    },
  });
  const classes = styles();
  const notify = useNotify();
  const redirect = useRedirect();
  const [options] = useContactOptions();
  const [defaultContactType, setDefaultContactType] = useState(0);
  const [primary, setPrimary] = useState(false);
  const [showPrimary, setShowPrimary] = useState(false);
  const onSuccess = ({ data }: Record) => {
    notify('contact.created');
    redirect(`/contacts/${data.id}`);
  };

  const transform = (data: Record) => {
    const newContact: Contact = {
      ...(data as Contact),
    };
    const name = data.first_name.split(' ');
    newContact.first_name = name[0];
    newContact.last_name = name.slice(1).join(' ');
    return newContact;
  };

  const onClientChange = (clientId: string) => {
    if (clientId) {
      setShowPrimary(true);
    }
    options.refetch().then((resp: any) => {
      const selectedClient = resp?.data?.clients.find((client: any) => client.id === clientId);
      if (selectedClient) {
        const contactType = resp?.data?.contactTypes.find(
          (types: any) => types.client_type_id === selectedClient?.client_type_id,
        );
        if (contactType) {
          setDefaultContactType(contactType.id);
        }
      }
    });
  };

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

  return (
    <Box>
      <EditAction />
      <Card variant="outlined" classes={{ root: classes.cardRoot }}>
        <ResourceContextProvider value="contact">
          <Create basePath="/contacts" {...props} transform={transform} resource="contact" onSuccess={onSuccess}>
            <SimpleForm
              initialValues={{
                contact_type_id: defaultContactType,
                client_id: null,
              }}
              toolbar={<Toolbar getPermission={getContactPermission} type={defaultContactType} />}
            >
              <Box className={classes.formContainer}>
                <Typography classes={{ root: classes.headingFirst }}>CONTACT</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <TextInput
                      autoFocus
                      validate={required()}
                      label="Name"
                      source="first_name"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid container item md={4}>
                    <TextInput variant="outlined" fullWidth source="email" validate={[email()]} />
                  </Grid>
                  <Grid container item md={4}>
                    <TextInput
                      source="phone_number"
                      label="Phone"
                      validate={validatePhone}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid container item md={4}>
                    <TextInput source="url" label="URL (Website)" variant="outlined" fullWidth />
                  </Grid>
                </Grid>
                <Grid container direction="row" alignItems="center">
                  <Grid container item md={4}></Grid>
                  <Grid container item md={8}>
                    <PlacesAutocomplete
                      variant="outlined"
                      autoFocus={false}
                      label="Address"
                      source="location_address"
                      isMapVisible={false}
                    />
                  </Grid>
                </Grid>
                <Typography classes={{ root: classes.headingFirst }}>CLIENT</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <ClientReferenceInput
                  source="client_id"
                  reference="client"
                  onChange={(clientId: string) => onClientChange(clientId)}
                  fullWidth
                  emptyText="Not Associated with Client"
                  variant="outlined"
                  sort={{ field: 'name', order: 'ASC' }}
                  filterToQuery={(searchText: string) => ({ name: searchText })}
                  perPage={Infinity}
                  children={<span />}
                  showContacts={false}
                  layout="grid"
                  customCSS={{
                    root: {
                      display: 'flex',
                      alignItems: 'self-start',
                      flex: 1,
                    },
                    create: {
                      marginBottom: '20px',
                    },
                  }}
                />
                <Typography classes={{ root: classes.headingFirst }}>TYPE</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="column" alignItems="center">
                  <Grid container item md={4}>
                    <ReferenceInput
                      label="Contact Type"
                      source="contact_type_id"
                      reference="contact_types"
                      allowEmpty={false}
                      fullWidth
                      onChange={(e: number) => setDefaultContactType(e)}
                      perPage={100}
                      variant="outlined"
                      sort={{ field: 'order', order: 'ASC' }}
                      validate={[required()]}
                      filterToQuery={(searchText: string) => ({ type: searchText })}
                    >
                      <AutocompleteInput source="contact_type_id" optionText="type" />
                    </ReferenceInput>
                  </Grid>
                </Grid>
                {showPrimary && (
                  <Box style={{ marginTop: '5px' }}>
                    <Grid container direction="column" alignItems="center">
                      <Grid container item md={4}>
                        <Typography classes={{ root: classes.headingFirst }}>Primary</Typography>
                        <BooleanInput
                          className={classes.primaryInput}
                          onChange={(v: any) => {
                            setPrimary(v);
                          }}
                          source="primary"
                          label={primary ? 'Yes' : 'No'}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                <Typography classes={{ root: classes.headingFirst }}>NOTES</Typography>
                <Divider classes={{ root: classes.divider }}></Divider>
                <Grid container direction="row">
                  <Grid container item md={4}></Grid>
                  <Grid container item md={8}>
                    <RichTextInput
                      options={{
                        readOnly: false,
                        placeholder: 'Additional Contact information',
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
              </Box>
            </SimpleForm>
          </Create>
        </ResourceContextProvider>
      </Card>
    </Box>
  );
};

export default CreateContact;
