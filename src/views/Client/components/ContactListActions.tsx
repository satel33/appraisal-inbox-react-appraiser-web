import Grid from '@material-ui/core/Grid';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import React from 'react';
import CreateContactButton from './CreateContactButton';
import { Client } from '../types';

type ContactListActionsProps = InjectedFieldProps<Client> &
  PublicFieldProps & {
    onSuccess(): void;
  };

function ContactListActions(props: ContactListActionsProps) {
  return (
    <Grid container spacing={3}>
      <Grid item md={12} justify="flex-end" container>
        <CreateContactButton
          initialValues={{
            client_id: props?.record?.id,
          }}
          onSuccess={props.onSuccess}
        />
      </Grid>
    </Grid>
  );
}

export default ContactListActions;
