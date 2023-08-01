import React, { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Document } from '@react-pdf/renderer';
import { gqlClient } from 'shared/ApolloClient';

function PdfWrapper(props: { children: ReactNode }) {
  return (
    <ApolloProvider client={gqlClient}>
      <Document>{props.children}</Document>
    </ApolloProvider>
  );
}

export const withPdfWrapper = (Component: any) => {
  function WithPdf(props: any) {
    return (
      <PdfWrapper>
        <Component {...props} />
      </PdfWrapper>
    );
  }
  return WithPdf;
};

export default PdfWrapper;
