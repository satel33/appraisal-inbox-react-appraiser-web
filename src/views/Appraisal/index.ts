import CreateAppraisalV2 from './CreateV2';
import Assignment from '@material-ui/icons/Assignment';
import EditAppraisal from './EditV2';
import AppraisalList from './List';

export default {
  name: 'appraisals',
  create: CreateAppraisalV2,
  edit: EditAppraisal,
  icon: Assignment,
  list: AppraisalList,
};
