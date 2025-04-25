import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const VoterInfo = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Voter Information
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
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
        <Typography variant="h6" gutterBottom>
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
    </Box>
  );
};

export default VoterInfo; 