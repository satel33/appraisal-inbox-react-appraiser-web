import React from 'react';
import useFormPermissions from 'shared/hooks/useResourcePermissions';
import useAppraisalOptions from 'shared/hooks/useAppraisalOptions';
import getAppraisalPermission from '../permission';
import { PDFViewer } from '@react-pdf/renderer';
import AppraisalPdf from './AppraisalPdf';

export default function PdfTab() {
  const [{ formData }] = useFormPermissions({ getPermission: getAppraisalPermission });
  const [appraisalOptions] = useAppraisalOptions();

  return (
    <PDFViewer>
      <AppraisalPdf record={formData} appraisalOptions={appraisalOptions} />
    </PDFViewer>
  );
}
