import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Property } from 'views/Property/types';
import {
  Appraisal_Priorities,
  Appraisal_Purposes,
  Appraisal_Statuses,
  Commercial_Building_Classes,
  Commercial_Property_Subtype,
  Commercial_Property_Type,
  Loan_Types,
  Property_Types,
  Report_Types,
  Residential_Form_Types,
  Residential_Ownership_Types,
  Residential_Styles,
  User_Profiles,
} from 'shared/generated/types';

import { Client } from 'views/Client/types';
const OPTIONS_QUERY = gql`
  query AppraisalOptions {
    clients(order_by: { name: asc }) {
      id
      name
    }
    propertyTypes: property_types(order_by: { order: asc }) {
      id
      type
    }
    appraisalPurposes: appraisal_purposes(order_by: { order: asc }) {
      id
      purpose
    }
    loanTypes: loan_types(order_by: { order: asc }) {
      id
      type
    }
    residentialOwnershipTypes: residential_ownership_types(order_by: { order: asc }) {
      id
      type
    }
    residentialStyles: residential_styles(order_by: { order: asc }) {
      id
      style
    }
    reportTypes: report_types(order_by: { order: asc }) {
      id
      type
    }
    residentialFormTypes: residential_form_types(order_by: { order: asc }) {
      id
      type
    }
    commercialPropertyTypes: commercial_property_type(order_by: { order: asc }) {
      id
      type
    }
    commercialPropertySubTypes: commercial_property_subtype(order_by: { order: asc }) {
      id
      subtype
      commercial_property_type_id
    }
    appraisalStatuses: appraisal_statuses(order_by: { order: asc }) {
      id
      status
    }
    appraisalPriorities: appraisal_priorities(order_by: { order: asc }) {
      id
      priority
    }
    commercialBuildingClass: commercial_building_classes(order_by: { order: asc }) {
      id
      class
    }
    properties: properties(order_by: { parcel_number: asc }) {
      id
      parcel_number
      location_address
      location_geography
      commercial_property_type_id
    }
    assignees: user_profiles(order_by: { full_name: asc }) {
      id: user_account_id
      full_name
    }
  }
`;

const OPTIONS_ASSIGNEES_QUERY = gql`
  query AssigneesOptions {
    assignees: user_profiles(order_by: { full_name: asc }) {
      id: user_account_id
      full_name
    }
  }
`;

const ORGANIZATION_QUERY = gql`
  query getOrganization($id: uuid) {
    organization(where: { id: { _eq: $id } }) {
      user_accounts_active_count
    }
  }
`;

export type AppraisalOptionsResponse = {
  propertyTypes: Property_Types[];
  appraisalPurposes: Appraisal_Purposes[];
  loanTypes: Loan_Types[];
  residentialOwnershipTypes: Residential_Ownership_Types[];
  reportTypes: Report_Types[];
  residentialFormTypes: Residential_Form_Types[];
  commercialPropertyTypes: Commercial_Property_Type[];
  commercialPropertySubTypes: Commercial_Property_Subtype[];
  appraisalStatuses: Appraisal_Statuses[];
  appraisalPriorities: Appraisal_Priorities[];
  commercialBuildingClass: Commercial_Building_Classes[];
  residentialStyles: Residential_Styles[];
  properties: Property[];
  assignees: User_Profiles[];
  clients: Client[];
};

export type OrganizationOptionsResponse = {
  organization: { user_accounts_active_count: number }[];
};

export default function useAppraisalOptions() {
  const options = useQuery<AppraisalOptionsResponse>(OPTIONS_QUERY, { fetchPolicy: 'cache-first' });
  return [options] as const;
}
// Fetch assignees using network
// Sometimes appraisal will not be able to save if assignees options are not synchronized with backend
export function useAssigneesOptions() {
  const options = useQuery<{ assignees: User_Profiles[] }>(OPTIONS_ASSIGNEES_QUERY, { fetchPolicy: 'network-only' });
  return [options] as const;
}

export function useOrgnaizationOptions(props: { id: string }) {
  const options = useQuery<OrganizationOptionsResponse>(ORGANIZATION_QUERY, {
    fetchPolicy: 'cache-first',
    variables: props,
  });
  return [options] as const;
}
