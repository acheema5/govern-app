import { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Chip, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Important Dates
const importantDates = [
  { date: '2025-03-15', title: 'City Council Public Hearing', type: 'meeting' },
  { date: '2025-04-15', title: 'Federal Tax Filing Deadline', type: 'deadline' },
  { date: '2025-05-06', title: 'Local Primary Elections', type: 'election' },
  { date: '2025-06-30', title: 'End of State Fiscal Year', type: 'deadline' },
  { date: '2025-07-15', title: 'Campaign Finance Filing Deadline', type: 'deadline' },
  { date: '2025-08-20', title: 'Candidate Filing Deadline for General Election', type: 'deadline' },
  { date: '2025-09-15', title: 'City Council Budget Meeting', type: 'meeting' },
  { date: '2025-10-07', title: 'Voter Registration Deadline', type: 'deadline' },
  { date: '2025-11-04', title: 'General Election Day', type: 'election' },
  { date: '2025-11-18', title: 'Certification of Election Results', type: 'deadline' },
];

const Calendar = () => {
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
      case 'election': return 'primary';
      case 'deadline': return 'error';
      case 'meeting': return 'info';
      default: return 'default';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(new Date(year, month, -i));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const daysInMonth = getDaysInMonth(currentDate);

  const handleDateClick = (date: Date) => {
    if (getDateEvents(date).length > 0) {
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
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 2
            }}>
              <Button onClick={prevMonth} variant="contained" size="small" color="primary">&lt;</Button>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {formatDate(currentDate)}
              </Typography>
              <Button onClick={nextMonth} variant="contained" size="small" color="primary">&gt;</Button>
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
                <Typography key={day} variant="subtitle1" sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.light',
                  pb: 2
                }}>
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
                      backgroundColor: isCurrentDay
                        ? 'primary.main'
                        : events.length > 0
                        ? '#e3f2fd'
                        : isCurrentMonth
                        ? 'white'
                        : 'grey.50',
                      color: isCurrentDay ? 'white' : 'inherit',
                      fontWeight: isCurrentDay ? 'bold' : events.length > 0 ? 'bold' : 'normal',
                      '&:hover': {
                        backgroundColor: events.length > 0 ? '#e3f2fd' : 'grey.100',
                        cursor: events.length > 0 ? 'pointer' : 'default',
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ opacity: isCurrentMonth ? 1 : 0.5 }}>
                      {day.getDate()}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
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
                            <Chip label={event.type.charAt(0).toUpperCase() + event.type.slice(1)} color={getChipColor(event.type)} size="small" />
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

      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="date-events-modal">
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
                        <Chip label={event.type.charAt(0).toUpperCase() + event.type.slice(1)} color={getChipColor(event.type)} size="small" />
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

export default Calendar;
