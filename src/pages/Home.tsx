import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GavelIcon from '@mui/icons-material/Gavel';

const HeroSection = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  overflow: 'hidden',
}));

const FunFactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
}));

const Home = () => {
  // Hardcoded weekly events
  const weeklyEvents = [
    {
      date: 'April 25, 2025',
      title: 'Supreme Court Ruling on AI Regulation',
      description: 'The Supreme Court issued a landmark ruling on the regulation of artificial intelligence in the workplace.',
      type: 'Court Ruling',
      icon: <GavelIcon />
    },
    {
      date: 'April 24, 2025',
      title: 'Climate Resilience Bill Passes House',
      description: 'The House passed a major climate resilience bill with bipartisan support.',
      type: 'Legislation',
      icon: <TrendingUpIcon />
    },
    {
      date: 'April 23, 2025',
      title: 'Presidential Executive Order on Cybersecurity',
      description: 'New executive order strengthens federal cybersecurity standards.',
      type: 'Executive Action',
      icon: <EventIcon />
    }
  ];

  // Hardcoded fun fact
  const funFact = {
    fact: "The U.S. Constitution has been amended 27 times, with the first 10 amendments (the Bill of Rights) being ratified in 1791 and the most recent amendment (27th) being ratified in 1992.",
    source: "National Archives"
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <HeroSection elevation={3}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Civil Lens
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Your comprehensive platform for civic engagement and political awareness
        </Typography>
      </HeroSection>

      <FunFactCard elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            Fun Fact of the Day
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          {funFact.fact}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Source: {funFact.source}
        </Typography>
      </FunFactCard>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EventIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            What's Happened This Week
          </Typography>
        </Box>
        <List>
          {weeklyEvents.map((event, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {event.icon}
                      <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                        {event.title}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {event.date}
                      </Typography>
                      <Typography variant="body1" component="span">
                        {event.description}
                      </Typography>
                    </>
                  }
                />
                <Chip 
                  label={event.type} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              </ListItem>
              {index < weeklyEvents.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Home; 