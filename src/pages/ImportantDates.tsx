import { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Chip, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Sample important dates data
const importantDates = [
  { date: '2024-03-15', title: 'Primary Election Day', type: 'election' },
  { date: '2024-04-01', title: 'Tax Filing Deadline', type: 'deadline' },
  { date: '2024-05-15', title: 'City Council Meeting', type: 'meeting' },
  { date: '2024-06-01', title: 'State Budget Deadline', type: 'deadline' },
  { date: '2024-07-04', title: 'Independence Day', type: 'holiday' },
  { date: '2024-09-03', title: 'Labor Day', type: 'holiday' },
  { date: '2024-11-05', title: 'General Election Day', type: 'election' },
];

const ImportantDates = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const getDateEvents = (date: Date) => {
    return importantDates.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case 'election':
        return 'primary';
      case 'deadline':
        return 'error';
      case 'meeting':
        return 'info';
      case 'holiday':
        return 'success';
      default:
        return 'default';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add days from previous month to start on Sunday
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(new Date(year, month, -i));
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const daysInMonth = getDaysInMonth(currentDate);

  const handleDateClick = (date: Date) => {
    const events = getDateEvents(date);
    if (events.length > 0) {
      setSelectedDate(date);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDate(null);
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      p: 2,
      backgroundColor: '#f5f5f5',
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 2,
        mb: 3
      }}>
        <CalendarMonthIcon sx={{ 
          fontSize: 40, 
          color: 'primary.main',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' }
          }
        }} />
        <Typography variant="h4" sx={{ 
          color: 'primary.main',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          Important Dates
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 2
            }}>
              <Button 
                onClick={prevMonth}
                variant="contained"
                size="small"
                color="primary"
              >
                &lt;
              </Button>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatDate(currentDate)}
              </Typography>
              <Button 
                onClick={nextMonth}
                variant="contained"
                size="small"
                color="primary"
              >
                &gt;
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: 2,
              '& > *': {
                textAlign: 'center',
                p: 2,
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 1,
                boxShadow: 1
              }
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Typography 
                  key={day} 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    borderBottom: '2px solid',
                    borderColor: 'primary.light',
                    pb: 2
                  }}
                >
                  {day}
                </Typography>
              ))}
              
              {daysInMonth.map((day, index) => {
                const events = getDateEvents(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isCurrentDay = isToday(day);
                
                return (
                  <Box
                    key={index}
                    onClick={() => handleDateClick(day)}
                    sx={{
                      position: 'relative',
                      border: '2px solid',
                      borderColor: isCurrentMonth ? 'primary.light' : 'grey.200',
                      borderRadius: 2,
                      backgroundColor: isCurrentMonth ? 'white' : 'grey.50',
                      ...(isCurrentDay && {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        borderColor: 'primary.main',
                      }),
                      ...(events.length > 0 && {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                          transform: 'scale(1.05)',
                          transition: 'all 0.2s',
                        }
                      }),
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      }
                    }}
                  >
                    <Typography 
                      variant="h6"
                      sx={{
                        opacity: isCurrentMonth ? 1 : 0.5,
                        fontWeight: events.length > 0 ? 'bold' : 'normal'
                      }}
                    >
                      {day.getDate()}
                    </Typography>
                    {events.length > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: 1
                        }}
                      >
                        {events.map((event, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: getChipColor(event.type)
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <List>
              {importantDates
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event, index) => (
                  <Box key={event.date}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </Typography>
                            <Chip 
                              label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              color={getChipColor(event.type)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={event.title}
                      />
                    </ListItem>
                    {index < importantDates.length - 1 && <Divider />}
                  </Box>
                ))}
            </List>
          </Paper>
        </Box>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="date-events-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {selectedDate && getDateEvents(selectedDate).map((event, index) => (
              <Box key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          color={getChipColor(event.type)}
                          size="small"
                        />
                        <Typography variant="subtitle1">
                          {event.title}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < getDateEvents(selectedDate).length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImportantDates; 