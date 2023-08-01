import pick from 'lodash/pick';
import * as React from 'react';
import { cloneElement } from 'react';
import {
  useListContext,
  TopToolbar,
  CreateButton,
  sanitizeListRestProps,
  ListActionsProps,
  ExportButton,
  Exporter,
} from 'react-admin';
import ExportIcon from '@material-ui/icons/GridOn';
import { makeStyles } from '@material-ui/core';

type CustomListActionsProps = ListActionsProps & {
  hasExport?: boolean;
  customAction?: React.ReactElement;
  customAction2?: React.ReactElement;
};
const useExportStyle = makeStyles((theme) => ({
  label: {
    width: 50,
  },
}));

const ListActions = (props: CustomListActionsProps) => {
  const buttonClasses = useExportStyle();
  const {
    className,
    exporter,
    filters,
    customAction,
    hasCreate = true,
    hasExport = true,
    customAction2,
    ...rest
  } = props;
  const listContext = useListContext();
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {customAction && React.cloneElement(customAction)}
      {filters &&
        cloneElement(filters, {
          ...listContext,
          context: 'button',
        })}
      {customAction2 && React.cloneElement(customAction2)}
      {hasExport && (
        <>
          <ExportButton
            {...pick(listContext, 'resource')}
            label="Export"
            icon={<ExportIcon />}
            classes={buttonClasses}
            exporter={exporter as Exporter}
          />
        </>
      )}
      {hasCreate && <CreateButton basePath={listContext.basePath} />}
    </TopToolbar>
  );
};

export default ListActions;
