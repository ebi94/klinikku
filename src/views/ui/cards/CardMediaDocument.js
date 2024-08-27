import React from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { PhotoProvider, PhotoView } from "react-photo-view";

const CardMediaDocument = (props) => {
  const { data } = props;

  return (
    <>
      <PhotoProvider>
        <PhotoView src={data?.imageUrl ?? "/images/pages/empty-image.svg"}>
          <CardMedia
            sx={{ height: 175, mt: 5, cursor: "pointer" }}
            image={data?.imageUrl ?? "/images/pages/empty-image.svg"}
          />
        </PhotoView>
      </PhotoProvider>
      <CardContent>
        <Box
          sx={{
            mb: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">{data?.label}</Typography>
        </Box>
        <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
          <Typography variant="body2">
            No {data?.label} : {data?.description}
          </Typography>
        </Box>
        <Divider sx={{ my: (theme) => `${theme.spacing(4)} !important` }} />
      </CardContent>
    </>
  );
};

export default CardMediaDocument;
