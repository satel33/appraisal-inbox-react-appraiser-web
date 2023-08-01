import gql from 'graphql-tag';
import { buildFields } from 'ra-data-hasura';

const EXTENDED_APPRAISAL = gql`
  {
    property {
      id
      organization_id
      user_account_id
      updated_by_user_account_id
      property_type_id
      commercial_property_type_id
      commercial_property_subtype_id
      commercial_building_class_id
      residential_ownership_type_id
      residential_style_id
      location_address
      location_components
      location_geography
      location_city
      location_county
      location_state
      location_postal_code
      parcel_number
      universal_property_identifier
      subdivision
      legal_description
      tax_id
      zoning
      total_acres
      year_built
      year_renovated
      site
      heating_cooling
      energy_efficient_items
      commercial_building_name
      commercial_buildings
      commercial_floors
      commercial_units
      commercial_gross_area
      residential_above_grade_bedrooms
      residential_above_grade_bathrooms
      residential_below_grade_bedrooms
      residential_below_grade_bathrooms
      residential_gross_living_area
      residential_basement_and_finished
      residential_functional_utility
      residential_garage_carport
      residential_porch_patio_deck
      residential_fireplaces
      residential_other
      notes
    }
  }
`;

const EXTENDED_USER_PROFILE = gql`
  {
    user_account {
      id
      email
      user_role_id
      enabled
    }
  }
`;

const EXTENDED_USER_ACCOUNT = gql`
  {
    user_profile {
      id
      first_name
      last_name
      url
      notes
      phone_number
      location_address
      location_city
      location_components
      location_county
      location_geography
      location_postal_code
      location_state
    }
  }
`;

// const EXTENDED_CLIENT = gql`
//   {
//     contacts_aggregate {
//       aggregate {
//         count
//       }
//     }
//     appraisals_aggregate {
//       aggregate {
//         count
//       }
//     }
//   }
// `;

// const EXTENDED_CONTACT = gql`
//   {
//     appraisals_aggregate {
//       aggregate {
//         count
//       }
//     }
//   }
// `;

const extractFieldsFromQuery = (queryAst: any) => {
  return queryAst.definitions[0].selectionSet.selections;
};

const customBuildFields = (type: any, fetchType: any) => {
  const resourceName = type.name;

  // First take the default fields (all, but no related or nested).
  const defaultFields = buildFields(type, fetchType);

  if (resourceName === 'appraisal' && ['GET_ONE', 'UPDATE', 'CREATE'].includes(fetchType)) {
    defaultFields.push(...extractFieldsFromQuery(EXTENDED_APPRAISAL));
  }

  if (resourceName === 'user_profile' && ['GET_ONE', 'UPDATE'].includes(fetchType)) {
    defaultFields.push(...extractFieldsFromQuery(EXTENDED_USER_PROFILE));
  }

  if (resourceName === 'user_account' && ['GET_ONE'].includes(fetchType)) {
    defaultFields.push(...extractFieldsFromQuery(EXTENDED_USER_ACCOUNT));
  }

  return defaultFields;
};
export default customBuildFields;
