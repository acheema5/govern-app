import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Fab } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import GavelIcon from '@mui/icons-material/Gavel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const VoterInfo = () => {
  return (
    <Box sx={{ 
      p: 2,
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Typography variant="h4" gutterBottom align="center">
        Voter Information
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Fab 
          variant="extended" 
          color="primary" 
          href="https://www.vote.org/register-to-vote/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            borderRadius: '50px',
            px: 4,
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          <HowToRegIcon sx={{ mr: 1 }} />
          Register Here!
        </Fab>
      </Box>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom align="center">
          Your Voter Status
        </Typography>
        <List>
          <ListItem>
            <PersonIcon sx={{ mr: 2 }} />
            <ListItemText 
              primary="Registration Status" 
              secondary="Active" 
            />
          </ListItem>
          <Divider />
          <ListItem>
            <HowToVoteIcon sx={{ mr: 2 }} />
            <ListItemText 
              primary="Voting History" 
              secondary="Last voted in 2022 General Election" 
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom align="center">
          Polling Location
        </Typography>
        <List>
          <ListItem>
            <LocationOnIcon sx={{ mr: 2 }} />
            <ListItemText 
              primary="Your Polling Place" 
              secondary="123 Main St, Your City, State" 
            />
          </ListItem>
          <Divider />
          <ListItem>
            <CalendarTodayIcon sx={{ mr: 2 }} />
            <ListItemText 
              primary="Polling Hours" 
              secondary="7:00 AM - 8:00 PM" 
            />
          </ListItem>
        </List>
      </Paper>

      {/* 🗳️ New Section: Upcoming Elections, Initiatives, and Referendums */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom align="center">
          Upcoming Elections & Ballot Measures
        </Typography>
        <List>
          <ListItem>
            <EventIcon sx={{ mr: 2 }} />
            <ListItemText 
              primary="2025 Local Primary Election" 
              secondary="August 6, 2025" 
            />
          </ListItem>
          <Divider />
          <ListItem>
            <AssignmentIcon sx={{ mr: 2 }} />
            <ListItemText 
              primary="Initiative 123: Affordable Housing Expansion" 
              secondary="Vote on funding for new affordable housing projects." 
            />
          </ListItem>
          <Divider />
          <ListItem>
            <GavelIcon sx={{ mr: 2 }} />
            <ListItemText 
              primary="Referendum 45: Property Tax Adjustment" 
              secondary="Citizen referendum to adjust local property tax rates." 
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default VoterInfo;