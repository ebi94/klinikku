import Link from "next/link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Icon from "src/@core/components/icon";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import themeConfig from "src/configs/themeConfig";
import BlankLayout from "src/@core/layouts/BlankLayout";
import { useSettings } from "src/@core/hooks/useSettings";
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { useState } from "react";

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: "0 !important",
  [theme.breakpoints.down("lg")]: {
    padding: theme.spacing(10),
  },
}));

const ForgotPasswordIllustration = styled("img")(({ theme }) => ({
  maxWidth: "53.125rem",
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
  display: "flex",
  fontSize: "0.875rem",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();

  // ** Vars
  const { skin } = settings;
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const schema = yup.object().shape({
    password: yup.string().min(5).required(),
    rePassword: yup.string().min(5).required(),
  });

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

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
          <ForgotPasswordIllustrationWrapper>
            <ForgotPasswordIllustration
              alt="forgot-password-illustration"
              src={`/images/pages/reset-password.svg`}
            />
          </ForgotPasswordIllustrationWrapper>
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
                Reset your Password 🔒
              </TypographyStyled>
              <Typography variant="body2">Enter your new password</Typography>
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e) => e.preventDefault()}
            >
              <FormControl fullWidth sx={{ display: "flex", mb: 4 }}>
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
              <FormControl fullWidth sx={{ display: "flex", mb: 4 }}>
                <InputLabel
                  htmlFor="auth-login-v2-password"
                  error={Boolean(errors.rePassword)}
                >
                  Retry Password
                </InputLabel>
                <Controller
                  name="rePassword"
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
                      type={showRePassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowRePassword(!showRePassword)}
                          >
                            <Icon
                              icon={
                                showRePassword
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
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 5.25 }}
              >
                Reset Password
              </Button>
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LinkStyled href="/login">
                  <Icon icon="mdi:chevron-left" />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
};
ForgotPassword.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
ForgotPassword.guestGuard = true;

export default ForgotPassword;
