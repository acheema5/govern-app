import { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Chip, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const importantDates = [
  { date: '2025-03-15', title: 'Primary Election Day', type: 'election' },
  { date: '2025-04-01', title: 'Tax Filing Deadline', type: 'deadline' },
  { date: '2025-05-15', title: 'City Council Meeting', type: 'meeting' },
  { date: '2025-06-01', title: 'State Budget Deadline', type: 'deadline' },
  { date: '2025-11-05', title: 'General Election Day', type: 'election' },
];

const ImportantDates = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const getDateEvents = (date) => {
    return importantDates.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  };

  const getChipColor = (type) => {
    switch (type) {
      case 'election': return 'primary';
      case 'deadline': return 'error';
      case 'meeting': return 'info';
      default: return 'default';
    }
  };

  const getDaysInMonth = (date) => {
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

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const daysInMonth = getDaysInMonth(currentDate);

  const handleDateClick = (date) => {
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
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
        <CalendarMonthIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Important Dates</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Button onClick={prevMonth} variant="contained" size="small" color="primary">&lt;</Button>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{formatDate(currentDate)}</Typography>
              <Button onClick={nextMonth} variant="contained" size="small" color="primary">&gt;</Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Typography key={day} variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>{day}</Typography>
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
                      backgroundColor: events.length > 0 
                        ? 'primary.light' 
                        : (isCurrentMonth ? 'white' : 'grey.50'),
                      ...(isCurrentDay && {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        borderColor: 'primary.main',
                      }),
                      cursor: events.length > 0 ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      '&:hover': events.length > 0 ? {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        transform: 'scale(1.05)',
                      } : {},
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1
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
                          mt: 1,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main'
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
            <List>
              {importantDates.sort((a, b) => new Date(a.date) - new Date(b.date)).map((event, index) => (
                <Box key={event.date}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
                        <Typography variant="subtitle1">{event.title}</Typography>
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