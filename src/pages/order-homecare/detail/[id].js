import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import PropTypes from "prop-types";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import CustomChip from "src/@core/components/mui/chip";
import Icon from "src/@core/components/icon";
import PageHeader from "src/@core/components/page-header";
import {
  detailOrderHomecare,
  updateStatusOrderHomecare,
} from "src/services/orderHomecare";
import { statusOrderHomecare } from "src/configs/constans";
import { mappingDataOptions, selectColor } from "src/utils/helpers";
import UnitListDialog from "src/views/order-homecare/UnitListDialog";
import { listTreatment } from "src/services/treatment";
import EmptyState from "src/views/components/empty-state/EmptyState";
import AddTreatmentDrawer from "src/views/components/drawer/AddTreatmentDrawer";

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

const Row = (props) => {
  const { row } = props;

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          {row?.treatment}
        </TableCell>
        <TableCell align="right">
          {row?.treatment === "Wound"
            ? `Total luka: ${row?.total_wound}`
            : row?.total_eye}
        </TableCell>
        <TableCell align="right">{row?.current_treatment_status}</TableCell>
        <TableCell align="right">
          <Link
            href={`/treatment/detail/${row?.id}/?patientId=${row.patient_id}&bookingId=${row?.booking_id}`}
          >
            <IconButton aria-label="expand row" size="small">
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Link>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const OrderHomeCareDetail = () => {
  const router = useRouter();
  const orderId = router.query.id;
  const userData = JSON.parse(window.localStorage.getItem("userData"));

  const [loading, setLoading] = useState(true);
  const [dataDetail, setDataDetail] = useState({});
  const [showEditStatus, setShowEditStatus] = useState(false);
  const [status, setStatus] = useState(statusOrderHomecare);
  const [openChooseUnit, setOpenChooseUnit] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);
  const [statusSelected, setStatusSelected] = useState("");
  const [reason, setReason] = useState(" ");
  const [dataListTreatment, setDataListTreatment] = useState([]);
  const [loadingDataTreatment, setLoadingDataTreatment] = useState(true);
  const [openTreatment, setOpenTreatment] = useState(false);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/order-homecare", name: "Order Homecare List" },
    { id: 3, path: "#", name: "Order Detail" },
  ];

  const fetchOrderDetail = async () => {
    const res = await detailOrderHomecare(orderId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      setDataDetail(data);
      setLoading(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  const handleSubmitChangeStatus = async (status, clinicId, nurseId) => {
    setLoadingUpdateStatus(true);
    const payload = {
      status: status,
      reason,
      clinic_id: clinicId,
      nurse_id: nurseId,
    };
    const res = await updateStatusOrderHomecare(orderId, payload);
    if (+res?.result?.status === 200) {
      fetchOrderDetail();
      setLoadingUpdateStatus(false);
      setOpenChangeStatus(false);
      setOpenChooseUnit(false);
      toast.success(res?.result?.message);
    } else {
      setLoadingUpdateStatus(false);
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  const fetchListTreatment = async (patientId) => {
    const res = await listTreatment(patientId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      const mappingDataList = mappingDataOptions(data, "treatment_id");
      setDataListTreatment(mappingDataList);
      setLoadingDataTreatment(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoadingDataTreatment(false);
    }
  };

  const toggleTreatment = () => {
    setOpenTreatment(!openTreatment);
  };

  useEffect(() => {
    if (dataDetail?.status === "Booked") {
      const filteredStatus = statusOrderHomecare.filter(
        (item) => item.id === 2 || item.id === 6
      );
      setStatus(filteredStatus);
      setShowEditStatus(true);
    }
    if (dataDetail?.status === "Paid") {
      setShowEditStatus(false);
    }
    if (dataDetail?.status === "Assigned") {
      const filteredStatus = statusOrderHomecare.filter(
        (item) => item.id === 4 || item.id === 6
      );
      setStatus(filteredStatus);
      setShowEditStatus(true);
    }
    if (dataDetail?.status === "In Progress") {
      const filteredStatus = statusOrderHomecare.filter(
        (item) => item.id === 5
      );
      setStatus(filteredStatus);
      setShowEditStatus(true);
    }
    if (dataDetail?.status === "Completed") {
      setShowEditStatus(false);
    }
  }, [dataDetail?.status]);

  useEffect(() => {
    if (orderId !== undefined) fetchOrderDetail();
  }, [orderId]);

  useEffect(() => {
    if (dataDetail?.patient?.patient_id) {
      fetchListTreatment(dataDetail?.patient?.patient_id);
    }
  }, [dataDetail?.patient?.patient_id]);

  return (
    <>
      <Grid container spacing={6} className="match-height">
        <PageHeader
          breadCrumbs={breadCrumbs}
          title={`Kode Booking: #${dataDetail?.booking_code ?? ""}`}
          subtitle=""
        />

        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Order Homecare" />
            <Divider sx={{ my: "0 !important" }} />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress disableShrink sx={{ my: 6 }} />
              </Box>
            ) : (
              <>
                <CardContent sx={{ height: "calc(100% - 120px)" }}>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Kode Booking</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.booking_code}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Status Booking</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        <CustomChip
                          size="small"
                          skin="dark"
                          color={selectColor(dataDetail?.status)}
                          label={`${dataDetail?.status}`}
                          sx={{
                            "& .MuiChip-label": { textTransform: "capitalize" },
                          }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Tanggal Booking</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.date}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                {showEditStatus && (
                  <CardActions>
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
                  </CardActions>
                )}
              </>
            )}
          </Card>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Pasien" />
            <Divider sx={{ my: "0 !important" }} />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress disableShrink sx={{ my: 6 }} />
              </Box>
            ) : (
              <>
                <CardContent sx={{ height: "calc(100% - 120px)" }}>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Nama Lengkap</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.patient?.name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Umur</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.patient?.age}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>
                        Tempat & Tanggal Lahir
                      </Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.patient?.place_of_birth},{" "}
                        {dataDetail?.patient?.date_of_birth}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Nama Wali</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.patient?.pic_name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Kontak Wali</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.patient?.pic_phone}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </>
            )}
          </Card>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Card>
            <CardHeaderStyled title="Detail Transaksi" />
            <Divider sx={{ my: "0 !important" }} />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress disableShrink sx={{ my: 6 }} />
              </Box>
            ) : (
              <>
                <CardContent sx={{ height: "calc(100% - 120px)" }}>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Total</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.transaction?.total ?? "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Metode Pembayaran</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.transaction?.paymnent_method ?? "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }}>
                    <Grid item md={4} sx={gridTitle}>
                      <Typography sx={titleStyle}>Status Pembayaran</Typography>
                      <Typography sx={titleStyle}>:</Typography>
                    </Grid>
                    <Grid item md={8}>
                      <Typography variant="body2">
                        {dataDetail?.clinic?.payment_status ?? "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item md={6}></Grid>
                    <Grid item md={6}>
                      <Button
                        fullWidth
                        color="error"
                        variant="contained"
                        onClick={() => setOpenChangeStatus(true)}
                        size="small"
                        startIcon={<Icon icon="mdi:download" />}
                      >
                        Download Invoice
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </>
            )}
          </Card>
        </Grid>
        {+userData?.data?.role?.role_id !== 16 ? (
          <Grid item md={6} sm={6} xs={12}>
            <Card>
              <CardHeaderStyled title="Detail Perawat" />
              <Divider sx={{ my: "0 !important" }} />
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress disableShrink sx={{ my: 6 }} />
                </Box>
              ) : (
                <>
                  <CardContent sx={{ height: "calc(100% - 120px)" }}>
                    <Grid container sx={{ mb: 2 }}>
                      <Grid item md={4} sx={gridTitle}>
                        <Typography sx={titleStyle}>Nama Perawat</Typography>
                        <Typography sx={titleStyle}>:</Typography>
                      </Grid>
                      <Grid item md={8}>
                        <Typography variant="body2">
                          {dataDetail?.nurse?.name ?? "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ mb: 2 }}>
                      <Grid item md={4} sx={gridTitle}>
                        <Typography sx={titleStyle}>No Telepon</Typography>
                        <Typography sx={titleStyle}>:</Typography>
                      </Grid>
                      <Grid item md={8}>
                        <Typography variant="body2">
                          {dataDetail?.nurse?.phone ?? "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Grid container>
                      <Grid item md={6}></Grid>
                      <Grid item md={6}>
                        <Button
                          color="info"
                          fullWidth
                          variant="contained"
                          onClick={() => setOpenChooseUnit(true)}
                          size="small"
                          startIcon={
                            <Icon icon="mdi:account-convert-outline" />
                          }
                        >
                          Cari Perawat
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </>
              )}
            </Card>
          </Grid>
        ) : (
          <></>
        )}
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <CardHeaderStyled title="Perawatan" />
            <Divider sx={{ my: "0 !important" }} />
            <CardContent sx={{ height: "calc(100% - 120px)" }}>
              {loadingDataTreatment ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress disableShrink sx={{ my: 6 }} />
                </Box>
              ) : dataListTreatment?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Perawatan</TableCell>
                        <TableCell align="right">Keterangan</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {+dataListTreatment?.length > 0 &&
                        dataListTreatment.map((row) => {
                          const tempRow = {
                            booking_id: orderId,
                            ...row,
                          };
                          return <Row key={row.name} row={tempRow} />;
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <EmptyState />
              )}
              <CardActions
                sx={{
                  display: loadingDataTreatment ? "none" : "unset",
                  padding: 4,
                }}
              >
                {+dataListTreatment?.length === 0 ||
                dataListTreatment?.[0]?.current_treatment_status !==
                  "Kembali" ? (
                  <Grid container spacing={2}>
                    <Grid item md={9}></Grid>
                    <Grid item md={3}>
                      <Button
                        color="info"
                        fullWidth
                        variant="contained"
                        onClick={() => toggleTreatment()}
                        size="small"
                        startIcon={<Icon icon="mdi:plus" />}
                      >
                        Tambah Perawatan
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                )}
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
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
            {statusSelected === "Cancelled" ? (
              <FormControl sx={{ mt: 4, mb: 4, width: "100%" }}>
                <TextField
                  required
                  size="small"
                  value={reason}
                  disabled={loadingUpdateStatus}
                  label="Reason"
                  onChange={(e) => setReason(e?.target?.value)}
                  placeholder="Reason"
                  error={+reason?.length === 0}
                />
                {+reason?.length === 0 && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Reason is required
                  </FormHelperText>
                )}
              </FormControl>
            ) : (
              <></>
            )}
          </form>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            color="warning"
            fullWidth
            onClick={() => setOpenChangeStatus(false)}
            variant="contained"
            size="small"
            disabled={loadingUpdateStatus}
          >
            Batalkan
          </Button>
          <Button
            color="success"
            fullWidth
            onClick={() => handleSubmitChangeStatus(statusSelected, "", "")}
            variant="contained"
            size="small"
            disabled={
              loadingUpdateStatus ||
              (reason?.length === 0 && statusSelected === "Cancelled")
            }
          >
            {loadingUpdateStatus ? (
              <CircularProgress size={20} />
            ) : (
              "Ya, lanjutkan"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <UnitListDialog
        loading={loadingUpdateStatus}
        bookingData={dataDetail}
        submitNurse={(clinic, nurse) => {
          handleSubmitChangeStatus(
            "Assigned",
            clinic?.clinic_id,
            nurse?.nurse_id
          );
        }}
        open={openChooseUnit}
        toggle={() => setOpenChooseUnit(!openChooseUnit)}
      />
      <AddTreatmentDrawer
        open={openTreatment}
        toggle={toggleTreatment}
        patientId={dataDetail?.patient?.patient_id}
      />
    </>
  );
};

export default OrderHomeCareDetail;
