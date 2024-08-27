import { useState } from "react";
import toast from "react-hot-toast";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import Icon from "src/@core/components/icon";
import DialogConfirm from "src/@core/components/dialog/dialog-confirm";
import { useAuth } from "src/hooks/useAuth";
import { changePassword } from "src/services/auth";
import { useRouter } from "next/router";
import FormHelperText from "@mui/material/FormHelperText";

const SecurityTab = ({ data }) => {
  const router = useRouter();
  const [values, setValues] = useState({
    currentPassword: "",
    showCurrentPassword: false,
    newPassword: "",
    showNewPassword: false,
    confirmNewPassword: "",
    showConfirmNewPassword: false,
  });
  const [errors, setErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [dialogConfirm, setDialogConfirm] = useState(false);

  const auth = useAuth();
  const userData = auth?.user?.data;

  const dataDialog = {
    isSubmit: true,
    title: "Apakah Anda yakin untuk mengubah Password Anda ?",
  };

  const handleDialogConfirm = () => {
    if (
      values?.currentPassword === "" ||
      values?.newPassword === "" ||
      values?.confirmNewPassword === ""
    ) {
      const tempErrors = {
        currentPassword: values?.currentPassword === "" ? true : false,
        newPassword: values?.newPassword === "" ? true : false,
        confirmNewPassword: values?.confirmNewPassword === "" ? true : false,
      };
      setErrors(tempErrors);
    } else {
      setDialogConfirm(!dialogConfirm);
    }
  };

  const handleSubmitDialog = async () => {
    setLoading(true);
    const payload = {
      user_id: userData?.user_id,
      password: values?.newPassword,
      password_confirmation: values?.confirmNewPassword,
    };
    const res = await changePassword(payload);
    if (+res?.result?.status === 200) {
      setLoading(false);
      toast.success("Password berhasil diubah !");
      setDialogConfirm(false);
      router.reload();
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
      setDialogConfirm(false);
    }
  };

  // Handle Current Password
  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setErrors({ ...errors, [prop]: event.target.value ? false : true });
  };

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const handleClickShowConfirmNewPassword = () => {
    setValues({
      ...values,
      showConfirmNewPassword: !values.showConfirmNewPassword,
    });
  };
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Change Password" />
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel
                        htmlFor="user-view-security-current-password"
                        error={errors?.currentPassword}
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        label="Password"
                        value={values.currentPassword}
                        id="user-view-security-current-password"
                        onChange={handlePasswordChange("currentPassword")}
                        error={errors?.currentPassword}
                        type={values.showCurrentPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowCurrentPassword}
                              onMouseDown={(e) => e.preventDefault()}
                              aria-label="toggle password visibility"
                            >
                              <Icon
                                icon={
                                  values.showCurrentPassword
                                    ? "mdi:eye-outline"
                                    : "mdi:eye-off-outline"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors.currentPassword && (
                        <FormHelperText
                          sx={{ color: "error.main" }}
                          id="validation-basic"
                        >
                          Password harus diisi !
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} />
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel
                        htmlFor="user-view-security-new-password"
                        error={errors?.newPassword}
                      >
                        Password Baru
                      </InputLabel>
                      <OutlinedInput
                        label="Password Baru"
                        error={errors?.newPassword}
                        value={values.newPassword}
                        id="user-view-security-new-password"
                        onChange={handlePasswordChange("newPassword")}
                        type={values.showNewPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowNewPassword}
                              onMouseDown={(e) => e.preventDefault()}
                              aria-label="toggle password visibility"
                            >
                              <Icon
                                icon={
                                  values.showNewPassword
                                    ? "mdi:eye-outline"
                                    : "mdi:eye-off-outline"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors.newPassword && (
                        <FormHelperText
                          sx={{ color: "error.main" }}
                          id="validation-basic"
                        >
                          Password Baru harus diisi !
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel
                        htmlFor="user-view-security-confirm-new-password"
                        error={errors?.confirmNewPassword}
                      >
                        Konfirmasi Password Baru
                      </InputLabel>
                      <OutlinedInput
                        label="Konfirmasi Password Baru"
                        error={errors?.confirmNewPassword}
                        value={values.confirmNewPassword}
                        id="user-view-security-confirm-new-password"
                        type={
                          values.showConfirmNewPassword ? "text" : "password"
                        }
                        onChange={handlePasswordChange("confirmNewPassword")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirmNewPassword}
                            >
                              <Icon
                                icon={
                                  values.showConfirmNewPassword
                                    ? "mdi:eye-outline"
                                    : "mdi:eye-off-outline"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors.confirmNewPassword && (
                        <FormHelperText
                          sx={{ color: "error.main" }}
                          id="validation-basic"
                        >
                          Konfirmasi Password Baru harus diisi !
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Typography sx={{ mt: 1, color: "text.secondary" }}>
                      Password Requirements:
                    </Typography>
                    <Box
                      component="ul"
                      sx={{
                        pl: 4,
                        mb: 0,
                        "& li": {
                          mb: 4,
                          color: "text.secondary",
                          "&::marker": { fontSize: "1.25rem" },
                        },
                      }}
                    >
                      <li>Minimum 8 characters long - the more, the better</li>
                      <li>At least one lowercase & one uppercase character</li>
                      <li>
                        At least one number, symbol, or whitespace character
                      </li>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={() => handleDialogConfirm()}
                    >
                      Ubah Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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

export default SecurityTab;
