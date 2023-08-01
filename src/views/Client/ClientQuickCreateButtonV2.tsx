import React, { useEffect, useState } from 'react';
import { useForm } from 'react-final-form';
import { Button, SaveButton, useCreate, useNotify, FormWithRedirect, TextInput, required } from 'react-admin';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import { Card, CardHeader, Divider, Typography, Box } from '@material-ui/core';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import gql from 'graphql-tag';
import DialogActions from '@material-ui/core/DialogActions';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';
import CreateContactList from './components/CreateContactList';

const CLIENT_TYPE_QUERY = gql`
  query ClientTypeQuery {
    clientTypes: client_types(order_by: { order: asc }) {
      id
      type
    }
  }
`;

const CONTACT_TYPE_QUERY = gql`
  query ContactTypeQuery {
    contactTypes: contact_types(order_by: { order: asc }) {
      id
      type
      client_type_id
    }
  }
`;

type ClientQuickCreateButtonProps = {
  onChange(id: string): void;
  classes: any;
  showContacts: boolean;
  onlyIconLabel?: boolean;
};
function ClientQuickCreateButton({ onChange, classes, showContacts, onlyIconLabel }: ClientQuickCreateButtonProps) {
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
    formContainer: {
      paddingLeft: '35px',
      paddingRight: '35px',
      '@media (max-width: 600px)': {
        paddingLeft: '5px',
        paddingRight: '5px',
      },
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
  });
  const popUpClasses = styles();
  const queryData = useQuery<{
    clientTypes: {
      id: string;
      type: string;
    }[];
  }>(CLIENT_TYPE_QUERY, { fetchPolicy: 'cache-first' });

  const contactQueryData = useQuery<{
    contactTypes: {
      id: string;
      type: string;
      client_type_id: string;
    }[];
  }>(CONTACT_TYPE_QUERY, { fetchPolicy: 'cache-first' });

  const [showDialog, setShowDialog] = useState(false);
  const [clientTypeId, setClientTypeId] = useState(12);
  const [contacts, setContacts] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [create, { loading }] = useCreate('client');
  const [createContact] = useCreate('contact');
  const notify = useNotify();
  const form = useForm();

  const handleClick = () => {
    setShowDialog(true);
    moveToolbarBelow();
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const moveToolbarBelow = () => {
    setTimeout(() => {
      const toolbar = document.querySelector('#notes-popup .ql-toolbar') as any;
      const container = document.querySelector('#notes-popup .ql-container') as any;
      const editor = document.querySelector('#notes-popup .ql-editor') as any;
      if (toolbar && container && editor) {
        container.append(toolbar);
        container.style.border = 'none';
        editor.style.border = '1px solid rgba(0, 0, 0, 0.12)';
        editor.style.borderRadius = '3px';
      }
    }, 2);
  };

  useEffect(() => {
    const contact = contacts.find(
      (contact: any) => contact.edit === true && (contact.name || contact.email || contact.phone),
    );
    if (contact) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [contacts]);

  const getOtherContactTypeId = () => {
    const type = (contactQueryData?.data?.contactTypes ?? []).find((item: any) => item.type === 'Other');
    return type?.id;
  };

  const getContactType = (typeId: number) => {
    const type = (contactQueryData?.data?.contactTypes ?? []).find((item: any) => item.client_type_id === typeId);
    return type?.id;
  };

  const handleSubmit = async (values: any) => {
    create(
      {
        payload: {
          data: values,
        },
      },
      {
        onSuccess: ({ data }: any) => {
          createContacts(data.id, data.client_type_id).then((createdContacts: any) => {
            const contactIds = createdContacts.map((item: any) => item.id);
            localStorage.setItem('contactIds', JSON.stringify(contactIds));
          });
          form.change('client_id', data.id);
          onChange(data.id);
          setShowDialog(false);
        },
        onFailure: ({ error }: any) => {
          notify(error.message, 'error');
        },
      },
    );
  };

  const createContacts = (clientId: number, typeId: number) => {
    const results: any = [];
    contacts.forEach((contact: any) => {
      results.push(
        new Promise((resolve, reject) => {
          const name = contact.name.split(' ');
          createContact(
            {
              payload: {
                data: {
                  first_name: name[0],
                  last_name: name.slice(1).join(' '),
                  email: contact.email,
                  contact_type_id: getContactType(typeId) || getOtherContactTypeId(),
                  phone_number: contact.phone_number,
                  url: contact.url,
                  location_address: contact.location_address,
                  notes: contact.notes,
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

  return (
    <>
      <Button className={classes} onClick={handleClick} label={onlyIconLabel ? '' : 'ADD NEW CLIENT'}>
        <IconContentAdd />
      </Button>
      <Dialog fullWidth={true} maxWidth={'md'} open={showDialog} onClose={handleCloseClick} aria-label="Add Client">
        <FormWithRedirect
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, saving }: any) => (
            <DialogContent classes={{ root: popUpClasses.dialogContent }}>
              <Card variant="outlined" className={popUpClasses.formBottom}>
                <CardHeader title="Add Client" classes={{ root: popUpClasses.cardHeader }}></CardHeader>
                <Divider></Divider>
                <Box className={popUpClasses.formContainer}>
                  <Typography classes={{ root: popUpClasses.heading }}>CLIENT</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>
                  <Grid container direction="row">
                    <Grid item md={8} sm={10} xs={12}>
                      <TextInput validate={required()} source="name" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item md={8} sm={10} xs={12}>
                      <TextInput label="URL (Website)" source="url" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <PlacesAutocomplete
                        variant="outlined"
                        autoFocus={false}
                        label="Biling Address"
                        source="location_address"
                        isMapVisible={false}
                      />
                    </Grid>
                    <Grid item md={8} sm={10} xs={12}>
                      <AutocompleteInput
                        onChange={(v: number) => setClientTypeId(v)}
                        fullWidth
                        defaultValue={12}
                        variant="outlined"
                        label="Client Type"
                        source="client_type_id"
                        optionText="type"
                        choices={queryData.data?.clientTypes ?? []}
                      />
                    </Grid>
                  </Grid>
                  <Typography classes={{ root: popUpClasses.heading }}>NOTES</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>
                  <Grid container direction="row">
                    <Grid item md={12} sm={12} xs={12}>
                      <div id="notes-popup">
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
                      </div>
                    </Grid>
                  </Grid>
                  {showContacts && (
                    <>
                      <Typography classes={{ root: popUpClasses.heading }}>CONTACTS</Typography>
                      <Divider classes={{ root: popUpClasses.divider }}></Divider>
                      <Grid container direction="row">
                        <Grid item md={12}>
                          <CreateContactList clientTypeId={clientTypeId} saveContacts={setContacts}></CreateContactList>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <DialogActions classes={{ root: popUpClasses.editActions }}>
                    <Button label="ra.action.cancel" onClick={handleCloseClick} disabled={loading}>
                      <IconCancel />
                    </Button>
                    <SaveButton
                      handleSubmitWithRedirect={handleSubmitWithRedirect}
                      saving={saving}
                      disabled={loading || disabled}
                    />
                  </DialogActions>
                </Box>
              </Card>
            </DialogContent>
          )}
        />
      </Dialog>
    </>
  );
}

export default ClientQuickCreateButton;
