import React, { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { addClinic } from "src/services/clinics";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import PageHeader from "src/@core/components/page-header";
import ButtonSubmit from "src/views/components/buttons/ButtonSubmit";

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

const CustomerMedicalRecordsNew = () => {
  const router = useRouter();
  const patientId = router.query.id;

  const [loading, setLoading] = useState(false);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/customers", name: "Customers" },
    { id: 3, path: `/customers/detail/${patientId}`, name: "Customer Detail" },
    { id: 4, path: `#`, name: "Medical Records" },
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
          <PageHeader
            breadCrumbs={breadCrumbs}
            title="Tambah Medical Records"
          />
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
                          1. Medical Record Info
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <Controller
                            name="date"
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
                                    required
                                    size="small"
                                    onChange={onChange}
                                    label="Date"
                                    error={Boolean(errors.date)}
                                    aria-describedby="date"
                                  />
                                }
                              />
                            )}
                          />
                          {errors.date && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.date.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="main_complaints"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                rows={4}
                                size="small"
                                multiline
                                {...field}
                                label="Main Complaints"
                                disabled={loading}
                                error={Boolean(errors.main_complaints)}
                                aria-describedby="validation-basic-textarea"
                              />
                            )}
                          />
                          {errors.main_complaints && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.main_complaints.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="history"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                rows={4}
                                size="small"
                                multiline
                                {...field}
                                label="History"
                                disabled={loading}
                                error={Boolean(errors.history)}
                                aria-describedby="validation-basic-textarea"
                              />
                            )}
                          />
                          {errors.history && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.history.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                rows={4}
                                size="small"
                                multiline
                                {...field}
                                label="Concomitant Diseases"
                                disabled={loading}
                                error={Boolean(errors.concomitant_diseases)}
                                aria-describedby="validation-basic-textarea"
                              />
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <>
                                <FormLabel>Faktor Penghambat</FormLabel>
                                <FormGroup row>
                                  <FormControlLabel
                                    label="Diabetes"
                                    control={<Checkbox name="basic" />}
                                  />
                                  <FormControlLabel
                                    label="Anemia"
                                    control={<Checkbox name="basic" />}
                                  />
                                  <FormControlLabel
                                    label="Merokok"
                                    control={<Checkbox name="basic" />}
                                  />
                                  <FormControlLabel
                                    label="Rematoid Artitis"
                                    control={<Checkbox name="basic" />}
                                  />
                                  <FormControlLabel
                                    label="Usia"
                                    control={<Checkbox name="basic" />}
                                  />
                                </FormGroup>
                              </>
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <>
                                <FormLabel>Cara Jalan</FormLabel>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  defaultValue="home"
                                  // onChange={(e) =>
                                  //   setCardData({
                                  //     ...cardData,
                                  //     addressType: e.target.value,
                                  //   })
                                  // }
                                >
                                  <FormControlLabel
                                    value="Jalan Sendiri"
                                    control={<Radio />}
                                    label="Jalan Sendiri"
                                  />
                                  <FormControlLabel
                                    value="Kursi Roda"
                                    control={<Radio />}
                                    label="Kursi Roda"
                                  />
                                  <FormControlLabel
                                    value="Bantuan"
                                    control={<Radio />}
                                    label="Bantuan"
                                  />
                                </RadioGroup>
                              </>
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <>
                                <FormLabel>Kondisi Psikologis</FormLabel>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  defaultValue="home"
                                  // onChange={(e) =>
                                  //   setCardData({
                                  //     ...cardData,
                                  //     addressType: e.target.value,
                                  //   })
                                  // }
                                >
                                  <FormControlLabel
                                    value="Baik"
                                    control={<Radio />}
                                    label="Baik"
                                  />
                                  <FormControlLabel
                                    value="Apatis"
                                    control={<Radio />}
                                    label="Apatis"
                                  />
                                  <FormControlLabel
                                    value="Cemas"
                                    control={<Radio />}
                                    label="Cemas"
                                  />
                                  <FormControlLabel
                                    value="Depresi"
                                    control={<Radio />}
                                    label="Depresi"
                                  />
                                </RadioGroup>
                              </>
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <>
                                <FormLabel>
                                  Pasien Mengatakan Tidak Tahu
                                </FormLabel>
                                <FormGroup
                                  row
                                  name="radio-buttons-group"
                                  sx={{ display: "contents" }}
                                  // onChange={(e) =>
                                  //   setCardData({
                                  //     ...cardData,
                                  //     addressType: e.target.value,
                                  //   })
                                  // }
                                >
                                  <FormControlLabel
                                    value="home"
                                    control={<Checkbox />}
                                    label="Tanda dan Gejala Gula Darah Tinggi / Hiperglikemi dan Hipoglikemi"
                                  />
                                  <FormControlLabel
                                    value="1"
                                    control={<Checkbox />}
                                    label="Pola Makan dan Diet bagi Pasien Luka"
                                  />
                                  <FormControlLabel
                                    value="2"
                                    control={<Checkbox />}
                                    label="Perawata Kaki"
                                  />
                                  <FormControlLabel
                                    value="3"
                                    control={<Checkbox />}
                                    label="Senam Kaki dan Senam Diabetes"
                                  />
                                  <FormControlLabel
                                    value="4"
                                    control={<Checkbox />}
                                    label="Komplikasi DM"
                                  />
                                  <FormControlLabel
                                    value="5"
                                    control={<Checkbox />}
                                    label="Manajemen Stress dengan Teknik Tarik Napas Dalam"
                                  />
                                </FormGroup>
                              </>
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          2. Nutrition Status
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <>
                                <FormLabel>Nafsu Makan</FormLabel>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  // onChange={(e) =>
                                  //   setCardData({
                                  //     ...cardData,
                                  //     addressType: e.target.value,
                                  //   })
                                  // }
                                >
                                  <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="Baik"
                                  />
                                  <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="Anoreksia Mual Muntah"
                                  />
                                  <FormControlLabel
                                    value="3"
                                    control={<Radio />}
                                    label="Biasa"
                                  />
                                </RadioGroup>
                              </>
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <>
                                <FormLabel>Frekuensi Makan</FormLabel>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  // onChange={(e) =>
                                  //   setCardData({
                                  //     ...cardData,
                                  //     addressType: e.target.value,
                                  //   })
                                  // }
                                >
                                  <FormControlLabel
                                    value="3"
                                    control={<Radio />}
                                    label="3 x Sehari"
                                  />
                                  <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="2 x Sehari"
                                  />
                                  <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="1 x Sehari"
                                  />
                                </RadioGroup>
                              </>
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="concomitant_diseases"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <>
                                <FormLabel>Pola Makan</FormLabel>
                                <RadioGroup
                                  row
                                  name="radio-buttons-group"
                                  // onChange={(e) =>
                                  //   setCardData({
                                  //     ...cardData,
                                  //     addressType: e.target.value,
                                  //   })
                                  // }
                                >
                                  <FormControlLabel
                                    value="Teratur"
                                    control={<Radio />}
                                    label="Teratur"
                                  />
                                  <FormControlLabel
                                    value="Tidak Teratur"
                                    control={<Radio />}
                                    label="Tidak Teratur"
                                  />
                                </RadioGroup>
                              </>
                            )}
                          />
                          {errors.concomitant_diseases && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.concomitant_diseases.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          3. Physical Status
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <Controller
                            name="weight"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Berat Badan"
                                onChange={onChange}
                                placeholder="70"
                                disabled={loading}
                                error={Boolean(errors.weight)}
                                aria-describedby="validation-basic"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      Kg
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          {errors.weight && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.weight.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <Controller
                            name="height"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Tinggi Badan"
                                onChange={onChange}
                                placeholder="150"
                                disabled={loading}
                                error={Boolean(errors.height)}
                                aria-describedby="validation-basic"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      cm
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          {errors.height && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.height.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <Controller
                            name="blood_preasure"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Tekanan Darah"
                                onChange={onChange}
                                placeholder="120/90"
                                disabled={loading}
                                error={Boolean(errors.blood_preasure)}
                                aria-describedby="validation-basic"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      mmHg
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          {errors.blood_preasure && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.blood_preasure.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <Controller
                            name="temperature"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Suhu Badan"
                                onChange={onChange}
                                placeholder="33"
                                disabled={loading}
                                error={Boolean(errors.temperature)}
                                aria-describedby="validation-basic"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      °C
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          {errors.temperature && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.temperature.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <Controller
                            name="gds"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Gula Darah Sewaktu"
                                onChange={onChange}
                                placeholder="100"
                                disabled={loading}
                                error={Boolean(errors.gds)}
                                aria-describedby="validation-basic"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      °C
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          {errors.gds && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.gds.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <Controller
                            name="date_gds"
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
                                    required
                                    size="small"
                                    onChange={onChange}
                                    label="Waktu (GDS)"
                                    error={Boolean(errors.date_gds)}
                                    aria-describedby="date_gds"
                                  />
                                }
                              />
                            )}
                          />
                          {errors.date_gds && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.date_gds.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="date_gds"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <RadioGroup
                                row
                                name="radio-buttons-group"
                                defaultValue="home"
                                // onChange={(e) =>
                                //   setCardData({
                                //     ...cardData,
                                //     addressType: e.target.value,
                                //   })
                                // }
                              >
                                <FormControlLabel
                                  value="home"
                                  control={<Radio />}
                                  label="Setelah Makan"
                                />
                                <FormControlLabel
                                  value="office"
                                  control={<Radio />}
                                  label="Sebelum Makan"
                                />
                              </RadioGroup>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  </Grid>
                </CardContent>
                <Divider sx={{ m: "0 !important" }} />
                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link href="/customers">
                    <Button
                      calor="warning"
                      variant="contained"
                      sx={{ mr: 2, width: "150px" }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Link>
                  <ButtonSubmit loading={loading} />
                  <Button
                    color="success"
                    variant="contained"
                    sx={{ width: "150px" }}
                    type="submit"
                    disabled={loading}
                  >
                    {!loading ? "Submit" : <CircularProgress size={20} />}
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

export default CustomerMedicalRecordsNew;
