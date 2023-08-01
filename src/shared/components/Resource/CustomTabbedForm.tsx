import * as React from 'react';
import { Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Route, useRouteMatch, useLocation } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import omit from 'lodash/omit';
import Grid from '@material-ui/core/Grid';
import { Toolbar, TabbedFormTabs, FormWithRedirect, escapePath, TabbedFormProps } from 'react-admin';
import { TabbedFormViewProps } from 'ra-ui-materialui/lib/form/TabbedForm';

/**
 * Form layout where inputs are divided by tab, one input per line.
 *
 * Pass FormTab components as children.
 *
 * @example
 *
 * import * as React from "react";
 * import {
 *     Edit,
 *     TabbedForm,
 *     FormTab,
 *     Datagrid,
 *     TextField,
 *     DateField,
 *     TextInput,
 *     ReferenceManyField,
 *     NumberInput,
 *     DateInput,
 *     BooleanInput,
 *     EditButton
 * } from 'react-admin';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <TabbedForm>
 *             <FormTab label="summary">
 *                 <TextInput disabled label="Id" source="id" />
 *                 <TextInput source="title" validate={required()} />
 *                 <TextInput multiline source="teaser" validate={required()} />
 *             </FormTab>
 *             <FormTab label="body">
 *                 <RichTextInput source="body" validate={required()} addLabel={false} />
 *             </FormTab>
 *             <FormTab label="Miscellaneous">
 *                 <TextInput label="Password (if protected post)" source="password" type="password" />
 *                 <DateInput label="Publication date" source="published_at" />
 *                 <NumberInput source="average_note" validate={[ number(), minValue(0) ]} />
 *                 <BooleanInput label="Allow comments?" source="commentable" defaultValue />
 *                 <TextInput disabled label="Nb views" source="views" />
 *             </FormTab>
 *             <FormTab label="comments">
 *                 <ReferenceManyField reference="comments" target="post_id" addLabel={false}>
 *                     <Datagrid>
 *                         <TextField source="body" />
 *                         <DateField source="created_at" />
 *                         <EditButton />
 *                     </Datagrid>
 *                 </ReferenceManyField>
 *             </FormTab>
 *         </TabbedForm>
 *     </Edit>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {ReactElement[]} FormTab elements
 * @prop {Object} initialValues
 * @prop {Function} validate
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 * @prop {ReactElement} toolbar The element displayed at the bottom of the form, contzining the SaveButton
 * @prop {string} variant Apply variant to all inputs. Possible values are 'standard', 'outlined', and 'filled' (default)
 * @prop {string} margin Apply variant to all inputs. Possible values are 'none', 'normal', and 'dense' (default)
 *
 * @param {Prop} props
 */
const TabbedForm = (props: TabbedFormProps) => (
  <FormWithRedirect {...props} render={(formProps: any) => <TabbedFormView {...formProps} />} />
);

TabbedForm.propTypes = {
  children: PropTypes.node,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
  initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  record: PropTypes.object,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]),
  save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
  saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  submitOnEnter: PropTypes.bool,
  undoable: PropTypes.bool,
  validate: PropTypes.func,
  fixedDisplay: PropTypes.node,
  toolbar: PropTypes.element,
};

const useStyles = makeStyles(
  (theme) => ({
    errorTabButton: { color: theme.palette.error.main },
    content: {
      // paddingTop: theme.spacing(1),
      // paddingLeft: theme.spacing(2),
      // paddingRight: '18px',
    },
    fixedDisplay: {
      paddingTop: theme.spacing(1),
      paddingLeft: '35px',
      paddingRight: theme.spacing(2),
    },
  }),
  { name: 'RaTabbedForm' },
);

type CustomTabbedFormViewProps = TabbedFormViewProps & {
  fixedDisplay: React.ReactElement;
  tabs: React.ReactElement;
};
const getTabFullPath = (tab: any, index: any, baseUrl: any) =>
  `${baseUrl}${tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''}`;

