import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const DividerText = (props) => {
  const { label } = props;
  return (
    <Grid item xs={12}>
      <Divider
        textAlign="left"
        sx={{
          "&::before": {
            width: "0% !important",
          },
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: "1.2rem" }}>
          {label}
        </Typography>
      </Divider>
    </Grid>
  );
};

export default DividerText;
