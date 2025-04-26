import { Box, Typography, Collapse, IconButton, Divider, Link, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface GovernmentDocumentProps {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  fullText: string;
  aiSummary?: string;
  date: string;
  expanded: boolean;
  onExpand: () => void;
}

const GovernmentDocument: React.FC<GovernmentDocumentProps> = ({
  id,
  title,
  subtitle,
  summary,
  fullText,
  aiSummary,
  date,
  expanded,
  onExpand
}) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 4,
        p: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
        mb: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ pr: 4 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {subtitle}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {summary}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {date}
          </Typography>
        </Box>

        <IconButton
          onClick={onExpand}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />
        {aiSummary && (
          <Box sx={{ mb: 2 }}>
            <Chip label="AI Summary" size="small" color="primary" sx={{ mb: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-line' }}>
              {aiSummary}
            </Typography>
          </Box>
        )}
        <Typography variant="body2">
          <Link
            href={fullText}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ color: 'primary.main' }}
          >
            View Full Text
          </Link>
        </Typography>
      </Collapse>
    </Box>
  );
};

export default GovernmentDocument; 