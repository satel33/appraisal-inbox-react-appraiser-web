import { Card } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { ContactsLoadingSkeleton } from 'shared/components/AddressField/LoadingSkeleton/ContactsSkeleton';

import { styleRight } from 'shared/hooks/useEditFormStyle';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getAppraisalPermission from 'views/Appraisal/permission';
import ContactListEditable from 'views/Client/components/ContactListEditable';

export interface ContactsProps {
  formData: any;
}
export const Contacts = ({ formData }: ContactsProps) => {
  const formClasses = styleRight();

  const [contacts, setContacts] = useState<any>([]);
  const [clientTypeId, setClientTypeId] = useState<any>([]);
  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const dataProvider = useDataProvider();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.values.contact_ids) {
      setLoading(true);
      dataProvider.getMany('contacts', { ids: formData.values.contact_ids }).then(({ data }) => {
        setContacts(
          data.map((item: any) => ({
            id: item.id,
            name: `${item.first_name} ${item.last_name}`,
            email: item.email,
            phone: item.phone_number,
            appraisalsCount: item.appraisals_count,
            contact_type_id: item.contact_type_id,
            type: item.type,
          })),
        );
        setLoading(false);
      });
    }
    if (formData.values.client_id) {
      dataProvider.getOne('client', { id: formData.values.client_id }).then(({ data }) => {
        setClientTypeId(data.client_type_id);
      });
    }
  }, []);

  return (
    <Card variant="outlined" classes={{ root: formClasses.card }} style={{ marginTop: '30px' }}>
      {loading ? (
        <ContactsLoadingSkeleton />
      ) : (
        <ContactListEditable
          initialContacts={contacts}
          clientTypeId={clientTypeId}
          clientId={formData.values.client_id}
          appraisal={formData.values}
          edit={permissions.edit}
          delet={permissions.delete}
        />
      )}
    </Card>
  );
};
