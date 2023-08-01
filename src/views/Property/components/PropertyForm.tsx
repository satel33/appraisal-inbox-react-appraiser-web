import React from 'react';
import { TextInput } from 'react-admin';
import { YearInput } from 'shared/components/Pickers';
import RichTextInput from 'ra-input-rich-text';
import Grid from '@material-ui/core/Grid';
import AutocompleteInput from 'shared/components/AutocompleteInput';
import { Property } from 'views/Property/types';
import useAppraisalOptions from 'shared/hooks/useAppraisalOptions';
import Typography from '@material-ui/core/Typography';
// import CustomSelectInput from 'shared/components/CustomSelectInput';
import { makeStyles } from '@material-ui/core';

type PropertyFormProps = {
  prefix?: string;
  formData: Property;
  readOnly: boolean;
};
const useCustomStyle = makeStyles({
  centered: {
    display: 'flex',
    alignItems: 'center',
  },
});
function PropertyForm(props: PropertyFormProps) {
  const [appraisalOptions] = useAppraisalOptions();
  const classes = useCustomStyle();
  const { prefix = '', formData, readOnly } = props;
  return (
    <>
      <Grid container spacing={2}>
        {!prefix && (
          <>
            <Grid item md={12}>
              <Typography style={{ fontSize: '1rem' }} variant="h6">
                Type
              </Typography>
            </Grid>
            <Grid item md={4}>
              <AutocompleteInput
                label="Type"
                variant="standard"
                fullWidth
                source="property_type_id"
                optionText="type"
                choices={appraisalOptions.data?.propertyTypes ?? []}
                disabled={readOnly}
              />
            </Grid>
            {formData.property_type_id === 1 && (
              <>
                <Grid className={classes.centered} item md={4}>
                  <AutocompleteInput
                    label="Ownership"
                    variant="standard"
                    fullWidth
                    source={addPrefix('residential_ownership_type_id')}
                    optionText="type"
                    choices={appraisalOptions.data?.residentialOwnershipTypes ?? []}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid className={classes.centered} item md={4}>
                  <AutocompleteInput
                    label="Style"
                    fullWidth
                    variant="standard"
                    source={addPrefix('residential_style_id')}
                    optionText="style"
                    choices={appraisalOptions.data?.residentialStyles ?? []}
                    disabled={readOnly}
                  />
                </Grid>
              </>
            )}
            {formData.property_type_id === 2 && (
              <>
                <Grid className={classes.centered} item md={4}>
                  <AutocompleteInput
                    choices={appraisalOptions.data?.commercialPropertyTypes ?? []}
                    label="Property Type"
                    variant="standard"
                    fullWidth
                    source={addPrefix('commercial_property_type_id')}
                    optionText="type"
                    disabled={readOnly}
                  />
                </Grid>
                <Grid className={classes.centered} item md={4}>
                  <AutocompleteInput
                    label="Property Subtype"
                    fullWidth
                    source={addPrefix('commercial_property_subtype_id')}
                    optionText="subtype"
                    variant="standard"
                    disabled={readOnly}
                    choices={
                      appraisalOptions.data?.commercialPropertySubTypes.filter(
                        (e: any) =>
                          e.commercial_property_type_id === formData.property?.commercial_property_type_id ||
                          e.commercial_property_type_id === formData.commercial_property_type_id,
                      ) ?? []
                    }
                  />
                </Grid>
              </>
            )}
          </>
        )}
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Legal
          </Typography>
        </Grid>
        <Grid item md={4}>
          <TextInput
            disabled={readOnly}
            variant="standard"
            fullWidth
            source={addPrefix('parcel_number')}
            label="Parcel Number (APN)"
          />
        </Grid>
        <Grid item md={4}>
          <TextInput disabled={readOnly} variant="standard" fullWidth source={addPrefix('tax_id')} label="Tax ID" />
        </Grid>
        <Grid item md={4}>
          <TextInput
            variant="standard"
            fullWidth
            source={addPrefix('universal_property_identifier')}
            label="Universal Property Identifier"
            disabled={readOnly}
          />
        </Grid>
        <Grid item md={12}>
          <RichTextInput
            key={`${formData.id}-${readOnly}`}
            options={{ readOnly }}
            fullWidth
            source={addPrefix('legal_description')}
            multiline
            variant="standard"
            label="Legal Description"
          />
        </Grid>
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Land
          </Typography>
        </Grid>
        <Grid item md={4}>
          <TextInput disabled={readOnly} variant="standard" fullWidth source={addPrefix('zoning')} label="Zoning" />
        </Grid>
        <Grid item md={4}>
          <TextInput
            disabled={readOnly}
            variant="standard"
            fullWidth
            source={addPrefix('total_acres')}
            label="Total Acres"
            type="number"
          />
        </Grid>
        <Grid item md={4}>
          <TextInput disabled={readOnly} variant="standard" source={addPrefix('site')} fullWidth label="Site" />
        </Grid>
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Improvements
          </Typography>
        </Grid>
        {formData.property_type_id === 1 && (
          <>
            <Grid item md={4}>
              <YearInput disabled={readOnly} label="Year Built" source={addPrefix('year_built')} />
            </Grid>
            <Grid item md={4}>
              <YearInput disabled={readOnly} label="Year Renovated" source={addPrefix('year_renovated')} />
            </Grid>
            <Grid item md={4}>
              <TextInput disabled={readOnly} variant="standard" fullWidth source={addPrefix('view')} label="View" />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_above_grade_bedrooms')}
                label="Above Grade Bedrooms"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_above_grade_bathrooms')}
                label="Above Grade Bathrooms"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_gross_living_area')}
                label="Gross Living Area"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_below_grade_bedrooms')}
                label="Below Grade Bedrooms"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_below_grade_bathrooms')}
                label="Below Grade Bathrooms"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_basement_and_finished')}
                label="Basement and Finished"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_functional_utility')}
                label="Functional Utility"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_garage_carport')}
                label="Garage Carport"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_porch_patio_deck')}
                label="Porch Patio Deck"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('residential_fireplaces')}
                label="Fire Places"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                disabled={readOnly}
                variant="standard"
                fullWidth
                source={addPrefix('heating_cooling')}
                label="Heating & Cooling"
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('energy_efficient_items')}
                label="Energy Efficient Items"
                disabled={readOnly}
              />
            </Grid>
          </>
        )}
        {formData.property_type_id === 2 && (
          <>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('commercial_building_name')}
                label="Building Name"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <AutocompleteInput
                label="Building Class"
                fullWidth
                variant="standard"
                source={addPrefix('commercial_building_class_id')}
                optionText="class"
                choices={appraisalOptions.data?.commercialBuildingClass ?? []}
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('commercial_buildings')}
                label="Buildings"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('commercial_floors')}
                label="Floors"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('commercial_units')}
                label="Units"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <TextInput
                variant="standard"
                fullWidth
                source={addPrefix('commercial_gross_area')}
                label="Gross Area"
                type="number"
                disabled={readOnly}
              />
            </Grid>
            <Grid item md={4}>
              <YearInput label="Year Built" source={addPrefix('year_built')} disabled={readOnly} />
            </Grid>
            <Grid item md={4}>
              <YearInput label="Year Renovated" source={addPrefix('renovated')} disabled={readOnly} />
            </Grid>
            <Grid item md={4}>
              <TextInput variant="standard" fullWidth source={addPrefix('view')} label="View" disabled={readOnly} />
            </Grid>
          </>
        )}
        <Grid item md={12}>
          <Typography style={{ fontSize: '1rem' }} variant="h6">
            Notes
          </Typography>
        </Grid>
        <Grid item md={12}>
          <RichTextInput
            key={`${formData.id}-${readOnly}`}
            options={{ readOnly }}
            fullWidth
            source={addPrefix('notes')}
            multiline
            variant="standard"
            label={null}
          />
        </Grid>
      </Grid>
    </>
  );

  function addPrefix(field: string) {
    return [prefix, field].filter(Boolean).join('.');
  }
}

export default PropertyForm;
