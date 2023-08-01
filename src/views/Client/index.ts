import ClientList from './List';
import CreateClientV2 from './CreateV2';
import EditClient from './EditV2';
import AccountBalance from '@material-ui/icons/AccountBalance';
import withAuthRoute from 'shared/components/ProtectedRoute';

export default {
  name: 'clients',
  list: withAuthRoute('clients')(ClientList),
  create: withAuthRoute('clients')(CreateClientV2),
  edit: withAuthRoute('clients')(EditClient),
  icon: AccountBalance,
};
