// React imports
import React, { useEffect, useState } from "react";

// MUI components imports
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

// Form and validation imports
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Utilities and custom components/services
import toast from "react-hot-toast";
import moment from "moment";
import { listGender } from "src/configs/constans";
import { addCustomer } from "src/services/customers";

const DialogAddCustomer = (props) => {
  const { data, open, toggleDialog, submitData } = props;

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    nik: yup.string().required("NIK harus diisi !"),
    name: yup.string().required("Nama harus diisi !"),
    address: yup.string().required("Alamat harus diisi !"),
    phone: yup.string().required("Nomor telepon harus diisi !"),
    date: yup.string().required("Tanggal lahir harus diisi !"),
    gender: yup.string().required("Jenis kelamin harus diisi !"),
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    setValue("nik", "");
    setValue("name", "");
    setValue("phone", "");
    setValue("address", "");
    setValue("gender", "");
    setValue("date", "");
  };

  const handleCloseDialog = () => {
    toggleDialog();
    resetForm();
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const formattedDate = moment(values?.date).format("YYYY-MM-DD");
    const payload = {
      nik: values?.nik,
      name: values?.name,
      phone: values?.phone,
      gender: values?.gender,
      date_of_birth: formattedDate,
      complete_address: values?.address,
    };
    const res = await addCustomer(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Berhasil Menambahkan Data Pasien");
      resetForm();
      submitData(dataPasien);
      toggleDialog();
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  useEffect(() => {
    if (data?.name) setValue("name", data?.name);
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={() => handleCloseDialog()}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Tambah Pasien Baru</DialogTitle>
        <DialogContent>
          <DialogContentText>Masukan data diri pasien</DialogContentText>
          <Grid container spacing={6} sx={{ marginTop: 4 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      name="name"
                      size="small"
                      label="Nama"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      disabled={loading}
                      error={Boolean(errors.name)}
                      aria-describedby="validation-basic-textarea"
                    />
                  )}
                />
                {errors.name && (
                  <FormHelperText
                    sx={{ color: "error.main" }}
                    id="validation-basic-textarea"
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
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      name="nik"
                      size="small"
                      label="NIK"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      disabled={loading}
                      error={Boolean(errors.nik)}
                      aria-describedby="validation-basic-textarea"
                    />
                  )}
                />
                {errors.nik && (
                  <FormHelperText
                    sx={{ color: "error.main" }}
                    id="validation-basic-textarea"
                  >
                    {errors.nik.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...field}
                      label="Tanggal Lahir"
                      disabled={loading}
                      error={Boolean(errors.date)}
                      aria-describedby="validation-basic-textarea"
                    />
                  )}
                />
                {errors.date && (
                  <FormHelperText
                    sx={{ color: "error.main" }}
                    id="validation-basic-textarea"
                  >
                    {errors.date.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      label="Nomor Telepon"
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value}
                      options={listGender}
                      id="autocomplete-gender"
                      onChange={(option, e, reason) => {
                        if (e?.value) {
                          setValue("gender", e?.value);
                          onChange(e?.value);
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
                          name="gender"
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
                    id="validation-basic"
                  >
                    {errors.gender.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      rows={4}
                      size="small"
                      multiline
                      {...field}
                      label="Alamat"
                      disabled={loading}
                      error={Boolean(errors.address)}
                      aria-describedby="validation-basic-textarea"
                    />
                  )}
                />
                {errors.address && (
                  <FormHelperText
                    sx={{ color: "error.main" }}
                    id="validation-basic-textarea"
                  >
                    {errors.address.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: 4 }} />
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            size="small"
            sx={{ width: 120 }}
            variant="contained"
            color="warning"
            onClick={() => handleCloseDialog()}
            disabled={loading}
          >
            Batal
          </Button>{" "}
          <Button
            size="small"
            sx={{ width: 120 }}
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogAddCustomer;
