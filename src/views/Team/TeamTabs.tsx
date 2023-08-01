import { Box, Divider, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { FlashOn, Notes as NotesIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useRedirect } from 'react-admin';
import { useFormState } from 'react-final-form';
import { useLocation } from 'react-router-dom';

import { NoteTab } from './components/NoteTab';
import { TeamActivity } from './components/TeamActivity/TeamActivity';

const TABS = [
  { title: 'Activity', index: 0, key: 'activity', icon: <FlashOn /> },
  { title: 'Notes', index: 1, key: 'notes', icon: <NotesIcon /> },
];

export const TeamTabs = () => {
  const classes = simpleFormContainer();
  const [value, setValue] = useState(0);
  const redirect = useRedirect();
  const location = useLocation();

  const formData = useFormState();

  useEffect(() => {
    const path = location?.hash.slice(1);
    const currentValue = TABS.find((tab) => tab.key === path)?.index;
    setValue(currentValue ? currentValue : 0);
  }, [location]);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const getIndex = (tab: string) => {
    return TABS.find((item) => item.key === tab)?.index || 0;
  };

  const onTabClick = (path: string) => {
    redirect(`${location.pathname}#${path}`);
  };

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
        {TABS.map((tab) => (
          <Tab
            label={tab.title}
            {...a11yProps(getIndex(tab.key))}
            onClick={() => onTabClick(tab.key)}
            key={tab.index}
            className={classes.tab}
          />
        ))}
      </Tabs>
      <Divider />
      <TabPanel value={value} index={getIndex('activity')}>
        <TeamActivity formData={formData} />
      </TabPanel>
      <TabPanel value={value} index={getIndex('notes')}>
        <NoteTab formData={formData} />
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
