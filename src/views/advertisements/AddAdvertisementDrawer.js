import { useState, forwardRef, useEffect } from "react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import format from "date-fns/format";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Slide from "@mui/material/Slide";
import * as yup from "yup";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Icon from "src/@core/components/icon";
import {
  addAdvertisement,
  editAdvertisement,
} from "src/services/advertisements";
import DropzoneWrapper from "src/@core/styles/libs/react-dropzone";
import FileUploaderSingle from "src/views/articles/FileUploaderSingle";

const CustomInputs = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props;

  return (
    <TextField
      inputRef={ref}
      {...props}
      label={label || ""}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  );
});

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} harus diisi !`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name Advertisement harus diisi !")
    .min(10, (obj) =>
      showErrors("Name Advertisement", obj.value.length, obj.min)
    ),
  company_name: yup.string().required("Company Name harus diisi !"),
  pic: yup.string().required("PIC harus diisi !"),
  pic_phone: yup
    .string()
    .required("PIC Phone harus diisi !")
    .min(12, (obj) => showErrors("PIC Phone", obj.value.length, obj.min)),
});

const defaultValues = {
  name: "",
  company_name: "",
  pic: "",
  pic_phone: "",
  content: "",
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddAdvertisementDrawer = (props) => {
  // ** Props
  const { open, toggle, type, dataDetail } = props;

  // ** State
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [files, setFiles] = useState([]);
  const [startDateRange, setStartDateRange] = useState(null);
  const [endDateRange, setEndDateRange] = useState(null);

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const onUpload = (e) => {
    if (Array.isArray(e) && e.length > 0) {
      setFiles(e);
    } else {
      console.error("Invalid files array:", e);
    }
  };

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleReset = () => {
    reset();
    setStartDateRange(null);
    setEndDateRange(null);
    setFiles([]);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      name: data?.name,
      company_name: data?.company_name,
      pic: data?.pic,
      pic_phone: data?.pic_phone,
      start_date: format(startDateRange, "yyyy-MM-dd HH:mm"),
      end_date: format(endDateRange, "yyyy-MM-dd HH:mm"),
      content: files[0],
    };

    const payloadEdit = {
      advertisement_id: dataDetail?.advertisement_id,
      name: data?.name,
      company_name: data?.company_name,
      pic: data?.pic,
      pic_phone: data?.pic_phone,
      start_date: format(startDateRange, "yyyy-MM-dd HH:mm"),
      end_date: format(endDateRange, "yyyy-MM-dd HH:mm"),
      content: files[0],
      new_content: +files?.length > 0 ? true : false,
    };

    if (type === "Add") {
      const res = await addAdvertisement(payload);
      if (+res?.result?.status === 201) {
        setLoading(false);
        toast.success("Buat Advertisement Success");
        handleReset();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.result?.message}`);
      }
    } else {
      const res = await editAdvertisement(payloadEdit);
      if (+res?.result?.status === 200) {
        setLoading(false);
        toast.success("Update Advertisement Success");
        handleReset();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.result?.message}`);
      }
    }
  };

  const handleClose = () => {
    toggle();
    handleReset();
  };

  useEffect(() => {
    if (dataDetail !== undefined && type === "Edit") {
      setValue("name", dataDetail?.name ?? "");
      setValue("company_name", dataDetail?.company_name ?? "");
      setValue("company_address", dataDetail?.company_address ?? "");
      setValue("pic", dataDetail?.pic ?? "");
      setValue("pic_phone", dataDetail?.pic_phone ?? "");
      setStartDateRange(new Date(dataDetail?.start_date));
      setEndDateRange(new Date(dataDetail?.end_date));
    }
  }, [dataDetail, type]);

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="persistent"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: 300, sm: "calc(100vw - 270px)" },
          },
        }}
      >
        <Header>
          <Typography variant="h6">
            {type === "Add" ? "Tambah Baru" : "Ubah"} Advertisement
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "text.primary" }}
          >
            <Icon icon="mdi:close" fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        size="small"
                        value={value}
                        disabled={loading}
                        label="Name"
                        onChange={onChange}
                        placeholder="Name"
                        error={Boolean(errors.name)}
                      />
                    )}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.name.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Controller
                    name="company_name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        size="small"
                        value={value}
                        disabled={loading}
                        label="Company Name"
                        onChange={onChange}
                        placeholder="Company Name"
                        error={Boolean(errors.company_name)}
                      />
                    )}
                  />
                  {errors.company_name && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.company_name.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Controller
                    name="pic"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        size="small"
                        value={value}
                        disabled={loading}
                        label="PIC"
                        onChange={onChange}
                        placeholder="PIC"
                        error={Boolean(errors.pic)}
                      />
                    )}
                  />
                  {errors.pic && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.pic.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Controller
                    name="pic_phone"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        size="small"
                        value={value}
                        disabled={loading}
                        label="PIC Phone"
                        onChange={onChange}
                        placeholder="PIC Phone"
                        error={Boolean(errors.pic_phone)}
                      />
                    )}
                  />
                  {errors.pic_phone && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.pic_phone.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <DatePickerWrapper>
                  <Grid container spacing={6}>
                    <Grid item md={6} xs={12}>
                      <DatePicker
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        selected={startDateRange}
                        id="date-time-picker"
                        dateFormat="MM/dd/yyyy HH:mm"
                        onChange={(date) => setStartDateRange(date)}
                        customInput={
                          <CustomInputs
                            size="small"
                            fullWidth
                            label="Start Date"
                          />
                        }
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <DatePicker
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        selected={endDateRange}
                        id="date-time-picker"
                        dateFormat="MM/dd/yyyy HH:mm"
                        onChange={(date) => setEndDateRange(date)}
                        customInput={
                          <CustomInputs
                            size="small"
                            fullWidth
                            label="End Date"
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </DatePickerWrapper>
                {errors.date && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.date.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <DropzoneWrapper>
                  <FileUploaderSingle
                    onUpload={onUpload}
                    files={files}
                    type={"image"}
                    isColumn
                    isEdit={type === "Edit"}
                    srcEdit={type === "Edit" ? dataDetail?.content : files}
                  />
                </DropzoneWrapper>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }} />
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} md={3}>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                  disabled={loading}
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} md={6} />
              <Grid item xs={12} md={3}>
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={20} /> : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>
    </>
  );
};

export default AddAdvertisementDrawer;
