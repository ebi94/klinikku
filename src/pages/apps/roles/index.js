// ** MUI Imports
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PageHeader from "src/@core/components/page-header";
import Table from "src/views/apps/roles/Table";
import RoleCards from "src/views/apps/roles/RoleCards";

const RolesComponent = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant="h5">Roles List</Typography>}
        subtitle="
            A role provided access to predefined menus and features so that depending on assigned
            role an administrator can have access to what he need
          "
      />
      <Grid item xs={12} sx={{ mb: 4 }}>
        <RoleCards />
      </Grid>
      <PageHeader
        title={
          <Typography variant="h5">Total users with their roles</Typography>
        }
        subtitle="
            Find all of your company’s administrator accounts and their associate roles.
          "
      />
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  );
};

export default RolesComponent;
