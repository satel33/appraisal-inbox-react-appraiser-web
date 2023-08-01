import { Box, Divider, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { Contacts as ContactsIcon, FlashOn, Notes as NotesIcon } from '@material-ui/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useRedirect } from 'react-admin';
import { useFormState } from 'react-final-form';
import { useLocation } from 'react-router-dom';
// import { useOrgnaizationOptions } from 'shared/hooks/useAppraisalOptions';
import useFormPermissions from 'shared/hooks/useResourcePermissions';

import { AppraisalActivities } from './components/AppraisalActivity/AppraisalActivities';
import { Contacts } from './components/Contacts';
import { Fees } from './components/Fees';
import { Notes } from './components/Notes';
import WorkFile from './components/WorkFile/WorkFile';
import { useGetFiles } from './hooks/workfileHooks';
import getAppraisalPermission from './permission';
import { Appraisal } from './types';

const TABS = [
  { title: 'Activity', index: 0, key: 'activity', icon: <FlashOn /> },
  { title: 'Notes', index: 1, key: 'notes', icon: <NotesIcon /> },
  { title: 'Contacts', index: 2, key: 'contacts', icon: <ContactsIcon /> },
  { title: '', index: 3, key: 'fees', icon: <ContactsIcon /> },
  { title: 'Workfile', index: 4, key: 'workfile', icon: <ContactsIcon /> },
];

export const AppraisalTabs = () => {
  const classes = simpleFormContainer();
  const [value, setValue] = useState(0);
  const redirect = useRedirect();
  const location = useLocation();

  // const { identity } = useGetIdentity();
  const [{ permissions }] = useFormPermissions({ getPermission: getAppraisalPermission });
  // const [organizationOptions] = useOrgnaizationOptions({ id: identity?.organization_id });

  const formData = useFormState<Appraisal>();

  const getFilesParams = useGetFiles({
    parent: 'appraisal',
    parent_id: formData.values.id,
  });

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const getIndex = (tab: string) => {
    return TABS.find((item) => item.key === tab)?.index || 0;
  };

  const onTabClick = (path: string) => {
    redirect(`${location.pathname}#${path}`);
  };

  const { contactsCount, showActivityTab } = useMemo(() => {
    return {
      contactsCount: formData.values.contact_ids?.length || 0,
      showActivityTab: permissions.create,
    };
  }, [formData, permissions]);

  useEffect(() => {
    const path = location?.hash.slice(1);
    const currentValue = TABS.find((tab) => tab.key === path)?.index;

    const defaultTab = showActivityTab ? 0 : 1;
    setValue(currentValue ? currentValue : defaultTab);
  }, [location, showActivityTab]);

  return (
    <Box className={classes.formContainer}>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        {TABS.map((tab) => {
          if (tab.key === 'activity' && !showActivityTab) {
            return '';
          }

          let label = tab.title;

          if (tab.title === 'Contacts' && contactsCount) {
            label = `${tab.title} (${contactsCount})`;
          }
          if (tab.title === 'Workfile' && getFilesParams.data?.file_aggregate.aggregate.count) {
            label = `${tab.title} (${getFilesParams.data?.file_aggregate.aggregate.count})`;
          }
          if (tab.key === 'fees') {
            label = 'Fees & Expenses';
            // organizationOptions.data?.organization[0].user_accounts_active_count === 1
            //   ? 'Fee & Expenses'
            //   : 'Fees & Commissions';
          }

          return (
            <Tab
              label={label}
              value={tab.index}
              {...a11yProps(getIndex(tab.key))}
              onClick={() => onTabClick(tab.key)}
              key={tab.index}
              className={classes.tab}
            />
          );
        })}
      </Tabs>
      <Divider />
      {showActivityTab && (
        <TabPanel value={value} index={getIndex('activity')}>
          <AppraisalActivities formData={formData} />
        </TabPanel>
      )}
      <TabPanel value={value} index={getIndex('notes')}>
        <Notes formData={formData} />
      </TabPanel>
      <TabPanel value={value} index={getIndex('contacts')}>
        <Contacts formData={formData} />
      </TabPanel>
      <TabPanel value={value} index={getIndex('fees')}>
        <Fees formData={formData} />
      </TabPanel>
      <TabPanel value={value} index={getIndex('workfile')}>
        <WorkFile formData={formData} getFilesParams={getFilesParams} />
      </TabPanel>
    </Box>
  );
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={0}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const simpleFormContainer = makeStyles({
  formContainer: {
    marginTop: '30px',
    display: 'flow-root',
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    // marginBottom: '120px',
  },
  tab: {
    minHeight: '50px',
  },
});
