import * as React from 'react';
import { Datagrid, DateField, TextField } from 'react-admin';
import FileNumber from 'views/Appraisal/components/FileNumber';
import ReportFeeColumn from 'views/Appraisal/components/ReportFeeColumn';
import { withGridLoader } from 'shared/components/TablePreloader';

function ExpenseGrid() {
  return (
    <Datagrid optimized>
      <TextField label="Type" source="expense_type" />
      <FileNumber label="File #" source="appraisal_file_number" />
      <TextField label="Description" source="description" />
      <TextField label="Qty./Perc." source="quantity" />
      <TextField label="Rate" source="rate" />
      <ReportFeeColumn label="Total" source="total_amount" />
      <DateField label="Date" source="expense_date" />
    </Datagrid>
  );
}

export default withGridLoader()(ExpenseGrid);
