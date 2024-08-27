import Typography from "@mui/material/Typography";

const TypographyInfo = (props) => {
  const { data } = props;
  return (
    <>
      <Typography sx={{ fontWeight: 500, mb: 1, ml: 4 }}>
        {data?.label}
      </Typography>
      <Typography variant="body2" sx={{ my: "auto", ml: 4 }}>
        {data?.description}
      </Typography>
    </>
  );
};

export default TypographyInfo;
