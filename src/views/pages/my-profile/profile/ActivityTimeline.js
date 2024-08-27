// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import MuiTimeline from "@mui/lab/Timeline";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// Styled Timeline component
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  "& .MuiTimelineItem-root": {
    width: "100%",
    "&:before": {
      display: "none",
    },
  },
});

const ActivityTimeline = () => {
  return (
    <Card>
      <CardHeader
        title="Activity Timeline"
        sx={{ "& .MuiCardHeader-avatar": { mr: 2.5 } }}
        avatar={<Icon icon="mdi:chart-timeline-variant" />}
        titleTypographyProps={{ sx: { color: "text.primary" } }}
      />
      <CardContent>
        <Timeline sx={{ my: 0, py: 0 }}>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="error" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent
              sx={{ mt: 0, mb: (theme) => `${theme.spacing(2.75)} !important` }}
            >
              <Box
                sx={{
                  mb: 2.5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600 }}>
                  Buat Booking Homecare
                </Typography>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  Today
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Kode Booking #HC.00009.24
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent
              sx={{ mt: 0, mb: (theme) => `${theme.spacing(2.75)} !important` }}
            >
              <Box
                sx={{
                  mb: 2.5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600 }}>Login</Typography>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  April, 18
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2.5 }}></Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="info" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent
              sx={{ mt: 0, mb: (theme) => `${theme.spacing(2.75)} !important` }}
            >
              <Box
                sx={{
                  mb: 2.5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600 }}>
                  Buat Booking Unit
                </Typography>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  Juny, 10
                </Typography>
              </Box>
              <Typography variant="body2">Kode Booking #UN.00009.22</Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600 }}>Login</Typography>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  May, 30
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
