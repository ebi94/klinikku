// ** MUI Imports
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const SpinnerLoadData = ({ sx }) => {
  return (
    <Box
      sx={{
        height: 120,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        ...sx,
      }}
    >
      <CircularProgress disableShrink sx={{ mt: 6 }} />
      <Typography sx={{ mt: 4 }}>Mohon Tunggu . . . </Typography>
    </Box>
  );
};

export default SpinnerLoadData;
