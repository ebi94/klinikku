import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import TypographyInfoDetail from "src/views/ui/typography/TypographyInfoDetail";
import DividerText from "src/views/components/divider/DividerText";
import { formatLabel } from "src/utils/helpers";

const DetailWoundEducation = ({ data }) => {
  console.log("data", data);
  const desktopView = useMediaQuery("(min-width:600px)");

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <React.Fragment>
        <DividerText />
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {data?.education &&
            Object.entries(data?.education).map(([key, value]) => {
              console.log(key);
              return (
                <Grid item xs={12} sm={12}>
                  <TypographyInfoDetail
                    data={{
                      label: formatLabel(key),
                      description: value,
                      widthLabel: desktopView ? "15%" : "50%",
                    }}
                  />
                </Grid>
              );
            })}
        </Grid>
        <Box sx={{ mb: 6 }} />
      </React.Fragment>
    </Box>
  );
};

export default DetailWoundEducation;
