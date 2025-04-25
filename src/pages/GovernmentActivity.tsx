import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, List, ListItem, ListItemText, Divider, IconButton, Collapse, CircularProgress, Alert, Link, Button } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PublicIcon from '@mui/icons-material/Public';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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
        <Box sx={{ 
          p: 3,
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Bill {
  id: string;
  number: string;
  title: string;
  summary: string;
  fullText: string;
  status: string;
  date: string;
}

interface CourtRuling {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  date: string;
  citation: string;
}

interface ExecutiveOrder {
  id: string;
  number: string;
  title: string;
  summary: string;
  fullText: string;
  date: string;
  aiSummary: string;
}

const GovernmentActivity = () => {
  const [value, setValue] = useState(0);
  const [federalSubTab, setFederalSubTab] = useState(0);
  const [stateSubTab, setStateSubTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [rulings, setRulings] = useState<CourtRuling[]>([]);
  const [orders, setOrders] = useState<ExecutiveOrder[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleFederalSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setFederalSubTab(newValue);
  };

  const handleStateSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setStateSubTab(newValue);
  };

  const handleItemExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch data...');

        // Fetch recent Supreme Court rulings
        try {
          console.log('Fetching Supreme Court rulings...');
          const rulingsResponse = await fetch('https://api.oyez.org/cases?per_page=5&filter=term:ot23');
          if (!rulingsResponse.ok) {
            console.error('Oyez API failed:', rulingsResponse.status, rulingsResponse.statusText);
            throw new Error(`Oyez API failed: ${rulingsResponse.status} ${rulingsResponse.statusText}`);
          }
          const rulingsData = await rulingsResponse.json();
          console.log('Received rulings data:', rulingsData);
          
          if (!rulingsData || rulingsData.length === 0) {
            throw new Error('No rulings found');
          }

          const formattedRulings = rulingsData
            .map((ruling: any) => {
              try {
                return {
                  id: ruling.docket_number,
                  title: ruling.name || 'Untitled Case',
                  summary: ruling.summary || 'No summary available',
                  fullText: ruling.opinion_url || 'Full text not available',
                  date: ruling.decision_date,
                  citation: ruling.citation || 'Citation not available'
                };
              } catch (err) {
                console.error('Error processing ruling:', err);
                return null;
              }
            })
            .filter((ruling: CourtRuling | null) => ruling !== null)
            .sort((a: CourtRuling, b: CourtRuling) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            });

          if (formattedRulings.length === 0) {
            throw new Error('No valid rulings found');
          }

          setRulings(formattedRulings);
        } catch (err) {
          console.error('Error fetching rulings:', err);
          // Fallback to current sample data
          const sampleRulings: CourtRuling[] = [
            {
              id: '1',
              title: 'Trump v. Anderson',
              summary: 'The Court held that states cannot disqualify candidates for federal office under Section 3 of the Fourteenth Amendment without congressional legislation.',
              fullText: 'https://www.supremecourt.gov/opinions/23pdf/23-719_19m2.pdf',
              date: '2024-03-04',
              citation: 'No. 23-719'
            },
            {
              id: '2',
              title: 'Consumer Financial Protection Bureau v. Community Financial Services Association of America',
              summary: 'The Court upheld the constitutionality of the CFPB\'s funding mechanism, rejecting a challenge to its structure.',
              fullText: 'https://www.supremecourt.gov/opinions/23pdf/22-448_8o6a.pdf',
              date: '2024-05-16',
              citation: 'No. 22-448'
            }
          ];
          setRulings(sampleRulings);
        }

        // Fetch executive orders
        try {
          console.log('Fetching executive orders...');
          const ordersResponse = await fetch('https://www.federalregister.gov/api/v1/documents.json?per_page=5&order=newest&conditions[type]=PRESDOCU');
          if (!ordersResponse.ok) {
            console.error('Federal Register API failed:', ordersResponse.status, ordersResponse.statusText);
            throw new Error(`Federal Register API failed: ${ordersResponse.status} ${ordersResponse.statusText}`);
          }
          const ordersData = await ordersResponse.json();
          console.log('Received orders data:', ordersData);
          
          if (!ordersData.results || ordersData.results.length === 0) {
            throw new Error('No executive orders found');
          }

          const processedOrders = ordersData.results.map((order: any) => {
            try {
              return {
                id: order.document_number,
                number: `Executive Order ${order.document_number}`,
                title: order.title,
                summary: order.abstract || 'No abstract available',
                fullText: order.html_url,
                date: order.publication_date,
                aiSummary: order.abstract || 'No summary available'
              };
            } catch (err) {
              console.error('Error processing order:', err);
              return null;
            }
          }).filter((order: ExecutiveOrder | null) => order !== null)
            .sort((a: ExecutiveOrder, b: ExecutiveOrder) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA;
            });

          if (processedOrders.length === 0) {
            throw new Error('No valid executive orders found');
          }

          setOrders(processedOrders);
        } catch (err) {
          console.error('Error fetching orders:', err);
          // Fallback to current sample data
          const sampleOrders: ExecutiveOrder[] = [
            {
              id: '14110',
              number: 'Executive Order 14110',
              title: 'Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence',
              summary: 'Establishes new standards for AI safety and security, protects Americans\' privacy, advances equity and civil rights, stands up for consumers and workers, promotes innovation and competition, advances American leadership around the world, and more.',
              fullText: 'https://www.federalregister.gov/documents/2023/10/30/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence',
              date: '2023-10-30',
              aiSummary: 'This executive order establishes comprehensive standards for AI development and use, focusing on safety, security, privacy, and American leadership in AI technology.'
            },
            {
              id: '14109',
              number: 'Executive Order 14109',
              title: 'Advancing Effective, Accountable Policing and Criminal Justice Practices to Enhance Public Trust and Public Safety',
              summary: 'Strengthens public trust and enhances public safety by promoting accountability in the Federal criminal justice system.',
              fullText: 'https://www.federalregister.gov/documents/2023/10/30/2023-24282/advancing-effective-accountable-policing-and-criminal-justice-practices-to-enhance-public-trust-and',
              date: '2023-10-30',
              aiSummary: 'This executive order focuses on improving policing and criminal justice practices to build public trust and enhance public safety.'
            }
          ];
          setOrders(sampleOrders);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Some government data sources are temporarily unavailable.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading government data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      p: 2
    }}>
      <Typography variant="h4" gutterBottom align="center">
        Government Activity
      </Typography>
      
      <Paper sx={{ 
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<FlagIcon />} label="Federal" />
          <Tab icon={<LocationCityIcon />} label="State" />
          <Tab icon={<ApartmentIcon />} label="City" />
          <Tab icon={<PublicIcon />} label="Global" />
        </Tabs>

        <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <TabPanel value={value} index={0}>
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={federalSubTab}
                onChange={handleFederalSubTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<DescriptionIcon />} label="Congressional Bills" />
                <Tab icon={<GavelIcon />} label="Supreme Court Rulings" />
                <Tab icon={<AssignmentIcon />} label="Executive Orders" />
              </Tabs>

              <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <TabPanel value={federalSubTab} index={0}>
                  <List>
                    {bills.map((bill) => (
                      <Box key={bill.id}>
                        <ListItem>
                          <ListItemText 
                            primary={bill.number} 
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.primary">
                                  {bill.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {bill.summary}
                                </Typography>
                                <Collapse in={expandedItems[bill.id]}>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <Link 
                                      href={bill.fullText} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      sx={{ color: 'primary.main' }}
                                    >
                                      View bill details on Congress.gov
                                    </Link>
                                  </Typography>
                                </Collapse>
                              </Box>
                            }
                          />
                          <IconButton
                            onClick={() => handleItemExpand(bill.id)}
                            size="small"
                          >
                            {expandedItems[bill.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </ListItem>
                        <Divider />
                      </Box>
                    ))}
                  </List>
                </TabPanel>

                <TabPanel value={federalSubTab} index={1}>
                  <List>
                    {rulings.map((ruling) => (
                      <Box key={ruling.id}>
                        <ListItem>
                          <ListItemText 
                            primary={ruling.title} 
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.primary">
                                  {ruling.citation}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {ruling.summary}
                                </Typography>
                                <Collapse in={expandedItems[ruling.id]}>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <Link 
                                      href={ruling.fullText} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      View full text
                                    </Link>
                                  </Typography>
                                </Collapse>
                              </Box>
                            }
                          />
                          <IconButton
                            onClick={() => handleItemExpand(ruling.id)}
                            size="small"
                          >
                            {expandedItems[ruling.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </ListItem>
                        <Divider />
                      </Box>
                    ))}
                  </List>
                </TabPanel>

                <TabPanel value={federalSubTab} index={2}>
                  <List>
                    {orders.map((order) => (
                      <Box key={order.id}>
                        <ListItem>
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="body2" color="text.primary" gutterBottom>
                              {order.number}
                            </Typography>
                            <Typography variant="body2" color="text.primary" gutterBottom>
                              {order.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {order.summary}
                            </Typography>
                            <Collapse in={expandedItems[order.id]}>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  <strong>AI Summary:</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                  {order.aiSummary || 'No AI summary available'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                  <strong>Full Text:</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <Link 
                                    href={order.fullText} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    sx={{ color: 'primary.main' }}
                                  >
                                    View full text on FederalRegister.gov
                                  </Link>
                                </Typography>
                              </Box>
                            </Collapse>
                            <IconButton
                              onClick={() => handleItemExpand(order.id)}
                              size="small"
                              sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                              {expandedItems[order.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>
                        </ListItem>
                        <Divider />
                      </Box>
                    ))}
                  </List>
                </TabPanel>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={stateSubTab}
                onChange={handleStateSubTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<DescriptionIcon />} label="State Bills" />
                <Tab icon={<GavelIcon />} label="State Court Rulings" />
                <Tab icon={<AssignmentIcon />} label="Executive Actions" />
              </Tabs>

              <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <TabPanel value={stateSubTab} index={0}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="SB 567" 
                        secondary="Healthcare Access Expansion - Passed House" 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="AB 123" 
                        secondary="Environmental Protection Act - In Committee" 
                      />
                    </ListItem>
                  </List>
                </TabPanel>

                <TabPanel value={stateSubTab} index={1}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="State v. Johnson" 
                        secondary="2023 - Criminal Justice Reform" 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Smith v. State Education Board" 
                        secondary="2023 - Education Funding" 
                      />
                    </ListItem>
                  </List>
                </TabPanel>

                <TabPanel value={stateSubTab} index={2}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Executive Order 2023-01" 
                        secondary="Emergency Response Protocol Update" 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Executive Order 2023-02" 
                        secondary="State Workforce Development Initiative" 
                      />
                    </ListItem>
                  </List>
                </TabPanel>
              </Box>
            </Box>
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

          <TabPanel value={value} index={3}>
            <List>
              <ListItem>
                <ListItemText 
                  primary="UN Climate Change Conference" 
                  secondary="COP28 - Global Climate Action Summit" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Global Trade Agreement" 
                  secondary="New international trade negotiations underway" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="International Health Regulations" 
                  secondary="WHO updates on global health policies" 
                />
              </ListItem>
            </List>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default GovernmentActivity; 