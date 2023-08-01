import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Appraisal } from '../types';
import { displayFormattedDate, formatCurrency, getOptionValue } from 'shared/utils';
import useAppraisalOptions from 'shared/hooks/useAppraisalOptions';
import PdfTable from 'shared/components/PdfTable';
import { withPdfWrapper } from 'shared/components/PdfWrapper';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Assessment } from 'views/Assessment/types';
import { Contact } from 'views/Contact/types';
import { LeaseComps, SalesComps } from 'views/Transactions/types';
import parse from 'html-react-parser';

// Create styles
const styles = StyleSheet.create({
  hr: {
    border: '0.5px solid rgba(0, 0, 0, 0.12)',
    marginTop: 2,
    marginBottom: 2,
  },
  container: {
    marginTop: 10,
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column',
    },
  },
  leftColumn: {
    flexDirection: 'column',
    width: '68%',
    marginRight: 10,
    '@media max-width: 400': {
      width: '100%',
      paddingRight: 0,
    },
    '@media orientation: landscape': {
      width: 200,
    },
  },
  rightColumn: {
    flexDirection: 'column',
    width: '30%',
    '@media max-width: 400': {
      width: '100%',
      paddingRight: 0,
    },
    '@media orientation: landscape': {
      width: 200,
    },
  },
  col50: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '45%',
    marginRight: 10,
    '@media max-width: 400': {
      width: '100%',
      paddingRight: 0,
    },
    '@media orientation: landscape': {
      width: 200,
    },
  },
  page: {
    flexDirection: 'column',
    padding: 20,
    fontSize: 11,
  },
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textDecoration: 'underline',
  },
  property: {
    padding: 2,
    marginBottom: 5,
  },
  pagination: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
});

type AppraisalPdfProps = {
  record: Appraisal;
};

const QUERY = gql`
  query Contacts($contact_ids: [uuid!]!) {
    contacts(where: { id: { _in: $contact_ids } }) {
      id
      full_name
      type
      email
      phone_number
    }
  }
`;

type AppraisalPdfQueryResponse = {
  assessments: Assessment[];
  salesTransactions: SalesComps[];
  leaseTransactions: LeaseComps[];
  contacts: Contact[];
};

