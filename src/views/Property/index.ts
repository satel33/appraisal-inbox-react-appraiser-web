import HomeWork from '@material-ui/icons/HomeWork';
import CreateProperty from './Create';
import EditProperty from './Edit';
import PropertyList from './List';

export default {
  name: 'properties',
  icon: HomeWork,
  list: PropertyList,
  create: CreateProperty,
  edit: EditProperty,
};
