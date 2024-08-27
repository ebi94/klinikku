// React imports
import { useEffect, useState, forwardRef } from "react";

// MUI components and styles
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

// Form handling and validation
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Date pickers and wrappers
import DatePicker from "react-datepicker";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// Custom components and utils
import Icon from "src/@core/components/icon";
import DialogConfirm from "src/@core/components/dialog/dialog-confirm";
import OptionsList from "../components/autocomplete/OptionsList";
import DialogAddCustomer from "./DialogAddCustomer";

// Services and helpers
import { listCustomer } from "src/services/customers";
import { mappingDataOptions } from "src/utils/helpers";
import { createOrderHomecare } from "src/services/orderHomecare";

// Toast notifications
import toast from "react-hot-toast";

// External utilities
import moment from "moment";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const schema = yup.object().shape({
  pasien_id: yup
    .object()
    .shape({
      id: yup.string().required(),
      value: yup.string().required(),
      label: yup.string().required(),
      patient_id: yup.string().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  complete_address: yup.string().required("Kolom ini harus diisi !"),
  date: yup.string().required("Kolom ini harus diisi !"),
  date_time: yup.string().required("Kolom ini harus diisi !"),
});

const AddOrderDrawer = (props) => {
  // ** Props
  const { open, onClose, onRefresh } = props;
  const filter = createFilterOptions();

  // ** State
  const [loading, setLoading] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [dialogCustomer, setDialogCustomer] = useState(false);
  const [dataDialog, setDataDialog] = useState({});
  const [dataDialogCustomer, setDataDialogCustomer] = useState(false);
  const [dataPayload, setDataPayload] = useState({});

  const toggleDialogCustomer = () => {
    setDialogCustomer(!dialogCustomer);
  };

  const defaultValues = {
    pasien_id: null,
    complete_address: "",
    date: "",
    date_time: "",
  };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    setValue("pasien_id", null);
    setValue("complete_address", "");
    setValue("date", "");
    setValue("date_time", "");
    reset({ pasien_id: null, complete_address: "", date: "", date_time: "" });
  };

  const submitData = async () => {
    setLoading(true);

    const setValueDate = `${moment(dataPayload?.date).format(
      "YYYY-MM-DD"
    )} ${moment(dataPayload?.date_time).format("HH:mm")}`;
    const payload = {
      pasien_id: dataPayload?.pasien_id?.id,
      complete_address: dataPayload?.complete_address,
      latitude: "-6.3868987",
      longitude: "106.7392817",
      date: setValueDate,
    };

    const res = await createOrderHomecare(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Berhasil membuat order");
      onReset();
      onClose();
      onRefresh();
      setDialogConfirm(false);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
      setDialogConfirm(false);
    }
  };

  const onSubmit = (data) => {
    setDataDialog({
      isSubmit: true,
      title: "Apakah Anda yakin untuk membuat Order ini ?",
    });
    handleDialogConfirm();
    setDataPayload(data);
  };

  const handleDialogConfirm = () => {
    setDialogConfirm(!dialogConfirm);
  };

  const handleCloseDrawer = () => {
    setDataDialog({
      isSubmit: false,
      title: "Apakah Anda yakin ingin membatalkan ini?",
    });
    handleDialogConfirm();
  };

  const handleSubmitDialog = () => {
    if (dataDialog?.isSubmit) {
      submitData();
    } else {
      setDialogConfirm(false);
      onClose();
      onReset();
    }
  };

  const fetchCustomerList = async () => {
    const res = await listCustomer();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingData = mappingDataOptions(data, "patient_id");
      setCustomersList(mappingData);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} `, {
        duration: 100000,
      });
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={() => {}}
        ModalProps={{ keepMounted: true, disableEnforceFocus: true }}
        sx={{
          "& .MuiDrawer-paper": { width: { xs: 300, sm: 300 } },
        }}
      >
        <DatePickerWrapper>
          <Header>
            <Typography variant="h6">Order Homecare</Typography>
            <IconButton
              size="small"
              onClick={handleCloseDrawer}
              sx={{ color: "text.primary" }}
            >
              <Icon icon="mdi:close" fontSize={20} />
            </IconButton>
          </Header>
          <Box sx={{ p: 5 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="pasien_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          value={value}
                          required
                          freeSolo
                          options={customersList}
                          id="autocomplete-pasien"
                          onChange={(option, e, reason) => {
                            if (e && e.inputValue) {
                              setDialogCustomer(true);
                              const tempData = {
                                id: "-",
                                patient_id: "-",
                                name: e.inputValue,
                                label: e.inputValue,
                                value: "-",
                              };
                              setDataDialogCustomer(tempData);
                              setValue("pasien_id", tempData);
                              onChange(tempData);
                            } else if (e?.value) {
                              setValue("pasien_id", e);
                              onChange(e);
                            }
                            if (reason === "clear") {
                              setValue("pasien_id", null);
                            }
                          }}
                          renderOption={(props, option) => (
                            <Grid
                              container
                              component="li"
                              sx={{ mr: 2, flexShrink: 0 }}
                              {...props}
                            >
                              <OptionsList data={option} />
                            </Grid>
                          )}
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            if (params.inputValue !== "") {
                              filtered.push({
                                inputValue: params.inputValue,
                                title: `Tambahkan "${params.inputValue}"`,
                              });
                            }

                            return filtered;
                          }}
                          error={Boolean(errors.pasien_id)}
                          labelId="pasien_id"
                          aria-describedby="pasien_id"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="Nama Pasien"
                              placeholder="Cari Pasien"
                              disabled={loading}
                              error={Boolean(errors.pasien_id)}
                            />
                          )}
                        />
                      )}
                    />
                    {errors.pasien_id && (
                      <FormHelperText
                        sx={{ color: "error.main" }}
                        id="validation-basic-textarea"
                      >
                        {errors.pasien_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="complete_address"
                      control={control}
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
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          size="small"
                          selected={value}
                          timeCaption="Tanggal Booking"
                          dateFormat="dd-MMM-yyyy"
                          onChange={(e) => onChange(e)}
                          placeholderText="Tanggal Booking"
                          disabled={loading}
                          customInput={
                            <CustomInput
                              value={value}
                              required
                              size="small"
                              onChange={onChange}
                              label="Tanggal Booking"
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
                  <FormControl fullWidth size="small">
                    <Controller
                      name="date_time"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          size="small"
                          selected={value}
                          timeCaption="Jam Booking"
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={60}
                          dateFormat="HH:mm"
                          onChange={(e) => onChange(e)}
                          placeholderText="Jam Booking"
                          disabled={loading}
                          customInput={
                            <CustomInput
                              value={value}
                              required
                              size="small"
                              onChange={onChange}
                              label="Jam Booking"
                              error={Boolean(errors.date_time)}
                              aria-describedby="date_time"
                            />
                          }
                        />
                      )}
                    />
                    {errors.date_time && (
                      <FormHelperText
                        sx={{ color: "error.main" }}
                        id="validation-basic"
                      >
                        {errors.date_time.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item md={6} sm={6} xs={12}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleCloseDrawer}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    Buat Order
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DatePickerWrapper>
      </Drawer>
      <DialogConfirm
        open={dialogConfirm}
        toggle={handleDialogConfirm}
        data={dataDialog}
        onSubmit={handleSubmitDialog}
        loading={loading}
      />
      <DialogAddCustomer
        data={dataDialogCustomer}
        open={dialogCustomer}
        toggleDialog={() => toggleDialogCustomer()}
        submitData={(e) => setValue("pasien_id", e)}
      />
    </>
  );
};

export default AddOrderDrawer;
