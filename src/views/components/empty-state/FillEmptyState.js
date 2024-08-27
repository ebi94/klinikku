import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

const FillEmptyState = (props) => {
  const { useSkipButton, onClickSkipButton } = props;
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
          justifyContent: "space-evenly",
          alignItems: "center",
          height: 130,
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{ color: "text.secondary", textAlign: "center" }}
          variant="h5"
        >
          Mohon isi data di Form sebelumnya
        </Typography>

        {useSkipButton ? (
          <>
            <Typography
              sx={{ color: "text.secondary", textAlign: "center" }}
              variant="h5"
            >
              atau
            </Typography>
            <Button
              sx={{ mb: 2 }}
              variant="contained"
              size="small"
              onClick={() => onClickSkipButton()}
            >
              Lewati Tahap ini dan isi Nanti
            </Button>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default FillEmptyState;
