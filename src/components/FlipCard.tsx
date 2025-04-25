import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';

interface FlipCardProps {
  title: string;
  summary: string;
  source: string;
  region: string;
  category: string;
  imageUrl: string;
  tags: string[];
  date: string;
}

const FlipCard = ({
  title,
  summary,
  source,
  region,
  category,
  imageUrl,
  tags,
  date,
}: FlipCardProps) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Box display="flex" gap={2}>
          <Avatar
            variant="rounded"
            src={imageUrl}
            sx={{ width: 100, height: 100 }}
          />
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {source} • {date} • {region}
            </Typography>
            <Typography variant="body1" paragraph>
              {summary}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={category}
                size="small"
                variant="outlined"
                color="primary"
              />
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlipCard; 