import React, { useEffect } from 'react';
import { TextInput, required, email, UserIdentity } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import useTeamOptions from 'shared/hooks/useTeamOptions';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { elavatedRoles, rolesMapping } from 'shared/constants/roles';
import getTeamPermission from './permissions';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import { Grid, Divider, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { validatePhone } from 'shared/utils';

type TeamFormProps = {
  identity: UserIdentity;
};

function TeamForm(props: TeamFormProps) {
  const styles = makeStyles({
    divider: {
      marginBottom: '20px',
    },
    formBottom: {
      marginBottom: '15px',
      border: 'none',
    },
    heading: {
      marginTop: '30px',
    },
    headingFirst: {
      marginTop: '0px',
    },
    formContainer: {
      display: 'flow-root',
      width: '100%',
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
    cardRoot: {
      paddingRight: '10px',
      paddingLeft: '10px',
      marginBottom: '30px',
      paddingTop: '0px !important',
    },
    dialogContent: {
      padding: '8px 12px 12px 12px !important',
    },
    cardHeader: {
      marginLeft: '20px',
      '@media (max-width: 600px)': {
        display: 'none',
      },
    },
    editActions: {
      marginTop: '16px',
      justifyContent: 'space-between',
    },
  });
  const classes = styles();

  const { identity } = props;
  const { role } = identity;
  const [options] = useTeamOptions();
  const [{ permissions, formData }] = useFormPermissions({ getPermission: getTeamPermission });
  const notCurrentUser = identity?.id !== formData?.user_account_id;
  const editRoleEnabled = canEditRole();

  useEffect(() => {
    setTimeout(() => {
      const toolbar = document.querySelector('.ql-toolbar') as any;
      const container = document.querySelector('.ql-container') as any;
      const editor = document.querySelector('.ql-editor') as any;
      if (toolbar && container && editor) {
        container.append(toolbar);
        container.style.border = 'none';
        editor.style.border = '1px solid rgba(0, 0, 0, 0.12)';
        editor.style.borderRadius = '3px';
      }
    }, 20);
  }, []);

  return (
    <Box className={classes.formContainer}>
      <Typography classes={{ root: classes.headingFirst }}>TEAM MEMBER</Typography>
      <Divider classes={{ root: classes.divider }}></Divider>
      <Grid container direction="column" alignItems="center">
        <Grid container item md={4}>
          <TextInput autoFocus variant="outlined" validate={[required()]} fullWidth label="Name" source="first_name" />
        </Grid>
        <Grid container item md={4}>
          <TextInput
            disabled={!permissions.edit}
            variant="outlined"
            fullWidth
            validate={[required(), email()]}
            source="user_account.email"
            label="Email"
          />
        </Grid>
        <Grid container item md={4}>
          <TextInput
            disabled={!permissions.edit}
            validate={validatePhone}
            label="Phone"
            variant="outlined"
            fullWidth
            source="phone_number"
          />
        </Grid>
        <Grid container item md={4}>
          <TextInput disabled={!permissions.edit} source="url" label="URL (Website)" variant="outlined" fullWidth />
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid container item md={4}></Grid>
        <Grid container item md={8}>
          <PlacesAutocomplete
            disabled={!permissions.edit}
            variant="outlined"
            autoFocus={false}
            label="Address"
            source="location_address"
            isMapVisible={false}
          />
        </Grid>
      </Grid>
      <Typography classes={{ root: classes.headingFirst }}>ACCESS</Typography>
      <Divider classes={{ root: classes.divider }}></Divider>
      {editRoleEnabled && (
        <>
          <Grid container direction="column" alignItems="center">
            <Grid container item md={4}>
              <AutocompleteInput
                label="Permissions"
                source="user_account.user_role_id"
                fullWidth
                optionText="display"
                variant="outlined"
                defaultValue={3}
                choices={(options.data?.roles ?? []).filter((e) => e.id !== 1 && e.id !== 2)}
              />
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item md={4}></Grid>
            <Grid container item md={8}>
              <Typography color="textSecondary" style={{ fontSize: '1.0rem', marginBottom: '15px' }} variant="caption">
                {options.data?.roles.find((role) => role.id === formData?.user_account?.user_role_id)?.description}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <Typography classes={{ root: classes.headingFirst }}>NOTES</Typography>
      <Divider classes={{ root: classes.divider }}></Divider>
      <Grid container direction="row">
        <Grid container item md={4}></Grid>
        <Grid container item md={8}>
          <RichTextInput
            options={{
              readOnly: false,
              placeholder: 'Additional Team Member information, fee splits, licensing, etc',
            }}
            fullWidth
            source="notes"
            multiline
            variant="outlined"
            label=""
            key={`text-${!permissions.edit}`}
          />
        </Grid>
      </Grid>
    </Box>
  );

  function isSuperiorRole() {
    if (!elavatedRoles.includes(role)) return false;
    return (
      elavatedRoles.indexOf(role) >=
      elavatedRoles.indexOf(rolesMapping?.[formData?.user_account?.user_role_id ?? 0] ?? '')
    );
  }

  function canEditRole() {
    if (!formData?.id) {
      return true;
    }
    return notCurrentUser && elavatedRoles.includes(role) && isSuperiorRole();
  }
}

export default TeamForm;
