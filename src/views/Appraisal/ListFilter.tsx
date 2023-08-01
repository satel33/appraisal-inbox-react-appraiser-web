import React from 'react';
import { BulkActionProps, Filter, FilterProps, useGetIdentity } from 'react-admin';
import { displayFields, Field } from 'shared/components/Resource/List';
import { filterFields } from './fields';
import { useFilterStyles } from 'shared/components/Resource/styles';
import { transform } from 'shared/utils';
import pick from 'lodash/pick';
import usePersistentQueryString from 'shared/hooks/usePersistentQueryString';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import { useLocation } from 'react-router-dom';
import useAppraisalOptions from 'shared/hooks/useAppraisalOptions';

type FilterValues = {
  [key: string]: any;
};

export function onChangePropertyFilter(filters: FilterValues) {
  const retainFilters = pick(filters, ['appraisal_status_id']);
  let newFilters = { ...filters };
  if (newFilters.property_type_id === 1) {
    newFilters = transform(newFilters, (val: any, key: string) => !['commercial'].some((e) => key.includes(e)));
  } else if (newFilters.property_type_id === 2) {
    newFilters = transform(newFilters, (val: any, key: string) => !['residential'].some((e) => key.includes(e)));
  } else {
    newFilters = transform(
      newFilters,
      (val: any, key: string) => !key.includes('commercial') && !key.includes('residential'),
    );
  }
  return {
    ...newFilters,
    ...retainFilters,
  };
}

export default (
  props: Omit<FilterProps, 'children'> & BulkActionProps & { isCalendar?: boolean; isInsight?: boolean },
) => {
  const { isCalendar, isInsight, ...restProps } = props;
  const { filterValues } = props;
  const classes = useFilterStyles();
  const location = useLocation();
  const [qs, onChangeParams] = useLocationQuery();
  usePersistentQueryString({
    onChangeFilter: onChangePropertyFilter,
  });
  const { identity } = useGetIdentity();
  const [isInteracted, setIsInteracted] = React.useState(false);
  const [appraisalOptions] = useAppraisalOptions();
  const filters = qs.filter ? JSON.parse(qs.filter) : {};
  let displayFilterFields: Field[] = filterFields;
  if (filters.property_type_id === 1) {
    displayFilterFields = displayFilterFields.filter((e) => !e.source?.includes('commercial'));
  } else if (filters.property_type_id === 2) {
    displayFilterFields = displayFilterFields.filter((e) => !e.source?.includes('residential'));
    if (filters.commercial_property_type_id !== undefined) {
      displayFilterFields = displayFilterFields.map((e) =>
        e.source === 'commercial_property_subtype_id'
          ? { ...e, filter: { commercial_property_type_id: filters.commercial_property_type_id } }
          : e,
      );
    } else {
      displayFilterFields = displayFilterFields.filter((e) => e.source !== 'commercial_property_subtype_id');
    }
  } else {
    displayFilterFields = displayFilterFields.filter(
      (e) => !e.source?.includes('residential') && !e.source?.includes('commercial'),
    );
  }
  if (isInsight) {
    displayFilterFields = displayFilterFields.filter((e) => e.type !== 'TextInput');
  }
  if (isCalendar) {
    displayFilterFields = displayFilterFields.filter((e) => !e.source?.includes('_date'));
  }
  if (Object.keys(filterValues?.inspection_date?.value ?? {}).includes('_is_null')) {
    displayFilterFields = displayFilterFields.filter((e) => e.source !== 'inspection_date');
  }
  if (['appraisal_firm_limited_access', 'appraisal_firm_restricted_access'].includes(identity?.role)) {
    displayFilterFields = displayFilterFields.filter((e) => e.source !== 'assignee_user_account_ids');
  }
  if (location.pathname === '/appraisals/unassigned') {
    displayFilterFields = displayFilterFields.filter((e) => e.source !== 'assignee_user_account_ids');
  }

  // remove alwaysOn assignee filter if not assignee exists
  if ((appraisalOptions?.data?.assignees?.length ?? 0) < 2) {
    displayFilterFields = displayFilterFields.map((e) => {
      if (e.source === 'assignee_user_account_ids') {
        return {
          ...e,
          alwaysOn: false,
        };
      }
      return e;
    });
  }
  React.useEffect(() => {
    setIsInteracted(true);
  }, [filterValues.property_type_id]);
  React.useEffect(() => {
    if (isInteracted) {
      const currentFilter = qs?.filter ?? '{}';
      const newFilters = onChangePropertyFilter(JSON.parse(currentFilter));
      onChangeParams({
        filter: JSON.stringify(onChangePropertyFilter(newFilters)),
      });
    }
  }, [filterValues.property_type_id]);
  return displayFields(Filter, { ...restProps, classes } as FilterProps, displayFilterFields);
};
