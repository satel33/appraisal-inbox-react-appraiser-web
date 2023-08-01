import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Button, useGetIdentity } from 'react-admin';
import omit from 'lodash/omit';
import ListFilter from './ListFilter';
import orderBy from 'lodash/orderBy';
import useAppraisalRowStyle, { BackGroundType } from 'shared/hooks/useRowStyle';
import { useListStyles } from 'shared/components/Resource/styles';
import ListActions from 'shared/components/Resource/ListActions';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';
import useMaxDimensions from 'shared/hooks/useMaxDimension';
import useLocationQuery from 'shared/hooks/useLocationQuery';
import { AppraisalGrid } from './components/AppraisalGrid';
import AppraisalMap from './components/AppraisalMap';
import { useLocation } from 'react-router-dom';
import { ListProps, BulkActionProps, useListContext, List } from 'react-admin';
import { appraisalMutationRoles } from 'shared/constants/roles';
import TablePreloader from 'shared/components/TablePreloader';
import Empty from 'ra-ui-materialui/lib/list/Empty';
import { INDEX_LIST_PER_PAGE } from 'shared/constants/config';
import Pagination from 'shared/components/Resource/Pagination';
import { createExporter } from 'shared/utils';
import { exportFields } from './fields';

const AppraisalList = (props: ListProps) => {
  const classes = useListStyles();
  const [queryParams, onChangeQuery] = useLocationQuery();
  const location = useLocation();
  const [isMapView, setIsMapView] = React.useState(Boolean(queryParams.view === 'map'));
  const { identity } = useGetIdentity();
  const exporter = React.useMemo(() => createExporter(exportFields, 'appraisals'), []);
  return (
    <List
      {...omit(props, 'staticContext')}
      exporter={exporter}
      key={location.pathname}
      classes={classes}
      hasShow={false}
      hasCreate={false}
      hasEdit={true}
      hasList={true}
      resource="appraisals"
      basePath="/appraisals"
      bulkActionButtons={false}
      perPage={INDEX_LIST_PER_PAGE}
      sort={{ field: 'due_date', order: 'DESC' }}
      filters={<ListFilter />}
      pagination={isMapView ? false : <Pagination limit={<span />} />}
      syncWithLocation
      actions={
        <ListActions
          hasCreate={appraisalMutationRoles.includes(identity?.role ?? '')}
          customAction={
            <Button
              label={isMapView ? 'List' : 'Map'}
              onClick={() => {
                setIsMapView((prev) => !prev);
                onChangeQuery({ view: isMapView ? 'list' : 'map' });
              }}
            >
              {isMapView ? <ListIcon /> : <MapIcon />}
            </Button>
          }
        />
      }
    >
      <TabbedDatagrid onChangeParams={onChangeQuery} {...omit(props, 'staticContext', 'total')} isMapView={isMapView} />
    </List>
  );
};

type TabbedDatagridProps = ListProps &
  BulkActionProps & {
    isMapView: boolean;
    onChangeParams(data: object): void;
  };

function TabbedDatagrid(props: TabbedDatagridProps) {
  const listContext = useListContext();
  const [{ loading, statusMap }, { rowStyle, getBackgroundColor }] = useAppraisalRowStyle();
  const tabs = React.useMemo(
    () =>
      orderBy(
        Object.entries(statusMap).map(([key, value]) => ({
          id: Number(key),
          name: (
            <>
              <span>{value.name}</span>
              <span>{value.count}</span>
            </>
          ),
          order: value.order,
        })),
        'order',
      ),
    [statusMap],
  );
  const { filterValues } = props;
  const dimensions = useMaxDimensions();
  const handleChangeStatusFilter = (event: React.ChangeEvent<{}>, value: number) => {
    let additionalQuery: { sort: undefined | string; order: undefined | string } = {
      sort: undefined,
      order: undefined,
    };
    if (value === 0) {
      props.onChangeParams({
        filter: JSON.stringify(omit(filterValues, 'appraisal_status_id')),
      });
    } else {
      if (value === 8) {
        additionalQuery = {
          sort: 'quote_made_date',
          order: 'DESC',
        };
      }
      props.onChangeParams({
        filter: JSON.stringify({ ...filterValues, appraisal_status_id: value }),
        ...additionalQuery,
      });
    }
  };

  if (loading) {
    return <TablePreloader columns={6} />;
  }
  return (
    <div>
      <div
        style={{
          width: dimensions.width,
        }}
      >
        <Tabs
          variant="scrollable"
          value={Number(filterValues.appraisal_status_id || 0)}
          indicatorColor="primary"
          onChange={handleChangeStatusFilter}
          TabIndicatorProps={{
            style: {
              backgroundColor: getBackgroundColor(filterValues.appraisal_status_id || 0, BackGroundType.Tab),
            },
          }}
        >
          {tabs.map((choice) => (
            <Tab key={choice.id} label={choice.name} style={{ width: '62px' }} value={choice.id} />
          ))}
        </Tabs>
      </div>

      <Divider />
      {listContext.total === 0 && <Empty resource="appraisals" />}
      {props.isMapView && listContext.total !== 0 ? (
        <AppraisalMap />
      ) : (
        <AppraisalGrid filterValues={filterValues} rowStyle={rowStyle} />
      )}
    </div>
  );
}

export default AppraisalList;
