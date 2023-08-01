import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';

export const FeesLoadingSkeleton = () => (
  <>
    <Box>
      <Skeleton variant="rect" height={40} animation={false} />
      <Skeleton />
      <Skeleton />
      <Skeleton />

      <Box display={'flex'} justifyContent="flex-end" pr={3} pb={1}>
        <Skeleton width={120} />
      </Box>
    </Box>
    <Box>
      <Skeleton variant="rect" height={40} animation={false} />
      <Skeleton />
      <Skeleton />
      <Skeleton />

      <Box display={'flex'} justifyContent="flex-end" pr={3} pb={1}>
        <Skeleton width={120} />
      </Box>
    </Box>
  </>
);
