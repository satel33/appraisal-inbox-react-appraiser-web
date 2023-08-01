import React from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export const ActivityLoadingSkeleton = () => (
  <>
    <Box mb={3}>
      <Skeleton width={200} />
      <Box pl={2} pt={2}>
        <Skeleton />
        <Skeleton />
        <Skeleton width={200} />
      </Box>
    </Box>
    <Box mb={3}>
      <Skeleton width={200} />
      <Box pl={2} pt={2}>
        <Box mb={2}>
          <Skeleton />
          <Skeleton width={200} />
        </Box>
      </Box>
    </Box>
    <Box mb={3}>
      <Skeleton width={200} />
      <Box pl={2} pt={2}>
        <Box mb={2}>
          <Skeleton />
          <Skeleton />
          <Skeleton width={200} />
        </Box>
      </Box>
    </Box>
  </>
);
