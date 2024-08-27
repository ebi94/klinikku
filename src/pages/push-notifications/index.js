import React, { useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PageHeader from "src/@core/components/page-header";
import TableHeader from "src/views/push-notifications/TableHeader";
import AddNotificationDrawer from "src/views/push-notifications/AddNotificationDrawer";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const PushNotifications = () => {
  const [value, setValue] = useState("");
  const [addNotifDrawer, setAddNotifDrawer] = useState(false);

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          title={
            <TypographyStyled variant="h5">
              Push Notifications List
            </TypographyStyled>
          }
          subtitle={
            <Typography variant="body2">
              List of Push Notifications to using in KlinikKu Apps
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              handleFilter={handleFilter}
              toggle={() => setAddNotifDrawer(!addNotifDrawer)}
            />
            <DataGrid
              autoHeight
              pagination
              rows={[]}
              columns={[]}
              pageSizeOptions={[10, 25, 50]}

              // paginationModel={paginationModel}
              // onPaginationModelChange={setPaginationModel}
              // onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
      </Grid>
      <AddNotificationDrawer
        open={addNotifDrawer}
        toggle={() => setAddNotifDrawer(!addNotifDrawer)}

        // type={typeForm}
        // dataDetail={dataDetail}
        // onRefresh={fetchUserslist}
      />
    </>
  );
};

export default PushNotifications;
