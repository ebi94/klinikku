// React and Next.js imports
import React, { useEffect, useState } from "react";

// Third-party libraries for functionality
import { Controller } from "react-hook-form";

// Material-UI components
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// Services and local components
import {
  listBoolean,
  listDiscount,
  listPayment,
  listTreatmentStatus,
} from "src/configs/constans";
import ButtonSubmit from "src/views/components/buttons/ButtonSubmit";
import { Button, FormHelperText } from "@mui/material";
import { updateInvoice } from "src/services/medicalRecords";
import moment from "moment";
import toast from "react-hot-toast";

const defAdditionalPrice = {
  price: "",
  note: "",
  qty: "",
};

const FormInvoice = (props) => {
  const { data, onSubmitData } = props;

  const [loading, setLoading] = useState(false);
  const [additionalPrice, setAdditionalPrice] = useState([]);
  const [approvalNextVisit, setApprovalNextVisit] = useState(false);

  const schema = yup.object().shape({
    next_visit: yup.string().required("Wajib diisi!"),
    payment_type: yup.string().required("Wajib diisi!"),
    treatment_status: yup.string().required("Wajib diisi!"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    setLoading(true);

    const payload = {
      invoice_id: data?.invoice_id,
      next_visit: values?.next_visit
        ? moment(values?.next_visit).format("YYYY-MM-DD HH:mm")
        : "",
      payment_type: values?.payment_type ?? "",
      treatment_status: values?.treatment_status ?? "",
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
  };

  const handleAddPrice = () => {
    const tempData = [...additionalPrice, defAdditionalPrice];
    setAdditionalPrice(tempData);
  };

  const handleRemovePrice = (index) => {
    const tempData = [...additionalPrice];
    tempData.splice(index, 1);
    setAdditionalPrice(tempData);
  };
  const handleChangePrice = (index, val, key) => {
    const tempData = [...additionalPrice];
    let updatedData = { ...tempData[index] };
    updatedData = { ...additionalPrice[index], [key]: val };
    tempData[index] = updatedData;
    setAdditionalPrice([...tempData]);
  };

  useEffect(() => {
    console.log("approvalNextVisit", approvalNextVisit);
  }, [approvalNextVisit]);
  return (
    <>
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ alignItems: "center", display: "flex" }}
          >
            Form Invoice
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ marginTop: 6 }}>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Controller
                    name="approval"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        value={value}
                        options={listBoolean}
                        id="autocomplete-payment-type"
                        onChange={(option, e, reason) => {
                          console.log("e pereset", e);
                          setApprovalNextVisit(+e?.value === 1 ? true : false);

                          if (e?.value) {
                            setValue("payment_type", e?.value);
                            setApprovalNextVisit(
                              +e?.value === 1 ? true : false
                            );
                            onChange(e?.value);
                          }
                          if (reason === "clear") {
                            setValue("payment_type", null);
                          }
                        }}
                        error={Boolean(errors.payment_type)}
                        labelId="payment-type"
                        aria-describedby="payment-type"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="approval"
                            size="small"
                            label="Persetujuan untuk Perawatan Berikutnya ?"
                            placeholder=""
                            disabled={loading}
                            error={Boolean(errors.payment_type)}
                          />
                        )}
                      />
                    )}
                  />
                  {errors.payment_type && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.payment_type.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                {approvalNextVisit ? (
                  <>
                    <FormControl fullWidth error={Boolean(errors.next_visit)}>
                      <Controller
                        name="next_visit"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={loading}
                            size="small"
                            type="datetime-local"
                            //   defaultValue={new Date()}
                            label="Kunjungan Berikutnya"
                            InputLabelProps={{ shrink: true }}
                            error={Boolean(errors.next_visit)}
                            fullWidth
                          />
                        )}
                      />
                      {errors.next_visit && (
                        <FormHelperText sx={{ color: "error.main" }}>
                          {errors.next_visit.message}
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
                  <Controller
                    name="treatment_status"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        value={value}
                        options={listTreatmentStatus}
                        id="autocomplete-treatment-status"
                        onChange={(option, e, reason) => {
                          if (e?.value) {
                            setValue("treatment_status", e?.value);
                            onChange(e?.value);
                          }
                          if (reason === "clear") {
                            setValue("treatment_status", null);
                          }
                        }}
                        error={Boolean(errors.treatment_status)}
                        labelId="treatment-status"
                        aria-describedby="treatment-status"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="treatment_status"
                            size="small"
                            label="Status Perawatan"
                            placeholder=""
                            disabled={loading}
                            error={Boolean(errors.treatment_status)}
                          />
                        )}
                      />
                    )}
                  />
                  {errors.treatment_status && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.treatment_status.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Controller
                    name="payment_type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        value={value}
                        options={listPayment}
                        id="autocomplete-payment-type"
                        onChange={(option, e, reason) => {
                          if (e?.value) {
                            setValue("payment_type", e?.value);
                            onChange(e?.value);
                          }
                          if (reason === "clear") {
                            setValue("payment_type", null);
                          }
                        }}
                        error={Boolean(errors.payment_type)}
                        labelId="payment-type"
                        aria-describedby="payment-type"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="payment_type"
                            size="small"
                            label="Metode Pembayaran"
                            placeholder=""
                            disabled={loading}
                            error={Boolean(errors.payment_type)}
                          />
                        )}
                      />
                    )}
                  />
                  {errors.payment_type && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.payment_type.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <>
              <Box sx={{ marginTop: 4 }} />
              <Divider />
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  alignItems: "center",
                  display: "flex",
                  fontSize: "18px !important",
                  mt: 4,
                }}
              >
                Biaya Tambahan
              </Typography>
              <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      disabled={loading}
                      size="small"
                      label="Keterangan"
                      value={additionalPrice[0]?.note}
                      onChange={(e) =>
                        handleChangePrice(0, e.target.value, "note")
                      }
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <FormControl fullWidth>
                    <TextField
                      disabled={loading}
                      size="small"
                      label="Qty"
                      type="number"
                      value={additionalPrice[0]?.qty}
                      onChange={(e) =>
                        handleChangePrice(0, e.target.value, "qty")
                      }
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField
                      disabled={loading}
                      size="small"
                      label="Harga"
                      value={additionalPrice[0]?.price}
                      onChange={(e) =>
                        handleChangePrice(0, e.target.value, "price")
                      }
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                {+additionalPrice?.length > 1 && (
                  <>
                    <Grid
                      item
                      xs={6}
                      sm={1}
                      sx={{
                        display: { xs: "block", md: "none" },
                      }}
                    />
                    <Grid item xs={6} sm={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={() => handleRemovePrice(0)}
                      >
                        <Icon icon="mdi:trash" />
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
              {+additionalPrice?.length > 1 &&
                additionalPrice.slice(1).map((item, index) => (
                  <>
                    <Box sx={{ marginTop: 3 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <TextField
                            disabled={loading}
                            size="small"
                            label="Keterangan"
                            value={additionalPrice[+index + 1]?.note}
                            onChange={(e) =>
                              handleChangePrice(
                                +index + 1,
                                e.target.value,
                                "note"
                              )
                            }
                            fullWidth
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <FormControl fullWidth>
                          <TextField
                            disabled={loading}
                            size="small"
                            label="Qty"
                            type="number"
                            value={additionalPrice[+index + 1]?.qty}
                            onChange={(e) =>
                              handleChangePrice(
                                +index + 1,
                                e.target.value,
                                "qty"
                              )
                            }
                            fullWidth
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <TextField
                            disabled={loading}
                            size="small"
                            label="Harga"
                            value={additionalPrice[+index + 1]?.price}
                            onChange={(e) =>
                              handleChangePrice(
                                +index + 1,
                                e.target.value,
                                "price"
                              )
                            }
                            fullWidth
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sm={1}
                        sx={{
                          display: { xs: "block", md: "none" },
                        }}
                      />
                      <Grid item xs={6} sm={1}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="error"
                          onClick={() => handleRemovePrice(+index + 1)}
                        >
                          <Icon icon="mdi:trash" />
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider
                      sx={{
                        display: { xs: "block", md: "none" },
                        mt: { xs: 3, md: 0 },
                      }}
                    />
                  </>
                ))}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={6} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleAddPrice()}
                  >
                    <Icon icon="mdi:plus" />
                  </Button>
                </Grid>
              </Grid>
            </>
            <>
              <Box sx={{ marginTop: 4 }} />
              <Divider />
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  alignItems: "center",
                  display: "flex",
                  fontSize: "18px !important",
                  mt: 4,
                }}
              >
                Diskon
              </Typography>
              <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth size="small">
                    <Controller
                      name="discount_type"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          value={value}
                          options={listDiscount}
                          id="autocomplete-discount-type"
                          onChange={(option, e, reason) => {
                            setApprovalNextVisit(
                              +e?.value === 1 ? true : false
                            );
                            if (e?.value) {
                              setValue("discount_type", e?.value);
                              setApprovalNextVisit(
                                +e?.value === 1 ? true : false
                              );
                              onChange(e?.value);
                            }
                            if (reason === "clear") {
                              setValue("discount_type", null);
                            }
                          }}
                          error={Boolean(errors.discount_type)}
                          labelId="discount-type"
                          aria-describedby="discount-type"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="approval"
                              size="small"
                              label="Tipe Diskon"
                              placeholder=""
                              disabled={loading}
                              error={Boolean(errors.discount_type)}
                            />
                          )}
                        />
                      )}
                    />
                    {errors.payment_type && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.payment_type.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <FormControl fullWidth>
                    <TextField
                      disabled={loading}
                      size="small"
                      label="Jumlah Diskon"
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </>
            <Box sx={{ marginTop: 4 }} />
            <Divider />

            <Box sx={{ marginTop: 4 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={9}></Grid>
              <Grid item xs={12} sm={3}>
                <ButtonSubmit loading={loading} />
              </Grid>
            </Grid>
          </form>
          <Box sx={{ marginTop: 4 }} />
        </CardContent>
      </Card>
    </>
  );
};

export default FormInvoice;
