import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
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
            label="Home"
            value="/"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="State"
            value="/state"
            icon={<LocationCityIcon />}
          />
          <BottomNavigationAction
            label="Federal"
            value="/country"
            icon={<FlagIcon />}
          />
          <BottomNavigationAction
            label="Global"
            value="/global"
            icon={<PublicIcon />}
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