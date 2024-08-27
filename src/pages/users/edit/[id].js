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
import { useForm, Controller } from "react-hook-form";
import { addClinic, listClinic } from "src/services/clinics";
import {
  listBoolean,
  listGender,
  listMaritalStatus,
} from "src/configs/constans";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import PageHeader from "src/@core/components/page-header";
import { listRole } from "src/services/roles";
import { mappingDataOptions } from "src/utils/helpers";
import { detailUser } from "src/services/users";

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const UserEdit = () => {
  const router = useRouter();
  const userId = router.query.id;

  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);
  const [clinicOptions, setClinicOptions] = useState([]);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/users", name: "User" },
    { id: 3, path: "#", name: "User Edit" },
  ];

  const defaultValues = {
    name: "",
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (value) => {
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

  const fetchDataDetail = async (id) => {
    const res = await detailUser(id);
    if (+res?.result?.status === 200) {
      setDataDetail(res?.result?.data);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const setDefaultData = (data) => {
    const selectedGender = listGender.filter(
      (filter) => filter?.value === data?.gender
    )?.[0];
    console.log(selectedGender);
    setValue("name", data?.name);
    setValue("username", data?.username);
    setValue("nik", data?.nik);
    setValue("email", data?.email);
    setValue("phone", data?.phone);
    setValue("str", data?.str);
    setValue("sipp", data?.sipp);
    setValue("nirappni", data?.nirappni);
    setValue("ktainwocna", data?.ktainwocna);
    setValue("npwp", data?.npwp);
    setValue("gender", selectedGender);
  };

  useEffect(() => {
    if (dataDetail) {
      setDefaultData(dataDetail);
    }
  }, [dataDetail]);

  useEffect(() => {
    fetchListRole();
    fetchDataClinic();
  }, []);

  useEffect(() => {
    if (userId) fetchDataDetail(userId);
  }, [userId]);

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
            title={`Edit User - ${dataDetail?.name}`}
          />
          <Grid item xs={12} md={12} lg={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <Divider sx={{ m: "0 !important" }} />
                <CardContent>
                  <Grid container spacing={5}>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          1. User Information
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
                                InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
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
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="username"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                InputLabelProps={{ shrink: true }}
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
                      <Grid item xs={12} sm={6}>
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
                                InputLabelProps={{ shrink: true }}
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
                                    console.log("gender", e);
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
                                    InputLabelProps={{ shrink: true }}
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
                            name="date_of_birth"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                size="small"
                                selected={value}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => onChange(e)}
                                placeholderText="2000-01-01"
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
                                onChange={onChange}
                                error={Boolean(errors.marital_status)}
                                labelId="marital_status"
                                aria-describedby="marital_status"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    label="Marital Status"
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
                                onChange={onChange}
                                error={Boolean(errors.role_id)}
                                labelId="role"
                                aria-describedby="role"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    InputLabelProps={{ shrink: true }}
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
                    </>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          3. Clinic Information
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
                                id="autocomplete-role"
                                onChange={onChange}
                                error={Boolean(errors.clinic_id)}
                                labelId="role"
                                aria-describedby="role"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    InputLabelProps={{ shrink: true }}
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
                                id="autocomplete-role"
                                onChange={onChange}
                                error={Boolean(errors.is_clinic_pic)}
                                labelId="role"
                                aria-describedby="role"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    label="Is PIC Clinic"
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
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          3. Legal Information
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
                                InputLabelProps={{ shrink: true }}
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
                                onChange={onChange}
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
                                InputLabelProps={{ shrink: true }}
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
                                onChange={onChange}
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
                                InputLabelProps={{ shrink: true }}
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
                                onChange={onChange}
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
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                label="KTA InWOCNA"
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
                                label="KTA InWOCNA - Document"
                                onChange={onChange}
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
                                InputLabelProps={{ shrink: true }}
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
                                onChange={onChange}
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
                  </Grid>
                </CardContent>
                <Divider sx={{ m: "0 !important" }} />
                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    calor="warning"
                    variant="contained"
                    sx={{ mr: 2, width: "150px" }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
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

export default UserEdit;
