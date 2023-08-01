import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid, { GridSize } from '@material-ui/core/Grid';
import range from 'lodash/range';
import { getRandomInt } from 'shared/utils';
import { useListContext } from 'react-admin';
import Empty from 'ra-ui-materialui/lib/list/Empty';

type Props = {
  columns: number;
};

export default function TablePreloader(props: Props) {
  // const { columns } = props;
  const columns = 1;
  const rows = 20;
  const columnWidth = Math.floor(12 / columns) as GridSize;
  const child = React.useMemo(
    () => (
      <Grid container spacing={1}>
        {range(0, rows).map((row) => (
          <>
            {range(0, columns).map((e) => (
              <Grid item md={columnWidth}>
                <Skeleton variant="text" width={`${getRandomInt(80, 100)}%`} />
              </Grid>
            ))}
          </>
        ))}
      </Grid>
    ),
    [],
  );
  return child;
}

type WithGridLoaderType = {
  showEmpty: boolean;
};
export const withGridLoader = (options: WithGridLoaderType = { showEmpty: true }) => (WrappedComponent: any) => {
  function GridWithLoader(props: any) {
    const listContext = useListContext();
    const { loading, total } = listContext || {};
    if (loading) {
      return <TablePreloader columns={1} />;
    } else if (!loading && !total && options.showEmpty) {
      return <Empty resource={props.resource} />;
    }
    return <WrappedComponent {...props} />;
  }
  return GridWithLoader;
};
