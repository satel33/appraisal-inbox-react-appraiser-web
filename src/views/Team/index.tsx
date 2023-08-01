import List from './List';
import CreateV2 from './CreateV2';
import Edit from './EditV2';
import Group from '@material-ui/icons/Group';
import withAuthRoute from 'shared/components/ProtectedRoute';

export default {
  name: 'team',
  list: withAuthRoute('team')(List),
  icon: Group,
  create: withAuthRoute('team')(CreateV2),
  edit: withAuthRoute('team')(Edit),
};
