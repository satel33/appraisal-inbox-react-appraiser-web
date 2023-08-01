import React from 'react';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import { TextInput } from 'react-admin';
import { DateInput } from 'shared/components/Pickers';
import Grid from '@material-ui/core/Grid/Grid';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import CurrencyInput from 'shared/components/CurrencyInput';
import RichTextInput from 'ra-input-rich-text';
import useAppraisalOptions from 'shared/hooks/useAppraisalOptions';
import getAppraisalPermission from '../permission';
import Typography from '@material-ui/core/Typography';
import AutocompleteArrayInput from 'shared/components/AutocompleteArrayInput';

export default function Engagement() {
  const [{ formData, permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const [appraisalOptions] = useAppraisalOptions();
  const isResidential = formData.property_type_id === 1;
  const isFormReport = formData.report_type_id === 1;
  const isFormTypeVisible = isResidential && isFormReport;
  const caseNumberVisible = [4, 5, 6].includes(formData.loan_type_id || NaN);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Engagement
          </Typography>
        </Grid>
        <Grid item md={4}>
          <TextInput disabled={!permissions.edit} variant="standard" fullWidth source="appraisal_file_number" />
        </Grid>
        <Grid item md={4}>
          <TextInput disabled={!permissions.edit} source="client_file_number" fullWidth variant="standard" />
        </Grid>
        <Grid item md={4}>
          <TextInput disabled={!permissions.edit} source="client_loan_number" fullWidth variant="standard" />
        </Grid>
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Purpose
          </Typography>
        </Grid>
        <Grid item md={4}>
          <AutocompleteInput
            label="Appraisal Purpose"
            fullWidth
            source="appraisal_purpose_id"
            optionText="purpose"
            variant="standard"
            disabled={!permissions.edit}
            choices={appraisalOptions.data?.appraisalPurposes ?? []}
          />
        </Grid>
        <Grid item md={4}>
          <AutocompleteInput
            label="Loan Type"
            choices={appraisalOptions.data?.loanTypes ?? []}
            source="loan_type_id"
            optionText="type"
            variant="standard"
            disabled={!permissions.edit}
            fullWidth
          />
        </Grid>
        <Grid item md={4}>
          <AutocompleteInput
            label="Report Type"
            fullWidth
            variant="standard"
            source="report_type_id"
            optionText="type"
            disabled={!permissions.edit}
            choices={appraisalOptions.data?.reportTypes ?? []}
          />
        </Grid>
        <Grid spacing={2} container justify="flex-end">
          {caseNumberVisible && (
            <>
              {formData.loan_type_id === 4 && (
                <Grid item md={4}>
                  <TextInput
                    disabled={!permissions.edit}
                    variant="standard"
                    fullWidth
                    source="fha_case_number"
                    label="FHA Case Number"
                  />
                </Grid>
              )}
              {formData.loan_type_id === 5 && (
                <Grid item md={4}>
                  <TextInput
                    disabled={!permissions.edit}
                    variant="standard"
                    fullWidth
                    source="usda_case_number"
                    label="USDA Case Number"
                  />
                </Grid>
              )}
              {formData.loan_type_id === 6 && (
                <Grid item md={4}>
                  <TextInput
                    disabled={!permissions.edit}
                    variant="standard"
                    fullWidth
                    source="va_case_number"
                    label="VA Case Number"
                  />
                </Grid>
              )}
            </>
          )}
          {isFormTypeVisible && (
            <Grid item md={4}>
              <AutocompleteArrayInput
                label="Form Types"
                fullWidth
                variant="standard"
                source="residential_form_type_ids"
                optionText="type"
                disabled={!permissions.edit}
                choices={appraisalOptions.data?.residentialFormTypes ?? []}
              />
            </Grid>
          )}
        </Grid>
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Values
          </Typography>
        </Grid>
        <Grid item md={4}>
          <CurrencyInput
            disabled={!permissions.edit}
            variant="standard"
            label="Cost Approach Value"
            fullWidth
            source="cost_approach_value"
          />
        </Grid>
        <Grid item md={4}>
          <CurrencyInput
            disabled={!permissions.edit}
            variant="standard"
            label="Income Approach Value"
            fullWidth
            source="income_approach_value"
          />
        </Grid>
        <Grid item md={4}>
          <CurrencyInput
            disabled={!permissions.edit}
            variant="standard"
            fullWidth
            source="sales_approach_value"
            label="Sales Approach Value"
          />
        </Grid>
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Dates
          </Typography>
        </Grid>
        <Grid item md={4}>
          <DateInput disabled={!permissions.edit} source="quote_made_date" variant="standard" fullWidth />
        </Grid>
        <Grid item md={4}>
          <DateInput disabled={!permissions.edit} source="quote_declined_date" variant="standard" fullWidth />
        </Grid>
        <Grid item md={4}>
          <DateInput disabled={!permissions.edit} source="quote_accepted_date" variant="standard" fullWidth />
        </Grid>
        <Grid item md={4}>
          <DateInput disabled={!permissions.edit} source="engagement_date" variant="standard" fullWidth />
        </Grid>
        <Grid item md={4}>
          <DateInput
            disabled={!permissions.edit}
            label="Submitted for Review"
            source="submitted_date"
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item md={4}>
          <DateInput
            disabled={!permissions.edit}
            source="revision_request_date"
            label="Revision Request"
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item md={4}>
          <DateInput disabled={!permissions.edit} source="paid_date" variant="standard" fullWidth />
        </Grid>
        <Grid item md={4}>
          <DateInput disabled={!permissions.edit} source="on_hold_date" variant="standard" fullWidth />
        </Grid>
        <Grid item md={4}>
          <DateInput disabled={!permissions.edit} source="canceled_date" variant="standard" fullWidth />
        </Grid>
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Instructions
          </Typography>
        </Grid>
        <Grid item md={12}>
          <RichTextInput
            key={!permissions.edit}
            options={{ readOnly: !permissions.edit }}
            fullWidth
            source="notes"
            // rows={4}
            multiline
            variant="standard"
            label={null}
          />
        </Grid>
      </Grid>
    </>
  );
}
