import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import PageHeader from "src/@core/components/page-header";
import SpinnerLoadData from "src/@core/components/spinner-load-data";
import { detailTransactions } from "src/services/transactions";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import DetailInvoice from "src/views/treatments/detail/DetailInvoice";

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.customColors.tableHeaderBg,
  "&.MuiCardHeader-root": {
    padding: "1rem 1.25rem !important",
  },
  "&.MuiCardHeader-title": {
    fontSize: "1rem",
    color: theme.palette.customColors.darkBg,
  },
}));

const TransactionDetail = ({ tab, invoiceData }) => {
  const router = useRouter();
  const transactionId = router.query.id;
  console.log("id", transactionId);

  const [dataDetail, setDataDetail] = useState({});
  const [loading, setLoading] = useState(true);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/transactions", name: "Transactions List" },
    { id: 2, path: "#", name: `Transactions Detail #${transactionId}` },
  ];

  const fetchDataDetail = async (id) => {
    const res = await detailTransactions(id);
    if (+res?.result?.status === 200) {
      setLoading(false);
      const data = res?.result?.data;
      setDataDetail(data);
      console.log("res tr", res);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      console.error(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      fetchDataDetail(transactionId);
    }
  }, [transactionId]);

  return (
    <Grid container spacing={6}>
      <PageHeader breadCrumbs={breadCrumbs} title="Transactions Detail" />
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <SpinnerLoadData />
        </Box>
      ) : (
        <>
          <Grid item md={6} sm={6} xs={12}>
            <Card>
              <CardHeaderStyled title="Detail Pembayaran" />
              <Divider sx={{ my: "0 !important" }} />
              <CardContent></CardContent>
            </Card>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Card>
              <CardHeaderStyled title="Detail Pembayaran" />
              <Divider sx={{ my: "0 !important" }} />
              <CardContent></CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12}>
            <DetailInvoice data={dataDetail} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default TransactionDetail;
