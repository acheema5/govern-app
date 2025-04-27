import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  overflow: 'hidden',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Voter Information',
      description: 'Find your polling location, check registration status, and learn about voting requirements.',
      icon: <HowToVoteIcon fontSize="large" color="primary" />,
      path: '/voter-info',
    },
    {
      title: 'Government Activity',
      description: 'Track legislation, executive orders, and government actions at all levels.',
      icon: <GavelIcon fontSize="large" color="primary" />,
      path: '/government',
    },
    {
      title: 'Important Issues',
      description: 'Stay informed about key political and social issues affecting your community.',
      icon: <InfoIcon fontSize="large" color="primary" />,
      path: '/issues',
    },
    {
      title: 'Important Dates',
      description: 'View upcoming elections, deadlines, and important civic events.',
      icon: <EventIcon fontSize="large" color="primary" />,
      path: '/dates',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <HeroSection elevation={3}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Govern
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Your comprehensive platform for civic engagement and political awareness
        </Typography>
      </HeroSection>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <FeatureCard>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate(feature.path)}
                >
                  Explore
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 