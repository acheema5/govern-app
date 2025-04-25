import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
      }} 
      elevation={3}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <BottomNavigation
          value={value}
          onChange={handleChange}
          sx={{ width: '100%' }}
        >
          <BottomNavigationAction
            label="Voter Info"
            value="/voter-info"
            icon={<PersonIcon />}
          />
          <BottomNavigationAction
            label="Government"
            value="/government-activity"
            icon={<GavelIcon />}
          />
          <BottomNavigationAction
            label="Issues"
            value="/important-issues"
            icon={<CampaignIcon />}
          />
          <BottomNavigationAction
            label="Calendar"
            value="/calendar"
            icon={<EventIcon />}
          />
        </BottomNavigation>
        <IconButton 
          onClick={onLogout}
          sx={{ mr: 1 }}
          color="primary"
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Navbar; 