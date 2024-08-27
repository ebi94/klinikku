// ** MUI Components
import Grid from "@mui/material/Grid";

// ** Demo Components
import AboutOverivew from "src/views/pages/my-profile/profile/AboutOverivew";
import ProjectsTable from "src/views/pages/my-profile/profile/ProjectsTable";
import ActivityTimeline from "src/views/pages/my-profile/profile/ActivityTimeline";
import ConnectionsTeams from "src/views/pages/my-profile/profile/ConnectionsTeams";

const ProfileTab = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew about={data?.about} contacts={data?.contacts} />
      </Grid>
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ActivityTimeline />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfileTab;
