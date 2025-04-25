import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getBiasColor, getBiasBackgroundColor } from '../utils/colors';

interface Representative {
  name: string;
  role: string;
  party: string;
  imageUrl: string;
  contact: string;
}

interface Bill {
  title: string;
  summary: string;
  status: string;
  bias: 'left' | 'center' | 'right';
  sponsors?: string[];
  lastAction?: string;
  nextAction?: string;
  fullText?: string;
  committee?: string;
  fiscalImpact?: string;
}

// Mock data - would be replaced with real API data
const mockRepresentatives: Representative[] = [
  {
    name: "Jane Smith",
    role: "State Senator",
    party: "Democratic",
    imageUrl: "https://via.placeholder.com/150",
    contact: "jane.smith@state.gov"
  },
  {
    name: "John Doe",
    role: "State Representative",
    party: "Republican",
    imageUrl: "https://via.placeholder.com/150",
    contact: "john.doe@state.gov"
  }
];

const mockBills: Bill[] = [
  {
    title: "Education Funding Reform",
    summary: "Proposal to increase education funding by 10%",
    status: "In Committee",
    bias: "left",
    sponsors: ["Sen. Maria Rodriguez", "Sen. James Wilson"],
    lastAction: "Referred to Education Committee - March 8, 2024",
    nextAction: "Committee Hearing - March 22, 2024",
    fullText: "This bill proposes a comprehensive reform of state education funding, including:\n\n1. 10% increase in per-student funding\n2. Additional resources for special education programs\n3. Teacher salary improvements\n4. Infrastructure upgrades for aging schools\n5. Enhanced STEM program funding",
    committee: "Education Committee",
    fiscalImpact: "Estimated $500 million annual increase in education budget"
  },
  {
    title: "Business Regulation Update",
    summary: "Streamlining business permit processes",
    status: "Introduced",
    bias: "right",
    sponsors: ["Rep. Michael Chang", "Rep. Sarah Johnson"],
    lastAction: "Introduced in House - March 5, 2024",
    nextAction: "First Reading - March 18, 2024",
    fullText: "The Business Regulation Update Act aims to simplify and modernize the state's business permit process through:\n\n1. Digital permit application system\n2. Reduced processing times\n3. Simplified fee structure\n4. Small business assistance program\n5. Regulatory compliance streamlining",
    committee: "Commerce Committee",
    fiscalImpact: "Net neutral - Implementation costs offset by efficiency savings"
  }
];

const State = () => {
  const [location] = useState("Washington"); // Would be fetched from user preferences
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
          <LocationOnIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          {location} State Information
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Stay informed about your state's political landscape and representatives
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' } }}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Your Representatives
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {mockRepresentatives.map((rep, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
                    bgcolor: getBiasBackgroundColor(rep.party === 'Democratic' ? 'left' : 'right')
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={rep.imageUrl}
                    alt={rep.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {rep.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {rep.role}
                    </Typography>
                    <Chip
                      label={rep.party}
                      color={rep.party === "Democratic" ? "primary" : "error"}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2">
                      Contact: {rep.contact}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Recent State Bills
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockBills.map((bill, index) => (
                <Card 
                  key={index}
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
                    <Typography variant="h6" gutterBottom>
                      {bill.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {bill.summary}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Chip label={bill.status} size="small" />
                      <Chip
                        label={bill.bias}
                        size="small"
                        sx={{
                          bgcolor: getBiasColor(bill.bias, 0.8),
                          color: 'white',
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 0' } }}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Upcoming Elections
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Primary Election</Typography>
              <Typography variant="body2" color="textSecondary">
                August 15, 2024
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle1">General Election</Typography>
              <Typography variant="body2" color="textSecondary">
                November 5, 2024
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Voter Resources
            </Typography>
            <Typography variant="body2" paragraph>
              • Voter Registration Status
            </Typography>
            <Typography variant="body2" paragraph>
              • Polling Locations
            </Typography>
            <Typography variant="body2" paragraph>
              • Absentee Ballot Information
            </Typography>
            <Typography variant="body2">
              • Election Day Requirements
            </Typography>
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
                  Committee: {selectedBill.committee}
                </Typography>
                <Typography variant="body2" paragraph>
                  Last Action: {selectedBill.lastAction}
                </Typography>
                <Typography variant="body2" paragraph>
                  Next Action: {selectedBill.nextAction}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Fiscal Impact</Typography>
                <Typography variant="body2" paragraph>
                  {selectedBill.fiscalImpact}
                </Typography>
              </Box>
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

export default State; 