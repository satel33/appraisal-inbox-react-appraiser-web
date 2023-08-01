import { Datagrid, DatagridProps, TextField } from 'ra-ui-materialui';
import React from 'react';
import { withGridLoader } from 'shared/components/TablePreloader';
import YearField from 'shared/components/YearField';
import AssessmentListRowActions from './AssessmentListRowActions';

type AssessmentGridProps = DatagridProps & {
  onSuccess?(): void;
  readOnly?: boolean;
};

function AssessmentGrid(props: AssessmentGridProps) {
  const { onSuccess, readOnly, ...restProps } = props;
  return (
    <Datagrid {...restProps}>
      <YearField source="year" label="Year" />
      <TextField source="land_value" label="Land" />
      <TextField source="building_value" label="Building" />
      <TextField source="other_value" label="Other" />
      <TextField source="taxes" label="Taxes" />
      <AssessmentListRowActions readOnly={readOnly} onSuccess={onSuccess} />
    </Datagrid>
  );
}

export default withGridLoader({ showEmpty: false })(AssessmentGrid);
