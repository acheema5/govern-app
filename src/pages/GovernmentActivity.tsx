import { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, List, ListItem, ListItemText, Divider } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ApartmentIcon from '@mui/icons-material/Apartment';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`government-tabpanel-${index}`}
      aria-labelledby={`government-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const GovernmentActivity = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
        Government Activity
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<FlagIcon />} label="Federal" />
          <Tab icon={<LocationCityIcon />} label="State" />
          <Tab icon={<ApartmentIcon />} label="City" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <List>
            <ListItem>
              <ListItemText 
                primary="Federal Bill HR 1234" 
                secondary="Education Reform Act - Currently in Committee" 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Federal Budget 2024" 
                secondary="Under review in the Senate" 
              />
            </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <List>
            <ListItem>
              <ListItemText 
                primary="State Bill SB 567" 
                secondary="Healthcare Access Expansion - Passed House" 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="State Budget 2024" 
                secondary="Signed into law" 
              />
            </ListItem>
          </List>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <List>
            <ListItem>
              <ListItemText 
                primary="City Ordinance 2024-01" 
                secondary="Zoning Changes - Public Hearing Scheduled" 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="City Budget 2024" 
                secondary="Under review by City Council" 
              />
            </ListItem>
          </List>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default GovernmentActivity; 