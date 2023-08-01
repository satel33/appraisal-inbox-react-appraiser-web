import React from 'react';
import Grid from '@material-ui/core/Grid';
import { ReferenceManyField } from 'react-admin';
import CreateAssessmentButton from './CreateAssessmentButton';
import Typography from '@material-ui/core/Typography';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Property } from 'shared/generated/types';
import AssessmentGrid from './AssessmentGrid';
import { TAB_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';

type AssessmentListProps = PublicFieldProps &
  InjectedFieldProps<Property> & {
    readOnly: boolean;
  };

function AssessmentList(props: AssessmentListProps) {
  const { readOnly, ...restProps } = props;
  const [listKey, onReset] = React.useState(1);
  return (
    <>
      <Grid style={{ paddingBottom: '15px' }} container spacing={2}>
        <Grid item md={6}>
          <Typography style={{ fontSize: '1.1rem' }} variant="h6">
            Assessments
          </Typography>
        </Grid>
        {!readOnly && (
          <Grid container item md={6} justify="flex-end">
            <CreateAssessmentButton onSuccess={() => onReset((prev) => prev + 1)} propertyId={props.record?.id} />
          </Grid>
        )}
      </Grid>
      <Grid item>
        <ReferenceManyField
          key={listKey}
          reference="assessment"
          target="property_id"
          fullWidth
          label={'Assessments'}
          addLabel={false}
          pagination={<Pagination />}
          perPage={TAB_LIST_PER_PAGE}
          {...restProps}
        >
          <AssessmentGrid readOnly={readOnly} onSuccess={() => onReset((prev) => prev + 1)} />
        </ReferenceManyField>
      </Grid>
    </>
  );
}

export default AssessmentList;
