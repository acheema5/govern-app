import { Box, Typography, Paper, Card, CardContent, CardActions, Button } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SchoolIcon from '@mui/icons-material/School';
import NatureIcon from '@mui/icons-material/Nature';
import WorkIcon from '@mui/icons-material/Work';

const issues = [
  {
    title: 'Healthcare Reform',
    description: 'Current proposals for expanding healthcare access and reducing costs',
    icon: <HealthAndSafetyIcon fontSize="large" />,
    status: 'Active Legislation',
  },
  {
    title: 'Education Funding',
    description: 'Debates over school funding and curriculum standards',
    icon: <SchoolIcon fontSize="large" />,
    status: 'Under Review',
  },
  {
    title: 'Climate Change',
    description: 'Environmental policies and renewable energy initiatives',
    icon: <NatureIcon fontSize="large" />,
    status: 'Urgent',
  },
  {
    title: 'Economic Policy',
    description: 'Tax reforms and economic stimulus measures',
    icon: <WorkIcon fontSize="large" />,
    status: 'Ongoing',
  },
];

const ImportantIssues = () => {
  return (
    <Box sx={{ 
      p: 2,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Typography variant="h4" gutterBottom align="center">
        Important Issues
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        justifyContent: 'center',
        '& > *': {
          flex: '1 1 300px',
          minWidth: '300px',
          maxWidth: '500px'
        }
      }}>
        {issues.map((issue, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {issue.icon}
                <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                  {issue.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {issue.description}
              </Typography>
              <Typography variant="caption" color="primary">
                Status: {issue.status}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
              <Button size="small">Take Action</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ImportantIssues; 