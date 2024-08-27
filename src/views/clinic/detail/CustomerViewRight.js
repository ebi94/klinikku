// ** React Imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MuiTabList from '@mui/lab/TabList';
import CircularProgress from '@mui/material/CircularProgress';
import Icon from 'src/@core/components/icon';
import CustomerOrderUnit from 'src/views/customers/detail/CustomerOrderUnit';
import CustomerOrderHomecare from 'src/views/customers/detail/CustomerOrderHomecare';
import CustomerOrderTelenursing from 'src/views/customers/detail/CustomerOrderTelenursing';

// ** Styled Tab component
const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}));

const CustomerViewRight = ({ tab }) => {
  // ** State
  const [activeTab, setActiveTab] = useState('orderunit');
  const [isLoading, setIsLoading] = useState(false);

  // ** Hooks
  const router = useRouter();

  const handleChange = (event, value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <TabContext value={activeTab}>
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        aria-label="forced scroll tabs example">
        <Tab
          value="orderunit"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon="mdi:list-box-outline" />
              Order Unit
            </Box>
          }
        />
        <Tab
          value="orderhomecare"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon="mdi:list-box-outline" />
              Order Homecare
            </Box>
          }
        />
        <Tab
          value="ordertelenursing"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon="mdi:list-box-outline" />
              Order Telenursing
            </Box>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value="orderunit">
              <CustomerOrderUnit />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="orderhomecare">
              <CustomerOrderHomecare />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="ordertelenursing">
              <CustomerOrderTelenursing />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  );
};

export default CustomerViewRight;
