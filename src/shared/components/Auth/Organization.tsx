import React, { useCallback, useState } from 'react';
import { Edit, SimpleForm, useNotify, useGetIdentity, ResourceComponentInjectedProps, required } from 'react-admin';
import debounce from 'lodash/debounce';
import { useForm, useFormState } from 'react-final-form';
import Grid from '@material-ui/core/Grid';
import { Box, Divider, InputAdornment, IconButton, Card } from '@material-ui/core';
import { TextInput } from 'react-admin';
import PageLoader from '../PageLoader';
import Typography from '@material-ui/core/Typography';
import { profileStyles, styleRight, simpleFormContainer } from 'shared/hooks/useEditFormStyle';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

function OrganizationPage(props: ResourceComponentInjectedProps) {
  const identityState = useGetIdentity();
  const classes = simpleFormContainer();
  const notify = useNotify();
  const onSuccess = () => {
    notify('Organization updated');
  };

  if (identityState.loading) {
    return <PageLoader />;
  }

  return (
    <Edit
      {...props}
      undoable={false}
      onSuccess={onSuccess}
      resource="organization"
      title="Settings: Account"
      id={identityState?.identity?.organization_id}
      basePath="/account/my-profile"
      mutationMode="pessimistic"
    >
      <SimpleForm {...props} toolbar={<span />} margin="none">
        <Box p={0} className={classes.formContainerOrganization}>
          <OrganizationForm identityState={identityState}></OrganizationForm>
        </Box>
      </SimpleForm>
    </Edit>
  );
}

function OrganizationForm(props: any) {
  const classes = styleRight();
  const formData = useFormState();
  const profileClasses = profileStyles();
  const form = useForm();
  const [edit, setEdit] = useState(false);
  const getDefaultFields = (initialValue: boolean) => ({
    name: initialValue,
  });
  const [fields, setFields] = useState<any>(getDefaultFields(false));
  const setAllFields = (val: boolean) => {
    setFields(getDefaultFields(val));
    setEdit(val);
  };
  const save = useCallback(debounce(form.submit, 0), []);
  return (
    <Card variant="outlined" classes={{ root: classes.card }}>
      <Box className={`${classes.flexBox} ${profileClasses.userAccountBox}`}>
        <Typography classes={{ root: `${profileClasses.userAccountHeading} ${classes.heading500}` }}>
          ORGANIZATION
        </Typography>
        {props.identityState.identity.role === 'appraisal_firm_account_owner' && !edit && (
          <IconButton
            className={classes.topEditBtnProfile}
            edge="end"
            disabled={edit}
            onClick={() => setAllFields(true)}
          >
            <EditIcon classes={{ root: classes.icon }} />
          </IconButton>
        )}
        {edit && (
          <IconButton
            classes={{ root: classes.topEditBtnProfile }}
            disabled={!edit}
            edge="end"
            onClick={() => {
              setEdit(false);
              setAllFields(false);
            }}
          >
            <CloseIcon classes={{ root: classes.icon }} />
          </IconButton>
        )}
      </Box>{' '}
      <Divider classes={{ root: classes.dividerMB }}></Divider>
      <Grid container direction="row" alignItems="center">
        <Grid item md={4} sm={1} xs={1}></Grid>
        <Grid item md={4} sm={3} xs={3}>
          <Typography classes={{ root: `${classes.heading400}` }}>Name</Typography>
        </Grid>
        <Grid item md={4} sm={6} xs={8}>
          <Box pr={2}>
            <TextInput
              defaultValue="Click pencil to set"
              size="small"
              color="secondary"
              InputProps={{
                placeholder: 'Click pencil to edit',
                classes: {
                  root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                    fields.name ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
                  }`,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      className={classes.fieldEditBtn}
                      edge="end"
                      disabled={fields.name && !formData.dirtyFields.name}
                    >
                      {fields.name && formData.dirtyFields.name && (
                        <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                      )}
                      &nbsp;
                      {fields.name && formData.dirtyFields.name && (
                        <CloseIcon
                          fontSize="small"
                          classes={{ root: classes.icon }}
                          onClick={() => form.change('name', formData.initialValues.name)}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{ style: { display: 'none' } }}
              variant="outlined"
              disabled={!fields.name}
              validate={required()}
              fullWidth
              label=""
              source="name"
            />
          </Box>
        </Grid>
      </Grid>
      <Box className={profileClasses.orgMB}></Box>
    </Card>
  );
}

export default OrganizationPage;
