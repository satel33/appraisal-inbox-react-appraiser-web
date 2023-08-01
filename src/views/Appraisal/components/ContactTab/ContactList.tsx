import React from 'react';
import ContactListActions from 'views/Appraisal/components/ContactTab/ContactListActions';
import AssignReferenceArrayField from 'shared/components/AssignReferenceArrayField';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Appraisals } from 'views/Appraisal/types';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from 'views/Appraisal/permission';
import { standardMutationRoles } from 'shared/constants/roles';
import ContactGrid from 'views/Contact/components/ContactGrid';
import AppraisalContactRowActions from './ContactRowActions';
import { TAB_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';

type ContactListProps = InjectedFieldProps<Appraisals> & PublicFieldProps;
function ContactList(props: ContactListProps) {
  const [{ permissions, identity }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const actionsEnabled = permissions.edit && standardMutationRoles.includes(identity?.role ?? '');
  const [key, setKey] = React.useState(1);
  return (
    <>
      {actionsEnabled && <ContactListActions {...props} fullWidth />}
      <AssignReferenceArrayField
        {...props}
        key={key}
        reference="contacts"
        source="contact_ids"
        pagination={<Pagination />}
        perPage={TAB_LIST_PER_PAGE}
        sort={{ field: 'full_name', order: 'asc' }}
        type="assigned"
      >
        <ContactGrid actionsRenderer={AppraisalContactRowActions} onSuccess={onSuccess} resource="contacts" />
      </AssignReferenceArrayField>
    </>
  );

  function onSuccess() {
    setKey((prev) => prev + 1);
  }
}

export default ContactList;
