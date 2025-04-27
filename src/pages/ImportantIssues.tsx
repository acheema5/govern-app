import { Box, Typography, Card, CardContent, CardActions, Button, Collapse, Grid, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import { useState } from 'react';

// Styled ExpandMore button that rotates on click
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// Issues list
const issues = [
  {
    title: 'U.S. Tariffs on China',
    description: 'Trade tariffs on Chinese goods continue to impact prices across industries. These measures aim to bolster American manufacturing but also risk raising costs for businesses and consumers.',
    pros: ['Protects American manufacturing', 'May reduce reliance on foreign supply chains'],
    cons: ['Higher consumer prices', 'Strains international trade relationships'],
    learnMore: 'https://www.brookings.edu/articles/the-trump-trade-war-an-assessment/',
  },
  {
    title: 'Russia-Ukraine Conflict',
    description: 'The ongoing war in Ukraine has disrupted energy markets, increased global tensions, and prompted widespread humanitarian efforts. It has also reshaped alliances and defense policies worldwide.',
    pros: ['Strengthens NATO alliances', 'Increases support for democratic nations'],
    cons: ['Energy price inflation', 'Escalation risk into wider conflict'],
    learnMore: 'https://www.cfr.org/global-conflict-tracker/conflict/conflict-ukraine',
  },
  {
    title: 'AI Regulation Debate',
    description: 'Rapid advancements in artificial intelligence have sparked global conversations on regulation. Leaders aim to balance innovation with the ethical and societal risks posed by unchecked AI systems.',
    pros: ['Protects public from misuse', 'Encourages ethical tech development'],
    cons: ['Potential to stifle innovation', 'Slow legislative responses'],
    learnMore: 'https://www.wired.com/story/artificial-intelligence-regulation/',
  },
  {
    title: 'Climate Action Policies',
    description: 'Governments are introducing policies to accelerate the transition to green energy. These actions aim to curb carbon emissions but face challenges in balancing economic impacts and industry pushback.',
    pros: ['Reduces carbon emissions', 'Creates green jobs'],
    cons: ['Higher short-term energy costs', 'Resistance from fossil industries'],
    learnMore: 'https://climate.nasa.gov/solutions/',
  },
  {
    title: 'Healthcare Reform Discussions',
    description: 'Ongoing proposals seek to expand access to affordable healthcare and address soaring costs. Changes could alter insurance coverage models and shift financial responsibilities among citizens.',
    pros: ['Could expand access to healthcare', 'Potential to lower drug prices'],
    cons: ['Higher taxes for some', 'Implementation complexities'],
    learnMore: 'https://www.kff.org/health-reform/',
  },
  {
    title: 'Immigration Policy Shifts',
    description: 'New debates over immigration policy seek to balance border security with the need for labor and economic growth. Policies may affect industries, communities, and social services nationwide.',
    pros: ['Addresses labor shortages', 'Promotes diversity and innovation'],
    cons: ['Border security concerns', 'Strain on public resources'],
    learnMore: 'https://www.migrationpolicy.org/topics/immigration-policy',
  },
];

const ImportantIssues = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleExpandClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: '1400px', 
      margin: '0 auto'
    }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 5 }}>
        Important Issues
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 4, 
        justifyContent: 'center',
        '& > *': {
          flex: '1 1 400px',
          minWidth: '400px',
          maxWidth: '550px',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 6,
          }
        }
      }}>
        {issues.map((issue, index) => (
          <Card key={index} sx={{ minHeight: '350px', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                {issue.title}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {issue.description}
              </Typography>
            </CardContent>

            <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
              <Button
                size="large"
                color="primary"
                onClick={() => handleExpandClick(index)}
                endIcon={
                  <ExpandMore expand={expandedIndex === index}>
                    <ExpandMoreIcon />
                  </ExpandMore>
                }
              >
                View Impact
              </Button>
            </CardActions>

            <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
              <CardContent>
                <Grid container spacing={3} sx={{ minHeight: '200px' }}>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      backgroundColor: 'rgba(144, 238, 144, 0.3)', 
                      p: 3,
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Pros:
                      </Typography>
                      {issue.pros.map((pro, idx) => (
                        <Typography key={idx} variant="body1" sx={{ mb: 1 }}>
                          • {pro}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ 
                      backgroundColor: 'rgba(255, 182, 193, 0.3)', 
                      p: 3,
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Cons:
                      </Typography>
                      {issue.cons.map((con, idx) => (
                        <Typography key={idx} variant="body1" sx={{ mb: 1 }}>
                          • {con}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"   // Now a filled blue button
                    color="primary"
                    size="large"
                    href={issue.learnMore}
                    target="_blank"
                    rel="noopener"
                  >
                    Learn More
                  </Button>
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ImportantIssues;
