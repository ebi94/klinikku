import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.customColors.tableHeaderBg,
  "&.MuiCardHeader-root": {
    padding: "1rem 1.25rem !important",
  },
  "&.MuiCardHeader-title": {
    fontSize: "1rem",
    color: theme.palette.customColors.darkBg,
  },
}));

const TableDetailOrder = (props) => {
  const { title, loading, content, width } = props;

  return (
    <Grid item md={width?.md} sm={width?.sm} xs={12}>
      <Card>
        <CardHeaderStyled title={title} />
        <Divider sx={{ my: "0 !important" }} />
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress disableShrink sx={{ mt: 6 }} />
            </Box>
          ) : (
            <>{content}</>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TableDetailOrder;
