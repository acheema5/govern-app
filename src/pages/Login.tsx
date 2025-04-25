import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import useAuth, { UserPreferences } from '../hooks/useAuth';
import { seedDatabase } from '../utils/seedDatabase';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const interestOptions = [
  'Voting Rights',
  'Election Security',
  'Campaign Finance',
  'Local Politics',
  'State Politics',
  'Federal Politics',
  'International Relations',
  'Environmental Policy',
  'Healthcare',
  'Education',
];

const Login = () => {
  const navigate = useNavigate();
  const { signup, login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    location: '',
    interests: [],
    newsPreference: 'all',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, preferences);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      await seedDatabase();
      alert('Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Error seeding database. Check console for details.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome to CivicEngage
        </Typography>
        <Typography variant="body1" paragraph align="center" color="textSecondary">
          Your platform for civic engagement
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleLogin}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Login
              </Button>

              {email === 'admin@civicengage.com' && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleSeedDatabase}
                  sx={{ mt: 2 }}
                >
                  Seed Database (Admin Only)
                </Button>
              )}
            </Box>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleSignup}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Location (City, State)"
                value={preferences.location}
                onChange={(e) =>
                  setPreferences({ ...preferences, location: e.target.value })
                }
                fullWidth
              />

              <Autocomplete
                multiple
                options={interestOptions}
                value={preferences.interests}
                onChange={(_, newValue) =>
                  setPreferences({ ...preferences, interests: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Topics of Interest" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />

              <FormControl fullWidth>
                <InputLabel>News Preference</InputLabel>
                <Select
                  value={preferences.newsPreference}
                  label="News Preference"
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      newsPreference: e.target.value as UserPreferences['newsPreference'],
                    })
                  }
                >
                  <MenuItem value="all">Show All Sources</MenuItem>
                  <MenuItem value="left">Left-Leaning Sources</MenuItem>
                  <MenuItem value="center">Centrist Sources</MenuItem>
                  <MenuItem value="right">Right-Leaning Sources</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Sign Up
              </Button>
            </Box>
          </form>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Login; 