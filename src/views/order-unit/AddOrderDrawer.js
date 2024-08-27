import { useEffect, useState, forwardRef } from "react";
import toast from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
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
import * as yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Icon from "src/@core/components/icon";
import { listCustomer } from "src/services/customers";
import { mappingDataOptions } from "src/utils/helpers";
import { listClinic } from "src/services/clinics";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { availableTime, createOrderUnit } from "src/services/orderUnit";
import DialogConfirm from "src/@core/components/dialog/dialog-confirm";
import OptionsList from "../components/autocomplete/OptionsList";

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
  patient_id: yup
    .object()
    .shape({
      id: yup.string().required(),
      value: yup.string().required(),
      label: yup.string().required(),
      patient_id: yup.string().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  clinic_id: yup
    .object()
    .shape({
      id: yup.string().required(),
      value: yup.string().required(),
      label: yup.string().required(),
      clinic_id: yup.string().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  date: yup.string().required("Kolom ini harus diisi !"),
  booking_time: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
});

const AddOrderDrawer = (props) => {
  // ** Props
  const { open, onClose, onRefresh } = props;

  // ** State
  const [loading, setLoading] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [clinicsList, setClinicsList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [dataDialog, setDataDialog] = useState({});
  const [dataPayload, setDataPayload] = useState({});
  const [clinicId, setClinicId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const defaultValues = {
    patient_id: null,
    clinic_id: null,
    date: "",
    booking_time: "",
  };

  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    setValue("patient_id", null);
    setValue("clinic_id", null);
    setValue("date", "");
    setValue("booking_time", "");
    reset({ patient_id: null, clinic_id: null, date: "", booking_time: "" });
  };

  const handleDialogConfirm = () => {
    setDialogConfirm(!dialogConfirm);
  };

  const submitData = async () => {
    setLoading(true);

    const formattedDate = `${moment(dataPayload?.date).format("YYYY-MM-DD")} ${
      dataPayload?.booking_time?.value
    }`;
    const payload = {
      patient_id: dataPayload?.patient_id?.id,
      clinic_id: dataPayload?.clinic_id?.id,
      date: formattedDate,
    };

    const res = await createOrderUnit(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Created Order Successfully");
      onReset();
      onRefresh();
      onClose();
      handleDialogConfirm();
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
      handleDialogConfirm();
    }
  };

  const onSubmit = async (data) => {
    setDataDialog({
      isSubmit: true,
      title: "Apakah Anda yakin untuk membuat Order ini ?",
    });
    handleDialogConfirm();
    setDataPayload(data);
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
      toast.error(`Opps ! ${res?.error} `);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  const fetchClinicList = async () => {
    const res = await listClinic();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingData = mappingDataOptions(data, "clinic_id");
      setClinicsList(mappingData);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} `);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  const checkAvailableTime = async (id, date) => {
    const res = await availableTime(id, date);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingData = data.map((item, index) => ({
        id: +index,
        value: item,
        label: item,
      }));
      setTimeList(mappingData);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} `);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    console.log("errors", errors);
    console.log("control", control);
  }, [errors, control]);

  useEffect(() => {
    if (clinicId && selectedDate) {
      checkAvailableTime(clinicId, selectedDate);
    }
  }, [clinicId, selectedDate]);

  useEffect(() => {
    fetchCustomerList();
    fetchClinicList();
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
            <Typography variant="h6">Buat Order Homecare</Typography>
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
                      name="patient_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          value={value}
                          required
                          options={customersList}
                          id="autocomplete-pasien"
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
                          onChange={(option, e, reason) => {
                            if (e?.value) {
                              setValue("patient_id", e);
                              onChange(e);
                            }
                            if (reason === "clear") {
                              setValue("patient_id", null);
                            }
                          }}
                          error={Boolean(errors.patient_id)}
                          labelId="patient_id"
                          aria-describedby="patient_id"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="Customer"
                              placeholder="Choose Customer"
                              disabled={loading}
                              error={Boolean(errors.patient_id)}
                            />
                          )}
                        />
                      )}
                    />
                    {errors.patient_id && (
                      <FormHelperText
                        sx={{ color: "error.main" }}
                        id="validation-basic-textarea"
                      >
                        {errors.patient_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="clinic_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          value={value}
                          required
                          options={clinicsList}
                          id="autocomplete-clinic"
                          onChange={(option, e, reason) => {
                            if (e?.value) {
                              setValue("clinic_id", e);
                              setClinicId(e?.id);
                              onChange(e);
                            }
                            if (reason === "clear") {
                              setValue("clinic_id", null);
                            }
                          }}
                          error={Boolean(errors.clinic_id)}
                          labelId="clinic_id"
                          aria-describedby="clinic_id"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="Clinic"
                              placeholder="Choose Clinic"
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
                        id="validation-basic-textarea"
                      >
                        {errors.clinic_id.message}
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
                          onChange={(e) => {
                            onChange(e);
                            const formattedDate =
                              moment(e).format("yyyy-MM-DD");
                            setSelectedDate(formattedDate);
                          }}
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
                  <FormControl fullWidth>
                    <Controller
                      name="booking_time"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          value={value}
                          required
                          options={timeList}
                          id="autocomplete-clinic"
                          onChange={(option, e, reason) => {
                            if (e?.value) {
                              setValue("booking_time", e);
                              onChange(e);
                            }
                            if (reason === "clear") {
                              setValue("booking_time", null);
                            }
                          }}
                          error={Boolean(errors.booking_time)}
                          labelId="booking_time"
                          aria-describedby="booking_time"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="Booking Time"
                              placeholder="08:00"
                              disabled={loading}
                              error={Boolean(errors.booking_time)}
                            />
                          )}
                        />
                      )}
                    />
                    {errors.booking_time && (
                      <FormHelperText
                        sx={{ color: "error.main" }}
                        id="validation-basic-textarea"
                      >
                        {errors.booking_time.message}
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
                    Cancel
                  </Button>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <Button
                    size="small"
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={25} /> : "Buat"}
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
    </>
  );
};

export default AddOrderDrawer;
