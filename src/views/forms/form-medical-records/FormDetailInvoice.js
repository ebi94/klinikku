import React, { useEffect, useState } from "react";
// ** MUI Imports
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";

// ** Configs
import themeConfig from "src/configs/themeConfig";
import { formatRupiah } from "src/utils/helpers";

// Material-UI components
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// Services and local components
import { Button, CardActions } from "@mui/material";
import {
  listBoolean,
  listDiscount,
  listPayment,
  listTreatmentStatus,
} from "src/configs/constans";
import {
  calculatePriceInvoice,
  updateInvoice,
} from "src/services/medicalRecords";
import toast from "react-hot-toast";
import moment from "moment";

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: "0 !important",
  paddingRight: "0 !important",
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`,
}));

const CalcWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:not(:last-of-type)": {
    marginBottom: theme.spacing(2),
  },
}));

const defAdditionalData = {
  name: "",
  qty: "",
  price: "",
};

const defDiscountData = {
  type: null,
  description: "-",
  amount: "",
};

const FormDetailInvoice = (props) => {
  const { data, onSubmitData } = props;

  console.log("data detail", data);

  const [loading, setLoading] = useState(false);
  const [additionalData, setAdditionalData] = useState(defAdditionalData);
  const [discountData, setDiscountData] = useState(defDiscountData);
  const [additionalList, setAdditionalList] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [errorAdditional, setErrorAdditional] = useState({
    name: false,
    qty: false,
    price: false,
  });
  const [discountNominal, setDiscountNominal] = useState();
  const [errorDiscount, setErrorDiscount] = useState({
    description: false,
    amount: false,
    type: false,
  });
  const [approvalNextVisit, setApprovalNextVisit] = useState("");
  const [dateNextVisit, setDateNextVisit] = useState("");
  const [treatmentStatus, setTreatmentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [taxAmount, setTaxAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [errorSubmit, setErrorSubmit] = useState({
    approvalNextVisit: false,
    dateNextVisit: false,
    treatmentStatus: false,
    paymentMethod: false,
  });

  const handleErrorAdditional = () => {
    let hasError = false;
    let tempError = { ...errorAdditional };

    // Cek setiap field dan set error jika field kosong
    Object.keys(additionalData).forEach((key) => {
      if (additionalData[key] === "" || additionalData[key] === null) {
        tempError[key] = true;
        hasError = true;
      } else {
        tempError[key] = false;
      }
    });

    setErrorAdditional(tempError);

    return hasError;
  };

  const handleErrorDiscount = () => {
    let hasError = false;
    let tempError = { ...errorDiscount };
    console.log("tempError", tempError);

    // Cek setiap field dan set error jika field kosong
    Object.keys(discountData).forEach((key) => {
      if (discountData[key] === "" || discountData[key] === null) {
        console.log(discountData[key], key);
        tempError[key] = true;
        hasError = true;
      } else {
        tempError[key] = false;
      }
    });

    setErrorDiscount(tempError);

    return hasError;
  };

  const handleErrorSubmit = () => {
    let hasError = false;
    let tempError = { ...errorSubmit };
    console.log("tempError", tempError);

    let submitData;

    if (approvalNextVisit === "Iya") {
      submitData = {
        approvalNextVisit,
        dateNextVisit,
        treatmentStatus,
        paymentMethod,
      };
    } else {
      submitData = {
        approvalNextVisit,
        treatmentStatus,
        paymentMethod,
      };
    }

    // Cek setiap field dan set error jika field kosong
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === "" || submitData[key] === null) {
        console.log(submitData[key], key);
        tempError[key] = true;
        hasError = true;
      } else {
        tempError[key] = false;
      }
    });

    setErrorSubmit(tempError);

    return hasError;
  };

  const handleAddDiscount = () => {
    const hasError = handleErrorDiscount();

    if (!hasError) {
      fetcCalculatePrice();
    }
  };

  const handleAddAdditional = () => {
    const hasError = handleErrorAdditional();

    if (!hasError) {
      const defAdditionalList = {
        price: additionalData?.price,
        name: additionalData?.name,
        qty: additionalData?.qty,
        total: +additionalData?.qty * additionalData?.price,
      };

      const tempData = [...additionalList, defAdditionalList];
      setAdditionalList(tempData);
      setAdditionalData(defAdditionalData);
    }
  };

  const handleRemovePrice = (index) => {
    const tempData = [...additionalList];
    tempData.splice(index, 1);
    setAdditionalList(tempData);
    fetcCalculatePrice();
  };

  const handleChangeAdditionalData = (val, key) => {
    const tempData = { ...additionalData, [key]: val };
    const tempError = { ...errorAdditional, [key]: val !== "" ? false : true };
    setErrorAdditional(tempError);
    setAdditionalData(tempData);
  };

  const handleChangeDiscount = (val, key) => {
    const tempData = { ...discountData, [key]: val };
    const tempError = { ...errorDiscount, [key]: val !== "" ? false : true };
    setErrorDiscount(tempError);
    setDiscountData(tempData);
  };

  const handleRemoveDiscount = () => {
    setDiscountData(defDiscountData);
    setErrorDiscount({
      description: false,
      amount: false,
      type: false,
    });
    fetcCalculatePrice();
  };

  const fetcCalculatePrice = async () => {
    const mappingDataAdditional = additionalList.map((item) => {
      return {
        name: item?.name,
        qty: item?.qty,
        unit_price: item?.price,
        total: item?.total,
      };
    });
    const payload = {
      invoice_id: data?.invoice_id,
      additional_price: mappingDataAdditional,
      discount_type: discountData?.type ?? "Nominal",
      discount_description: discountData?.description ?? "-",
      discount_amount: +discountData?.amount,
    };
    const res = await calculatePriceInvoice(payload);
    console.log("data calc", res);

    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      setGrandTotal(+data?.total_price);
      setTaxAmount(+data?.tax_total);
      setDiscountNominal(+data?.discount_total);
      setSubTotal(+data?.sub_total);
    }
  };

  const handleSubmitInvoice = async () => {
    setLoading(true);
    const hasError = handleErrorSubmit();

    if (!hasError) {
      const mappingDataAdditional = additionalList.map((item) => {
        return {
          name: item?.name,
          qty: item?.qty,
          unit_price: item?.price,
          total: item?.total,
        };
      });
      const payload = {
        invoice_id: data?.invoice_id,
        next_visit: dateNextVisit
          ? moment(dateNextVisit).format("YYYY-MM-DD HH:mm")
          : "",
        payment_type: paymentMethod ?? "",
        treatment_status: treatmentStatus ?? "",
        additional_price: mappingDataAdditional,
        discount_type: discountData?.type ?? "Nominal",
        discount_description: discountData?.description ?? "-",
        discount_amount: +discountData?.amount,
        is_scheduled_for_next_visit: approvalNextVisit === "Iya" ? "1" : "0",
      };

      console.log(payload);
      const res = await updateInvoice(payload);
      if (+res?.result?.status === 200) {
        setLoading(false);
        onSubmitData();
        toast.success("Berhasil mengubah data");
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    }
  };

  useEffect(() => {
    fetcCalculatePrice();
  }, [additionalList, discountData]);

  useEffect(() => {
    if (data?.tax_total) setTaxAmount(+data?.tax_total);
    if (data?.total_price) setGrandTotal(+data?.total_price);
    if (data?.sub_total) setSubTotal(+data?.sub_total);
  }, [data]);

  return (
    <Card>
      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Grid container>
          <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: 6, display: "flex", alignItems: "center" }}>
                <Image src="/images/example-logo.png" width={35} height={35} />
                <Typography
                  variant="h6"
                  sx={{
                    ml: 2.5,
                    fontWeight: 600,
                    lineHeight: "normal",
                    textTransform: "uppercase",
                  }}
                >
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <div>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  PT KlinikKu
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Jakarta, Indonesia
                </Typography>
                <Typography variant="body2">+62 (21) 456 7891</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              <Table sx={{ maxWidth: "350px" }}>
                <TableBody>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="h6">Invoice</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography variant="h6">{`${data?.invoice_no}`}</Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2">Date Issued:</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {data?.date}
                      </Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2">Date Due:</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {data?.date}
                      </Typography>
                    </MUITableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant="body2" sx={{ mb: 3.5, fontWeight: 600 }}>
              Invoice To:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data?.pasien?.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data?.pasien?.complete_address}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data?.pasien?.phone}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: ["flex-start", "flex-end"],
            }}
          >
            <div>
              <Typography variant="body2" sx={{ mb: 3.5, fontWeight: 600 }}>
                Bill To:
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>Total Due:</MUITableCell>
                      <MUITableCell>
                        {formatRupiah(data?.total_price)}
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>Bank name:</MUITableCell>
                      <MUITableCell>BCA</MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>No Rekening:</MUITableCell>
                      <MUITableCell>12344567</MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <TableContainer sx={{ paddingLeft: 8, paddingRight: 8 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "30%" }}>Nama</TableCell>
              <TableCell sx={{ width: "15%" }}>Qty</TableCell>
              <TableCell sx={{ width: "25%", textAlign: "end" }}>
                Harga Satuan
              </TableCell>
              <TableCell sx={{ width: "25%", textAlign: "end" }}>
                Total
              </TableCell>
              <TableCell sx={{ width: "5%" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {+data?.items?.length > 0 &&
              data?.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell dangerouslySetInnerHTML={{ __html: item?.name }} />
                  <TableCell>{item?.qty}</TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    {formatRupiah(item?.unit_price)}
                    {item?.unit ?? ""}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    {formatRupiah(item?.total)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
            {+additionalList?.length > 0 &&
              additionalList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell dangerouslySetInnerHTML={{ __html: item?.name }} />
                  <TableCell>{item?.qty}</TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    {formatRupiah(item?.price)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    {formatRupiah(item?.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleRemovePrice(index)}
                    >
                      <Icon icon="mdi:trash" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  <TextField
                    disabled={loading}
                    size="small"
                    label="Nama"
                    error={Boolean(errorAdditional?.name)}
                    value={additionalData?.name}
                    onChange={(e) =>
                      handleChangeAdditionalData(e.target.value, "name")
                    }
                    fullWidth
                  />
                  {errorAdditional?.name && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      Harus diisi !
                    </FormHelperText>
                  )}
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <TextField
                    disabled={loading}
                    size="small"
                    label="Qty"
                    error={Boolean(errorAdditional?.qty)}
                    type="number"
                    value={additionalData?.qty}
                    onChange={(e) =>
                      handleChangeAdditionalData(e.target.value, "qty")
                    }
                    fullWidth
                  />
                  {errorAdditional?.qty && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      Harus diisi !
                    </FormHelperText>
                  )}
                </FormControl>
              </TableCell>
              <TableCell sx={{ textAlign: "end" }}>
                <FormControl fullWidth>
                  <TextField
                    disabled={loading}
                    size="small"
                    label="Harga Satuan"
                    type="number"
                    error={Boolean(errorAdditional?.price)}
                    value={additionalData?.price}
                    onChange={(e) =>
                      handleChangeAdditionalData(e.target.value, "price")
                    }
                    fullWidth
                  />
                  {errorAdditional?.price && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      Harus diisi !
                    </FormHelperText>
                  )}
                </FormControl>
              </TableCell>
              <TableCell sx={{ textAlign: "end" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleAddAdditional()}
                  startIcon={<Icon icon="mdi:plus" />}
                >
                  Biaya Tambahan
                </Button>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ marginTop: 4 }} />
      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Typography variant="body2">
          <strong>Diskon :</strong> <br />
        </Typography>
        <>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
            sx={{ mt: 2 }}
          >
            <Grid item xs={6} sm={2}>
              <FormControl fullWidth>
                <Autocomplete
                  disableClearable
                  value={discountData?.type}
                  options={listDiscount}
                  error={Boolean(errorDiscount?.type)}
                  id="autocomplete-discount-type"
                  onChange={(option, e, reason) => {
                    if (e?.value) {
                      handleChangeDiscount(e?.value, "type");
                    }
                  }}
                  // error={Boolean(errors.discount_type)}
                  labelId="discount-type"
                  aria-describedby="discount-type"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="approval"
                      size="small"
                      error={Boolean(errorDiscount?.type)}
                      label="Tipe Diskon"
                      placeholder=""
                      disabled={loading}
                      // error={Boolean(errors.discount_type)}
                    />
                  )}
                />
                {errorDiscount?.type && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Harus diisi !
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  disabled={loading}
                  size="small"
                  label="Jumlah Diskon"
                  value={discountData?.amount}
                  error={Boolean(errorDiscount?.amount)}
                  onChange={(e) =>
                    handleChangeDiscount(e.target.value, "amount")
                  }
                  type="number"
                  fullWidth
                />
                {errorDiscount?.amount && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Harus diisi !
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  disabled={loading}
                  size="small"
                  label="Keterangan"
                  error={Boolean(errorDiscount?.description)}
                  value={discountData?.description}
                  onChange={(e) =>
                    handleChangeDiscount(e.target.value, "description")
                  }
                  fullWidth
                />
                {errorDiscount?.description && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Harus diisi !
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleAddDiscount()}
                startIcon={<Icon icon="mdi:plus" />}
              >
                Diskon
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleRemoveDiscount()}
                startIcon={<Icon icon="mdi:trash" />}
              >
                Hapus
              </Button>
            </Grid>
          </Grid>
        </>
      </CardContent>
      <Divider />
      <Divider sx={{ marginTop: 4 }} />
      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Typography variant="body2">
          <strong>Status Perawatan :</strong> <br />
        </Typography>
        <>
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth size="small">
                <Autocomplete
                  value={approvalNextVisit}
                  disableClearable
                  options={listBoolean}
                  id="autocomplete-payment-type"
                  onChange={(option, e, reason) => {
                    setApprovalNextVisit(e?.value);
                    handleErrorSubmit();
                  }}
                  onMouseLeave={() => handleErrorSubmit()}
                  error={Boolean(errorSubmit?.approvalNextVisit)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="approval"
                      size="small"
                      label="Persetujuan untuk Perawatan Berikutnya ?"
                      placeholder=""
                      error={Boolean(errorSubmit?.approvalNextVisit)}
                      disabled={loading}
                    />
                  )}
                />
                {errorSubmit?.approvalNextVisit && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Harus diisi !
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              {approvalNextVisit === "Iya" ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      disabled={loading}
                      size="small"
                      type="datetime-local"
                      value={dateNextVisit}
                      onChange={(e) => {
                        setDateNextVisit(e.target.value);
                        handleErrorSubmit();
                      }}
                      onMouseLeave={() => handleErrorSubmit()}
                      label="Kunjungan Berikutnya"
                      error={Boolean(errorSubmit?.dateNextVisit)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    {errorDiscount?.dateNextVisit && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        Harus diisi !
                      </FormHelperText>
                    )}
                  </FormControl>
                </>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth size="small">
                <Autocomplete
                  disableClearable
                  value={treatmentStatus}
                  onChange={(option, e, reason) => {
                    setTreatmentStatus(e?.value);
                    handleErrorSubmit();
                  }}
                  onMouseLeave={() => handleErrorSubmit()}
                  options={listTreatmentStatus}
                  id="autocomplete-treatment-status"
                  labelId="treatment-status"
                  aria-describedby="treatment-status"
                  error={Boolean(errorSubmit?.treatmentStatus)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="treatment_status"
                      size="small"
                      label="Status Perawatan"
                      placeholder=""
                      error={Boolean(errorSubmit?.treatmentStatus)}
                      disabled={loading}
                    />
                  )}
                />
                {errorSubmit?.treatmentStatus && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Harus diisi !
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth size="small">
                <Autocomplete
                  disableClearable
                  value={paymentMethod}
                  onChange={(option, e, reason) => {
                    setPaymentMethod(e?.value);
                    handleErrorSubmit();
                  }}
                  onMouseLeave={() => handleErrorSubmit()}
                  options={listPayment}
                  id="autocomplete-payment-type"
                  labelId="payment-type"
                  aria-describedby="payment-type"
                  error={Boolean(errorSubmit?.paymentMethod)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="payment_type"
                      size="small"
                      label="Metode Pembayaran"
                      placeholder=""
                      error={Boolean(errorSubmit?.paymentMethod)}
                      disabled={loading}
                    />
                  )}
                />
                {errorSubmit?.paymentMethod && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    Harus diisi !
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </>
      </CardContent>
      <Divider />
      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Grid container>
          <Grid item xs={12} sm={6} lg={8} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                Perawat:
              </Typography>
              <Typography variant="body2">{data?.created_by}</Typography>
            </Box>

            <Typography variant="body2">
              Terima Kasih, semoga lekas sembuh
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}
          >
            <CalcWrapper>
              <Typography variant="body2" sx={{ width: "30%" }}>
                Sub Total
              </Typography>
              <Typography> : </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "end", width: "50%" }}
              >
                {formatRupiah(+subTotal)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2" sx={{ width: "30%" }}>
                Diskon
              </Typography>
              <Typography> : </Typography>
              <Typography
                variant="body2"
                color="error"
                sx={{ fontWeight: 600, textAlign: "end", width: "50%" }}
              >
                (- {formatRupiah(discountNominal)})
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2" sx={{ width: "30%" }}>
                Pajak (11%)
              </Typography>
              <Typography> : </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "end", width: "50%" }}
              >
                {formatRupiah(taxAmount)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2" sx={{ width: "30%" }}>
                Grand Total
              </Typography>
              <Typography> : </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "end", width: "50%" }}
              >
                {formatRupiah(grandTotal)}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Typography variant="body2">
          <strong>Note:</strong> <br />
          {data?.next_visit ? `Kunjungan Berikutnya : ${data?.next_visit}` : ""}
          <br />
          {data?.treatment_status
            ? `Status Perawatan : ${data?.treatment_status}`
            : ""}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={10}></Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleSubmitInvoice()}
            >
              Submit Invoice
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default FormDetailInvoice;