export const TabbedFormView = (props: CustomTabbedFormViewProps) => {
  const {
    basePath,
    children,
    className,
    classes: classesOverride,
    form,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    pristine,
    record,
    redirect: defaultRedirect,
    resource,
    saving,
    // setRedirect,
    submitOnEnter,
    tabs,
    toolbar,
    // translate,
    undoable,
    // value,
    variant,
    margin,
    ...rest
  } = props;
  const tabsWithErrors = findTabsWithErrors(children, form.getState().errors);
  const classes = useStyles(props);
  const match = useRouteMatch();
  const location = useLocation();

  const url = match ? match.url : location.pathname;
  return (
    <form className={classnames('tabbed-form', className)} {...sanitizeRestProps(omit(rest, 'fixedDisplay'))}>
      <Grid container>
        <Grid item xs={props.fixedDisplay ? 8 : 12}>
          {React.cloneElement(
            tabs,
            {
              classes,
              url,
              tabsWithErrors,
            },
            children,
          )}
          <Divider />
          {/* <div className={classes.content}> */}
          {Children.map(
            children,
            (tab: any, index) =>
              tab && (
                <Route exact path={escapePath(getTabFullPath(tab, index, url))}>
                  {(routeProps) =>
                    isValidElement(tab)
                      ? React.cloneElement(tab, {
                          // @ts-ignore
                          intent: 'content',
                          resource,
                          record,
                          basePath,
                          hidden: !routeProps.match,
                          // @ts-ignore
                          variant: tab.props.variant || variant,
                          // @ts-ignore
                          margin: tab.props.margin || margin,
                        })
                      : null
                  }
                </Route>
              ),
          )}
          {/* </div> */}
          {/* {toolbar &&
            React.cloneElement(toolbar, {
              basePath,
              className: 'toolbar',
              handleSubmitWithRedirect,
              handleSubmit,
              invalid,
              pristine,
              record,
              redirect: defaultRedirect,
              resource,
              saving,
              submitOnEnter,
              undoable,
            })} */}
        </Grid>
        {props.fixedDisplay && (
          <Grid item xs={4}>
            <Card className={classes.fixedDisplay}>{React.cloneElement(props.fixedDisplay)}</Card>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

TabbedFormView.propTypes = {
  basePath: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
  initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  handleSubmit: PropTypes.func, // passed by react-final-form
  invalid: PropTypes.bool,
  location: PropTypes.object,
  match: PropTypes.object,
  pristine: PropTypes.bool,
  record: PropTypes.object,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]),
  resource: PropTypes.string,
  save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
  saving: PropTypes.bool,
  submitOnEnter: PropTypes.bool,
  tabs: PropTypes.element.isRequired,
  tabsWithErrors: PropTypes.arrayOf(PropTypes.string),
  toolbar: PropTypes.element,
  translate: PropTypes.func,
  undoable: PropTypes.bool,
  validate: PropTypes.func,
  value: PropTypes.number,
  version: PropTypes.number,
};

TabbedFormView.defaultProps = {
  submitOnEnter: true,
  tabs: <TabbedFormTabs />,
  toolbar: <Toolbar />,
};

const sanitizeRestProps = ({
  anyTouched,
  array,
  asyncBlurFields,
  asyncValidate,
  asyncValidating,
  autofill,
  blur,
  change,
  clearAsyncError,
  clearFields,
  clearSubmit,
  clearSubmitErrors,
  destroy,
  dirty,
  dirtyFields,
  dirtyFieldsSinceLastSubmit,
  dirtySinceLastSubmit,
  dispatch,
  form,
  handleSubmit,
  hasSubmitErrors,
  hasValidationErrors,
  initialize,
  initialized,
  initialValues,
  modifiedSinceLastSubmit,
  modifiedsincelastsubmit,
  pristine,
  pure,
  redirect,
  reset,
  resetSection,
  save,
  staticContext,
  submit,
  submitAsSideEffect,
  submitError,
  submitErrors,
  submitFailed,
  submitSucceeded,
  submitting,
  touch,
  translate,
  triggerSubmit,
  undoable,
  untouch,
  valid,
  validate,
  validating,
  __versions,
  ...props
}: any) => props;

export const findTabsWithErrors = (children: any, errors: any) => {
  return Children.toArray(children).reduce((acc: any, child) => {
    if (!isValidElement(child)) {
      return acc;
    }

    const inputs = Children.toArray(child.props.children);

    if (inputs.some((input) => isValidElement(input) && get(errors, input.props.source))) {
      return [...acc, child.props.label];
    }

    return acc;
  }, []);
};

export default TabbedForm;
