import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import DescriptionIcon from '@mui/icons-material/Description';
import { getBiasColor, getBiasBackgroundColor } from '../utils/colors';

interface Bill {
  id: string;
  title: string;
  summary: string;
  status: 'Introduced' | 'In Committee' | 'Passed House' | 'Passed Senate' | 'Signed';
  category: string;
  bias: 'left' | 'center' | 'right';
  sponsors?: string[];
  lastAction?: string;
  nextAction?: string;
  fullText?: string;
  relatedBills?: string[];
}

const mockBills: Bill[] = [
  {
    id: "HR-2024-001",
    title: "Clean Energy Infrastructure Act",
    summary: "A comprehensive bill to modernize America's energy infrastructure and promote renewable energy sources.",
    status: "In Committee",
    category: "Environment",
    bias: "left",
    sponsors: ["Rep. Sarah Johnson", "Rep. Michael Chen", "Rep. David Martinez"],
    lastAction: "Referred to House Energy Committee - March 10, 2024",
    nextAction: "Committee Hearing Scheduled - March 25, 2024",
    fullText: "This comprehensive legislation aims to transform America's energy infrastructure through substantial investments in renewable energy sources and grid modernization. Key provisions include:\n\n1. $50 billion for solar and wind energy projects\n2. Tax incentives for residential solar installation\n3. Grid modernization initiatives\n4. Support for energy storage technology\n5. Workforce training programs",
    relatedBills: ["S-2024-015: Grid Modernization Act", "HR-2023-189: Energy Innovation Fund"]
  },
  {
    id: "S-2024-023",
    title: "Digital Privacy Protection Act",
    summary: "Legislation to strengthen online privacy protections and regulate data collection practices.",
    status: "Introduced",
    category: "Technology",
    bias: "center",
    sponsors: ["Sen. Robert Wilson", "Sen. Lisa Anderson"],
    lastAction: "Introduced in Senate - March 8, 2024",
    nextAction: "First Reading - March 20, 2024",
    fullText: "The Digital Privacy Protection Act establishes comprehensive guidelines for data collection and user privacy protection. Major components include:\n\n1. Enhanced user consent requirements\n2. Data collection limitations\n3. Mandatory breach notifications\n4. Consumer right to data deletion\n5. Penalties for non-compliance",
    relatedBills: ["HR-2024-089: Consumer Data Rights Act"]
  },
  {
    id: "HR-2024-045",
    title: "Tax Reform Initiative",
    summary: "Proposal to simplify the tax code and reduce corporate tax rates to stimulate economic growth.",
    status: "Passed House",
    category: "Economy",
    bias: "right",
    sponsors: ["Rep. James Thompson", "Rep. Emily White"],
    lastAction: "Passed House (245-180) - March 12, 2024",
    nextAction: "Senate Finance Committee Review - March 28, 2024",
    fullText: "This tax reform package aims to streamline the tax code and promote economic growth through:\n\n1. Corporate tax rate reduction to 21%\n2. Simplified tax brackets for individuals\n3. Enhanced business deductions\n4. International tax policy updates\n5. Small business tax relief measures",
    relatedBills: ["S-2024-031: Small Business Tax Relief Act", "HR-2024-012: IRS Modernization Act"]
  }
];

const getStatusColor = (status: Bill['status']) => {
  switch (status) {
    case 'Introduced':
      return '#757575';
    case 'In Committee':
      return '#ff9800';
    case 'Passed House':
      return '#2196f3';
    case 'Passed Senate':
      return '#9c27b0';
    case 'Signed':
      return '#4caf50';
    default:
      return '#757575';
  }
};

const Country = () => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleCloseDialog = () => {
    setSelectedBill(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          <FlagIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Federal Government
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Track federal legislation and connect with your representatives
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '2 1 0' } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <DescriptionIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5">Recent Bills</Typography>
            </Box>
            
            <Stack spacing={2}>
              {mockBills.map((bill) => (
                <Card 
                  key={bill.id} 
                  variant="outlined"
                  onClick={() => handleBillClick(bill)}
                  sx={{
                    bgcolor: getBiasBackgroundColor(bill.bias),
                    transition: 'background-color 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: getBiasBackgroundColor(bill.bias).replace('0.15', '0.25'),
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {bill.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                          Bill ID: {bill.id}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {bill.summary}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={bill.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(bill.status),
                              color: 'white',
                            }}
                          />
                          <Chip
                            label={bill.bias}
                            size="small"
                            sx={{
                              bgcolor: getBiasColor(bill.bias, 0.8),
                              color: 'white',
                            }}
                          />
                          <Chip label={bill.category} size="small" variant="outlined" />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Congressional Calendar
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Next Session</Typography>
              <Typography variant="body2" color="textSecondary">
                March 1, 2024 - House Floor Session
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle1">Important Dates</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                • Budget Resolution Deadline: April 15, 2024
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Summer Recess: August 1-31, 2024
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Dialog
        open={Boolean(selectedBill)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedBill && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedBill.title}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Bill ID: {selectedBill.id}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Typography variant="body1" paragraph>
                  {selectedBill.summary}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Details</Typography>
                <Typography variant="body1" paragraph>
                  {selectedBill.fullText}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Sponsors</Typography>
                {selectedBill.sponsors?.map((sponsor) => (
                  <Typography key={sponsor} variant="body2" paragraph>
                    • {sponsor}
                  </Typography>
                ))}
              </Box>

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Status Updates</Typography>
                <Typography variant="body2" paragraph>
                  Last Action: {selectedBill.lastAction}
                </Typography>
                <Typography variant="body2" paragraph>
                  Next Action: {selectedBill.nextAction}
                </Typography>
              </Box>

              {selectedBill.relatedBills && (
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>Related Bills</Typography>
                  {selectedBill.relatedBills.map((bill) => (
                    <Typography key={bill} variant="body2" paragraph>
                      • {bill}
                    </Typography>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Country; 