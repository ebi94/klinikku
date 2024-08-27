// React and Next.js core imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

// Material-UI imports for UI components
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

// Material-UI Lab components for additional UI functionality
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";

// Custom components specific to the project
import Icon from "src/@core/components/icon";
import CustomerOrderUnit from "src/views/customers/detail/CustomerOrderUnit";
import CustomerOrderHomecare from "src/views/customers/detail/CustomerOrderHomecare";
import CustomerMedicalRecords from "./CustomerMedicalRecords";

// Services for data fetching
import { listOrderUnit } from "src/services/orderUnit";
import { listOrderHomecare } from "src/services/orderHomecare";
import { listTreatment } from "src/services/treatment";

// Configuration and utility imports
import { listTabCustomer } from "src/configs/constans";
import { mappingDataOptions } from "src/utils/helpers";

// Third-party library imports
import toast from "react-hot-toast";

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

const CustomerViewRight = (props) => {
  const { patientId, tab } = props;
  console.log("patientId patientId", patientId);
  const router = useRouter();
  const pathname = usePathname();
  // ** State

  const [activeTab, setActiveTab] = useState("orderunit");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOrderUnit, setLoadingOrderUnit] = useState(true);
  const [loadingOrderHomeCare, setLoadingOrderHomeCare] = useState(true);
  const [loadingMedicalRecords, setLoadingMedicalRecords] = useState(true);
  const [dataListOrderUnit, setDataListOrderUnit] = useState([]);
  const [dataListOrderHomeCare, setDataListOrderHomeCare] = useState([]);
  const [dataListMedicalRecords, setDataListMedicalRecords] = useState([]);

  // ** Hooks
  console.log("tab", tab);
  const handleChange = (event, value) => {
    setActiveTab(value);
    router.push(
      {
        pathname,
        query: { tab: value },
      },
      undefined,
      { shallow: true }
    );
  };

  const fetchListOrderUnit = async () => {
    const res = await listOrderUnit(patientId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      const mappingDataList = mappingDataOptions(data, "order_id");
      setDataListOrderUnit(mappingDataList);
      setLoadingOrderUnit(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoadingOrderUnit(false);
    }
  };

  const fetchListOrderHomeCare = async () => {
    const res = await listOrderHomecare(patientId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      const mappingDataList = mappingDataOptions(data, "order_id");
      setDataListOrderHomeCare(mappingDataList);
      setLoadingOrderHomeCare(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoadingOrderHomeCare(false);
    }
  };

  const fetchListMedicalRecords = async () => {
    const res = await listTreatment(patientId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      const mappingDataList = mappingDataOptions(data, "treatment_id");
      setDataListMedicalRecords(mappingDataList);
      setLoadingMedicalRecords(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoadingMedicalRecords(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchListOrderUnit();
      fetchListOrderHomeCare();
      fetchListMedicalRecords();
    }
  }, [patientId]);

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <TabContext value={activeTab}>
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        aria-label="forced scroll tabs example"
      >
        {listTabCustomer.map((item) => (
          <Tab
            value={item?.value}
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
            <TabPanel sx={{ p: 0 }} value="orderunit">
              <CustomerOrderUnit
                dataList={dataListOrderUnit}
                loading={loadingOrderUnit}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="orderhomecare">
              <CustomerOrderHomecare
                dataList={dataListOrderHomeCare}
                loading={loadingOrderHomeCare}
              />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="treatment">
              <CustomerMedicalRecords
                dataList={dataListMedicalRecords}
                loading={loadingMedicalRecords}
              />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  );
};

export default CustomerViewRight;
