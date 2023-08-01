import React, { useState } from 'react';
import {
  Button,
  SaveButton,
  useCreate,
  useNotify,
  FormWithRedirect,
  TextInput,
  required,
  useRefresh,
} from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import { Card, CardHeader, Divider, Typography, Box, InputAdornment } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import styles from '../hooks/useContactPopupStyles';

type AddFeeProps = {
  label?: string;
  appraisal?: any;
  active?: boolean;
  clientId?: string;
};
interface State {
  description: string;
  quantity: number;
  rate: number;
}

function AddFeeButton({ label = 'ADD FEE', appraisal, active = true, clientId }: AddFeeProps) {
  const popUpClasses = styles();

  const [showDialog, setShowDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isFlat, setFlat] = useState(true);

  const [values, setValues] = useState<State>({
    description: '',
    quantity: 1,
    rate: 0,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [create, { loading }] = useCreate('appraisal_fee');
  const refresh = useRefresh();
  const notify = useNotify();

  const handleClick = () => {
    setShowDialog(true);
    moveToolbarBelow();
  };

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

  const handleSubmit = async (values: any) => {
    const values2 = {
      appraisal_id: values.appraisal_id,
      client_id: values.client_id,
      description: values.description,
      rate: values.rate / 100,
      rate_type_id: values.rate_type_id,
      report_fee: values.report_fee,
    };
    setDisabled(true);

    create(
      {
        payload: {
          data: values.rate_type_id === 2 ? values : values2,
        },
      },
      {
        onSuccess: () => {
          setShowDialog(false);
          setDisabled(false);
          notify('appraisal_fee.created');
          refresh();
        },
        onFailure: ({ error }: any) => {
          setDisabled(false);
          notify(error.message, 'error');
        },
      },
    );

    setShowDialog(false);
    setDisabled(false);
  };

  return (
    <>
      <Button onClick={handleClick} label={label} disabled={!active}>
        <IconContentAdd />
      </Button>
      <Dialog fullWidth={true} maxWidth={'md'} open={showDialog} onClose={handleCloseClick} aria-label="Add Fee">
        <FormWithRedirect
          initialValues={{
            appraisal_id: appraisal?.id,
            client_id: clientId,
            report_fee: appraisal?.report_fee,
            rate_type_id: isFlat ? 2 : 1,
          }}
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, saving, ...rest }: any) => (
            <DialogContent classes={{ root: popUpClasses.dialogContent }}>
              <Card variant="outlined" className={popUpClasses.formBottom}>
                <CardHeader title="Add Fee" classes={{ root: popUpClasses.cardHeader }}></CardHeader>
                <Divider></Divider>
                <Box className={popUpClasses.formContainer}>
                  <Typography classes={{ root: popUpClasses.heading }}>DESCRIPTION</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>

                  <Grid container direction="row">
                    <Grid item md={6} sm={8} xs={12}>
                      <TextInput validate={required()} source="description" variant="outlined" fullWidth />
                    </Grid>
                  </Grid>

                  <Typography classes={{ root: popUpClasses.heading }}>FEE</Typography>
                  <Divider classes={{ root: popUpClasses.divider }}></Divider>

                  <Grid container direction="row" style={{ marginBottom: '32px' }}>
                    <Button
                      label="Flat"
                      onClick={() => setFlat(true)}
                      variant={isFlat ? 'contained' : 'outlined'}
                      style={{ borderRadius: '24px', marginRight: '16px', paddingRight: '16px' }}
                    />
                    <Button
                      label="Percentage of Report Fee"
                      onClick={() => setFlat(false)}
                      variant={isFlat ? 'outlined' : 'contained'}
                      style={{ borderRadius: '24px', paddingRight: '16px' }}
                    />
                  </Grid>
                  <Grid container direction="row" justify="space-between">
                    <Grid item md={3} xs={12}>
                      {isFlat ? (
                        <TextInput
                          validate={required()}
                          source={'quantity'}
                          variant="outlined"
                          type="number"
                          value={values.quantity}
                          onChange={handleChange('quantity')}
                          fullWidth
                        />
                      ) : (
                        <TextInput
                          validate={required()}
                          source={'rate'}
                          variant="outlined"
                          type="number"
                          value={values.rate}
                          onChange={handleChange('rate')}
                          fullWidth
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      )}
                    </Grid>
                    {isFlat && (
                      <Grid item md={3} xs={12}>
                        <TextInput
                          validate={required()}
                          value={values.rate}
                          onChange={handleChange('rate')}
                          source="rate"
                          variant="outlined"
                          type="number"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          fullWidth
                        />
                      </Grid>
                    )}
                    <Grid item md={3} xs={12}>
                      <Typography style={{ paddingTop: '12.5px' }}>
                        Fee: $
                        {isFlat
                          ? values.rate * values.quantity
                          : ((values.rate / 100) * appraisal.report_fee).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider classes={{ root: popUpClasses.divider }}></Divider>

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
export default AddFeeButton;
