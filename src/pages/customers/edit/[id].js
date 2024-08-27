import React, { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import DatePicker from "react-datepicker";
import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { addClinic } from "src/services/clinics";
import { listBoolean, listGender } from "src/configs/constans";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import PageHeader from "src/@core/components/page-header";
import { detailCustomer } from "src/services/customers";

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const showErrors = (field, valueLen, min, max = 0) => {
  if (valueLen === 0) {
    return `${field} harus diisi !`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else if (valueLen > 0 && valueLen > max && max > 0) {
    return `${field} must be at least max ${max} characters`;
  } else {
    return "";
  }
};

const schema = yup.object().shape({
  email: yup.string().email().required("Kolom ini harus diisi !"),
  name: yup
    .string()
    .min(3, (obj) => showErrors("Name", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  complete_address: yup
    .string()
    .min(10, (obj) => showErrors("Alamat", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  gender: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  date_of_birth: yup.string().required("Kolom ini harus diisi !"),
  phone: yup
    .string()
    .min(8, (obj) => showErrors("Phone", obj.value.length, obj.min))
    .max(13, (obj) => showErrors("Phone", obj.value.length, obj.min, obj.max))
    .required("Kolom ini harus diisi !"),
  is_main_user: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  nik: yup
    .string()
    .min(16, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  mr: yup
    .string()
    .min(10, (obj) => showErrors("MR", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
});

const CustomerEdit = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [dataDetail, setDataDetail] = useState({});

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/customers", name: "Customers" },
    { id: 3, path: "#", name: "Customer Add" },
  ];

  const defaultValues = {
    name: "",
    phone: "",
    name: "",
    gender: "",
    date_of_birth: "",
    mr: "",
    nik: "",
    is_main_user: "",
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues, mode: "all", resolver: yupResolver(schema) });

  const onSubmit = async (value) => {
    console.log("value submit", value);
    setLoading(true);
    const payload = {};
    const res = await addClinic(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Buat New Clinic Success");
      router.push("/clinic");
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const setDefaultData = (data) => {
    // const formattedDate = data?.date_of_birth
    //   ? moment(data?.date_of_birth).format("DD/MM/YYYY")
    //   : null;
    setValue("name", data?.name);
    setValue("nik", data?.nik);
    setValue("mr", data?.mr);
    setValue("phone", data?.phone);
    setValue("email", data?.email);
    setValue("gender", data?.gender);
    // setValue("date_of_birth", formattedDate);
  };

  const fetchDataDetail = async (patientId) => {
    const res = await detailCustomer(patientId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      setDataDetail(data);
      setDefaultData(data);
      setLoading(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      console.log("ready");
      const patientId = router.query.id;
      setPatientId(patientId);
      fetchDataDetail(patientId);
    }
  }, [router.isReady]);

  return (
    <>
      <DatePickerWrapper>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={6}
        >
          <PageHeader breadCrumbs={breadCrumbs} title="Edit Data Customer" />
          <Grid item xs={12} md={12} lg={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                {/* <CardHeader title="Add New Customer" /> */}
                <Divider sx={{ m: "0 !important" }} />
                <CardContent>
                  <Grid container spacing={5}>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          1. Customer Info
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Name"
                                onChange={onChange}
                                placeholder="Full Name"
                                disabled={loading}
                                error={Boolean(errors.name)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.name && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.name.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="nik"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="NIK"
                                onChange={onChange}
                                placeholder="3170XXXXXXXXXXX"
                                disabled={loading}
                                error={Boolean(errors.nik)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.nik && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.nik.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="gender"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                value={value}
                                InputLabelProps={{ shrink: true }}
                                required
                                options={listGender}
                                id="autocomplete-gender"
                                onChange={(option, e, reason) => {
                                  if (e?.value) {
                                    setValue("gender", e);
                                    onChange(e);
                                  }
                                  if (reason === "clear") {
                                    setValue("gender", null);
                                  }
                                }}
                                error={Boolean(errors.gender)}
                                labelId="gender"
                                aria-describedby="gender"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Gender"
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.gender)}
                                  />
                                )}
                              />
                            )}
                          />
                          {errors.gender && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.gender.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="date_of_birth"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                size="small"
                                selected={value}
                                onChange={(e) => onChange(e)}
                                placeholderText="2000-01-01"
                                showMonthDropdown
                                showYearDropdown
                                disabled={loading}
                                customInput={
                                  <CustomInput
                                    value={value}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    size="small"
                                    onChange={onChange}
                                    label="Date of Birth"
                                    error={Boolean(errors.date_of_birth)}
                                    aria-describedby="date_of_birth"
                                  />
                                }
                              />
                            )}
                          />
                          {errors.date_of_birth && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.date_of_birth.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="phone"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="No Telepon"
                                onChange={onChange}
                                placeholder="0812312312312"
                                disabled={loading}
                                error={Boolean(errors.phone)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.phone && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.phone.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid> */}
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="email"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                label="Email"
                                onChange={onChange}
                                placeholder="customer@mail.com"
                                disabled={loading}
                                error={Boolean(errors.email)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.email && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.email.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="complete_address"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                rows={4}
                                size="small"
                                multiline
                                {...field}
                                label="Alamat"
                                disabled={loading}
                                error={Boolean(errors.complete_address)}
                                aria-describedby="validation-basic-textarea"
                              />
                            )}
                          />
                          {errors.complete_address && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.complete_address.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          1. Patient Info
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="mr"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="No MR"
                                onChange={onChange}
                                placeholder="8090111222333"
                                disabled={loading}
                                error={Boolean(errors.mr)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.mr && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.mr.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="is_main_user"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                value={value}
                                InputLabelProps={{ shrink: true }}
                                required
                                options={listBoolean}
                                id="autocomplete-role"
                                onChange={(option, e, reason) => {
                                  if (e?.value) {
                                    setValue("is_main_user", e);
                                    onChange(e);
                                  }
                                  if (reason === "clear") {
                                    setValue("is_main_user", null);
                                  }
                                }}
                                error={Boolean(errors.is_main_user)}
                                labelId="role"
                                aria-describedby="role"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Is Main Patient"
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.is_main_user)}
                                  />
                                )}
                              />
                            )}
                          />
                          {errors.is_main_user && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.is_main_user.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                  </Grid>
                </CardContent>
                <Divider sx={{ m: "0 !important" }} />
                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link href={`/customers/detail/${patientId}`}>
                    <Button
                      calor="warning"
                      variant="contained"
                      sx={{ mr: 2, width: "150px" }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    color="success"
                    variant="contained"
                    sx={{ width: "150px" }}
                    type="submit"
                    disabled={loading}
                  >
                    {!loading ? "Save" : <CircularProgress size={20} />}
                  </Button>
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </>
  );
};

export default CustomerEdit;
