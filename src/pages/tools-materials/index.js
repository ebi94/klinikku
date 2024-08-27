import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MuiTabList from "@mui/lab/TabList";
import CircularProgress from "@mui/material/CircularProgress";
import PageHeader from "src/@core/components/page-header";
import Icon from "src/@core/components/icon";
import "react-photo-view/dist/react-photo-view.css";
import EquipmentsListTable from "src/views/equipments/EquipmentsListTable";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const TabList = styled(MuiTabList)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up("md")]: {
      minWidth: 130,
    },
  },
}));

const Equipments = () => {
  // ** State
  const [activeTab, setActiveTab] = useState("accesories");
  const [isLoading, setIsLoading] = useState(false);

  // ** Hooks
  const router = useRouter();

  const EquipmentsCategory = [
    { id: 1, name: "Accesories", value: "accesories", icon: "mdi:toolbox" },
    { id: 2, name: "BHP", value: "bhp", icon: "mdi:treasure-chest" },
    { id: 3, name: "Dressing", value: "dressing", icon: "mdi:medical-bag" },
    { id: 4, name: "Medicine", value: "medicine", icon: "mdi:medication" },
  ];

  const handleChange = (event, value) => {
    setActiveTab(value);
  };

  return (
    <Grid container spacing={6}>
      <PageHeader
        title="Tools and Materials"
        subtitle="List of Tools and Materials"
      />
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <TabList
            variant="scrollable"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="forced scroll tabs example"
          >
            {EquipmentsCategory.map((item) => (
              <Tab
                key={item?.id}
                value={`${item?.value}`}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "& svg": { mr: 2 },
                      textAlign: "center",
                    }}
                  >
                    <Icon fontSize={20} icon={item?.icon} />
                    {item?.name}
                  </Box>
                }
              />
            ))}
          </TabList>
          <Box sx={{ mt: 4 }}>
            {isLoading ? (
              <Box
                sx={{
                  mt: 6,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CircularProgress sx={{ mb: 4 }} />
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <>
                <TabPanel sx={{ p: 0 }} value="accesories">
                  <EquipmentsListTable
                    type={{ title: "Accessories", value: "accessories" }}
                  />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value="bhp">
                  <EquipmentsListTable type={{ title: "BHP", value: "bhp" }} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value="dressing">
                  <EquipmentsListTable
                    type={{ title: "Dressing", value: "dressing" }}
                  />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value="medicine">
                  <EquipmentsListTable
                    type={{ title: "Medicine", value: "medicine" }}
                  />
                </TabPanel>
              </>
            )}
          </Box>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Equipments;
