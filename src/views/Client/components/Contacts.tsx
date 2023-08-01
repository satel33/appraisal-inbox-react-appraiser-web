import { Card } from '@material-ui/core';
import React, { useEffect } from 'react';
import { ContactsLoadingSkeleton } from 'shared/components/AddressField/LoadingSkeleton/ContactsSkeleton';
import useContactOptions from 'shared/hooks/useClientOptions';
import { styleRight } from 'shared/hooks/useEditFormStyle';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import ContactListEditable from '../components/ContactListEditable';
import getClientPermission from '../permissions';

interface Props {
  formData: any;
}

export const ContactTab = ({ formData }: Props) => {
  const formClasses = styleRight();

  const [{ permissions }] = useFormPermissions({ getPermission: getClientPermission });

  const [options] = useContactOptions({ client_id: formData.values.id });

  const getContacts = () => {
    return (options?.data?.contacts || []).map((item: any) => ({
      id: item.id,
      name: `${item.first_name} ${item.last_name}`,
      email: item.email,
      phone: item.phone_number,
      appraisalsCount: item.appraisals_count,
      contact_type_id: item.contact_type_id,
      type: item.type,
      primary: item.primary,
    }));
  };

  useEffect(() => {
    options.refetch();
  }, []);

  return (
    <Card variant="outlined" classes={{ root: formClasses.card }} style={{ marginTop: '30px' }}>
      {options.loading ? (
        <ContactsLoadingSkeleton />
      ) : (
        <ContactListEditable
          initialContacts={getContacts()}
          clientTypeId={formData.values.client_type_id}
          clientId={formData.values.id}
          contactsCount={formData.values.contacts_count}
          edit={permissions.edit}
          delet={permissions.delete}
        />
      )}
    </Card>
  );
};
