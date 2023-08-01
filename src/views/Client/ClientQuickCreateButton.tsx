import React, { useState } from 'react';
import { useForm } from 'react-final-form';
import { Button, SaveButton, useCreate, useNotify, FormWithRedirect, TextInput, required } from 'react-admin';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import gql from 'graphql-tag';
import DialogActions from '@material-ui/core/DialogActions';
import { useQuery } from '@apollo/client';

const CLIENT_TYPE_QUERY = gql`
  query ClientTypeQuery {
    clientTypes: client_types(order_by: { order: asc }) {
      id
      type
    }
  }
`;

type ClientQuickCreateButtonProps = {
  onChange(): void;
  classes: any;
};
function ClientQuickCreateButton({ onChange, classes }: ClientQuickCreateButtonProps) {
  const queryData = useQuery<{
    clientTypes: {
      id: string;
      type: string;
    }[];
  }>(CLIENT_TYPE_QUERY, { fetchPolicy: 'cache-first' });
  const [showDialog, setShowDialog] = useState(false);
  const [create, { loading }] = useCreate('client');
  const notify = useNotify();
  const form = useForm();

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
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
          form.change('client_id', data.id);
          onChange();
          setShowDialog(false);
        },
        onFailure: ({ error }: any) => {
          notify(error.message, 'error');
        },
      },
    );
  };

  return (
    <>
      <Button className={classes} onClick={handleClick} label="ADD NEW CLIENT">
        <IconContentAdd />
      </Button>
      <Dialog fullWidth open={showDialog} onClose={handleCloseClick} aria-label="Add Client">
        <DialogTitle>Create Client</DialogTitle>

        <FormWithRedirect
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, saving }: any) => (
            <>
              <DialogContent>
                <Grid container md={12} spacing={2}>
                  <Grid item md={6}>
                    <TextInput validate={required()} source="name" variant="standard" fullWidth />
                  </Grid>
                  <Grid item md={6}>
                    <AutocompleteInput
                      fullWidth
                      variant="standard"
                      label="Client Type"
                      source="client_type_id"
                      optionText="type"
                      choices={queryData.data?.clientTypes ?? []}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button label="ra.action.cancel" onClick={handleCloseClick} disabled={loading}>
                  <IconCancel />
                </Button>
                <SaveButton handleSubmitWithRedirect={handleSubmitWithRedirect} saving={saving} disabled={loading} />
              </DialogActions>
            </>
          )}
        />
      </Dialog>
    </>
  );
}

export default ClientQuickCreateButton;
