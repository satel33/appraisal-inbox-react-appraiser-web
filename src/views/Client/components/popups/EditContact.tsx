import React, { useEffect, useState } from 'react';
import { Button, SaveButton, FormWithRedirect, TextInput, required, email, ReferenceInput } from 'react-admin';
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
import Icon from '@material-ui/core/Icon';
import styles from '../hooks/useContactPopupStyles';
import { useContactQuery } from '../hooks/useContactOptions';

type EditContactProps = {
  onSave: (value: any) => any;
  clientTypeId?: number;
  contact: any;
};

function EditContactButton({ clientTypeId, onSave, contact }: EditContactProps) {
  const popUpClasses = styles();
  const contactQueryData = useContactQuery();
  const [showDialog, setShowDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [defaultContactType, setDefaultContactType] = useState<any>(0);

  const handleClick = () => {
    setShowDialog(true);
    moveToolbarBelow();
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    if (clientTypeId) {
      setDefaultContactType(getContactType(clientTypeId) || getOtherContactTypeId());
    }
  }, [contactQueryData]);

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
    const type = contactQueryData?.data?.contactTypes.find((item: any) => item.id === values.contact_type_id);
    if (type) {
      values.type = type.type;
    }
    onSave(values);
    setShowDialog(false);
    setDisabled(false);
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

  return (
    <>
      <Icon onClick={handleClick} style={{ cursor: 'pointer' }} fontSize="small">
        edit
      </Icon>
      <Dialog fullWidth={true} maxWidth={'md'} open={showDialog} onClose={handleCloseClick} aria-label="Edit Contact">
        <FormWithRedirect
          initialValues={{
            contact_type_id: defaultContactType,
            ...contact,
          }}
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, saving }: any) => (
            <DialogContent classes={{ root: popUpClasses.dialogContent }}>
              <Card variant="outlined" className={popUpClasses.formBottom}>
                <CardHeader title="Edit Contact" classes={{ root: popUpClasses.cardHeader }}></CardHeader>
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
                  <Typography classes={{ root: popUpClasses.headingSecondary }}>TYPE</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>
                  <Grid container direction="row">
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
                  </Grid>
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
                    <Button label="ra.action.cancel" onClick={handleCloseClick}>
                      <IconCancel />
                    </Button>
                    <SaveButton
                      handleSubmitWithRedirect={handleSubmitWithRedirect}
                      saving={saving}
                      disabled={disabled}
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
export default EditContactButton;
