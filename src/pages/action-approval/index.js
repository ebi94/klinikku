import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PageHeader from "src/@core/components/page-header";

const ActionApproval = () => {
  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "#", name: "Action Approval List" },
  ];
  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          breadCrumbs={breadCrumbs}
          title="Action Approval List"
          subtitle="List of Action Approval to using in KlinikKu Apps"
        />
        <Grid item xs={12}>
          <Card>
            <DataGrid
              disableColumnMenu
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
    </>
  );
};

export default ActionApproval;
