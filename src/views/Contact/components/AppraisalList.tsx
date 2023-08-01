import React from 'react';
import Grid from '@material-ui/core/Grid';
import { AppraisalGrid } from 'views/Appraisal/components/AppraisalGrid';
import useAppraisalRowStyle from 'shared/hooks/useRowStyle';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Contact } from '../types';
import AssignReferenceArrayField from 'shared/components/AssignReferenceArrayField';
import { TAB_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';

type AppraisalListProps = InjectedFieldProps<Contact> & PublicFieldProps;
function AppraisalList(props: AppraisalListProps) {
  const [, { rowStyle }] = useAppraisalRowStyle();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <AssignReferenceArrayField
            {...props}
            target="contact_ids"
            reference="appraisals"
            source="id"
            fullWidth
            addLabel={true}
            pagination={<Pagination />}
            perPage={TAB_LIST_PER_PAGE}
            basePath="/appraisals"
            type="assigned"
          >
            <AppraisalGrid rowStyle={rowStyle} filterValues={undefined}/>
          </AssignReferenceArrayField>
        </Grid>
      </Grid>
    </>
  );
}

export default AppraisalList;
