// ** React Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Material-UI components and styles
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
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
import PageHeader from "src/@core/components/page-header";
import { detailTreatment } from "src/services/treatment";
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

const AddNewTreatment = (props) => {
  const router = useRouter();
  const { id, patientId } = router.query;

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    {
      id: 2,
      path: `/customers/detail/${patientId}/?tab=treatment`,
      name: "Customer Detail",
    },
    { id: 3, path: "#", name: "Formulir Perawatan" },
  ];

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pengkajian-umum");
  const [medicalRecords, setMedicalRecords] = useState(null);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchDetailTreatment = async (treatmentId) => {
    const res = await detailTreatment(treatmentId);
    if (+res?.result?.status === 200) {
      setLoading(false);
      const data = res?.result?.data;
      const dataMedicalRecords =
        +data?.medical_record?.length > 0 ? data?.medical_record[0] : null;
      console.log("data treatment detail", data);
      setMedicalRecords(dataMedicalRecords);
      // setDataDetail(data);
      // setDataListTreatment(data?.medical_record);
    } else {
      setLoading(false);
      toast.error(`Oops gagal ! ${res?.error}`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailTreatment(id);
    }
  }, [id]);

  return (
    <>
      <PageHeader
        breadCrumbs={breadCrumbs}
        title="Formulir Pengkajian Umum"
        subtitle=""
      />
      <TabContext value={activeTab}>
        <TabList
          sx={{ marginTop: 4 }}
          variant="scrollable"
          scrollButtons="auto"
          onChange={handleChange}
          aria-label="forced scroll tabs example"
        >
          {listTreatmentForm.map((item) => (
            // <Tooltip
            //   title="Mohon lengkapi form 'Pengkajian Umum' terlebih dahulu !"
            //   placement="top"
            // >
            <Tab
              key={item?.value}
              value={item?.slug}
              // disabled={item?.slug !== "pengkajian-umum"}
              // disableFocusRipple={item?.slug !== "pengkajian-umum"}
              sx={{
                "& .Mui-disabled": {
                  cursor: "not-allowed",
                },
              }}
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
            // </Tooltip>
          ))}
        </TabList>
        <Box sx={{ mt: 4 }}>
          {loading ? (
            <SpinnerLoadData />
          ) : (
            <>
              <TabPanel sx={{ p: 0 }} value="pengkajian-umum">
                <ContentGeneralAssestment
                  id={id}
                  data={medicalRecords}
                  useEdit={medicalRecords === null}
                />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value="pengkajian-luka">
                <ContentWoundAssestment id={id} data={medicalRecords} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value="data-penunjang">
                <ContentDataSupport id={id} data={medicalRecords} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value="diagnosa-perawatan">
                <ContentWoundDiagnose id={id} data={medicalRecords} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value="tindakan-perawatan">
                <ContentWoundNursingActions id={id} data={medicalRecords} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value="edukasi">
                <ContentWoundEducation id={id} data={medicalRecords} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value="invoice">
                <ContentInvoice id={id} data={medicalRecords} />
              </TabPanel>
            </>
          )}
        </Box>
      </TabContext>
    </>
  );
};

export default AddNewTreatment;
