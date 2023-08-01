import React, { useCallback, useEffect, useState } from 'react';
import { Edit, SimpleForm, useNotify, useGetIdentity, email } from 'react-admin';
import debounce from 'lodash/debounce';
import { useForm, useFormState } from 'react-final-form';
import Grid from '@material-ui/core/Grid';
import { Box, InputAdornment, IconButton } from '@material-ui/core';
import { TextInput } from 'react-admin';
import PageLoader from '../PageLoader';
import Typography from '@material-ui/core/Typography';
import { styleRight, simpleFormContainer } from 'shared/hooks/useEditFormStyle';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

function UserAccount(props: any) {
  const identityState = useGetIdentity();
  const classes = simpleFormContainer();
  const notify = useNotify();
  const onSuccess = () => {
    notify('Profile updated');
  };

  if (identityState.loading) {
    return <PageLoader />;
  }

  return (
    <Edit
      {...props}
      undoable={false}
      onSuccess={onSuccess}
      resource="user_account"
      title=" "
      id={identityState?.identity?.id + ''}
      basePath="/account/my-profile"
      mutationMode="pessimistic"
      className={classes.edit}
    >
      <SimpleForm {...props} toolbar={<span />} className={classes.simpleForm}>
        <AccountForm edit={props.edit}></AccountForm>
      </SimpleForm>
    </Edit>
  );
}

function AccountForm(props: any) {
  const classes = styleRight();
  const simpleFormClasses = simpleFormContainer();
  const formData = useFormState();
  const form = useForm();
  const getDefaultFields = (initialValue: boolean) => ({
    email: initialValue,
  });
  const [fields, setFields] = useState<any>(getDefaultFields(false));
  const save = useCallback(debounce(form.submit, 0), []);

  useEffect(() => {
    setFields(getDefaultFields(props.edit));
  }, [props.edit]);

  return (
    <Grid container direction="row" alignItems="center" className={simpleFormClasses.emailField}>
      <Grid item md={4} sm={1} xs={1}></Grid>
      <Grid item md={4} sm={3} xs={3}>
        <Typography classes={{ root: `${classes.heading400}` }}>Email</Typography>
      </Grid>
      <Grid item md={4} sm={6} xs={8}>
        <Box pr={2}>
          <TextInput
            size="small"
            InputProps={{
              placeholder: 'Click pencil to edit',
              classes: {
                root: `${classes.cssOutlinedInput} ${classes.inputFontWeight} ${
                  fields.email ? classes.cssOutlinedActive : classes.cssOutlinedDisabled
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
                    disabled={fields.email && !formData.dirtyFields.email}
                  >
                    {fields.email && formData.dirtyFields.email && (
                      <SaveIcon fontSize="small" classes={{ root: classes.icon }} onClick={() => save()} />
                    )}
                    &nbsp;
                    {fields.email && formData.dirtyFields.email && (
                      <CloseIcon
                        fontSize="small"
                        classes={{ root: classes.icon }}
                        onClick={() => form.change('email', formData.initialValues.email)}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            FormHelperTextProps={{ style: { display: 'none' } }}
            disabled={!fields.email}
            variant="outlined"
            label=""
            fullWidth
            source="email"
            validate={[email()]}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default UserAccount;
