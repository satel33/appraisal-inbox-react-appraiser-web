import React, { useState } from 'react';
import {
  Button,
  SaveButton,
  useNotify,
  FormWithRedirect,
  TextInput,
  required,
  useRefresh,
  useUpdate,
} from 'react-admin';
import IconCancel from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import { Card, CardHeader, Divider, Box, InputAdornment, Icon } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import styles from '../hooks/useContactPopupStyles';
import styles2 from '../hooks/useContactListStyles';

type EditReportFeeProps = {
  appraisal?: any;
};
interface State {
  report_fee: string;
}

function EditReportFee({ appraisal }: EditReportFeeProps) {
  const popUpClasses = styles();
  const classes = styles2();

  const [showDialog, setShowDialog] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [values, setValues] = useState<State>({
    report_fee: appraisal?.report_fee,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const refresh = useRefresh();
  const notify = useNotify();
  const [update, { loading }] = useUpdate('appraisal', appraisal?.id);

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
    setDisabled(true);
    update(
      {
        payload: {
          id: appraisal?.id,
          data: values,
          previousData: appraisal,
        },
      },
      {
        onSuccess: () => {
          setShowDialog(false);
          setDisabled(false);
          notify('appraisal.updated');
          refresh();
        },
        onFailure: ({ error }: any) => {
          alert('error');
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
      <Icon onClick={handleClick} classes={{ root: classes.activeCursor }} fontSize="small">
        edit
      </Icon>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={showDialog}
        onClose={handleCloseClick}
        aria-label="Edit Report Fee"
      >
        <FormWithRedirect
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, saving, ...rest }: any) => (
            <DialogContent classes={{ root: popUpClasses.dialogContent }}>
              <Card variant="outlined" className={popUpClasses.formBottom}>
                <CardHeader title="Edit Report Fee" classes={{ root: popUpClasses.cardHeader }}></CardHeader>
                <Divider style={{ marginBottom: '24px' }}></Divider>
                <Box className={popUpClasses.formContainer}>
                  <Grid container direction="row" justify="space-between">
                    <Grid item md={3} xs={12}>
                      <TextInput
                        defaultValue={appraisal.report_fee}
                        validate={required()}
                        value={values.report_fee}
                        onChange={handleChange('report_fee')}
                        source="report_fee"
                        variant="outlined"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        fullWidth
                      />
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

export default EditReportFee;
