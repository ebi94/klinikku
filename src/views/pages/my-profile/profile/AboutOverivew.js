// ** MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Icon Imports
import Icon from "src/@core/components/icon";

const renderList = (arr) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            "&:not(:last-of-type)": { mb: 4 },
            "& svg": { color: "text.secondary" },
          }}
        >
          <Box sx={{ display: "flex", mr: 2 }}>
            <Icon icon={item.icon} />
          </Box>

          <Box
            sx={{
              columnGap: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>
              {`${
                item.property.charAt(0).toUpperCase() + item.property.slice(1)
              }:`}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
            </Typography>
          </Box>
        </Box>
      );
    });
  } else {
    return null;
  }
};

const renderTeams = (arr) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            "&:not(:last-of-type)": { mb: 4 },
            "& svg": { color: `${item.color}.main` },
          }}
        >
          <Icon icon="item.icon" />

          <Typography sx={{ mx: 2, fontWeight: 600, color: "text.secondary" }}>
            {item.property.charAt(0).toUpperCase() + item.property.slice(1)}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
          </Typography>
        </Box>
      );
    });
  } else {
    return null;
  }
};

const AboutOverivew = (props) => {
  const { teams, about, contacts, overview } = props;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="caption"
                sx={{ mb: 5, display: "block", textTransform: "uppercase" }}
              >
                About
              </Typography>
              {renderList(about)}
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="caption"
                sx={{ mb: 5, display: "block", textTransform: "uppercase" }}
              >
                Contacts
              </Typography>
              {renderList(contacts)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AboutOverivew;
