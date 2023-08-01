import { Appraisals } from 'views/Appraisal/types';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import React from 'react';
import AddContactField from '../../../Contact/components/AddContactField';
import CreateContactButton from './CreateContactButton';
import { useUpdate } from 'react-admin';
import { useForm } from 'react-final-form';
import Grid from '@material-ui/core/Grid';

type ContactListActionsProps = InjectedFieldProps<Appraisals> & PublicFieldProps;

function ContactListActions(props: ContactListActionsProps) {
  const form = useForm();
  const [update] = useUpdate('appraisal', props.record?.id);
  return (
    <Grid container alignItems="center" spacing={3}>
      <Grid item md={9}>
        <AddContactField
          {...props}
          filter={{
            id: {
              format: 'raw-query',
              value: {
                _nin: props.record?.['contact_ids'] || [],
              },
            },
          }}
          onAssign={handleAssign}
          addLabel={false}
          source="contact_ids"
          fullWidth
        />
      </Grid>
      <Grid container justify="flex-end" md={3}>
        <CreateContactButton {...props} />
      </Grid>
    </Grid>
  );

  async function handleAssign(selectedId: string) {
    const selected = [selectedId];
    const contactIds = (props.record?.['contact_ids'] ?? []).concat(selected);
    await update({
      payload: {
        data: {
          contact_ids: contactIds,
        },
      },
    });
    form.change('contact_ids', contactIds);
  }
}

export default ContactListActions;
