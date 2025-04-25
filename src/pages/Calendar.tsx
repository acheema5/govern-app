import { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const events = [
  {
    date: '2024-05-15',
    title: 'Primary Election Day',
    type: 'Election',
    location: 'All Polling Locations',
  },
  {
    date: '2024-06-01',
    title: 'City Council Meeting',
    type: 'Meeting',
    location: 'City Hall',
  },
  {
    date: '2024-06-15',
    title: 'Voter Registration Deadline',
    type: 'Deadline',
    location: 'Online/County Office',
  },
  {
    date: '2024-07-04',
    title: 'Independence Day',
    type: 'Holiday',
    location: 'N/A',
  },
];

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Important Dates
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarMonthIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Upcoming Events
          </Typography>
        </Box>
        
        <List>
          {events.map((event, index) => (
            <div key={index}>
              <ListItem>
                <EventIcon sx={{ mr: 2 }} />
                <ListItemText
                  primary={event.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                      <br />
                      {event.location}
                    </>
                  }
                />
                <Chip 
                  label={event.type} 
                  color={event.type === 'Election' ? 'primary' : 'default'}
                  size="small"
                />
              </ListItem>
              {index < events.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Calendar; 