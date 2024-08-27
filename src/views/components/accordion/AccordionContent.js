// ** React Imports
import { useState } from "react";
import { useRouter } from "next/router";

// Material-UI components and styles
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import { styled } from "@mui/material/styles";

// Third-party libraries
import toast from "react-hot-toast";

// Custom components and icons
import Icon from "src/@core/components/icon";

// Services and configurations
import { listTreatmentForm } from "src/configs/constans";
import ContentGeneralAssestment from "src/views/treatments/ContentGeneralAssestment";
import ContentWoundAssestment from "src/views/treatments/ContentWoundAssestment";
import ContentDataSupport from "src/views/treatments/ContentDataSupport";
import SpinnerLoadData from "src/@core/components/spinner-load-data";
import ContentWoundDiagnose from "src/views/treatments/ContentWoundDiagnose";
import ContentWoundNursingActions from "src/views/treatments/ContentWoundNursingActions";
import ContentWoundEducation from "src/views/treatments/ContentWoundEducation";
import ContentInvoice from "src/views/treatments/ContentInvoice";

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

const AccordionContent = (props) => {
  const { data } = props;
  console.log("data accordion", data);
  const router = useRouter();
  const { id } = router.query;
  // ** State

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pengkajian-umum");

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <TabContext value={activeTab}>
      <TabList
        sx={{ marginTop: 4 }}
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        aria-label="forced scroll tabs example"
      >
        {listTreatmentForm.map((item) => (
          <Tab
            key={item?.value}
            value={item?.slug}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 2 },
                }}
              >
                <Icon fontSize={20} icon={item?.icon} />
                {item?.label}
              </Box>
            }
          />
        ))}
      </TabList>
      <Box sx={{ mt: 4 }}>
        {loading ? (
          <SpinnerLoadData />
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value="pengkajian-umum">
              <ContentGeneralAssestment id={id} data={data} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="pengkajian-luka">
              <ContentWoundAssestment id={id} data={data} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="data-penunjang">
              <ContentDataSupport id={id} data={data} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="diagnosa-perawatan">
              <ContentWoundDiagnose id={id} data={data} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="tindakan-perawatan">
              <ContentWoundNursingActions id={id} data={data} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="edukasi">
              <ContentWoundEducation id={id} data={data} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="invoice">
              <ContentInvoice id={id} data={data} />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  );
};

export default AccordionContent;
