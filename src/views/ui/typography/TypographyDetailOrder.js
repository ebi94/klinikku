import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const gridTitle = {
  display: "flex",
  justifyContent: "space-between",
  paddingRight: "10px",
  alignItems: "flex-start",
};

const titleStyle = { fontWeight: 500, fontSize: "0.875rem" };

const TypographyDetailOrder = (props) => {
  const { data } = props;
  return (
    <Grid container sx={{ mb: 2 }}>
      <Grid item md={4} sx={gridTitle}>
        <Typography sx={titleStyle}>{data?.label}</Typography>
        <Typography sx={titleStyle}>:</Typography>
      </Grid>
      <Grid item md={8}>
        <Typography variant="body2">{data?.value}</Typography>
      </Grid>
    </Grid>
  );
};

export default TypographyDetailOrder;
