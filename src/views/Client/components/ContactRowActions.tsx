import React from 'react';
import { EditButton, useUpdate, useNotify, FieldProps } from 'react-admin';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ButtonWithConfirm from 'shared/components/ButtonWithConfirm';
import { Contacts } from 'views/Contact/types';
import { standardMutationRoles } from 'shared/constants/roles';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getClientPermission from '../permissions';

const useStyles = makeStyles({
  remove: {
    '& svg': { color: 'red' },
    minWidth: '20px',
  },
  edit: {
    minWidth: '20px',
  },
});

type ContactRowActionsProps = FieldProps<Contacts> & {
  onSuccess(): void;
};
function ContactRowActions(props: ContactRowActionsProps) {
  const [{ permissions, identity }] = useFormPermissions({ getPermission: getClientPermission });
  const actionsEnabled = permissions.edit && standardMutationRoles.includes(identity?.role ?? '');
  const [update] = useUpdate('contact', props.record?.id);
  const notify = useNotify();
  const classes = useStyles();
  if (!actionsEnabled) return null;

  return (
    <Grid container>
      <Grid item>
        <EditButton className={classes.edit} {...props} size="small" label="" basePath="/contacts" />
      </Grid>
      <Grid item>
        <ButtonWithConfirm
          title={`Remove Contact ${props.record?.full_name}`}
          content="Are you sure you want to remove this contact from this Client?"
          btnClassname={classes.remove}
          onConfirm={onRemove}
        />
      </Grid>
    </Grid>
  );

  async function onRemove() {
    await update({
      payload: {
        data: {
          client_id: null,
        },
      },
    });
    props.onSuccess();
    notify('Contact successfully removed');
  }
}

export default ContactRowActions;
