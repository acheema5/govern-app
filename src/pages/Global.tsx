import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import FlipCard from '../components/FlipCard';
import useNews from '../hooks/useNews';
import useAuth from '../hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  region: string;
  category: string;
  imageUrl: string;
  tags: string[];
  url: string;
  date: string;
  fullText?: string;
}

// Mock news data
const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "EU Announces Major Climate Initiative",
    summary: "European Union reveals ambitious new climate targets and funding for renewable energy projects across member states.",
    source: "Reuters",
    region: "Europe",
    category: "Environmental Policy",
    imageUrl: "https://via.placeholder.com/150",
    tags: ["Climate Change", "EU Policy", "Renewable Energy"],
    url: "https://example.com/eu-climate",
    date: "2024-03-15",
    fullText: "The European Union has announced a comprehensive climate initiative that aims to accelerate the transition to renewable energy across all member states. The program includes €100 billion in funding for solar and wind projects, as well as new emissions reduction targets for 2030. This marks a significant step forward in the EU's commitment to achieving carbon neutrality by 2050."
  },
  {
    id: "2",
    title: "Pacific Trade Agreement Enters Final Phase",
    summary: "Major Asia-Pacific economies reach consensus on trade regulations and tariff reductions.",
    source: "Bloomberg",
    region: "Asia & Pacific",
    category: "International Trade",
    imageUrl: "https://via.placeholder.com/150",
    tags: ["Trade", "Economics", "Asia-Pacific"],
    url: "https://example.com/pacific-trade",
    date: "2024-03-14",
    fullText: "Representatives from twelve Pacific Rim nations have concluded the final round of negotiations on a landmark trade agreement. The deal, which covers nearly 40% of global GDP, will significantly reduce tariffs and establish new standards for digital commerce and intellectual property protection."
  },
  {
    id: "3",
    title: "African Union Launches Digital Currency Initiative",
    summary: "Pan-African digital currency project aims to boost cross-border trade and financial inclusion.",
    source: "Financial Times",
    region: "Africa",
    category: "Finance",
    imageUrl: "https://via.placeholder.com/150",
    tags: ["Digital Currency", "African Union", "Finance"],
    url: "https://example.com/au-digital",
    date: "2024-03-13",
    fullText: "The African Union has unveiled plans for a continent-wide digital currency, designed to facilitate cross-border trade and improve financial inclusion. The project will initially launch in five countries before expanding across the continent, potentially transforming how millions of Africans conduct business and transfer money."
  },
  {
    id: "4",
    title: "North American Infrastructure Partnership Announced",
    summary: "US, Canada, and Mexico agree to joint infrastructure development program.",
    source: "Associated Press",
    region: "North America",
    category: "Infrastructure",
    imageUrl: "https://via.placeholder.com/150",
    tags: ["Infrastructure", "North America", "International Cooperation"],
    url: "https://example.com/na-infrastructure",
    date: "2024-03-12",
    fullText: "The leaders of the United States, Canada, and Mexico have announced a trilateral infrastructure development program worth $500 billion. The initiative will focus on modernizing transportation networks, expanding renewable energy capacity, and improving digital connectivity across North America."
  }
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const regions = [
  "All Regions",
  "Americas",
  "Europe",
  "Asia & Pacific",
  "Africa",
  "Middle East"
];

const Global = () => {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const handleRegionChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedRegion(newValue);
  };

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseDialog = () => {
    setSelectedArticle(null);
  };

  const filteredNews = selectedRegion === 0 
    ? mockNews 
    : mockNews.filter(item => {
        const region = regions[selectedRegion];
        switch (region) {
          case "Americas":
            return item.region.includes("North America") || 
                   item.region.includes("South America") ||
                   item.region.includes("Americas");
          case "Europe":
            return item.region.includes("Europe") || 
                   item.region.includes("EU");
          case "Asia & Pacific":
            return item.region.includes("Asia") || 
                   item.region.includes("Pacific") ||
                   item.region.includes("Oceania");
          case "Africa":
            return item.region.includes("Africa");
          case "Middle East":
            return item.region.includes("Middle East") ||
                   item.region.includes("Gulf");
          default:
            return true;
        }
      });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          <PublicIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Global News & Analysis
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Stay informed about international developments and their impact
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs
          value={selectedRegion}
          onChange={handleRegionChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {regions.map((region, index) => (
            <Tab key={region} label={region} />
          ))}
        </Tabs>

        {regions.map((region, index) => (
          <TabPanel key={region} value={selectedRegion} index={index}>
            <Box display="flex" alignItems="center" mb={3}>
              <NewspaperIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5">
                {region === "All Regions" ? "Featured Stories" : `${region} News`}
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              {filteredNews.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => handleArticleClick(item)}
                  sx={{ cursor: 'pointer' }}
                >
                  <FlipCard {...item} />
                </Box>
              ))}
              {filteredNews.length === 0 && (
                <Typography color="text.secondary" align="center">
                  No news available for this region
                </Typography>
              )}
            </Stack>
          </TabPanel>
        ))}
      </Paper>

      <Dialog
        open={Boolean(selectedArticle)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedArticle && (
          <>
            <DialogTitle>
              {selectedArticle.title}
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {selectedArticle.source} • {selectedArticle.date} • {selectedArticle.region}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedArticle.fullText || selectedArticle.summary}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                {selectedArticle.tags.map((tag) => (
                  <Typography
                    key={tag}
                    variant="body2"
                    sx={{
                      bgcolor: 'action.selected',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    #{tag}
                  </Typography>
                ))}
              </Box>
              <Link
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                Read full article
              </Link>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Global; 