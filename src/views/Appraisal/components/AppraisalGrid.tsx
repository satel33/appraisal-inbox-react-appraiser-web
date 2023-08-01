import React from 'react';
import { Datagrid, useGetIdentity } from 'react-admin';
import AddressField from 'shared/components/AddressField';
import { withGridLoader } from 'shared/components/TablePreloader';
import TruncatedField from 'shared/components/TruncatedField';
import AssigneeField from './AssigneeField';
import DateInColumn from './DateInColumn';
import FileNumber from './FileNumber';
import ReportFeeColumn from './ReportFeeColumn';
import StarColumn from './StarColumn';
import { Record } from 'ra-core';
import { useOrgnaizationOptions } from 'shared/hooks/useAppraisalOptions';

interface ValuesProps {
  filterValues: any;
  rowStyle?: (record: Record, index: number) => any;
}

export function AppraisalGrid(props: ValuesProps) {
  const { rowStyle, filterValues, ...restProps } = props;
  const activeTab = filterValues.appraisal_status_id;
  const { identity } = useGetIdentity();
  const [organizationOptions] = useOrgnaizationOptions({ id: identity?.organization_id });
  return (
    <Datagrid optimized {...restProps} rowClick="edit" rowStyle={rowStyle}>
      <StarColumn label="" />
      <FileNumber source="appraisal_file_number" label="File #" />
      {organizationOptions.data?.organization[0].user_accounts_active_count === 1 ? null : (
        <AssigneeField label="Assignees" />
      )}
      <AddressField source="location_address" label="Address" />
      <TruncatedField label="Client" source="client_name" />
      {activeTab === 8 ? (
        <ReportFeeColumn label="Quote Fee" source="quote_fee" />
      ) : (
        <ReportFeeColumn label="Report Fee" source="report_fee" />
      )}
      {activeTab === 8 ? (
        <DateInColumn source="quote_made_date" label="Quote Made" />
      ) : activeTab === 3 ? (
        <DateInColumn source="reviewed_date" label="In Review" />
      ) : activeTab === 4 ? (
        <DateInColumn source="revision_request_date" label="In Revision" />
      ) : activeTab === 6 ? (
        <DateInColumn source="on_hold_date" label="On Hold" />
      ) : activeTab === 7 ? (
        <DateInColumn source="canceled_date" label="Canceled" />
      ) : activeTab === 5 ? (
        <DateInColumn source="completed_date" label="Completed" />
      ) : (
        <DateInColumn source="inspection_date" label="Inspection" />
      )}
      <DateInColumn source="due_date" label="Due" />
    </Datagrid>
  );
}

export default withGridLoader()(AppraisalGrid);
