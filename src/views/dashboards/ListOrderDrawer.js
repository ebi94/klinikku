import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Icon from "src/@core/components/icon";
import CardOrder from "./CardOrder";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const ListOrderDrawer = (props) => {
  // ** Props
  const { open, toggle, dataList } = props;

  const handleClose = () => {
    toggle();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
          List Booking {dataList?.[0]?.type}
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "text.primary" }}
        >
          <Icon icon="mdi:close" fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        {dataList.map((item) => (
          <CardOrder key={item?.id} dataItem={item} />
        ))}
      </Box>
    </Drawer>
  );
};

export default ListOrderDrawer;
