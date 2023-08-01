import ContactList from './List';
import CreateV2 from './CreateV2';
import Edit from './EditV2';
import ContactPhone from '@material-ui/icons/ContactPhone';
import withAuthRoute from 'shared/components/ProtectedRoute';

export default {
  name: 'contacts',
  list: withAuthRoute('contacts')(ContactList),
  create: withAuthRoute('contacts')(CreateV2),
  edit: withAuthRoute('contacts')(Edit),
  icon: ContactPhone,
};
