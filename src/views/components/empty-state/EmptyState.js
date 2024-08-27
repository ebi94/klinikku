import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const EmptyState = () => {
  return (
    <Box sx={{ height: "100%", width: "100%", padding: "10%" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/images/pages/no-data.svg" alt="Empty" height={150} />
      </Box>
      <Box
        sx={{
          marginTop: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ color: "text.secondary", textAlign: "center" }}
          variant="h5"
        >
          Tidak ada data tersedia.
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;
