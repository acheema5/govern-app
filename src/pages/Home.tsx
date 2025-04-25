import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Box,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { getBiasColor, getBiasBackgroundColor } from '../utils/colors';

interface NewsItem {
  title: string;
  category: string;
  bias: 'left' | 'center' | 'right';
}

const mockWeeklyHighlights: NewsItem[] = [
  {
    title: "New Voting Rights Bill Introduced in Congress",
    category: "Politics",
    bias: "center"
  },
  {
    title: "State Legislature Debates Election Reform",
    category: "State",
    bias: "left"
  },
  {
    title: "Supreme Court to Review Voter ID Laws",
    category: "Legal",
    bias: "right"
  }
];

const Home = () => {
  const [funFact, setFunFact] = useState("On this day in 1965, the Voting Rights Act was signed into law.");
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to CivicEngage
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          What would you like to learn about today?
        </Typography>
        <Typography variant="body1" paragraph>
          Stay informed about your representatives, upcoming bills, and make your voice heard in democracy.
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 16px)' } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUpIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5">This Week's Highlights</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockWeeklyHighlights.map((item, index) => (
                <Card 
                  key={index}
                  variant="outlined"
                  sx={{
                    bgcolor: getBiasBackgroundColor(item.bias),
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      bgcolor: getBiasBackgroundColor(item.bias).replace('0.15', '0.25'),
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                    <Box display="flex" gap={1} mt={1}>
                      <Chip label={item.category} size="small" />
                      <Chip
                        label={item.bias}
                        size="small"
                        sx={{
                          bgcolor: getBiasColor(item.bias, 0.8),
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

        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <EmojiObjectsIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5">Fun Fact</Typography>
            </Box>
            <Typography variant="body1">
              {funFact}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 