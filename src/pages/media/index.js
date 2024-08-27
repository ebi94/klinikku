import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MuiTabList from "@mui/lab/TabList";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "src/@core/components/icon";
import PageHeader from "src/@core/components/page-header";
import MediaDocumentList from "src/views/media-document/MediaDocumentList";
import "react-photo-view/dist/react-photo-view.css";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

// ** Styled Tab component
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

const MediaDocument = () => {
  // ** State
  const [activeTab, setActiveTab] = useState("image");
  const [isLoading, setIsLoading] = useState(false);

  // ** Hooks
  const router = useRouter();

  const MediaDocumentCategory = [
    { id: 1, name: "Image", value: "image", icon: "mdi:image" },
    { id: 2, name: "Icon", value: "icon", icon: "mdi:dots-hexagon" },
    { id: 3, name: "Video", value: "video", icon: "mdi:video" },
  ];

  const handleChange = (event, value) => {
    setActiveTab(value);
  };

  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          title="Media & Document"
          subtitle="List of Media & Document"
        />
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <TabList
              variant="scrollable"
              scrollButtons="auto"
              onChange={handleChange}
              aria-label="forced scroll tabs example"
            >
              {MediaDocumentCategory.map((item) => (
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
                  <TabPanel sx={{ p: 0 }} value="image">
                    <MediaDocumentList title={MediaDocumentCategory[0]} />
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value="icon">
                    <MediaDocumentList title={MediaDocumentCategory[1]} />
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value="video">
                    <MediaDocumentList title={MediaDocumentCategory[2]} />
                  </TabPanel>
                </>
              )}
            </Box>
          </TabContext>
        </Grid>
      </Grid>
    </>
  );
};

export default MediaDocument;
