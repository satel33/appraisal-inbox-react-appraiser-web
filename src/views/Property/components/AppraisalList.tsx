import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconContentAdd from '@material-ui/icons/Add';
import { Button, ReferenceManyField } from 'react-admin';
import AppraisalGrid from 'views/Appraisal/components/AppraisalGrid';
import useAppraisalRowStyle from 'shared/hooks/useRowStyle';
import history from 'shared/history';
import Typography from '@material-ui/core/Typography';
import { InjectedFieldProps, PublicFieldProps } from 'ra-ui-materialui/lib/field/types';
import { Appraisals } from 'views/Appraisal/types';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import getPropertyPermission from '../permission';
import { TAB_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';

type AppraisalListProps = InjectedFieldProps<Appraisals> & PublicFieldProps;
function AppraisalList(props: AppraisalListProps) {
  const { record } = props;
  const [, { rowStyle }] = useAppraisalRowStyle();
  const [{ permissions }] = useFormPermissions({ getPermission: getPropertyPermission });
  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Typography style={{ fontSize: '1.1rem' }} variant="h6">
            Appraisals
          </Typography>
        </Grid>
        {permissions.edit && (
          <Grid container item md={6} justify="flex-end">
            <Button onClick={onCreate} label="ra.action.create">
              <IconContentAdd />
            </Button>
          </Grid>
        )}
        <Grid item md={12}>
          <ReferenceManyField
            reference="appraisals"
            source="id"
            target="property_id"
            fullWidth
            addLabel={true}
            pagination={<Pagination />}
            perPage={TAB_LIST_PER_PAGE}
            basePath="/appraisals"
            filter={{ property_id: record?.id }}
          >
            <AppraisalGrid rowStyle={rowStyle} />
          </ReferenceManyField>
        </Grid>
      </Grid>
    </>
  );

  function onCreate() {
    history.push('/appraisals/create?property_id=' + record?.id);
  }
}

export default AppraisalList;
