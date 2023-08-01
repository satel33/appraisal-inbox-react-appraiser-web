import React from 'react';
import Grid from '@material-ui/core/Grid';
import { ReferenceManyField } from 'react-admin';
import AppraisalGrid from 'views/Appraisal/components/AppraisalGrid';
import useAppraisalRowStyle from 'shared/hooks/useRowStyle';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Appraisals } from 'views/Appraisal/types';
import { TAB_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';

type AppraisalListProps = InjectedFieldProps<Appraisals> & PublicFieldProps;
function AppraisalList(props: AppraisalListProps) {
  const { record } = props;
  const [, { rowStyle }] = useAppraisalRowStyle();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <ReferenceManyField
            reference="appraisals"
            source="id"
            target="client_id"
            fullWidth
            addLabel={true}
            pagination={<Pagination />}
            perPage={TAB_LIST_PER_PAGE}
            basePath="/appraisals"
            filter={{ client_id: record?.id }}
          >
            <AppraisalGrid rowStyle={rowStyle} />
          </ReferenceManyField>
        </Grid>
      </Grid>
    </>
  );
}

export default AppraisalList;
