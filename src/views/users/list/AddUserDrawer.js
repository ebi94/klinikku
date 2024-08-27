import { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { addUser, editUser } from "src/services/users";
import { useAuth } from "src/hooks/useAuth";
import Icon from "src/@core/components/icon";
import CustomInput from "src/views/forms/form-elements/pickers/PickersCustomInput";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { listRole } from "src/services/roles";

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
  email: yup.string().email().required(),
  fullname: yup
    .string()
    .min(3, (obj) => showErrors("First Name", obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, (obj) => showErrors("User Name", obj.value.length, obj.min))
    .required(),
});

const AddUserDrawer = (props) => {
  // ** Props
  const { open, toggle, type, dataDetail, onRefresh } = props;

  // ** State
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const theme = useTheme();
  const { logout } = useAuth();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";

  const emptyDefaultValues = {
    user_id: "",
    role_id: "",
    username: "",
    email: "",
    name: "",
    gender: "",
    date_of_birth: "",
  };

  const defaultValues = {
    user_id: dataDetail?.user_id ?? "",
    role_id: dataDetail?.role?.role_id ?? "",
    username: dataDetail?.username ?? "",
    email: dataDetail?.email ?? "",
    name: dataDetail?.name ?? "",
    gender: dataDetail?.gender ?? "",
    date_of_birth: dataDetail?.date_of_birth ?? "",
  };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: type === "Add" ? emptyDefaultValues : defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    reset({ username: "", fullname: "", email: "" });
    setRole("");
    setGender("");
    setBirthDate("");
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      avatar: "test",
      role_id: `${role}`,
      username: data?.username,
      email: data?.email,
      name: data?.fullname,
      gender: gender,
      date_of_birth: format(birthDate ?? new Date(), "yyyy-MM-dd"),
    };

    const payloadEdit = {
      user_id: dataDetail?.user_id,
      avatar: "test",
      role_id: `${role}`,
      email: data?.email,
      name: data?.fullname,
      gender: gender,
      date_of_birth: format(birthDate ?? new Date(), "yyyy-MM-dd"),
      is_active: isActive,
    };

    if (type === "Add") {
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
    } else {
      const res = await editUser(payloadEdit);
      if (+res?.result?.status === 200) {
        setLoading(false);
        toast.success("Updated Success");
        onReset();
        onRefresh();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    }
  };

  const handleClose = () => {
    setValue("username", "");
    setValue("email", "");
    setValue("fullname", "");
    setRole("");
    setGender("");
    toggle();
    onReset();
  };

  const fetchRolesList = async () => {
    const res = await listRole();
    if (+res?.result?.status === 200) {
      setRoleList(res?.result?.data);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} `);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (dataDetail !== undefined && (type === "Edit" || type === "Detail")) {
      setValue("username", dataDetail?.username ?? "");
      setValue("email", dataDetail?.email ?? "");
      setValue("fullname", dataDetail?.name ?? "");
      setRole(dataDetail?.role?.role_id);
      setGender(dataDetail?.gender);
      setIsActive(dataDetail?.is_active);
      if (dataDetail?.date_of_birth) {
        const tanggal = parse(
          dataDetail?.date_of_birth,
          "yyyy-MM-dd",
          new Date()
        );
        setBirthDate(tanggal);
      }
    }
  }, [dataDetail, type, setValue, role, reset]);

  useEffect(() => {
    fetchRolesList();
  }, []);

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
        <Typography variant="h6">{type} User</Typography>
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
          <FormControl fullWidth size="small" sx={{ mb: 6, mt: 3 }}>
            <Controller
              name="fullname"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  InputLabelProps={type !== "Add" ? { shrink: true } : {}}
                  sx={
                    type === "Detail"
                      ? {
                          "& .Mui-disabled": {
                            "-webkit-text-fill-color": "black !important",
                            color: "black !important",
                          },
                        }
                      : {}
                  }
                  value={value}
                  size="small"
                  label="Full Name"
                  onChange={onChange}
                  placeholder="Full Name"
                  disabled={loading || type === "Detail"}
                  error={Boolean(errors.fullname)}
                />
              )}
            />
            {errors.fullname && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.fullname.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth size="small" sx={{ mb: 6 }}>
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <TextField
                    InputLabelProps={type !== "Add" ? { shrink: true } : {}}
                    sx={
                      type === "Detail"
                        ? {
                            "& .Mui-disabled": {
                              "-webkit-text-fill-color": "black !important",
                              color: "black !important",
                            },
                          }
                        : {}
                    }
                    value={value}
                    size="small"
                    label="User Name"
                    onChange={onChange}
                    placeholder="Username"
                    disabled={loading || type === "Edit" || type === "Detail"}
                    error={Boolean(errors.username)}
                  />
                </>
              )}
            />
            {errors.username && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.username.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth size="small" sx={{ mb: 6 }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  sx={
                    type === "Detail"
                      ? {
                          "& .Mui-disabled": {
                            "-webkit-text-fill-color": "black !important",
                            color: "black !important",
                          },
                        }
                      : {}
                  }
                  type="email"
                  value={value}
                  size="small"
                  label="Email"
                  onChange={onChange}
                  placeholder="user@email.co.id"
                  disabled={loading || type === "Detail"}
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            sx={
              type === "Detail"
                ? {
                    mb: 6,
                    "& .MuiInputLabel-root": {
                      color: "black !important",
                    },
                    "& .Mui-disabled": {
                      "-webkit-text-fill-color": "black !important",
                      color: "black !important",
                    },
                  }
                : { mb: 6 }
            }
          >
            <DatePickerWrapper>
              <DatePicker
                showYearDropdown
                showMonthDropdown
                selected={birthDate}
                id="birthday"
                placeholderText="DD-MM-YYYY"
                popperPlacement={popperPlacement}
                onChange={(date) => {
                  setBirthDate(date);
                }}
                disabled={loading || type === "Detail"}
                customInput={
                  <CustomInput
                    label="Birthday"
                    fullWidth
                    size="small"
                    name="birthday"
                    disabled={loading}
                  />
                }
              />
            </DatePickerWrapper>
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            sx={
              type === "Detail"
                ? {
                    mb: 6,
                    "& .MuiInputLabel-root": {
                      color: "black !important",
                    },
                    "& .Mui-disabled": {
                      "-webkit-text-fill-color": "black !important",
                      color: "black !important",
                    },
                  }
                : { mb: 6 }
            }
          >
            <InputLabel id="role-select">Gender</InputLabel>
            <Select
              fullWidth
              size="small"
              value={gender}
              id="select-gender"
              label="Select Gender"
              labelId="role-select"
              onChange={(e) => setGender(e.target.value)}
              disabled={loading || type === "Detail"}
              inputProps={{ placeholder: "Select Gender" }}
            >
              <MenuItem value="Male">Laki-laki</MenuItem>
              <MenuItem value="Female">Wanita</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            sx={
              type === "Detail"
                ? {
                    mb: 6,
                    "& .MuiInputLabel-root": {
                      color: "black !important",
                    },
                    "& .Mui-disabled": {
                      "-webkit-text-fill-color": "black !important",
                      color: "black !important",
                    },
                  }
                : { mb: 6 }
            }
          >
            <InputLabel id="role-select">Role</InputLabel>
            <Select
              fullWidth
              size="small"
              value={role}
              id="select-role"
              label="Select Role"
              labelId="role-select"
              onChange={(e) => setRole(e.target.value)}
              disabled={loading || type === "Detail"}
              inputProps={{ placeholder: "Select Role" }}
            >
              {roleList.map((item) => (
                <MenuItem key={item?.role_id} value={item?.role_id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {type !== "Add" ? (
            <FormControl fullWidth size="small" sx={{ mb: 6 }}>
              <FormControlLabel
                disabled={loading || type === "Detail"}
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                }
                label={isActive ? "Active" : "Not Active"}
              />
            </FormControl>
          ) : (
            ""
          )}
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
                  <>{type === "Add" ? "Save" : "Edit"}</>
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

export default AddUserDrawer;
