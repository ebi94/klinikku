import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";

// ** Demo Components Imports
import PageHeader from "src/@core/components/page-header";
import CustomerViewLeft from "src/views/customers/detail/CustomerViewLeft";
import CustomerViewRight from "src/views/customers/detail/CustomerViewRight";

const CustomerView = (props) => {
  const router = useRouter();
  const { id, tab } = router.query;
  console.log("id", id);
  console.log("tab", tab);
  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/customers", name: "Customers List" },
    { id: 3, path: "/customers", name: "Customers Detail" },
  ];
  return (
    <Grid container spacing={6}>
      <PageHeader
        breadCrumbs={breadCrumbs}
        title="Customer Detail"
        subtitle=""
      />
      <Grid item xs={12} md={5} lg={4}>
        <CustomerViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <CustomerViewRight patientId={id} tab={tab} />
      </Grid>
    </Grid>
  );
};

export default CustomerView;
