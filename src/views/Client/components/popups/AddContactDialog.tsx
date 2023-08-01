import React, { useEffect, useState } from 'react';
import {
  Button,
  SaveButton,
  useCreate,
  useNotify,
  FormWithRedirect,
  TextInput,
  required,
  email,
  ReferenceInput,
  useRefresh,
  useUpdate,
  BooleanInput,
} from 'react-admin';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import IconCancel from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import { Card, CardHeader, Divider, Typography, Box } from '@material-ui/core';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import { validatePhone } from 'shared/utils';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RichTextInput from 'ra-input-rich-text';
import styles from '../hooks/useContactPopupStyles';
import { useContactQuery } from '../hooks/useContactOptions';
import useContactOptions from 'shared/hooks/useContactOptions';

type AddContactProps = {
  persist: boolean;
  viewPrimary?: boolean;
  onSave?: (value: any) => any;
  showDialogView: boolean;
  clientId?: string;
  contactName: string;
  clientTypeId?: number;
  contactsCount?: number;
  appraisal?: any;
  label?: string;
  active?: boolean;
};

function AddContactButton({
  clientTypeId,
  clientId,
  onSave,
  contactName,
  persist,
  appraisal,
  showDialogView,
  viewPrimary = false,
  contactsCount = 0,
}: AddContactProps) {
  const popUpClasses = styles();
  const contactQueryData = useContactQuery();
  const [contactOptions] = useContactOptions();
  const [showDialog, setShowDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [primary, setPrimary] = useState(contactsCount ? false : true);
  const [showPrimary, setShowPrimary] = useState(clientId || viewPrimary ? true : false);
  const [create, { loading }] = useCreate('contact');
  const refresh = useRefresh();
  const notify = useNotify();
  const [defaultContactType, setDefaultContactType] = useState<any>(0);
  const [update] = useUpdate('appraisal', appraisal?.id);

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
    if (clientTypeId) {
      setDefaultContactType(getContactType(clientTypeId) || getOtherContactTypeId());
    }
  }, [contactQueryData, clientTypeId]);

  useEffect(() => {
    setShowDialog(showDialogView);
  }, [showDialogView]);

  useEffect(() => {
    moveToolbarBelow();
  }, []);

  const getOtherContactTypeId = () => {
    const type = (contactQueryData?.data?.contactTypes ?? []).find((item: any) => item.type === 'Other');
    return type?.id;
  };

  const getContactType = (typeId: number) => {
    const type = (contactQueryData?.data?.contactTypes ?? []).find((item: any) => item.client_type_id === typeId);
    return type?.id;
  };

  const handleSubmit = async (values: any) => {
    setDisabled(true);
    const name = values.name.split(' ');
    values.first_name = name[0];
    values.last_name = name.slice(1).join(' ');
    if (!persist && onSave) {
      const type = contactQueryData?.data?.contactTypes.find((item: any) => item.id === values.contact_type_id);
      if (type) {
        values.type = type.type;
      }
      onSave(values);
      setShowDialog(false);
      setDisabled(false);
    } else {
      if (onSave) {
        onSave(values);
      }
      const createdContact: any = await createContact(values);
      await updateAppraisal(createdContact.id);
      setShowDialog(false);
      setDisabled(false);
      refresh();
    }
  };

  const createContact = (values: any) => {
    return new Promise((resolve: any, reject: any) => {
      create(
        {
          payload: {
            data: values,
          },
        },
        {
          onSuccess: ({ data }: any) => {
            setShowDialog(false);
            setDisabled(false);
            notify('contact.created');
            resolve(data);
          },
          onFailure: ({ error }: any) => {
            setDisabled(false);
            notify(error.message, 'error');
          },
        },
      );
    });
  };

  const updateAppraisal = (contactId: any) => {
    return new Promise((resolve: any) => {
      if (appraisal) {
        update(
          {
            payload: {
              id: appraisal?.id,
              data: {
                contact_ids: appraisal.contact_ids ? appraisal.contact_ids.concat([contactId]) : [contactId],
              },
            },
          },
          {
            onSuccess: () => {
              resolve();
            },
          },
        );
      } else {
        resolve();
      }
    });
  };

  return (
    <>
      <Dialog fullWidth={true} maxWidth={'md'} open={showDialog} onClose={handleCloseClick} aria-label="Add Contact">
        <FormWithRedirect
          initialValues={{
            contact_type_id: defaultContactType,
            client_id: clientId,
            primary: contactsCount ? false : true,
            name: contactName,
          }}
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, saving, ...rest }: any) => (
            <DialogContent classes={{ root: popUpClasses.dialogContent }}>
              <Card variant="outlined" className={popUpClasses.formBottom}>
                <CardHeader title="Add Contact" classes={{ root: popUpClasses.cardHeader }}></CardHeader>
                <Divider></Divider>
                <Box className={popUpClasses.formContainer}>
                  <Typography classes={{ root: popUpClasses.heading }}>CONTACT</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>
                  <Grid container direction="row">
                    <Grid item md={8} sm={10} xs={12}>
                      <TextInput validate={required()} source="name" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item md={8} sm={10} xs={12}>
                      <TextInput validate={[email()]} source="email" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item md={8} sm={10} xs={12}>
                      <TextInput
                        source="phone_number"
                        label="Phone"
                        validate={validatePhone}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item md={8} sm={10} xs={12}>
                      <TextInput label="URL (Website)" source="url" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <PlacesAutocomplete
                        variant="outlined"
                        autoFocus={false}
                        label="Address"
                        source="location_address"
                        isMapVisible={false}
                      />
                    </Grid>
                  </Grid>
                  {clientId && appraisal && (
                    <>
                      <Typography classes={{ root: popUpClasses.headingSecondary }}>Client</Typography>
                      <Divider classes={{ root: popUpClasses.divider }}></Divider>
                      <Grid item md={8} sm={10} xs={12}>
                        <AutocompleteInput
                          label="Client"
                          source="client_id"
                          onChange={() => {
                            setShowPrimary(rest.form.getState().values?.client_id ? true : false);
                          }}
                          fullWidth
                          optionText="name"
                          variant="outlined"
                          defaultValue={null}
                          emptyText="Not associated with Client"
                          choices={(contactOptions?.data?.clients ?? []).concat([
                            {
                              id: '',
                              name: 'Not Associated with Client',
                            },
                          ])}
                        />
                      </Grid>
                    </>
                  )}
                  <Typography classes={{ root: popUpClasses.headingSecondary }}>TYPE</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>
                  <Grid item md={8} sm={10} xs={12}>
                    <ReferenceInput
                      label="Contact Type"
                      source="contact_type_id"
                      reference="contact_types"
                      allowEmpty={false}
                      fullWidth
                      perPage={100}
                      variant="outlined"
                      sort={{ field: 'order', order: 'ASC' }}
                      validate={[required()]}
                      filterToQuery={(searchText: string) => ({ type: searchText })}
                    >
                      <AutocompleteInput source="contact_type_id" optionText="type" />
                    </ReferenceInput>
                  </Grid>
                  {showPrimary && (
                    <>
                      <Grid container direction="row">
                        <Grid container item md={6}>
                          <Typography classes={{ root: popUpClasses.headingSecondary }}>Primary</Typography>
                          <BooleanInput
                            className={popUpClasses.primaryToggle}
                            onChange={() => {
                              setPrimary(rest.form.getState().values?.primary);
                            }}
                            source="primary"
                            label={primary ? 'Yes' : 'No'}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <Typography classes={{ root: popUpClasses.headingSecondary }}>NOTES</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>
                  <Grid container direction="row">
                    <Grid item md={12} sm={12} xs={12}>
                      <div id="notes-popup">
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
                      </div>
                    </Grid>
                  </Grid>
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
export default AddContactButton;
