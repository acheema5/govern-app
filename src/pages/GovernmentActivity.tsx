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
import GovernmentDocument from '../components/GovernmentDocument';

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
  aiSummary: string;
}

interface CourtRuling {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  date: string;
  citation: string;
  aiSummary?: string;
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

// Function to generate AI summary with timeout
const generateAISummary = async (text: string, title: string, type: 'bill' | 'ruling' | 'order' = 'bill'): Promise<string> => {
  try {
    console.log('Starting AI summary generation...');
    console.log('All environment variables:', import.meta.env);
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    console.log('API Key first few characters:', apiKey ? apiKey.substring(0, 5) + '...' : 'none');
    
    if (!apiKey) {
      console.warn('Groq API key not found in environment variables');
      return generateFallbackSummary(text, title);
    }

    let prompt = '';
    if (type === 'bill') {
      prompt = `Please provide a concise, informative summary of the following bill. Focus on:
1. Key provisions and changes
2. Main objectives and goals
3. Impact on stakeholders
4. Implementation timeline if mentioned

Write in clear, accessible language that explains the bill's purpose and significance.`;
    } else if (type === 'ruling') {
      prompt = `Please provide a concise, informative summary of the following Supreme Court ruling. Focus on:
1. Key legal principles established
2. Main arguments and reasoning
3. Impact on affected parties
4. Broader implications for law and society

Write in clear, accessible language that explains the ruling's significance and consequences.`;
    } else if (type === 'order') {
      prompt = `Please provide a concise, informative summary of the following executive order. Focus on:
1. Key directives and requirements
2. Main objectives and goals
3. Impact on government agencies and the public
4. Implementation timeline and requirements

Write in clear, accessible language that explains the order's purpose and significance.`;
    }

    const fullPrompt = `${prompt}

Title: ${title}
Text: ${text.substring(0, 4000)}

Summary:`;

    const requestBody = {
      model: "llama2-70b",
      messages: [
        {
          role: "system",
          content: type === 'bill' 
            ? "You are a legislative analyst providing clear, concise summaries of bills for the general public. Focus on explaining the bill's purpose, key provisions, and potential impact."
            : type === 'ruling'
            ? "You are a legal analyst providing clear, concise summaries of Supreme Court rulings for the general public. Focus on explaining the ruling's significance, legal principles, and broader implications."
            : "You are a policy analyst providing clear, concise summaries of executive orders for the general public. Focus on explaining the order's purpose, directives, and impact on government and society."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
      stream: false
    };

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const aiSummary = data.choices[0]?.message?.content;

    if (!aiSummary || aiSummary.length < 20) {
      return generateFallbackSummary(text, title);
    }

    return aiSummary;
  } catch (error) {
    console.error('Error in AI summary generation:', error);
    return generateFallbackSummary(text, title);
  }
};

// Function to generate fallback summary
const generateFallbackSummary = (text: string, title: string): string => {
  try {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const keyTerms = [
      'shall', 'authorize', 'appropriate', 'establish', 'require', 
      'provide', 'create', 'prohibit', 'amend', 'repeal', 'direct',
      'ensure', 'protect', 'promote', 'support', 'fund', 'grant',
      'implement', 'develop', 'expand', 'improve'
    ];

    const keySentences = sentences
      .filter(s => {
        const lowerSentence = s.toLowerCase();
        return keyTerms.some(term => lowerSentence.includes(term)) &&
               lowerSentence.length > 20;
      })
      .slice(0, 3)
      .map(s => s.trim() + '.');

    if (keySentences.length > 0) {
      return `This legislation ${title.toLowerCase()} aims to ${keySentences.join(' ')}`;
    }

    const firstParagraph = text.split('\n')[0];
    if (firstParagraph && firstParagraph.length > 50) {
      return `This bill ${title.toLowerCase()} seeks to ${firstParagraph.substring(0, 200)}...`;
    }

    return `This legislation ${title.toLowerCase()} focuses on ${text.substring(0, 150)}...`;
  } catch (error) {
    console.error('Error generating fallback summary:', error);
    return `This legislation ${title.toLowerCase()} focuses on ${text.substring(0, 150)}...`;
  }
};

// Process rulings with AI summaries
const processRulings = async (rulingsData: any[]): Promise<CourtRuling[]> => {
  const processedRulings = await Promise.all(
    rulingsData.map(async (ruling: any) => {
      try {
        const rulingContent = ruling.case_name || ruling.summary || 'No text available';
        const rulingId = ruling.id || `ruling-${Math.random()}`;
        
        const generatedSummary = await generateAISummary(rulingContent, ruling.case_name, 'ruling');
        
        const processedRuling: CourtRuling = {
          id: rulingId,
          title: ruling.case_name || 'Untitled Case',
          summary: ruling.summary || 'No summary available',
          fullText: ruling.download_url || ruling.html_url || 'Full text not available',
          date: ruling.date_created || ruling.date_modified || new Date().toISOString().split('T')[0],
          citation: ruling.citation || 'Citation not available',
          aiSummary: generatedSummary
        };
        
        return processedRuling;
      } catch (error) {
        console.error(`Error processing ruling:`, error);
        return null;
      }
    })
  );

  const validRulings = processedRulings.filter((ruling): ruling is CourtRuling => ruling !== null);
  return validRulings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Process executive orders with AI summaries
const processOrders = async (ordersData: any[]): Promise<ExecutiveOrder[]> => {
  const processedOrders = await Promise.all(
    ordersData.map(async (order: any) => {
      try {
        const orderContent = order.abstract || order.title || 'No text available';
        const orderId = order.document_number || `order-${Math.random()}`;
        
        const generatedSummary = await generateAISummary(orderContent, order.title, 'order');
        
        const processedOrder: ExecutiveOrder = {
          id: orderId,
          number: `Executive Order ${order.document_number}`,
          title: order.title,
          summary: order.abstract || '',
          fullText: order.html_url,
          date: order.publication_date,
          aiSummary: generatedSummary
        };
        
        return processedOrder;
      } catch (error) {
        console.error(`Error processing order:`, error);
        return null;
      }
    })
  );

  return processedOrders.filter((order): order is ExecutiveOrder => order !== null);
};

// Process bills with AI summaries
const processBills = async (billsData: any[]): Promise<Bill[]> => {
  const processedBills = await Promise.all(
    billsData.map(async (bill: any) => {
      try {
        const latestActionDate = bill.latestAction?.actionDate || bill.introducedDate;
        const billContent = bill.summary || bill.title || 'No text available';
        const billId = bill.billNumber || `bill-${Math.random()}`;
        
        const generatedSummary = await generateAISummary(billContent, bill.title, 'bill');
        
        const processedBill: Bill = {
          id: billId,
          number: `${bill.billType?.toUpperCase() || 'H.R.'} ${bill.billNumber || 'Unknown'}`,
          title: bill.title || 'Untitled Bill',
          summary: bill.summary || 'No summary available',
          fullText: bill.congress ? 
            `https://www.congress.gov/bill/${bill.congress}th-congress/${bill.billType}/${bill.billNumber}` :
            'https://www.congress.gov',
          status: bill.latestAction?.text || 'Status unknown',
          date: latestActionDate ? new Date(latestActionDate).toISOString().split('T')[0] : 'Unknown date',
          aiSummary: generatedSummary
        };
        
        return processedBill;
      } catch (error) {
        console.error(`Error processing bill:`, error);
        return null;
      }
    })
  );

  return processedBills.filter((bill): bill is Bill => bill !== null);
};

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
  const [aiSummaries, setAiSummaries] = useState<{ [key: string]: string }>({});

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
          const apiKey = import.meta.env.VITE_COURTLISTENER_API_KEY;
          if (!apiKey) {
            throw new Error('CourtListener API key not found in environment variables');
          }

          const rulingsResponse = await fetch('https://www.courtlistener.com/api/rest/v3/opinions/?court=scotus&order_by=-date_created&limit=5', {
            headers: {
              'Authorization': `Token ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!rulingsResponse.ok) {
            console.error('CourtListener API failed:', rulingsResponse.status, rulingsResponse.statusText);
            throw new Error(`CourtListener API failed: ${rulingsResponse.status} ${rulingsResponse.statusText}`);
          }

          const rulingsData = await rulingsResponse.json();
          console.log('Received rulings data:', rulingsData);
          
          if (!rulingsData.results || rulingsData.results.length === 0) {
            throw new Error('No rulings found');
          }

          const processedRulings = await processRulings(rulingsData.results);
          setRulings(processedRulings);
        } catch (err) {
          console.error('Error fetching rulings:', err);
          // Fallback to sample data with recent rulings
          const sampleRulings: CourtRuling[] = [
            {
              id: '1',
              title: 'Trump v. Anderson',
              summary: 'The Court considered whether states can disqualify candidates for federal office under Section 3 of the Fourteenth Amendment without congressional legislation.',
              fullText: 'https://www.supremecourt.gov/opinions/25pdf/23-719_8o6a.pdf',
              date: '2025-04-25',
              citation: 'No. 23-719',
              aiSummary: 'This case examines the constitutional limits on state authority to disqualify federal candidates under the Fourteenth Amendment\'s insurrection clause. The decision will have significant implications for election law and the balance of power between state and federal governments in determining candidate eligibility.'
            },
            {
              id: '2',
              title: 'Fischer v. United States',
              summary: 'The Court addressed whether 18 U.S.C. § 1512(c)(2), which prohibits obstruction of an official proceeding, applies to the January 6, 2021, Capitol riot.',
              fullText: 'https://www.supremecourt.gov/opinions/25pdf/23-5572_8o6a.pdf',
              date: '2025-04-24',
              citation: 'No. 23-5572',
              aiSummary: 'This case examines the scope of federal obstruction laws in the context of the January 6th Capitol riot. The Court\'s interpretation of the obstruction statute will have significant implications for ongoing prosecutions and the balance between federal authority and individual rights.'
            },
            {
              id: '3',
              title: 'Department of State v. Muñoz',
              summary: 'The Court considered whether a U.S. citizen has a fundamental liberty interest in her noncitizen spouse being admitted to the country.',
              fullText: 'https://www.supremecourt.gov/opinions/25pdf/23-334_8o6a.pdf',
              date: '2025-04-23',
              citation: 'No. 23-334',
              aiSummary: 'This immigration case addresses the constitutional rights of U.S. citizens in relation to their noncitizen spouses\' admission to the country. The decision will have significant implications for family reunification policies and the scope of constitutional protections in immigration matters.'
            },
            {
              id: '4',
              title: 'Harrington v. Purdue Pharma',
              summary: 'The Court considered whether the Bankruptcy Code authorizes a court to approve a release that extinguishes claims against a non-debtor without the claimants\' consent.',
              fullText: 'https://www.supremecourt.gov/opinions/25pdf/23-124_8o6a.pdf',
              date: '2025-04-22',
              citation: 'No. 23-124',
              aiSummary: 'This bankruptcy case examines the limits of court authority in approving settlements that affect non-debtor parties. The decision will have significant implications for mass tort litigation and the resolution of complex bankruptcy cases involving multiple stakeholders.'
            },
            {
              id: '5',
              title: 'City of Grants Pass v. Johnson',
              summary: 'The Court addressed whether the enforcement of public camping ordinances against homeless individuals violates the Eighth Amendment\'s prohibition on cruel and unusual punishment.',
              fullText: 'https://www.supremecourt.gov/opinions/25pdf/23-175_8o6a.pdf',
              date: '2025-04-21',
              citation: 'No. 23-175',
              aiSummary: 'This case examines the constitutional limits on local governments\' ability to regulate homelessness through public camping ordinances. The decision will have significant implications for how cities address homelessness and the balance between public health concerns and individual rights.'
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

          const processedOrders = await processOrders(ordersData.results);
          setOrders(processedOrders);
        } catch (err) {
          console.error('Error fetching orders:', err);
          // Fallback to sample data
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

        // Fetch recent congressional bills
        const fetchBills = async () => {
          try {
            setLoading(true);
            setError(null);

            // Use sample data for testing since the API might be failing
            const sampleBills: Bill[] = [
              {
                id: 'hr1',
                number: 'H.R. 1',
                title: 'American Innovation and Competitiveness Act of 2025',
                summary: 'To promote American leadership in technology and innovation, strengthen domestic manufacturing, and enhance national security.',
                fullText: 'https://www.congress.gov/bill/119th-congress/house-bill/1',
                status: 'In Committee',
                date: '2025-04-15',
                aiSummary: ''
              },
              {
                id: 's1234',
                number: 'S. 1234',
                title: 'Climate Resilience and Infrastructure Modernization Act',
                summary: 'To enhance climate resilience, modernize infrastructure, and promote sustainable development.',
                fullText: 'https://www.congress.gov/bill/119th-congress/senate-bill/1234',
                status: 'Passed Senate',
                date: '2025-04-20',
                aiSummary: ''
              }
            ];

            setBills(sampleBills);
            setLoading(false);

            // Uncomment this code when the API is working
            
            // Fetch recent bills from both House and Senate
            const [houseResponse, senateResponse] = await Promise.all([
              fetch('https://api.congress.gov/v3/bill?congress=119&chamber=house&sort=latestAction&limit=10&api_key=BTqk9xWL9Hq7x6FqAhNVR5rjpQJK9cj8afy6G1f9'),
              fetch('https://api.congress.gov/v3/bill?congress=119&chamber=senate&sort=latestAction&limit=10&api_key=BTqk9xWL9Hq7x6FqAhNVR5rjpQJK9cj8afy6G1f9')
            ]);

            if (!houseResponse.ok || !senateResponse.ok) {
              console.error('API responses:', {
                house: houseResponse.status,
                senate: senateResponse.status
              });
              throw new Error('Failed to fetch bills');
            }

            const [houseData, senateData] = await Promise.all([
              houseResponse.json(),
              senateResponse.json()
            ]);

            console.log('API data:', { houseData, senateData });

            // Combine and process bills from both chambers
            const allBills = [
              ...(houseData.bills || []),
              ...(senateData.bills || [])
            ];

            if (allBills.length === 0) {
              console.warn('No bills found in API response');
              throw new Error('No bills found');
            }

            const processedBills = await processBills(allBills);
            setBills(processedBills);
            
          } catch (error) {
            console.error('Error in fetchBills:', error);
            setError('Failed to load bills. Using sample data.');
            // Use sample data as fallback
            const sampleBills: Bill[] = [
              {
                id: 'hr1',
                number: 'H.R. 1',
                title: 'American Innovation and Competitiveness Act of 2025',
                summary: 'To promote American leadership in technology and innovation, strengthen domestic manufacturing, and enhance national security.',
                fullText: 'https://www.congress.gov/bill/119th-congress/house-bill/1',
                status: 'In Committee',
                date: '2025-04-15',
                aiSummary: ''
              },
              {
                id: 's1234',
                number: 'S. 1234',
                title: 'Climate Resilience and Infrastructure Modernization Act',
                summary: 'To enhance climate resilience, modernize infrastructure, and promote sustainable development.',
                fullText: 'https://www.congress.gov/bill/119th-congress/senate-bill/1234',
                status: 'Passed Senate',
                date: '2025-04-20',
                aiSummary: ''
              }
            ];
            setBills(sampleBills);
          } finally {
            setLoading(false);
          }
        };

        fetchBills();

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
    <div className="container">
      <Paper sx={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
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
                      <GovernmentDocument
                        key={bill.id}
                        id={bill.id}
                        title={bill.number}
                        subtitle={bill.title}
                        summary={bill.summary}
                        fullText={bill.fullText}
                        aiSummary={bill.aiSummary}
                        date={bill.date}
                        expanded={expandedItems[bill.id] || false}
                        onExpand={() => handleItemExpand(bill.id)}
                      />
                    ))}
                  </List>
                </TabPanel>

                <TabPanel value={federalSubTab} index={1}>
                  <List>
                    {rulings.map((ruling) => (
                      <GovernmentDocument
                        key={ruling.id}
                        id={ruling.id}
                        title={ruling.title}
                        subtitle={ruling.citation}
                        summary={ruling.summary}
                        fullText={ruling.fullText}
                        aiSummary={ruling.aiSummary}
                        date={ruling.date}
                        expanded={expandedItems[ruling.id] || false}
                        onExpand={() => handleItemExpand(ruling.id)}
                      />
                    ))}
                  </List>
                </TabPanel>

                <TabPanel value={federalSubTab} index={2}>
                  <List>
                    {orders.map((order) => (
                      <GovernmentDocument
                        key={order.id}
                        id={order.id}
                        title={order.number}
                        subtitle={order.title}
                        summary={order.summary}
                        fullText={order.fullText}
                        aiSummary={order.aiSummary}
                        date={order.date}
                        expanded={expandedItems[order.id] || false}
                        onExpand={() => handleItemExpand(order.id)}
                      />
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
                    <GovernmentDocument
                      id="state-bill-sb567"
                      title="SB 567"
                      subtitle="Healthcare Access Expansion"
                      summary="Passed House"
                      fullText="https://link-to-sb567"
                      aiSummary="This bill aims to expand access to affordable healthcare across the state by increasing funding for public clinics and insurance subsidies."
                      date="2025-03-12"
                      expanded={expandedItems["state-bill-sb567"] || false}
                      onExpand={() => handleItemExpand("state-bill-sb567")}
                    />
                    <GovernmentDocument
                      id="state-bill-ab123"
                      title="AB 123"
                      subtitle="Environmental Protection Act"
                      summary="In Committee"
                      fullText="https://link-to-ab123"
                      aiSummary="This bill proposes stronger regulations on industrial emissions and conservation incentives to combat climate change."
                      date="2025-03-08"
                      expanded={expandedItems["state-bill-ab123"] || false}
                      onExpand={() => handleItemExpand("state-bill-ab123")}
                    />
                  </List>
                </TabPanel>

                <TabPanel value={stateSubTab} index={1}>
                  <List>
                    <GovernmentDocument
                      id="state-ruling-johnson"
                      title="State v. Johnson"
                      subtitle="Criminal Justice Reform"
                      summary="Case ruling on bail reform policies"
                      fullText="https://link-to-johnson-ruling"
                      aiSummary="This case addressed constitutional challenges to new bail reform laws, impacting pretrial detention standards across the state."
                      date="2025-02-20"
                      expanded={expandedItems["state-ruling-johnson"] || false}
                      onExpand={() => handleItemExpand("state-ruling-johnson")}
                    />
                    <GovernmentDocument
                      id="state-ruling-smith"
                      title="Smith v. State Education Board"
                      subtitle="Education Funding"
                      summary="Case on school funding inequalities"
                      fullText="https://link-to-smith-ruling"
                      aiSummary="This ruling mandated more equitable state funding for public schools, aiming to reduce disparities between districts."
                      date="2025-02-15"
                      expanded={expandedItems["state-ruling-smith"] || false}
                      onExpand={() => handleItemExpand("state-ruling-smith")}
                    />
                  </List>
                </TabPanel>

                <TabPanel value={stateSubTab} index={2}>
                  <List>
                    <GovernmentDocument
                      id="state-exec-2023-01"
                      title="Executive Order 2023-01"
                      subtitle="Emergency Response Protocol Update"
                      summary="Updated state emergency management procedures"
                      fullText="https://link-to-state-exec-2023-01"
                      aiSummary="This executive order updates emergency response protocols to improve coordination among state agencies during natural disasters."
                      date="2025-01-10"
                      expanded={expandedItems["state-exec-2023-01"] || false}
                      onExpand={() => handleItemExpand("state-exec-2023-01")}
                    />
                    <GovernmentDocument
                      id="state-exec-2023-02"
                      title="Executive Order 2023-02"
                      subtitle="Workforce Development Initiative"
                      summary="New programs to expand vocational training"
                      fullText="https://link-to-state-exec-2023-02"
                      aiSummary="This order establishes workforce development centers focused on providing job training in high-demand industries."
                      date="2025-01-15"
                      expanded={expandedItems["state-exec-2023-02"] || false}
                      onExpand={() => handleItemExpand("state-exec-2023-02")}
                    />
                  </List>
                </TabPanel>
              </Box>
            </Box>
          </TabPanel>


          <TabPanel value={value} index={2}>
            <List>
              <GovernmentDocument
                id="city-ordinance-2024-01"
                title="City Ordinance 2024-01"
                subtitle="Zoning Changes"
                summary="Public Hearing Scheduled"
                fullText="https://link-to-ordinance-2024-01"
                aiSummary="This ordinance proposes zoning updates to encourage mixed-use developments and address housing shortages in urban areas."
                date="2024-12-05"
                expanded={expandedItems["city-ordinance-2024-01"] || false}
                onExpand={() => handleItemExpand("city-ordinance-2024-01")}
              />
              <GovernmentDocument
                id="city-budget-2024"
                title="City Budget 2024"
                subtitle="City Council Review"
                summary="Budget under review for approval"
                fullText="https://link-to-city-budget-2024"
                aiSummary="The 2024 city budget proposes increased funding for public safety, infrastructure repairs, and affordable housing initiatives."
                date="2024-11-15"
                expanded={expandedItems["city-budget-2024"] || false}
                onExpand={() => handleItemExpand("city-budget-2024")}
              />
            </List>
          </TabPanel>


          <TabPanel value={value} index={3}>
            <List>
              <GovernmentDocument
                id="global-cop28"
                title="UN Climate Change Conference"
                subtitle="COP28"
                summary="Global Climate Action Summit"
                fullText="https://unfccc.int/cop28"
                aiSummary="The COP28 summit gathered nations to set updated targets for carbon neutrality, climate finance, and global environmental cooperation."
                date="2024-11-30"
                expanded={expandedItems["global-cop28"] || false}
                onExpand={() => handleItemExpand("global-cop28")}
              />
              <GovernmentDocument
                id="global-trade-agreement"
                title="Global Trade Agreement"
                subtitle="New Trade Negotiations"
                summary="International talks on trade policies"
                fullText="https://link-to-global-trade-agreement"
                aiSummary="This agreement seeks to update international trade rules to address supply chain resilience, digital commerce, and fair labor practices."
                date="2025-01-20"
                expanded={expandedItems["global-trade-agreement"] || false}
                onExpand={() => handleItemExpand("global-trade-agreement")}
              />
              <GovernmentDocument
                id="global-health-regulations"
                title="International Health Regulations"
                subtitle="WHO Global Updates"
                summary="Health policy updates worldwide"
                fullText="https://link-to-who-updates"
                aiSummary="The WHO introduced new international health regulations aimed at improving pandemic response coordination and vaccine equity."
                date="2025-02-01"
                expanded={expandedItems["global-health-regulations"] || false}
                onExpand={() => handleItemExpand("global-health-regulations")}
              />
            </List>
          </TabPanel>
        </Box>
      </Paper>
      </div>
  );
};

export default GovernmentActivity; 