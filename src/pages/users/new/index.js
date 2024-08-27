import React, { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { addClinic, listClinic } from "src/services/clinics";
import {
  listActive,
  listBoolean,
  listGender,
  listMaritalStatus,
} from "src/configs/constans";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import PageHeader from "src/@core/components/page-header";
import { listRole } from "src/services/roles";
import { mappingDataOptions } from "src/utils/helpers";
import { addUser } from "src/services/users";
import moment from "moment";
import DropzoneWrapper from "src/@core/styles/libs/react-dropzone";
import FileUploaderSingle from "src/views/users/FileUploaderSingle";

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

const schemaNurse = yup.object().shape({
  role_id: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
      role_id: yup.number().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  username: yup
    .string()
    .min(3, (obj) => showErrors("Username", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  email: yup.string().email().required("Kolom ini harus diisi !"),
  name: yup
    .string()
    .min(3, (obj) => showErrors("Name", obj.value.length, obj.min))
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
  // is_nurse: yup
  //   .object()
  //   .shape({
  //     id: yup.number().required(),
  //     value: yup.number().required(),
  //     label: yup.string().required(),
  //   })
  //   .required("Kolom ini harus diisi !"),
  clinic_id: yup
    .object()
    .shape({
      id: yup.string().required(),
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  is_clinic_pic: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  marital_status: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  nik: yup
    .string()
    .min(16, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  str: yup
    .string()
    .min(10, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  file_str: yup.mixed().required("Required"),
  sipp: yup
    .string()
    .min(10, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  file_sipp: yup.mixed().required("Required"),
  nirappni: yup
    .string()
    .min(10, (obj) => showErrors("NIRAPPNI", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  file_nirappni: yup.mixed().required("Required"),
  ktainwocna: yup
    .string()
    .min(10, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  file_ktainwocna: yup.mixed().required("Required"),
  npwp: yup
    .string()
    .min(16, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  file_npwp: yup.mixed().required("Required"),
});

const schema = yup.object().shape({
  role_id: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
      role_id: yup.number().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  username: yup
    .string()
    .min(3, (obj) => showErrors("Username", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  email: yup.string().email().required("Kolom ini harus diisi !"),
  name: yup
    .string()
    .min(3, (obj) => showErrors("Name", obj.value.length, obj.min))
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
  marital_status: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  nik: yup
    .string()
    .min(16, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
});

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const UserNew = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [clinicOptions, setClinicOptions] = useState([]);
  const [fileStr, setFileStr] = useState(null);
  const [fileSipp, setFileSipp] = useState(null);
  const [fileNirappni, setFileNirappni] = useState(null);
  const [fileKtainwocna, setFileKtainwocna] = useState(null);
  const [fileNpwp, setFileNpwp] = useState(null);
  const [fileAvatar, setFileAvatar] = useState([]);
  const [isNurse, setIsNurse] = useState(false);
  const [isNurseHc, setIsNurseHc] = useState(false);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/users", name: "User" },
    { id: 3, path: "#", name: "User Add" },
  ];

  const defaultValues = {
    role_id: "",
    username: "",
    email: "",
    avatar: "",
    name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    is_nurse: "",
    clinic_id: "",
    is_clinic_pic: "",
    marital_status: "",
    nik: "",
    str: "",
    file_str: "",
    sipp: "",
    file_sipp: "",
    nirappni: "",
    file_nirappni: "",
    ktainwocna: "",
    file_ktainwocna: "",
    npwp: "",
    file_npwp: "",
    operational_radius: "",
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "all",
    resolver: yupResolver(isNurse ? schemaNurse : schema),
  });

  const onSubmit = async (value) => {
    console.log("value submit", value);
    setLoading(true);

    const payload = {
      role_id: value?.role_id?.value,
      username: value?.username,
      email: value?.email,
      avatar: fileAvatar[0],
      name: value?.name,
      gender: value?.gender?.value,
      place_of_birth: value?.place_of_birth,
      date_of_birth: value?.date_of_birth
        ? moment(value?.date_of_birth).format("YYYY-MM-DD")
        : null,
      phone: value?.phone,
      is_nurse:
        +value?.role_id?.value === 13 || +value?.role_id?.value === 16 ? 1 : 0,
      is_active: value?.is_active?.value,
      clinic_id: value?.clinic_id?.value,
      is_clinic_pic: value?.is_clinic_pic?.value,
      marital_status: value?.marital_status?.value,
      nik: value?.nik,
      str: value?.str,
      file_str: fileStr,
      sipp: value?.sipp,
      file_sipp: fileSipp,
      nirappni: value?.nirappni,
      file_nirappni: fileNirappni,
      ktainwocna: value?.ktainwocna,
      file_ktainwocna: fileKtainwocna,
      npwp: value?.npwp,
      file_npwp: fileNpwp,
      operational_radius: value?.operational_radius,
    };

    console.log("payload before post", payload);
    const res = await addUser(payload);
    console.log("res res", res);
    if (+res?.status === 201) {
      setLoading(false);
      toast.success("Berhasil Menambahkan User Baru");
      router.push("/users");
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.message}`);
    }
  };

  const onUpload = (e) => {
    if (Array.isArray(e) && e.length > 0) {
      setFileAvatar(e);
    } else {
      console.error("Invalid files array:", e);
    }
  };

  const fetchListRole = async () => {
    const res = await listRole();
    if (res?.result?.status === 200) {
      const data = res?.result?.data;
      const mappingData = mappingDataOptions(data, "role_id");
      setRoleOptions(mappingData);
    } else {
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  const fetchDataClinic = async () => {
    const res = await listClinic();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      const mappingData = mappingDataOptions(data, "clinic_id");
      setClinicOptions(mappingData);
    } else {
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  useEffect(() => {
    fetchListRole();
    fetchDataClinic();
  }, []);

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
          <PageHeader breadCrumbs={breadCrumbs} title="Tambah Baru" />
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
                          1. Informasi User
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <DropzoneWrapper>
                          <FileUploaderSingle
                            onUpload={onUpload}
                            files={fileAvatar}
                            type={"image"}
                            isColumn
                          />
                        </DropzoneWrapper>
                      </Grid>
                      <Grid item sm={6}>
                        <Grid container spacing={5}>
                          <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                              <Controller
                                name="name"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="Nama"
                                    onChange={onChange}
                                    placeholder="Nama Lengkap"
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
                          <Grid item xs={12} sm={12}>
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
                                    placeholder="Nomor Induk KTP"
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
                          <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                              <Controller
                                name="username"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="Username"
                                    onChange={onChange}
                                    placeholder="Username"
                                    disabled={loading}
                                    error={Boolean(errors.username)}
                                    aria-describedby="validation-basic"
                                  />
                                )}
                              />
                              {errors.username && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.username.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                              <Controller
                                name="email"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <TextField
                                    size="small"
                                    {...field}
                                    label="Email"
                                    disabled={loading}
                                    error={Boolean(errors.email)}
                                    aria-describedby="validation-basic-textarea"
                                  />
                                )}
                              />
                              {errors.email && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic-textarea"
                                >
                                  {errors.email.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                              <Controller
                                name="phone"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <TextField
                                    size="small"
                                    {...field}
                                    label="No Telepon"
                                    disabled={loading}
                                    error={Boolean(errors.phone)}
                                    aria-describedby="validation-basic-textarea"
                                  />
                                )}
                              />
                              {errors.phone && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic-textarea"
                                >
                                  {errors.phone.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        </Grid>
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
                                    label="Jenis Kelamin"
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
                              id="validation-basic-textarea"
                            >
                              {errors.gender.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="place_of_birth"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                size="small"
                                {...field}
                                label="Tempat Lahir"
                                disabled={loading}
                                error={Boolean(errors.place_of_birth)}
                                aria-describedby="validation-basic-textarea"
                              />
                            )}
                          />
                          {errors.place_of_birth && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.place_of_birth.message}
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
                                    required
                                    size="small"
                                    onChange={onChange}
                                    label="Tanggal Lahir"
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
                              id="validation-basic-textarea"
                            >
                              {errors.date_of_birth.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="marital_status"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                value={value}
                                InputLabelProps={{ shrink: true }}
                                required
                                options={listMaritalStatus}
                                id="autocomplete-marital"
                                onChange={(option, e, reason) => {
                                  if (e?.value) {
                                    setValue("marital_status", e);
                                    onChange(e);
                                  }
                                  if (reason === "clear") {
                                    setValue("marital_status", null);
                                  }
                                }}
                                error={Boolean(errors.marital_status)}
                                labelId="marital_status"
                                aria-describedby="marital_status"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Status Perkawinan"
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.marital_status)}
                                  />
                                )}
                              />
                            )}
                          />
                          {errors.marital_status && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.marital_status.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="role_id"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                value={value}
                                InputLabelProps={{ shrink: true }}
                                required
                                options={roleOptions}
                                id="autocomplete-role"
                                onChange={(option, e, reason) => {
                                  if (e?.value) {
                                    setValue("role_id", e);
                                    onChange(e);
                                    if (+e?.value === 13 || +e?.value === 16) {
                                      setIsNurse(true);
                                      if (+e?.value === 16) {
                                        setIsNurseHc(true);
                                      } else {
                                        setIsNurseHc(false);
                                      }
                                    } else {
                                      setIsNurse(false);
                                    }
                                  }
                                  if (reason === "clear") {
                                    setValue("role_id", null);
                                    setIsNurse(false);
                                  }
                                }}
                                error={Boolean(errors.role_id)}
                                labelId="role"
                                aria-describedby="role"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Role"
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.role_id)}
                                  />
                                )}
                              />
                            )}
                          />
                          {errors.role_id && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.role_id.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="is_active"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                value={value}
                                InputLabelProps={{ shrink: true }}
                                required
                                options={listActive}
                                id="autocomplete-is_active"
                                onChange={(option, e, reason) => {
                                  if (e?.value) {
                                    setValue("is_active", e);
                                    onChange(e);
                                  }
                                  if (reason === "clear") {
                                    setValue("is_active", null);
                                  }
                                }}
                                error={Boolean(errors.is_active)}
                                labelId="is_active"
                                aria-describedby="is_active"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Status"
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.is_active)}
                                  />
                                )}
                              />
                            )}
                          />
                          {errors.gender && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.gender.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      {isNurseHc ? (
                        <>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="operational_radius"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="Radius Operasional"
                                    onChange={onChange}
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.operational_radius)}
                                    aria-describedby="validation-basic"
                                  />
                                )}
                              />
                              {errors.operational_radius && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.operational_radius.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                    {isNurse ? (
                      <>
                        <>
                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              2. Informasi Unit/Klinik
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="clinic_id"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    value={value}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    options={clinicOptions}
                                    id="autocomplete-clinic"
                                    onChange={(option, e, reason) => {
                                      if (e?.value) {
                                        setValue("clinic_id", e);
                                        onChange(e);
                                      }
                                      if (reason === "clear") {
                                        setValue("clinic_id", null);
                                      }
                                    }}
                                    error={Boolean(errors.clinic_id)}
                                    labelId="role"
                                    aria-describedby="role"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        label="Clinic"
                                        placeholder=""
                                        disabled={loading}
                                        error={Boolean(errors.clinic_id)}
                                      />
                                    )}
                                  />
                                )}
                              />
                              {errors.clinic_id && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.clinic_id.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="is_clinic_pic"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <Autocomplete
                                    value={value}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    options={listBoolean}
                                    id="autocomplete-is-clinic-pic"
                                    onChange={(option, e, reason) => {
                                      if (e?.value) {
                                        setValue("is_clinic_pic", e);
                                        onChange(e);
                                      }
                                      if (reason === "clear") {
                                        setValue("is_clinic_pic", null);
                                      }
                                    }}
                                    error={Boolean(errors.is_clinic_pic)}
                                    labelId="is-clinic-pic"
                                    aria-describedby="is-clinic-pic"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        label="PIC Klinik/Unit"
                                        placeholder=""
                                        disabled={loading}
                                        error={Boolean(errors.is_clinic_pic)}
                                      />
                                    )}
                                  />
                                )}
                              />
                              {errors.is_clinic_pic && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.is_clinic_pic.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                        <>
                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              3. Informasi Dokumen
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="str"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="Surat Tanda Registrasi (STR)"
                                    onChange={onChange}
                                    placeholder="123456-123456"
                                    disabled={loading}
                                    error={Boolean(errors.str)}
                                    aria-describedby="validation-basic"
                                  />
                                )}
                              />
                              {errors.str && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.str.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="file_str"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    label="Surat Tanda Registrasi (STR) - Document"
                                    onChange={(e) => {
                                      onChange(e);
                                      setFileStr(e.target.files[0]);
                                    }}
                                    placeholder="123456-123456"
                                    disabled={loading}
                                    error={Boolean(errors.file_str)}
                                    aria-describedby="validation-basic"
                                    type="file"
                                  />
                                )}
                              />
                              {errors.file_str && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.file_str.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="sipp"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="SIPP"
                                    onChange={onChange}
                                    placeholder="1234567890"
                                    disabled={loading}
                                    error={Boolean(errors.sipp)}
                                    aria-describedby="validation-basic"
                                  />
                                )}
                              />
                              {errors.sipp && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.sipp.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="file_sipp"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    label="SIPP - Document"
                                    onChange={(e) => {
                                      onChange(e);
                                      setFileSipp(e.target.files[0]);
                                    }}
                                    placeholder="123456-123456"
                                    disabled={loading}
                                    error={Boolean(errors.file_sipp)}
                                    aria-describedby="validation-basic"
                                    type="file"
                                  />
                                )}
                              />
                              {errors.file_sipp && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.file_sipp.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="nirappni"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="NIRAPPNI"
                                    onChange={onChange}
                                    placeholder="1234567890"
                                    disabled={loading}
                                    error={Boolean(errors.nirappni)}
                                    aria-describedby="validation-basic"
                                  />
                                )}
                              />
                              {errors.nirappni && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.nirappni.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="file_nirappni"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    label="NIRAPPNI - Document"
                                    onChange={(e) => {
                                      onChange(e);
                                      setFileNirappni(e.target.files[0]);
                                    }}
                                    placeholder="123456-123456"
                                    disabled={loading}
                                    error={Boolean(errors.file_nirappni)}
                                    aria-describedby="validation-basic"
                                    type="file"
                                  />
                                )}
                              />
                              {errors.file_nirappni && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.file_nirappni.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="ktainwocna"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="KTA INWOCNA"
                                    onChange={onChange}
                                    placeholder="1234567890"
                                    disabled={loading}
                                    error={Boolean(errors.ktainwocna)}
                                    aria-describedby="validation-basic"
                                  />
                                )}
                              />
                              {errors.ktainwocna && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.ktainwocna.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="file_ktainwocna"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    label="KTA INWOCNA - Document"
                                    onChange={(e) => {
                                      onChange(e);
                                      setFileKtainwocna(e.target.files[0]);
                                    }}
                                    placeholder="1234567890"
                                    disabled={loading}
                                    error={Boolean(errors.file_ktainwocna)}
                                    aria-describedby="validation-basic"
                                    type="file"
                                  />
                                )}
                              />
                              {errors.file_ktainwocna && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.file_ktainwocna.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="npwp"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    label="NPWP"
                                    onChange={onChange}
                                    placeholder="12.123.123.1-123.123"
                                    disabled={loading}
                                    error={Boolean(errors.npwp)}
                                    aria-describedby="validation-basic"
                                  />
                                )}
                              />
                              {errors.npwp && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.npwp.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <Controller
                                name="file_npwp"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    label="NPWP - Document"
                                    onChange={(e) => {
                                      onChange(e);
                                      setFileNpwp(e.target.files[0]);
                                    }}
                                    placeholder="123456-123456"
                                    disabled={loading}
                                    error={Boolean(errors.file_npwp)}
                                    aria-describedby="validation-basic"
                                    type="file"
                                  />
                                )}
                              />
                              {errors.file_npwp && (
                                <FormHelperText
                                  sx={{ color: "error.main" }}
                                  id="validation-basic"
                                >
                                  {errors.file_npwp.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        </>
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </CardContent>
                <Divider sx={{ m: "0 !important" }} />
                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    calor="warning"
                    variant="contained"
                    size="small"
                    sx={{ mr: 2, width: "150px" }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    variant="contained"
                    size="small"
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

export default UserNew;
