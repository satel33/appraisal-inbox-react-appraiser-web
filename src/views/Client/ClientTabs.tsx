import { Box, Divider, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { Contacts as ContactsIcon, FlashOn, Notes as NotesIcon } from '@material-ui/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useRedirect } from 'react-admin';
import { useFormState } from 'react-final-form';
import { useLocation } from 'react-router-dom';
import useFormPermissions from 'shared/hooks/useResourcePermissions';

import { ClientActivity } from './components/ClientActivity/ClientActivity';
import { ContactTab } from './components/Contacts';
import { NoteTab } from './components/Notes';
import getClientPermission from './permissions';

const TABS = [
  { title: 'Activity', index: 0, key: 'activity', icon: <FlashOn /> },
  { title: 'Notes', index: 1, key: 'notes', icon: <NotesIcon /> },
  { title: 'Contacts', index: 2, key: 'contacts', icon: <ContactsIcon /> },
];

export const ClientTabs = () => {
  const classes = simpleFormContainer();
  const [value, setValue] = useState(0);
  const redirect = useRedirect();
  const location = useLocation();

  const [{ permissions }] = useFormPermissions({ getPermission: getClientPermission });
  const formData = useFormState();

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
      contactsCount: formData.values.contacts_count,
      showActivityTab: permissions.create,
    };
  }, [formData]);

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
        scrollButtons="auto"
      >
        {TABS.map((tab) => {
          if (tab.key === 'activity' && !showActivityTab) {
            return '';
          }
          return (
            <Tab
              label={tab.title === 'Contacts' ? `${tab.title} (${contactsCount})` : tab.title}
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
          <ClientActivity formData={formData} />
        </TabPanel>
      )}
      <TabPanel value={value} index={getIndex('notes')}>
        <NoteTab formData={formData} />
      </TabPanel>
      <TabPanel value={value} index={getIndex('contacts')}>
        <ContactTab formData={formData} />
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
    // marginTop: '30px',
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
