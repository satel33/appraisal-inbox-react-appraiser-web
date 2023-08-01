import React from 'react';
import { Pagination as RAPagination, PaginationProps } from 'react-admin';

export default function Pagination(props: PaginationProps) {
  return <RAPagination {...props} rowsPerPageOptions={[15, 25]} />;
}
