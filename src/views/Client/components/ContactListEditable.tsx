import React, { useEffect, useState } from 'react';
import { Button, useNotify, useRedirect, useMutation, useRefresh, useUpdate } from 'react-admin';
import IconCheck from '@material-ui/icons/Check';
import { Typography, Box, Modal } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { ErrorOutline } from '@material-ui/icons';
import AddContact from './popups/AddContact';
import AddExistingContact from './popups/AddExistingContact';
import styles from './hooks/useContactListStyles';
import { copyToClipboard, sentaneCase } from 'shared/utils';

type contactProps = {
  initialContacts: any;
  clientTypeId: number;
  contactsCount?: number;
  clientId: string;
  appraisal?: any;
  edit?: boolean;
  delet?: boolean;
};

export function ContactListEditable({
  initialContacts,
  clientTypeId,
  clientId,
  appraisal,
  edit = true,
  delet = true,
  contactsCount = 0,
}: contactProps) {
  const classes = styles();
  const redirect = useRedirect();
  const [deleteMutation] = useMutation({ type: 'delete', resource: 'contact', payload: {} });
  const notify = useNotify();
  const refresh = useRefresh();
  const [contacts, setContacts] = useState([]);
  const [update] = useUpdate('appraisal', appraisal?.id);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');

  useEffect(() => {
    if (initialContacts && initialContacts.length) {
      setContacts(initialContacts);
    }
  }, [initialContacts && initialContacts.length]);

  const onEdit = (index: number) => {
    return redirect(`/contacts/${(contacts[index] as any)['id']}`);
  };

  const onRemove = (index: number) => {
    setSelected((contacts[index] as any)['id']);
    setSelectedLabel((contacts[index] as any)['name']);
    setOpen(true);
  };

  const updateAppraisal = (contactId: any) => {
    return new Promise((resolve: any) => {
      if (appraisal) {
        update(
          {
            payload: {
              id: appraisal?.id,
              data: {
                contact_ids: appraisal.contact_ids.filter((id: string) => id !== contactId),
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

  const remove = async (index: number) => {
    const newContacts = [...contacts];
    if (appraisal) {
      // Un-assign contact from appraisal and do not delete contact
      await updateAppraisal(selected);
    } else {
      await deleteContact();
    }
    setOpen(false);
    notify('contact.deleted');
    newContacts.splice(index, 1);
    setContacts(newContacts);
    refresh();
  };

  const deleteContact = async () => {
    return new Promise((resolve, reject) => {
      deleteMutation(
        {
          payload: {
            id: selected,
            data: {},
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
    });
  };

  const isDisabled = () => {
    if (selected) {
      const contact = contacts.find((item: any) => item.id === selected) as any;
      if (appraisal) {
        return false;
      } else if (contact && contact.appraisalsCount) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(!open)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box className={classes.paper}>
          <Typography classes={{ root: classes.heading }}>
            {appraisal ? 'Remove' : 'Delete'} Contact: {selectedLabel && sentaneCase(selectedLabel)}
          </Typography>
          <p>
            {' '}
            {isDisabled()
              ? 'Cannot delete contact with associated appraisals'
              : `Are you sure you want to ${appraisal ? 'Remove' : 'Delete'} this contact ${
                  appraisal ? 'from appraisal' : ''
                }?`}
          </p>
          <Box className={classes.confirmBtnBox}>
            <Button
              onClick={() => setOpen(false)}
              label="Cancel"
              color="secondary"
              startIcon={<ErrorOutline />}
            ></Button>
            <Button
              disabled={isDisabled()}
              onClick={() => remove(contacts.findIndex((item: any) => item.id === selected))}
              label="Confirm"
              color="primary"
              startIcon={<IconCheck />}
            ></Button>
          </Box>
        </Box>
      </Modal>
      {initialContacts.length > 0 && (
        <Table>
          <TableHead classes={{ root: classes.tableHead }}>
            <TableRow>
              <TableCell classes={{ root: classes.headCell }}>NAME</TableCell>
              <TableCell classes={{ root: classes.headCell }}>EMAIL</TableCell>
              <TableCell classes={{ root: classes.headCell }}>PHONE</TableCell>
              <TableCell classes={{ root: classes.headCell }}>TYPE</TableCell>
              {!appraisal && <TableCell classes={{ root: classes.headCell }}>PRIMARY</TableCell>}
              <TableCell classes={{ root: classes.cellEdit }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((row: any, i: number) => (
              <TableRow key={i}>
                <TableCell
                  component="th"
                  scope="row"
                  classes={{ root: classes.cell }}
                  onClick={(e: any) => copyToClipboard(row.name, e, false)}
                >
                  {' '}
                  {row.name}
                </TableCell>
                <TableCell classes={{ root: classes.cell }} onClick={(e: any) => copyToClipboard(row.email, e, false)}>
                  {row.email}
                </TableCell>
                <TableCell classes={{ root: classes.cell }} onClick={(e: any) => copyToClipboard(row.phone, e, false)}>
                  {row.phone}
                </TableCell>
                <TableCell classes={{ root: classes.cell }} onClick={(e: any) => copyToClipboard(row.type, e, false)}>
                  {row.type}
                </TableCell>
                {!appraisal && (
                  <TableCell classes={{ root: classes.cell }} onClick={(e: any) => copyToClipboard(row.type, e, false)}>
                    {row.primary ? 'Yes' : 'No'}
                  </TableCell>
                )}
                <TableCell classes={{ root: classes.cell }}>
                  <Box className={classes.savedCell}>
                    {edit && (
                      <span className={classes.iconPadding}>
                        <Icon classes={{ root: classes.activeCursor }} fontSize="small" onClick={() => onEdit(i)}>
                          edit
                        </Icon>
                      </span>
                    )}
                    {delet && (
                      <span>
                        <Icon classes={{ root: classes.activeCursor }} fontSize="small" onClick={() => onRemove(i)}>
                          {appraisal ? 'close' : 'delete'}
                        </Icon>
                      </span>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {edit && (
        <Box className={classes.addBox}>
          {appraisal ? (
            <Box className={classes.addContactBtn}>
              <AddExistingContact
                clientTypeId={clientTypeId}
                clientId={clientId}
                persist={true}
                appraisal={appraisal}
              ></AddExistingContact>
            </Box>
          ) : (
            <Box className={classes.addContactBtn}>
              <AddContact
                clientTypeId={clientTypeId}
                clientId={clientId}
                persist={true}
                appraisal={appraisal}
                contactsCount={contactsCount}
              ></AddContact>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

export default ContactListEditable;
