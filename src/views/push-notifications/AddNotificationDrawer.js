import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { addUser, editUser } from "src/services/users";
import Icon from "src/@core/components/icon";
import CustomInput from "src/views/forms/form-elements/pickers/PickersCustomInput";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

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
  title: yup
    .string()
    .min(3, (obj) => showErrors("Title", obj.value.length, obj.min))
    .required(),
  message: yup.string().required(),
});

const AddNotificationDrawer = (props) => {
  // ** Props
  const { open, toggle, type, dataDetail, onRefresh } = props;

  // ** State
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";

  const defaultValues = {
    title: "",
    message: "",
  };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    reset({ title: "", message: "" });
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      title: data?.title,
      message: data?.message,
    };

    const res = await addUser(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Created User Success");
      onReset();
      onRefresh();
      toggle();
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const handleClose = () => {
    setValue("message", "");
    setValue("title", "");
    toggle();
    onReset();
  };

  useEffect(() => {}, []);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">{type} New Push Notifications</Typography>
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
          <FormControl fullWidth sx={{ mb: 6, mt: 3 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  value={value}
                  size="small"
                  label="Title"
                  onChange={onChange}
                  placeholder="Title"
                  disabled={loading}
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.title.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="message"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  type="text"
                  value={value}
                  size="small"
                  label="Message"
                  onChange={onChange}
                  placeholder="Message"
                  disabled={loading}
                  error={Boolean(errors.message)}
                />
              )}
            />
            {errors.message && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.message.message}
              </FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleClose}
              disabled={loading}
              sx={{ mr: 3 }}
            >
              Cancel
            </Button>
            {type !== "Detail" ? (
              <Button
                size="small"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={25} />
                ) : (
                  "Send Notifications"
                )}
              </Button>
            ) : (
              ""
            )}
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddNotificationDrawer;
