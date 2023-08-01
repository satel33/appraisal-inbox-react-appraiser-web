import * as React from 'react';
import { Children, cloneElement, memo } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { ListContextProvider } from 'ra-core';
import { ReferenceArrayFieldProps } from 'react-admin';
import { sanitizeRestProps } from 'shared/utils';
import classnames from 'classnames';
import useAssignReferenceArrayField from './useAssignReferenceArrayField';
import { ReferenceArrayFieldViewProps } from 'ra-ui-materialui/lib/field/ReferenceArrayField';
import TablePreloader from '../TablePreloader';

type AssignReferenceArrayFieldProps = ReferenceArrayFieldProps & {
  type?: 'assign' | 'assigned';
  target?: string;
};
function AssignReferenceArrayField(props: AssignReferenceArrayFieldProps) {
  const {
    basePath,
    children,
    filter,
    page = 1,
    perPage,
    record,
    reference,
    resource,
    sort,
    source,
    type,
    target,
  } = props;

  if (React.Children.count(children) !== 1) {
    throw new Error('<ReferenceArrayField> only accepts a single child (like <Datagrid>)');
  }
  const controllerProps = useAssignReferenceArrayField({
    basePath: basePath ?? '',
    filter,
    page,
    perPage,
    record,
    reference,
    resource: resource ?? '',
    sort,
    source: source ?? '',
    type,
    target,
  });
  return (
    <ListContextProvider value={controllerProps}>
      <PureReferenceArrayFieldView {...props} {...controllerProps} />
    </ListContextProvider>
  );
}

AssignReferenceArrayField.defaultProps = {
  addLabel: true,
};

export function AssignReferenceArrayFieldView(props: ReferenceArrayFieldViewProps) {
  const { children, pagination, className, reference, ...rest } = props;
  const classes = useStyles(props);

  if (!props.loaded) {
    return <TablePreloader columns={1} />;
  }

  return (
    <div className={classes.main}>
      <Card
        className={classnames(classes.content, {
          [classes.bulkActionsDisplayed]: props.selectedIds.length > 0,
        })}
      >
        {children &&
          cloneElement(Children.only(children), {
            ...sanitizeRestProps(rest), // deprecated, use ListContext instead, to be removed in v4
            hasBulkActions: false,
          })}
        {pagination && props.total !== undefined && cloneElement(pagination, sanitizeRestProps(rest))}
      </Card>
    </div>
  );
}

const useStyles = makeStyles(
  (theme) => ({
    root: {},
    main: {
      display: 'flex',
      paddingTop: '25px',
    },
    progress: { marginTop: theme.spacing(2) },
    content: {
      marginTop: 0,
      transition: theme.transitions.create('margin-top'),
      position: 'relative',
      flex: '1 1 auto',
      [theme.breakpoints.down('xs')]: {
        boxShadow: 'none',
      },
      overflow: 'inherit',
      boxShadow: 'none',
    },
    bulkActionsDisplayed: {
      marginTop: -theme.spacing(8),
      transition: theme.transitions.create('margin-top'),
    },
    actions: {
      zIndex: 2,
      display: 'flex',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
    },
    noResults: { padding: 20 },
  }),
  { name: 'RaDialogList' },
);
AssignReferenceArrayField.propTypes = {
  basePath: PropTypes.string,
  classes: PropTypes.any,
  className: PropTypes.string,
  data: PropTypes.any,
  ids: PropTypes.array,
  loaded: PropTypes.bool,
  children: PropTypes.element.isRequired,
  reference: PropTypes.string.isRequired,
};

const PureReferenceArrayFieldView = memo(AssignReferenceArrayFieldView);

export default AssignReferenceArrayField;
