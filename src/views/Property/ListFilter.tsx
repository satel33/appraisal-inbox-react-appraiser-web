import React from 'react';
import { BulkActionProps, Filter, FilterProps } from 'react-admin';
import { displayFields, Field } from 'shared/components/Resource/List';
import { filterFields } from './fields';
import { useFilterStyles } from 'shared/components/Resource/styles';
import usePersistentQueryString from 'shared/hooks/usePersistentQueryString';
import { onChangePropertyFilter } from 'views/Appraisal/ListFilter';
import useLocationQuery from 'shared/hooks/useLocationQuery';

export function PropertyTypeFilter(fields: Field[]) {
  function PropertyFilter(props: Omit<FilterProps, 'children'> & BulkActionProps) {
    const { filterValues } = props;
    const classes = useFilterStyles();
    usePersistentQueryString({ onChangeFilter: onChangePropertyFilter });
    const [isInteracted, setIsInteracted] = React.useState(false);
    const [, onChangeParams] = useLocationQuery();
    let displayFilterFields: Field[] = fields;
    if (filterValues.property_type_id === 1) {
      displayFilterFields = displayFilterFields.filter((e, index) => index === 0 || !e.source?.includes('commercial'));
    } else if (filterValues.property_type_id === 2) {
      displayFilterFields = displayFilterFields.filter((e, index) => index === 0 || !e.source?.includes('residential'));
      if (filterValues.commercial_property_type_id !== undefined) {
        displayFilterFields = displayFilterFields.map((e) =>
          e.source === 'commercial_property_subtype_id'
            ? { ...e, filter: { commercial_property_type_id: filterValues.commercial_property_type_id } }
            : e,
        );
      } else {
        displayFilterFields = displayFilterFields.filter((e) => e.source !== 'commercial_property_subtype_id');
      }
    } else {
      displayFilterFields = displayFilterFields.filter(
        (e, index) => index === 0 || (!e.source?.includes('residential') && !e.source?.includes('commercial')),
      );
    }
    React.useEffect(() => {
      setIsInteracted(true);
    }, [filterValues.property_type_id]);
    React.useEffect(() => {
      if (isInteracted) {
        const newFilters = onChangePropertyFilter(filterValues);
        onChangeParams({
          filter: JSON.stringify(onChangePropertyFilter(newFilters)),
        });
      }
    }, [filterValues.property_type_id]);
    return displayFields(Filter, { ...props, classes } as FilterProps, displayFilterFields);
  }
  return PropertyFilter;
}
export default PropertyTypeFilter(filterFields);
