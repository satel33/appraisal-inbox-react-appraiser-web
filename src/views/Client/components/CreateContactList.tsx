import React, { useState } from 'react';
import { Button } from 'react-admin';
import IconCheck from '@material-ui/icons/Check';
import { Typography, Box, Modal } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { ErrorOutline } from '@material-ui/icons';
import AddContact from './popups/AddContact';
import EditContact from './popups/EditContact';
import styles from './hooks/useContactListStyles';
import { copyToClipboard } from 'shared/utils';

type CreateContactListProps = {
  saveContacts: (contacts: any) => any;
  clientTypeId?: number;
};

function CreateContactList({ saveContacts, clientTypeId }: CreateContactListProps) {
  const classes = styles();
  const [contacts, setContacts] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');

  const remove = (index: number) => {
    const newContacts: Array<any> = [...contacts];
    newContacts.splice(index, 1);
    setContacts(newContacts);
    saveContacts(newContacts);
    setOpen(false);
  };

  const onRemove = (index: number) => {
    setSelected(contacts[index].id);
    setSelectedLabel(contacts[index].name);
    setOpen(true);
  };

  const onContactAdd = (value: any): void => {
    const newContacts: Array<any> = [...contacts];
    newContacts.push({
      id: new Date().getTime() + '',
      ...value,
    });
    setContacts(newContacts);
    saveContacts(newContacts);
  };

  const onEditContact = (value: any): void => {
    if (selected) {
      const index = contacts.findIndex((item: any) => item.id === selected) as any;
      if (index !== -1) {
        const newContacts: Array<any> = [...contacts];
        newContacts[index] = value;
        setContacts(newContacts);
        saveContacts(newContacts);
      }
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
          <Typography classes={{ root: classes.heading }}>Remove Contact: {selectedLabel} </Typography>
          <p>Are you sure you want to remove this contact from client?</p>
          <Box className={classes.confirmBtnBox}>
            <Button
              onClick={() => setOpen(false)}
              label="Cancel"
              color="secondary"
              startIcon={<ErrorOutline />}
            ></Button>
            <Button
              onClick={() => remove(contacts.findIndex((item: any) => item.id === selected))}
              label="Confirm"
              color="primary"
              startIcon={<IconCheck />}
            ></Button>
          </Box>
        </Box>
      </Modal>
      {contacts.length > 0 && (
        <Table>
          <TableHead classes={{ root: classes.tableHead }}>
            <TableRow>
              <TableCell classes={{ root: classes.headCell }}>NAME</TableCell>
              <TableCell classes={{ root: classes.headCell }}>EMAIL</TableCell>
              <TableCell classes={{ root: classes.headCell }}>PHONE</TableCell>
              <TableCell classes={{ root: classes.headCell }}>TYPE</TableCell>
              <TableCell classes={{ root: classes.headCell }}>PRIMARY</TableCell>
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
                <TableCell
                  classes={{ root: classes.cell }}
                  onClick={(e: any) => copyToClipboard(row.phone_number, e, false)}
                >
                  {row.phone_number}
                </TableCell>
                <TableCell classes={{ root: classes.cell }} onClick={(e: any) => copyToClipboard(row.type, e, false)}>
                  {row.type}
                </TableCell>
                <TableCell classes={{ root: classes.cell }} onClick={(e: any) => copyToClipboard(row.type, e, false)}>
                  {row.primary ? 'Yes' : 'No'}
                </TableCell>
                <TableCell classes={{ root: classes.cell }}>
                  <Box className={classes.savedCell}>
                    <span className={classes.iconPadding} onClick={() => setSelected(row.id)}>
                      <EditContact contact={row} onSave={onEditContact}></EditContact>
                    </span>
                    <span>
                      <Icon classes={{ root: classes.activeCursor }} fontSize="small" onClick={() => onRemove(i)}>
                        close
                      </Icon>
                    </span>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Box className={classes.addBox}>
        <Box className={classes.addContactBtn}>
          <AddContact
            viewPrimary={true}
            contactsCount={contacts.length}
            persist={false}
            clientTypeId={clientTypeId}
            onSave={onContactAdd}
          ></AddContact>
        </Box>
      </Box>
    </>
  );
}

export default CreateContactList;
