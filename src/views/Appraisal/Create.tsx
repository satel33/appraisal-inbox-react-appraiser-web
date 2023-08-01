import React, { useEffect, useState } from 'react';
import {
  SimpleForm,
  required,
  useNotify,
  Create,
  ResourceContextProvider,
  useRedirect,
  useGetIdentity,
  CreateProps,
  Record,
  useInput,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import PlacesAutocomplete from 'shared/components/PlacesAutocomplete';
import FixedDisplayForm from './components/FixedDisplayForm';
import Toolbar from 'shared/components/Resource/Toolbar';
import useAppraisalOptions, { AppraisalOptionsResponse } from 'shared/hooks/useAppraisalOptions';
import { useDispatch } from 'react-redux';
import { FetchMenuCount } from './reducer';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import omit from 'lodash/omit';
// import Fuse from 'fuse.js';
import EditAction from 'shared/components/Resource/EditAction';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import { Appraisal } from 'views/Appraisal/types';
import { Property } from 'shared/generated/types';
import { QueryResult } from '@apollo/client';
import getAppraisalPermission from './permission';
// import getDistance from 'geolib/es/getDistance';
import { incrementFileNumber } from 'shared/utils';
import useLastAppraisal from 'shared/hooks/useLastAppraisal';

const INSERT_PROPERTY = gql`
  mutation insert_property($object: property_insert_input!) {
    property: insert_property_one(object: $object) {
      id
    }
  }
`;

const CreateAppraisal = (props: CreateProps) => {
  const { identity } = useGetIdentity();
  const dispatch = useDispatch();
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutation] = useMutation<{ property: Property }>(INSERT_PROPERTY);
  if (!identity) {
    return <span />;
  }
  return (
    <ResourceContextProvider value="appraisal">
      <Create {...props} actions={<EditAction />} onSuccess={onSuccess} transform={transform} resource="appraisal">
        <CreateAppraisalFields />
      </Create>
    </ResourceContextProvider>
  );

  function onSuccess({ data }: { data: Appraisal }) {
    dispatch(FetchMenuCount());
    notify('appraisal.created');
    redirect(`/appraisals/${data.id}`);
  }

  async function transform(data: Record) {
    let newAppraisal: Appraisal = {
      ...(data as Appraisal),
    };
    if (!newAppraisal.property_id) {
      let residentialOwnershipType = null;
      if (newAppraisal.property_type_id === 1) {
        residentialOwnershipType = 1;
      }
      const response = await mutation({
        variables: {
          object: {
            ...newAppraisal.property,
            property_type_id: newAppraisal.property_type_id,
            residential_ownership_type_id: residentialOwnershipType,
          },
        },
      });
      newAppraisal = {
        ...omit(newAppraisal, 'property'),
        property_id: response?.data?.property?.id,
      } as Appraisal;
    } else {
      newAppraisal = {
        ...omit(newAppraisal, 'property'),
      } as Appraisal;
    }
    return newAppraisal;
  }
};

type PropertyFieldProps = {
  setIsExistingProperty(arg: boolean): void;
  appraisalOptions: QueryResult<AppraisalOptionsResponse>;
};

function CreateAppraisalFields(props: any) {
  const [appraisalOptions] = useAppraisalOptions();
  const [query] = useLocationQuery();
  const [isExistingProperty, setIsExistingProperty] = useState(Boolean(query.property_id));

  return (
    <SimpleForm
      {...props}
      initialValues={{
        appraisal_status_id: 1,
        appraisal_priority_id: 1,
      }}
      toolbar={<Toolbar getPermission={getAppraisalPermission} />}
    >
      <>
        <Grid container spacing={2}>
          <Grid item md={8} container spacing={2}>
            <Grid item md={12}>
              <PropertyField setIsExistingProperty={setIsExistingProperty} appraisalOptions={appraisalOptions} />
            </Grid>
          </Grid>
          <Grid item md={4}>
            <FixedDisplayForm isExistingProperty={isExistingProperty} isCreate appraisalOptions={appraisalOptions} />
          </Grid>
        </Grid>
      </>
    </SimpleForm>
  );
}

