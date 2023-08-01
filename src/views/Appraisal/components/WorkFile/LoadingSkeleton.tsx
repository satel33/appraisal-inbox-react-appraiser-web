import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useStyles } from './WorkFile';

export const LoadingSkeleton = () => {
  const classes = useStyles();

  return (
    <Table>
      <TableHead classes={{ root: classes.tableHead }}>
        <TableCell classes={{ root: classes.headCell }}>
          <Skeleton />
        </TableCell>
        <TableCell classes={{ root: classes.headCell }}>
          <Skeleton />
        </TableCell>
        <TableCell classes={{ root: classes.headCell }}>
          <Skeleton />
        </TableCell>
        <TableCell classes={{ root: classes.headCell }}>
          <Skeleton />
        </TableCell>
      </TableHead>

      <TableBody>
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </TableBody>
    </Table>
  );
};

export const TableRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
    </TableRow>
  );
};
