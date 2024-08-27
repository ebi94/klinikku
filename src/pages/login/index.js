import { useState, useEffect } from "react";
import Link from "next/link";
import * as rdds from "react-device-detect";
import moment from "moment";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import Icon from "src/@core/components/icon";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "src/hooks/useAuth";
import useBgColor from "src/@core/hooks/useBgColor";
import { useSettings } from "src/@core/hooks/useSettings";
import themeConfig from "src/configs/themeConfig";
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { CircularProgress } from "@mui/material";
import { getDeviceInfo, login } from "src/services/auth";

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: "0 !important",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(10),
  },
}));

const LoginIllustration = styled("img")(({ theme }) => ({
  maxWidth: "48rem",
  [theme.breakpoints.down("lg")]: {
    maxWidth: "35rem",
  },
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("xl")]: {
    width: "100%",
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: 400,
  },
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("md")]: { mt: theme.spacing(8) },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(5).required(),
});

const defaultValues = {
  password: "20000229",
  username: "perawat",
};

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [IPv4, setIPv4] = useState("");
  const [loading, setLoading] = useState(false);

  // ** Hooks
  const auth = useAuth();
  const theme = useTheme();
  const bgColors = useBgColor();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const { skin } = settings;

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const fetchDeviceInfo = async () => {
    const payload = {
      uid: moment(new Date()).format("DDMMYYYY-hh:mm:ss"), //ddMMyyyyHHmmssfff
      brand_name: rdds?.mobileModel, //mobileModel
      model: rdds?.mobileVendor, //mobileVendor
      os: rdds?.osName, //osName
      os_version: rdds?.osVersion, //osVersion
      browser: rdds?.browserName, //browserName
      browser_version: rdds?.browserVersion, //browserVersion
      device_type: rdds?.deviceType, //deviceType
    };
    const res = await getDeviceInfo(payload);
    if (+res?.result?.status === 200) {
      return res?.result?.data?.device_id;
    } else {
      setLoading(false);
      toast.error(`Opps ! Something Wrong. ${res?.error}`);

      return false;
    }
  };

  const fetchLogin = async (data, deviceInfo) => {
    const payload = {
      username: data?.username,
      password: data?.password,
      device_id: deviceInfo,

      // ip_address: IPv4
    };
    const res = await login(payload);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      setLoading(false);
      toast.success("Success");
      auth.login({ data, rememberMe }, () => {});
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    // Login API
    const deviceInfo = await fetchDeviceInfo();
    if (deviceInfo) {
      fetchLogin(data, deviceInfo);
    }
  };

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt="login-illustration"
              src={`/images/pages/health-checkup.svg`}
            />
          </LoginIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <Box
          sx={{
            p: 12,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/example-logo.png"
                alt="KlinikKu"
                height={35}
                width={35}
              />
              <Typography
                variant="h6"
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "1.5rem !important",
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant="h5">
                Welcome to {themeConfig.templateName}! 👋🏻
              </TypographyStyled>
              <Typography variant="body2">
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label="Username"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                      placeholder="username"
                      disabled={loading}
                    />
                  )}
                />
                {errors.username && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.username.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="auth-login-v2-password"
                  error={Boolean(errors.password)}
                >
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="auth-login-v2-password"
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      disabled={loading}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon
                              icon={
                                showPassword
                                  ? "mdi:eye-outline"
                                  : "mdi:eye-off-outline"
                              }
                              fontSize={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }} id="">
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  mt: 2,
                  mb: 4,
                  display: "flex",
                  alignItems: "end",
                  flexWrap: "wrap",
                  justifyContent: "end",
                }}
              >
                {/* <FormControlLabel
                  label="Remember Me"
                  control={
                    <Checkbox
                      disabled={loading}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                /> */}
                <LinkStyled href="/forgot-password">
                  Forgot Password?
                </LinkStyled>
              </Box>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 7 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : "Login"}
              </Button>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};
LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
LoginPage.guestGuard = true;

export default LoginPage;