function PropertyField(props: PropertyFieldProps) {
  const { appraisalOptions, setIsExistingProperty } = props;
  const locationAddress = useInput({ source: 'property.location_address' });
  const locationGeography = useInput({ source: 'property.location_geography' });
  const propertyType = useInput({ source: 'property_type_id' });
  const propertyId = useInput({ source: 'property_id' });
  const fileNumberField = useInput({ source: 'appraisal_file_number' });
  // const fuse = new Fuse<Property>(appraisalOptions.data?.properties ?? [], {
  //   keys: ['location_address'],
  //   location: 0,
  //   threshold: 0.2,
  // });
  const [query] = useLocationQuery();
  const [autoCompleteKey, setAutoCompleteKey] = useState(1);
  // useEffect(() => {
  //   if (locationAddress.input.value && locationGeography.input.value) {
  //     const [match] = fuse.search(removeCountry(locationAddress.input.value));
  //     const geog = JSON.parse(locationGeography.input.value);
  //     if (match) {
  //       const matchCoordinates = getCoordinates(match.item.location_geography);
  //       const inputCoordiantes = getCoordinates(geog);
  //       const distance = getDistance(
  //         {
  //           latitude: matchCoordinates[0],
  //           longitude: matchCoordinates[1],
  //         },
  //         {
  //           latitude: inputCoordiantes[0],
  //           longitude: inputCoordiantes[1],
  //         },
  //         0.01,
  //       );
  //       console.log('distance', distance);
  //       const { item } = match;
  //       propertyId.input.onChange(item.id);
  //       propertyType.input.onChange(item.commercial_property_type_id !== null ? 2 : 1);
  //       setIsExistingProperty(true);
  //     } else {
  //       clearPropertyType();
  //     }
  //   } else {
  //     clearPropertyType();
  //   }
  // }, [locationAddress.input.value, locationGeography.input.value]);
  const lastAppraisalQuery = useLastAppraisal();
  useEffect(() => {
    if (lastAppraisalQuery.data?.appraisal?.length) {
      const appraisalFileNumber = lastAppraisalQuery.data?.appraisal[0].appraisal_file_number;
      fileNumberField.input.onChange(incrementFileNumber(appraisalFileNumber === null ? '' : appraisalFileNumber));
      propertyType.input.onChange(lastAppraisalQuery.data?.appraisal[0].property_type_id);
    }
  }, [lastAppraisalQuery.data]);
  useEffect(() => {
    if (query.property_id && appraisalOptions.data) {
      const item = appraisalOptions.data?.properties.find((e) => e.id === query.property_id);
      if (item) {
        locationAddress.input.onChange(item.location_address);
        setIsExistingProperty(true);
        setAutoCompleteKey((prev) => prev + 1);
        setTimeout(() => {
          locationGeography.input.onChange(item.location_geography);
          propertyId.input.onChange(item.id);
          propertyType.input.onChange(item.commercial_property_type_id !== null ? 2 : 1);
        }, 1000);
      }
    }
  }, [appraisalOptions.data]);
  return (
    <Grid item md={12}>
      <PlacesAutocomplete
        disabled={Boolean(query.property_id)}
        key={autoCompleteKey}
        height="calc(100vh - 345px)"
        prefix="property"
        isRequired
        validate={required()}
        xlCols={12}
      />
    </Grid>
  );

  // function clearPropertyType() {
  //   if (query.property_id) {
  //     return;
  //   }
  //   propertyId.input.onChange('');
  //   propertyType.input.onChange('');
  //   setIsExistingProperty(false);
  // }
}

// function removeCountry(address: string) {
//   const parts = address.split(', ');
//   return address
//     .split(', ')
//     .slice(0, parts.length - 1)
//     .join(', ')
//     .trim();
// }

export default CreateAppraisal;
