import React from 'react';
import {
  useNotify,
  Edit,
  ResourceContextProvider,
  useGetIdentity,
  TitleProps,
  EditProps,
  useMutation,
  Record,
} from 'react-admin';
import TeamForm from './TeamEditForm';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const EditTitle = ({ record }: TitleProps) => (
  <span>Team Member: {record ? `${[record.first_name, record.last_name].filter(Boolean).join(' ')}` : ''}</span>
);

const EditClient = (props: EditProps): JSX.Element => {
  const { identity } = useGetIdentity();
  const notify = useNotify();

  const onSuccess = () => {
    notify('team.updated');
  };

  const [update] = useMutation({ type: 'update', resource: 'user_account', payload: {} });

  if (!identity) {
    return (
      <Grid container direction="column" alignItems="center" style={{ marginTop: '20px' }}>
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <ResourceContextProvider value="user_profile">
      <Edit
        {...props}
        title={<EditTitle />}
        onSuccess={onSuccess}
        transform={transform}
        resource="user_profile"
        mutationMode="pessimistic"
      >
        <TeamForm identity={identity} />
      </Edit>
    </ResourceContextProvider>
  );

  async function transform(data: Record) {
    const name = data.name.split(' ');
    data.first_name = name[0];
    data.last_name = name.slice(1).join(' ');
    await update({
      payload: {
        id: data.user_account_id,
        data: pick(data.user_account, 'email', 'user_role_id', 'enabled', 'id'),
      },
    });
    return omit(data, 'user_account') as Record;
  }
};

export default EditClient;
