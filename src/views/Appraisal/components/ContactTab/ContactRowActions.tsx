import React from 'react';
import { EditButton, useUpdate, useNotify, FieldProps } from 'react-admin';
import { useForm } from 'react-final-form';
import Grid from '@material-ui/core/Grid';
import ButtonWithConfirm from 'shared/components/ButtonWithConfirm';
import { Contacts } from '../../../Contact/types';
import { standardMutationRoles } from 'shared/constants/roles';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from 'views/Appraisal/permission';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  remove: {
    '& svg': { color: 'red' },
    minWidth: '20px',
  },
  edit: {
    minWidth: '20px',
  },
});

function AppraisalContactRowActions(props: FieldProps<Contacts>) {
  const [{ permissions, identity, formData }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const actionsEnabled = permissions.edit && standardMutationRoles.includes(identity?.role ?? '');
  const form = useForm();
  const appraisal = formData;
  const currentIds = appraisal?.contact_ids ?? [];
  const [update] = useUpdate('appraisal', appraisal?.id);
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
          content="Are you sure you want to remove this contact from this Appraisal?"
          btnClassname={classes.remove}
          onConfirm={onRemove}
        />
      </Grid>
    </Grid>
  );

  async function onRemove() {
    const newIds = currentIds.filter((e: string) => e !== props.record?.id);
    await update({
      payload: {
        data: {
          contact_ids: newIds,
        },
      },
    });
    form.change('contact_ids', newIds);
    notify('Contact successfully removed');
  }
}

export default AppraisalContactRowActions;
