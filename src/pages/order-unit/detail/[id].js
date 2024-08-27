import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import CustomChip from "src/@core/components/mui/chip";
import { styled } from "@mui/material/styles";
import PageHeader from "src/@core/components/page-header";
import { detailOrderUnit, updateStatusOrderUnit } from "src/services/orderUnit";
import { statusOrderUnit } from "src/configs/constans";
import { selectColor } from "src/utils/helpers";
import TableDetailOrder from "src/views/components/table/TebleDetailOrder";
import TypographyDetailOrder from "src/views/ui/typography/TypographyDetailOrder";
import AddTreatmentDrawer from "src/views/components/drawer/AddTreatmentDrawer";
import CustomerMedicalRecordsAccordion from "src/views/customers/detail/CustomerMedicalRecordsAccordion";

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

const titleStyle = { fontWeight: 500, fontSize: "0.875rem" };

const gridTitle = {
  display: "flex",
  justifyContent: "space-between",
  paddingRight: "10px",
  alignItems: "flex-start",
};

const OrderUnitDetail = () => {
  const router = useRouter();
  const orderId = router.query.id;

  const [loading, setLoading] = useState(true);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);
  const [showEditStatus, setShowEditStatus] = useState(true);
  const [status, setStatus] = useState(statusOrderUnit);
  const [statusSelected, setStatusSelected] = useState("");
  const [dataDetail, setDataDetail] = useState({});
  const [reason, setReason] = useState("");
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/order-unit", name: "Order Unit List" },
    { id: 2, path: "#", name: "Order Detail" },
  ];

  const fetchOrderDetail = async () => {
    const res = await detailOrderUnit(orderId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      setDataDetail(data);
      setLoading(false);
    } else {
      toast.error(`Oops ! ${res?.error}`);
    }
  };

  const handleSubmitChangeStatus = async (status) => {
    setLoadingUpdateStatus(true);
    const payload = {
      status: status,
      reason,
      date: dataDetail?.date,
    };
    const res = await updateStatusOrderUnit(orderId, payload);
    if (+res?.result?.status === 200) {
      fetchOrderDetail();
      setLoadingUpdateStatus(false);
      setOpenChangeStatus(false);
      toast.success(res?.result?.message);
    } else {
      setLoadingUpdateStatus(false);
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  useEffect(() => {
    if (dataDetail?.status === "Booked") {
      const filteredStatus = statusOrderUnit.filter((item) => item.id !== 1);
      setStatus(filteredStatus);
      setShowEditStatus(true);
    }
    if (dataDetail?.status === "Confirmed") {
      const filteredStatus = statusOrderUnit.filter(
        (item) => item.id === 3 || item.id === 4
      );
      setStatus(filteredStatus);
      setShowEditStatus(true);
    }
    if (dataDetail?.status === "Cancelled") {
      setShowEditStatus(false);
    }
  }, [dataDetail?.status]);

  useEffect(() => {
    if (orderId !== undefined) fetchOrderDetail();
  }, [orderId]);

  return (
    <>
      <Grid container spacing={6} className="match-height">
        <PageHeader
          breadCrumbs={breadCrumbs}
          title={`Kode Booking: #${dataDetail?.booking_code}`}
          subtitle=""
        />
        <TableDetailOrder
          title="Detail Order Unit"
          width={{ sm: 6, md: 6 }}
          loading={loading}
          content={
            <>
              <TypographyDetailOrder
                data={{
                  label: "Kode Booking",
                  value: dataDetail?.booking_code,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Status Booking",
                  value: (
                    <CustomChip
                      size="small"
                      skin="dark"
                      color={selectColor(dataDetail?.status)}
                      label={`${dataDetail?.status}`}
                      sx={{
                        "& .MuiChip-label": { textTransform: "capitalize" },
                      }}
                    />
                  ),
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Tanggal Booking",
                  value: dataDetail?.booking_code,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Unit",
                  value: dataDetail?.clinic?.name,
                }}
              />
              {showEditStatus && (
                <Grid container>
                  <Grid item md={8}></Grid>
                  <Grid item md={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setOpenChangeStatus(true)}
                      size="small"
                    >
                      Ubah Status
                    </Button>
                  </Grid>
                </Grid>
              )}
            </>
          }
        />
        <TableDetailOrder
          title="Detail Pasien"
          width={{ sm: 6, md: 6 }}
          loading={loading}
          content={
            <>
              <TypographyDetailOrder
                data={{
                  label: "Nama Lengkap",
                  value: dataDetail?.patient?.name,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Umur",
                  value: dataDetail?.patient?.age,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Tempat, Tgl Lahir",
                  value: `${dataDetail?.patient?.place_of_birth ?? "-"}, ${
                    dataDetail?.patient?.date_of_birth
                  }`,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Nama PIC",
                  value: dataDetail?.patient?.pic_name,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Kontak PIC",
                  value: dataDetail?.patient?.pic_phone,
                }}
              />
            </>
          }
        />
        <TableDetailOrder
          title="Detail Unit/Klinik"
          width={{ sm: 6, md: 6 }}
          loading={loading}
          content={
            <>
              <TypographyDetailOrder
                data={{
                  label: "Unit",
                  value: dataDetail?.clinic?.name,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Alamat",
                  value: dataDetail?.clinic?.complete_address,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "No Telepon",
                  value: dataDetail?.clinic?.phone,
                }}
              />
            </>
          }
        />
        <TableDetailOrder
          title="Invoice"
          width={{ sm: 6, md: 6 }}
          loading={loading}
          content={
            <>
              <TypographyDetailOrder
                data={{
                  label: "Unit",
                  value: dataDetail?.clinic?.name,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "Alamat",
                  value: dataDetail?.clinic?.complete_address,
                }}
              />
              <TypographyDetailOrder
                data={{
                  label: "No Telepon",
                  value: dataDetail?.clinic?.phone,
                }}
              />
              <Grid container>
                <Grid item md={8}></Grid>
                <Grid item md={4}>
                  <Button fullWidth variant="contained" size="small">
                    Buat Invoice
                  </Button>
                </Grid>
              </Grid>
            </>
          }
        />
        <TableDetailOrder
          title="Perawatan"
          width={{ sm: 12, md: 12 }}
          loading={loading}
          content={
            <>
              <Grid container>
                <Grid item md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => setOpenDrawer(true)}
                  >
                    Tambah Perawatan
                  </Button>
                </Grid>
                <Grid item md={10}></Grid>
              </Grid>
              <Box sx={{ marginTop: 4 }} />
              <CustomerMedicalRecordsAccordion />
            </>
          }
        />
      </Grid>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={openChangeStatus}
        onClose={() => setOpenChangeStatus(false)}
      >
        <DialogTitle>Ubah Status Order</DialogTitle>
        <DialogContent>
          <form>
            <FormControl sx={{ mt: 4, mb: 4, width: "100%" }} size="small">
              <InputLabel id="demo-dialog-select-label">Status</InputLabel>
              <Select
                label="Status"
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                disabled={loadingUpdateStatus}
                defaultValue=""
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {status.map((item) => (
                  <MenuItem
                    key={item?.id}
                    value={item?.value}
                    onClick={() => setStatusSelected(item?.label)}
                  >
                    {item?.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            color="warning"
            sx={{ width: "100%" }}
            onClick={() => setOpenChangeStatus(false)}
            variant="contained"
            size="small"
            disabled={loadingUpdateStatus}
          >
            Batalkan
          </Button>
          <Button
            color="success"
            sx={{ width: "100%" }}
            onClick={() => handleSubmitChangeStatus(statusSelected)}
            variant="contained"
            size="small"
            disabled={loadingUpdateStatus}
          >
            {!loadingUpdateStatus ? (
              "Ya, lanjutkan"
            ) : (
              <CircularProgress size={20} />
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <AddTreatmentDrawer
        open={openDrawer}
        toggle={toggleDrawer}
        patientId={dataDetail?.patient?.patient_id}
      />
    </>
  );
};

export default OrderUnitDetail;
