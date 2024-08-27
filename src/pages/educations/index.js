import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PageHeader from "src/@core/components/page-header";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const Educations = () => {
  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          title={
            <TypographyStyled variant="h5">Educations List</TypographyStyled>
          }
          subtitle={
            <Typography variant="body2">
              List of Educations to using in KlinikKu Apps
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
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
    </>
  );
};

export default Educations;
