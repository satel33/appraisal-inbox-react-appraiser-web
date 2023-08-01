import React from 'react';
import { Edit, ResourceContextProvider, TabbedForm, useNotify, TitleProps, EditProps } from 'react-admin';
import EditAction from 'shared/components/Resource/EditAction';
import FormTab from 'shared/components/Resource/FormTab';
import Toolbar from 'shared/components/Resource/Toolbar';
import AppraisalList from 'views/Property/components/AppraisalList';
import PropertyTab from './components/PropertyTab';
import AssessmentTab from './components/AssessmentTab';
import TransactionTab from './components/TransactionTab';
import getPropertyPermission from './permission';
import LocationTab from './components/LocationTab';

const EditTitle = ({ record }: TitleProps) => (
  <span>
    Property: {record ? `${[record.parcel_number, record.location_address].filter(Boolean).join(' - ')}` : ''}
  </span>
);

function EditProperty(props: EditProps) {
  const notify = useNotify();
  return (
    <ResourceContextProvider value="property">
      <Edit
        {...props}
        undoable={false}
        onSuccess={onSuccess}
        title={<EditTitle />}
        actions={<EditAction />}
        resource="property"
      >
        <TabbedForm redirect={false} toolbar={<Toolbar getPermission={getPropertyPermission} />}>
          <FormTab label="Overview">
            <PropertyTab />
          </FormTab>
          <FormTab label="Location">
            <LocationTab />
          </FormTab>
          <FormTab label="Appraisals">
            <AppraisalList fullWidth />
          </FormTab>
          <FormTab label="Assessments">
            <AssessmentTab />
          </FormTab>
          <FormTab label="Transactions">
            <TransactionTab />
          </FormTab>
        </TabbedForm>
      </Edit>
    </ResourceContextProvider>
  );

  function onSuccess() {
    notify('property.updated');
  }
}

export default EditProperty;
