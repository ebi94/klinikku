import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const TypographyInfoDetail = (props) => {
  const { data } = props;
  return (
    <Box sx={{ display: "flex", mb: 2 }}>
      <Typography
        sx={{
          mr: 2,
          fontWeight: 500,
          fontSize: "0.875rem",
          width: data?.widthLabel ?? "30%",
        }}
      >
        {data?.label}
      </Typography>
      {data?.useTooltip ? (
        <Tooltip title={`${data?.description}`}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              width: "45%",
            }}
          >
            : {data?.description}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2">: {data?.description}</Typography>
      )}
    </Box>
  );
};

export default TypographyInfoDetail;
