import React from 'react';
import { TextInput, required, email, BooleanInput, UserIdentity } from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import Grid from '@material-ui/core/Grid';
import useTeamOptions from 'shared/hooks/useTeamOptions';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { elavatedRoles, rolesMapping } from 'shared/constants/roles';
import UrlInput from 'shared/components/UrlInput';
import getTeamPermission from './permissions';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import Typography from '@material-ui/core/Typography';

type TeamFormProps = {
  identity: UserIdentity;
};

function TeamForm(props: TeamFormProps) {
  const { identity } = props;
  const { role } = identity;
  const [options] = useTeamOptions();
  const [{ permissions, formData }] = useFormPermissions({ getPermission: getTeamPermission });
  const notCurrentUser = identity?.id !== formData?.user_account_id;
  const editRoleEnabled = canEditRole();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <TextInput
            disabled={!permissions.edit}
            variant="standard"
            validate={[required()]}
            fullWidth
            source="first_name"
          />
        </Grid>
        <Grid item md={6}>
          <TextInput disabled={!permissions.edit} variant="standard" fullWidth source="last_name" />
        </Grid>
        <Grid item md={6}>
          <TextInput disabled={!permissions.edit} label="Phone" variant="standard" fullWidth source="phone_number" />
        </Grid>
        <Grid item md={6}>
          <TextInput
            disabled={!permissions.edit}
            variant="standard"
            fullWidth
            validate={[required(), email()]}
            source="user_account.email"
            label="Email"
          />
        </Grid>
        <Grid item md={6}>
          <Grid container>
            <Grid item md={12}>
              <PlacesAutocomplete disabled={!permissions.edit} isMapVisible={false} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6}>
          <UrlInput disabled={!permissions.edit} label="URL (Website)" variant="standard" fullWidth source="url" />
        </Grid>
        <Grid item md={12}>
          <RichTextInput
            options={{ readOnly: !permissions.edit }}
            fullWidth
            source="notes"
            multiline
            variant="standard"
            label="Notes"
            key={`text-${!permissions.edit}`}
          />
        </Grid>
        {editRoleEnabled && (
          <Grid alignItems="center" container spacing={2} item md={12}>
            <Grid item md={6}>
              <AutocompleteInput
                label="Role"
                source="user_account.user_role_id"
                fullWidth
                optionText="display"
                variant="standard"
                defaultValue={3}
                choices={(options.data?.roles ?? []).filter((e) => e.id !== 1 && e.id !== 2)}
              />
            </Grid>
            <Grid item md={6}>
              <Typography color="textSecondary" style={{ fontSize: '1.0rem' }} variant="caption">
                {options.data?.roles.find((role) => role.id === formData?.user_account?.user_role_id)?.description}
              </Typography>
            </Grid>
          </Grid>
        )}
        {canEditStatus() && (
          <Grid container>
            <Grid item md={6}>
              <BooleanInput label="Active" source="user_account.enabled" />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
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

  function canEditStatus() {
    return notCurrentUser && isSuperiorRole();
  }
}

export default TeamForm;
