import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import State from './pages/State';
import Country from './pages/Country';
import Global from './pages/Global';
import Login from './pages/Login';
import useAuth from './hooks/useAuth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
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
          pb: 7 // Add padding bottom for the navigation bar
        }}>
          <Container 
            maxWidth="lg" 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              overflow: 'auto',
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
                path="/state" 
                element={
                  <ProtectedRoute>
                    <State />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/country" 
                element={
                  <ProtectedRoute>
                    <Country />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/global" 
                element={
                  <ProtectedRoute>
                    <Global />
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
