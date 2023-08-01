import React from 'react';
import {
  Button,
  SaveButton,
  FormWithRedirect,
  ReferenceInput,
  TextInput,
  required,
  FormWithRedirectSave,
} from 'react-admin';
import IconCancel from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { Contact } from 'views/Contact/types';
import useContactOptions from 'shared/hooks/useContactOptions';

type ContactDialogProps = {
  isVisible: boolean;
  onClose(): void;
  typeVisible?: boolean;
  loading: boolean;
  title: string;
  initialValues?: Partial<Contact>;
  onSubmit: FormWithRedirectSave;
};
function ContactDialog(props: ContactDialogProps) {
  const { isVisible, onClose, title, onSubmit, loading, initialValues, typeVisible = true } = props;
  const [contactOptions] = useContactOptions();
  return (
    <Dialog maxWidth="md" fullWidth open={isVisible} onClose={onClose} aria-label="Add Contact">
      <DialogTitle>{title}</DialogTitle>

      <FormWithRedirect
        initialValues={initialValues}
        save={onSubmit}
        render={({ handleSubmitWithRedirect, pristine, saving }: any) => (
          <>
            <DialogContent>
              <Grid container md={12} spacing={2}>
                <Grid item md={6}>
                  <TextInput validate={required()} variant="standard" fullWidth source="first_name" />
                </Grid>
                <Grid item md={6}>
                  <TextInput variant="standard" fullWidth source="last_name" />
                </Grid>
                <Grid item md={6}>
                  <TextInput label="Phone" variant="standard" fullWidth source="phone_number" />
                </Grid>
                <Grid item md={6}>
                  <TextInput variant="standard" fullWidth source="email" />
                </Grid>
                <Grid item md={6}>
                  <AutocompleteInput
                    label="Client"
                    source="client_id"
                    fullWidth
                    optionText="name"
                    variant="standard"
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
                {typeVisible && (
                  <Grid item md={6}>
                    <ReferenceInput
                      label="Type"
                      source="contact_type_id"
                      reference="contact_types"
                      fullWidth
                      perPage={100}
                      allowEmpty={false}
                      variant="standard"
                      validate={required()}
                      sort={{ field: 'order', order: 'ASC' }}
                      filterToQuery={(searchText: string) => ({ type: searchText })}
                    >
                      <AutocompleteInput source="contact_type_id" optionText="type" />
                    </ReferenceInput>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button label="ra.action.cancel" onClick={onClose} disabled={loading}>
                <IconCancel />
              </Button>
              <SaveButton handleSubmitWithRedirect={handleSubmitWithRedirect} saving={saving} disabled={loading} />
            </DialogActions>
          </>
        )}
      />
    </Dialog>
  );
}

export default ContactDialog;
