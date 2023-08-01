import React from 'react';
import {
  useNotify,
  useMutation,
  Edit,
  ResourceContextProvider,
  TabbedFormTabs,
  useGetIdentity,
  EditProps,
  Record,
  TitleProps,
} from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import CustomTabbedForm from 'shared/components/Resource/CustomTabbedForm';
import FormTab from 'shared/components/Resource/FormTab';
import Toolbar from 'shared/components/Resource/Toolbar';
import omit from 'lodash/omit';
import FixedDisplayForm from './components/FixedDisplayForm';
import ContactList from 'views/Appraisal/components/ContactTab/ContactList';
import useAppraisalOptions from 'shared/hooks/useAppraisalOptions';
import { useDispatch } from 'react-redux';
import { FetchMenuCount } from './reducer';
import { Appraisal } from 'views/Appraisal/types';
import getAppraisalPermission from './permission';
import EngagementTab from './components/EngagementTab';
import PropertyTab from './components/PropertyTab';
import LocationTab from './components/LocationTab';
import TransactionsTab from './components/TransactionsTab';
import { standardMutationRoles } from 'shared/constants/roles';
import AppraisalPdf from './components/AppraisalPdf';
// import PdfTab from './components/PdfTab';
import { displayFormattedDate } from 'shared/utils';

const EditTitle = ({ record }: TitleProps) => (
  <span>Appraisal: {record ? getAppraisalTitle(record as Appraisal) : ''}</span>
);

const EditAppraisal = (props: EditProps) => {
  const dispatch = useDispatch();
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const onSuccess = () => {
    dispatch(FetchMenuCount());
    notify('appraisal.updated');
  };
  const [update] = useMutation({ type: 'update', resource: 'property', payload: {} });
  const [appraisalOptions] = useAppraisalOptions();

  if (!identity) {
    return <span />;
  }
  return (
    <ResourceContextProvider value="appraisal">
      <Edit
        {...props}
        onSuccess={onSuccess}
        transform={transform}
        title={<EditTitle />}
        actions={<EditAction />}
        resource="appraisal"
        mutationMode="optimistic"
      >
        <CustomTabbedForm
          toolbar={
            <Toolbar
              pdfTitleGetter={(record: Appraisal) =>
                `${getAppraisalTitle(record)}-${displayFormattedDate(new Date().toISOString(), 'MM-dd-yyyy')}`
                  .replace(/\W+/g, '-')
                  .toLowerCase() + '.pdf'
              }
              pdfRenderer={(props) => <AppraisalPdf {...props} />}
              getPermission={getAppraisalPermission}
            />
          }
          fixedDisplay={<FixedDisplayForm appraisalOptions={appraisalOptions} />}
          redirect={false}
          tabs={<TabbedFormTabs variant="scrollable" />}
        >
          <FormTab label="Overview">
            <EngagementTab />
          </FormTab>
          {/* <FormTab label="PDF PREVIEW">
            <PdfTab />
          </FormTab> */}
          <FormTab label="Location">
            <LocationTab />
          </FormTab>
          <FormTab label="Property">
            <PropertyTab />
          </FormTab>
          <FormTab label="Transactions">
            <TransactionsTab />
          </FormTab>
          <FormTab label="Contacts">
            <ContactList fullWidth />
          </FormTab>
        </CustomTabbedForm>
      </Edit>
    </ResourceContextProvider>
  );

  async function transform(data: Record) {
    const appraisal: Appraisal = {
      ...(data as Appraisal),
    };
    if (standardMutationRoles.includes(identity?.role ?? '')) {
      await update({
        payload: {
          id: appraisal.property.id,
          data: {
            ...omit(appraisal.property, 'id', 'organization_id', 'user_account_id', 'updated_by_user_account_id'),
            property_type_id: appraisal.property_type_id,
          },
        },
      });
    }
    return omit(appraisal, 'property', 'assignee_user_account_names') as Record;
  }
};

function getAppraisalTitle(record: Appraisal) {
  return [record.appraisal_file_number, record.property.location_address].filter(Boolean).join(' - ');
}
export default EditAppraisal;