function AppraisalPdf(props: AppraisalPdfProps) {
  const { record } = props;
  const [appraisalOptions] = useAppraisalOptions();
  const transactionsResponse = useQuery<AppraisalPdfQueryResponse>(QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      contact_ids: record.contact_ids ?? [],
    },
  });
  const { contacts = [] } = transactionsResponse.data ?? {};
  const {
    appraisalStatuses = [],
    appraisalPriorities = [],
    commercialPropertyTypes = [],
    commercialPropertySubTypes = [],
    loanTypes = [],
    reportTypes = [],
    appraisalPurposes = [],
    residentialFormTypes = [],
    residentialOwnershipTypes = [],
    residentialStyles = [],
    clients = [],
  } = appraisalOptions.data ?? {};
  const isResidential = record.property_type_id === 1;
  const isFormReport = record.report_type_id === 1;
  const isFormTypeVisible = isResidential && isFormReport;
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.pagination} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      <Text style={styles.footer} render={() => `Powered by Appraisal Inbox (https://www.appraisalinbox.com)`} fixed />
      <View wrap={false}>
        <View style={styles.section}>
          <Text>{displayFormattedDate(new Date().toISOString(), 'MM/dd/yyyy')}</Text>
        </View>
        <View style={styles.section}>
          <Text>
            Appraisal: {record.appraisal_file_number} - {(record.property.location_address || '').replace(/\n|\r/g, '')}
          </Text>
        </View>
        <View>
          <View style={styles.container}>
            <View style={styles.leftColumn}>
              <Text style={styles.sectionTitle}>Property</Text>
              <View style={styles.container}>
                <View style={styles.col50}>
                  <Text style={styles.property}>Address: {record.property.location_address}</Text>
                  {record.property.property_type_id === 1 && (
                    <>
                      <Text style={styles.property}>
                        Ownership:{' '}
                        {getOptionValue(
                          record.property.residential_ownership_type_id,
                          residentialOwnershipTypes,
                          'type',
                        )}
                      </Text>
                      <Text style={styles.property}>
                        Style: {getOptionValue(record.property.residential_style_id, residentialStyles, 'style')}
                      </Text>
                    </>
                  )}
                  {record.property.property_type_id === 2 && (
                    <>
                      <Text style={styles.property}>
                        Commercial Property Type:{' '}
                        {getOptionValue(record.property.commercial_property_type_id, commercialPropertyTypes, 'type')}
                      </Text>
                      <Text style={styles.property}>
                        Commercial Sub Type:{' '}
                        {getOptionValue(
                          record.property.commercial_property_subtype_id,
                          commercialPropertySubTypes,
                          'type',
                        )}
                      </Text>
                    </>
                  )}
                </View>
                <View style={styles.col50}>
                  <Text style={styles.property}>Parcel Number: {record.property.parcel_number}</Text>
                  <Text style={styles.property}>Zoning: {record.property.zoning}</Text>
                  <Text style={styles.property}>Total Acres: {record.property.total_acres}</Text>
                  <Text style={styles.property}>Subdivision: {record.property.subdivision}</Text>
                </View>
              </View>
              <View>
                <PdfTable
                  title="Contacts"
                  data={contacts}
                  columns={[
                    {
                      name: 'Name',
                      getter: 'full_name',
                    },
                    {
                      name: 'Type',
                      getter: 'type',
                    },
                    {
                      name: 'Email',
                      getter: 'email',
                    },
                    {
                      name: 'Phone',
                      getter: 'phone_number',
                    },
                  ]}
                />
              </View>
              <View>
                <Text style={styles.sectionTitle}> Notes </Text>
                <Text style={styles.property}>{parse(record.notes || '')}</Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.sectionTitle}>Appraisal Order</Text>
              <Text style={styles.property}>File #: {record.appraisal_file_number}</Text>
              <Text style={styles.property}>
                Status: {getOptionValue(record.appraisal_status_id, appraisalStatuses, 'status')}
              </Text>
              <Text style={styles.property}>
                Priority: {getOptionValue(record.appraisal_priority_id, appraisalPriorities, 'priority')}
              </Text>
              <View style={styles.hr}></View>
              <Text style={styles.property}>Client File #: {record.client_file_number}</Text>
              <Text style={styles.property}>Client: {getOptionValue(record.client_id, clients, 'name')}</Text>
              <View style={styles.hr}></View>
              <Text style={styles.property}>Client Loan #: {record.client_loan_number}</Text>
              <Text style={styles.property}>Loan Type: {getOptionValue(record.loan_type_id, loanTypes, 'type')}</Text>
              {record.loan_type_id === 4 && <Text style={styles.property}>FHA Case #: {record.fha_case_number}</Text>}
              {record.loan_type_id === 5 && <Text style={styles.property}>USDA Case # {record.usda_case_number}</Text>}
              {record.loan_type_id === 6 && <Text style={styles.property}>VA Case # {record.va_case_number}</Text>}
              <View style={styles.hr}></View>
              <Text style={styles.property}>
                Purpose: {getOptionValue(record.appraisal_purpose_id, appraisalPurposes, 'purpose')}
              </Text>
              <Text style={styles.property}>
                Report Type: {getOptionValue(record.report_type_id, reportTypes, 'type')}
              </Text>
              {isFormTypeVisible && (
                <Text style={styles.property}>
                  Form Types: {getOptionValue(record.residential_form_type_ids, residentialFormTypes, 'type')}
                </Text>
              )}
              <View style={styles.hr}></View>
              <Text style={styles.property}>
                Engagement Date: {displayFormattedDate(record.engagement_date, 'MM/dd/yyyy')}
              </Text>
              <Text style={styles.property}>Due Date: {displayFormattedDate(record.due_date)}</Text>
              <Text style={styles.property}>Inspection Date: {displayFormattedDate(record.inspection_date)}</Text>
              <Text style={styles.property}>
                Quote Date: {displayFormattedDate(record.quote_accepted_date, 'MM/dd/yyyy')}
              </Text>
              <Text style={styles.property}>
                Quote Accepted Date: {displayFormattedDate(record.quote_accepted_date, 'MM/dd/yyyy')}
              </Text>
              <Text style={styles.property}>
                Quote Declined Date: {displayFormattedDate(record.quote_declined_date, 'MM/dd/yyyy')}
              </Text>
              <Text style={styles.property}>
                Submitted: {displayFormattedDate(record.submitted_date, 'MM/dd/yyyy')}
              </Text>
              <Text style={styles.property}>
                Revision: {displayFormattedDate(record.revision_request_date, 'MM/dd/yyyy')}
              </Text>
              <Text style={styles.property}>Paid Date: {displayFormattedDate(record.paid_date, 'MM/dd/yyyy')}</Text>
              <Text style={styles.property}>
                On Hold Date: {displayFormattedDate(record.on_hold_date, 'MM/dd/yyyy')}
              </Text>
              <Text style={styles.property}>
                Canceled Date: {displayFormattedDate(record.canceled_date, 'MM/dd/yyyy')}
              </Text>
              <View style={styles.hr}></View>
              <Text style={styles.property}>Quote Fee: {formatCurrency(record.quote_fee)}</Text>
              <Text style={styles.property}>Report Fee: {formatCurrency(record.report_fee)}</Text>
              <View style={styles.hr}></View>
              <Text style={styles.property}>Assignee: {record.assignee_user_account_names?.join(', ')}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}

export default withPdfWrapper(AppraisalPdf);
