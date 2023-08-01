import React from 'react';
import { Button, SaveButton, FormWithRedirect, TextInput, required, FormWithRedirectSave } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import IconCancel from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { YearInput } from 'shared/components/Pickers';
import CurrencyInput from 'shared/components/CurrencyInput';
import Typography from '@material-ui/core/Typography';
import { Assessment } from '../types';

type AssessmentDialogProps = {
  isVisible: boolean;
  onClose(): void;
  loading: boolean;
  title: string;
  initialValues?: Partial<Assessment>;
  onSubmit: FormWithRedirectSave;
  readOnly?: boolean;
};

function AssessmentDialog(props: AssessmentDialogProps) {
  const { isVisible, onClose, title, onSubmit, loading, initialValues, readOnly } = props;
  return (
    <Dialog maxWidth="md" fullWidth open={isVisible} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <FormWithRedirect
        initialValues={initialValues}
        save={onSubmit}
        render={({ handleSubmitWithRedirect, pristine, saving }: any) => (
          <>
            <DialogContent>
              <Grid container md={12} spacing={2}>
                <Grid item container spacing={2} md={12}>
                  <Grid item md={4}>
                    <YearInput disabled={readOnly} validate={required()} label="Year" source="year" />
                  </Grid>
                </Grid>
                <Grid item md={12}>
                  <Typography style={{ fontSize: '1rem' }} variant="h6">
                    Valuation
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <CurrencyInput
                    disabled={readOnly}
                    type="number"
                    label="Land"
                    variant="standard"
                    fullWidth
                    source="land_value"
                  />
                </Grid>
                <Grid item md={4}>
                  <CurrencyInput
                    disabled={readOnly}
                    type="number"
                    label="Building"
                    variant="standard"
                    fullWidth
                    source="building_value"
                  />
                </Grid>
                <Grid item md={4}>
                  <CurrencyInput
                    disabled={readOnly}
                    type="number"
                    label="Other"
                    variant="standard"
                    fullWidth
                    source="other_value"
                  />
                </Grid>
                <Grid item md={12}>
                  <Typography style={{ fontSize: '1rem' }} variant="h6">
                    Taxes
                  </Typography>
                </Grid>
                <Grid item md={4}>
                  <CurrencyInput disabled={readOnly} type="number" variant="standard" fullWidth source="taxes" />
                </Grid>
                <Grid item md={4}>
                  <TextInput
                    disabled={readOnly}
                    type="number"
                    label="Millage"
                    variant="standard"
                    fullWidth
                    source="millage_rate"
                  />
                </Grid>
                <Grid item md={4}>
                  <TextInput disabled={readOnly} variant="standard" fullWidth source="url" label="Tax Assessor Link" />
                </Grid>
                <Grid item md={12}>
                  <Typography style={{ fontSize: '1rem' }} variant="h6">
                    Notes
                  </Typography>
                </Grid>
                <Grid item md={12}>
                  <RichTextInput
                    options={{ readOnly }}
                    fullWidth
                    source="notes"
                    multiline
                    variant="standard"
                    label=""
                    key={`text-${readOnly}`}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button label="ra.action.cancel" onClick={onClose} disabled={loading}>
                <IconCancel />
              </Button>
              {!readOnly && (
                <SaveButton handleSubmitWithRedirect={handleSubmitWithRedirect} saving={saving} disabled={loading} />
              )}
            </DialogActions>
          </>
        )}
      />
    </Dialog>
  );
}

export default AssessmentDialog;
