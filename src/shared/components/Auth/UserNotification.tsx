import React, { useState, useEffect } from 'react';
import {
  Edit,
  SimpleForm,
  BooleanInput,
  useNotify,
  useGetIdentity,
  ResourceComponentInjectedProps,
  useMutation,
} from 'react-admin';
import { useFormState } from 'react-final-form';
import Grid from '@material-ui/core/Grid';
import { Box, Divider, Card, IconButton } from '@material-ui/core';
import PageLoader from '../PageLoader';
import Typography from '@material-ui/core/Typography';
import { profileStyles, styleRight, simpleFormContainer } from 'shared/hooks/useEditFormStyle';
import useProfileOptions from 'shared/hooks/useProfileOptions';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

function UserNotificationPage(props: ResourceComponentInjectedProps) {
  const identityState = useGetIdentity();
  const classes = simpleFormContainer();
  const notify = useNotify();
  const onSuccess = () => {
    notify('Preferences updated');
  };

  const [{ data, loading }] = useProfileOptions({ user_account_id: identityState?.identity?.id + '' });

  if (identityState.loading || loading) {
    return <PageLoader />;
  }

  const preferences = data?.preference[0];

  return (
    <Edit
      {...props}
      undoable={false}
      onSuccess={onSuccess}
      resource="user_preference_notification"
      title="Settings: Preferences"
      id={preferences?.id + ''}
      basePath="/account/my-profile"
      mutationMode="optimistic"
    >
      <SimpleForm {...props} toolbar={<span />} margin="none">
        <Box p={0} className={classes.formContainerOrganization}>
          <PreferenceForm></PreferenceForm>
        </Box>
      </SimpleForm>
    </Edit>
  );
}

function PreferenceForm(props: any) {
  const notify = useNotify();
  const classes = styleRight();
  const formData = useFormState();
  const profileClasses = profileStyles();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [saveMutation] = useMutation({
    type: 'update',
    resource: 'user_preference_notification',
    payload: { id: formData.values.id, data: {} },
  });

  useEffect(() => {
    if (formData.dirty) {
      save();
    }
  }, [formData.values]);

  const save = () => {
    setSaving(true);
    saveMutation(
      {
        payload: {
          id: formData.values.id,
          data: formData.values,
        },
      },
      {
        onSuccess: () => {
          notify('Preferences updated');
          setSaving(false);
        },
      },
    );
  };

  return (
    <Card variant="outlined" classes={{ root: classes.card }}>
      <Box className={`${classes.flexBox} ${profileClasses.userAccountBox}`}>
        <Typography classes={{ root: `${profileClasses.userAccountHeading} ${classes.heading500}` }}>
          EMAIL NOTIFICATIONS
        </Typography>
        {!edit && (
          <IconButton className={classes.topEditBtnProfile} edge="end" disabled={edit} onClick={() => setEdit(true)}>
            <EditIcon classes={{ root: classes.icon }} />
          </IconButton>
        )}
        {edit && (
          <IconButton
            classes={{ root: classes.topEditBtnProfile }}
            disabled={!edit}
            edge="end"
            onClick={() => setEdit(false)}
          >
            <CloseIcon classes={{ root: classes.icon }} />
          </IconButton>
        )}
      </Box>
      <Divider classes={{ root: classes.dividerMB }}></Divider>
      <Grid container direction="row" alignItems="center">
        <Grid item md={4} sm={1} xs={12}></Grid>
        <Grid item md={4} sm={8} xs={10}>
          <Typography classes={{ root: `${classes.heading400} ${profileClasses.toggle}` }}>
            Receive daily agenda email (every morning)?
          </Typography>
        </Grid>
        <Grid item md={4} sm={3} xs={2}>
          <Typography classes={{ root: `${classes.inputFontWeight}` }}>
            <BooleanInput
              className={profileClasses.toggleDisabled}
              disabled={!edit || saving}
              label={formData.values.email_daily_agenda ? 'Yes' : 'No'}
              source="email_daily_agenda"
            />
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item md={4} sm={1} xs={12}></Grid>
        <Grid item md={4} sm={8} xs={10}>
          <Typography classes={{ root: `${classes.heading400} ${profileClasses.toggle}` }}>
            Receive email when appraisal is assigned?
          </Typography>
        </Grid>
        <Grid item md={4} sm={3} xs={2}>
          <Typography classes={{ root: `${classes.inputFontWeight}` }}>
            <BooleanInput
              className={profileClasses.toggleDisabled}
              disabled={!edit || saving}
              label={formData.values.email_assigned ? 'Yes' : 'No'}
              source="email_assigned"
            />
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

export default UserNotificationPage;
