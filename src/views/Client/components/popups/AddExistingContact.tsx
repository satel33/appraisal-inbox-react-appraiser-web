import React, { useState } from 'react';
import { Button, SaveButton, useNotify, FormWithRedirect, useRefresh, useUpdate } from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import { Card, CardHeader, Divider, Box } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import styles from '../hooks/useContactPopupStyles';
import AddContactField from 'views/Contact/components/AddContactField';
import AddContact from './AddContactDialog';

type AddContactProps = {
  persist: boolean;
  onSave?: (value: any) => any;
  clientId?: string;
  clientTypeId?: number;
  appraisal?: any;
};

function AddExistingContactButton({ clientTypeId, clientId, onSave, persist, appraisal }: AddContactProps) {
  const popUpClasses = styles();
  const [showDialog, setShowDialog] = useState(false);
  const [isNewContact, setIsNewContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const refresh = useRefresh();
  const notify = useNotify();
  const [update] = useUpdate('appraisal', appraisal?.id);

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const handleSubmit = async (values: any) => {
    const cid = values.selected_contact_id.split('.');
    if (cid.length === 2) {
      // Create new contact
      setContactName(cid[0]);
      setIsNewContact(true);
    } else {
      // Add existing contact
      await updateAppraisal(values.selected_contact_id);
      setShowDialog(false);
      refresh();
      notify('Contact added successfully');
    }
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
      <Button onClick={handleClick} label="ADD CONTACT">
        <IconContentAdd />
      </Button>
      <Dialog fullWidth={true} maxWidth={'sm'} open={showDialog} onClose={handleCloseClick} aria-label="Add Contact">
        <FormWithRedirect
          initialValues={{
            client_id: clientId,
          }}
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, form }: any) => (
            <DialogContent classes={{ root: popUpClasses.dialogContent }}>
              <Card variant="outlined" className={popUpClasses.formBottom}>
                <CardHeader title="Add Contact" classes={{ root: popUpClasses.cardHeader }}></CardHeader>
                <Divider></Divider>
                <Box className={popUpClasses.formContainer}>
                  <AddContactField
                    filter={{
                      id: {
                        format: 'raw-query',
                        value: {
                          _nin: appraisal?.contact_ids || [],
                        },
                      },
                    }}
                    addLabel={false}
                    source="contact_ids"
                    fullWidth
                  />
                  <Box style={{ display: 'flex', justifyContent: 'end' }}>
                    <AddContact
                      contactName={contactName}
                      showDialogView={isNewContact}
                      clientTypeId={clientTypeId}
                      clientId={clientId}
                      persist={true}
                      appraisal={appraisal}
                      onSave={handleCloseClick}
                      label="ADD NEW CONTACT"
                      active={!form.getState().values?.selected_contact_id}
                    ></AddContact>
                  </Box>
                  <DialogActions classes={{ root: popUpClasses.editActions }} style={{ padding: '0px' }}>
                    <Button label="ra.action.cancel" onClick={handleCloseClick}>
                      <IconCancel />
                    </Button>
                    <SaveButton
                      handleSubmitWithRedirect={handleSubmitWithRedirect}
                      disabled={!form.getState().values?.selected_contact_id}
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
export default AddExistingContactButton;
