// ** React Imports
// React and Next.js imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

// Material-UI components and styles
import { styled } from "@mui/material/styles";

// Material-UI Lab components
import MuiTabList from "@mui/lab/TabList";

// Third-party libraries
import toast from "react-hot-toast";

// Custom components and icons
import PageHeader from "src/@core/components/page-header";

// Services and configurations
import { detailTreatment } from "src/services/treatment";
import CustomerMedicalRecordsAccordion from "src/views/customers/detail/CustomerMedicalRecordsAccordion";
import { Grid } from "@mui/material";

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

const DetailTreatment = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id, patientId, tab } = router.query;
  // ** State
  const [activeTab, setActiveTab] = useState("pengkajian-umum");
  const [loading, setLoading] = useState(true);
  const [dataDetail, setDataDetail] = useState({});
  const [dataListTreatment, setDataListTreatment] = useState([]);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    {
      id: 2,
      path: `/customers/detail/${patientId}/?tab=treatment`,
      name: "Customer Detail",
    },
    { id: 3, path: "#", name: "Formulir Perawatan" },
  ];

  const handleChange = (event, value) => {
    console.log("event", event);
    setActiveTab(value);
    router.push(
      {
        pathname,
        query: { patientId, tab: value },
      },
      undefined,
      { shallow: true }
    );
  };

  const fetchDetailTreatment = async () => {
    const res = await detailTreatment(id);
    if (+res?.result?.status === 200) {
      setLoading(false);
      const data = res?.result?.data;
      setDataDetail(data);
      setDataListTreatment(data?.medical_record);
    } else {
      setLoading(false);
      toast.error(`Oops gagal ! ${res?.error}`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailTreatment();
    }
  }, [id]);

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <>
      <PageHeader
        breadCrumbs={breadCrumbs}
        title="Formulir Pengkajian Umum"
        subtitle=""
      />
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={12}>
          <CustomerMedicalRecordsAccordion
            dataDetail={dataDetail}
            dataList={dataListTreatment}
            loading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DetailTreatment;
