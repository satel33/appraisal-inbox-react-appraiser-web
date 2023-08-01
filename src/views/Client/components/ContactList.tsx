import React from 'react';
import { ReferenceManyField } from 'react-admin';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import ContactGrid from 'views/Contact/components/ContactGrid';
import Grid from '@material-ui/core/Grid/Grid';
import { Client } from '../types';
import ContactRowActions from './ContactRowActions';
import ContactListActions from './ContactListActions';
import { TAB_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';

type ContactListProps = InjectedFieldProps<Client> & PublicFieldProps;
function ContactList(props: ContactListProps) {
  const [key, setKey] = React.useState(1);
  return (
    <>
      <ContactListActions {...props} onSuccess={onSuccess} />
      <Grid item md={12}>
        <ReferenceManyField
          key={key}
          reference="contacts"
          source="id"
          target="client_id"
          fullWidth
          addLabel={true}
          pagination={<Pagination />}
          perPage={TAB_LIST_PER_PAGE}
          basePath="/contacts"
          filter={{ client_id: props.record?.id }}
        >
          <ContactGrid onSuccess={onSuccess} actionsRenderer={ContactRowActions} resource="contact" />
        </ReferenceManyField>
      </Grid>
    </>
  );

  function onSuccess() {
    setKey((prev) => prev + 1);
  }
}

export default ContactList;
