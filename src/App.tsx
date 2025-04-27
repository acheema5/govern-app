import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VoterInfo from './pages/VoterInfo';
import GovernmentActivity from './pages/GovernmentActivity';
import ImportantIssues from './pages/ImportantIssues';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import useAuth from './hooks/useAuth';

const theme = createTheme({
  palette: {
    mode: 'light', // easy dark mode toggle in future
    primary: {
      main: '#0D47A1', // Deep professional blue
      light: '#5472d3',
      dark: '#002171',
    },
    secondary: {
      main: '#00C853', // Fresh green (trustworthy, active)
      light: '#5efc82',
      dark: '#009624',
    },
    background: {
      default: '#E3F2FD', // Light blue background
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.95rem',
    },
    button: {
      textTransform: 'none', // No ugly all-caps on buttons
    },
  },
  spacing: 8, // 8px spacing system
  shape: {
    borderRadius: 12, // Softer card/button rounding
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});


// Wrapper component to protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          pb: 7,
          alignItems: 'center',
          width: '100%'
        }}>
          <Container 
            maxWidth="lg" 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              pt: 2
            }}
          >
            <Routes>
              <Route 
                path="/login" 
                element={
                  user ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login />
                  )
                } 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/voter-info" 
                element={
                  <ProtectedRoute>
                    <VoterInfo />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/government" 
                element={
                  <ProtectedRoute>
                    <GovernmentActivity />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/issues" 
                element={
                  <ProtectedRoute>
                    <ImportantIssues />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dates" 
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
          {user && <Navbar onLogout={logout} />}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
