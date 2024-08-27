// ** MUI Imports
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const FallbackSpinner = ({ sx }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        ...sx,
      }}
    >
      <img
        src="/images/example-logo.png"
        alt="KlinikKu"
        height={65}
        width={65}
      />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  );
};

export default FallbackSpinner;
