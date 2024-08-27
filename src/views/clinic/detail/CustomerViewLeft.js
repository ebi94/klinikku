// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContentText from "@mui/material/DialogContentText";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import UserSuspendDialog from "src/views/apps/user/view/UserSuspendDialog";
import UserSubscriptionDialog from "src/views/apps/user/view/UserSubscriptionDialog";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

const data = {
  id: 1,
  role: "admin",
  status: "active",
  username: "gslixby0",
  avatarColor: "primary",
  country: "El Salvador",
  company: "Yotz PVT LTD",
  contact: "(479) 232-9151",
  currentPlan: "enterprise",
  fullName: "Daisy Patterson",
  email: "gslixby0@abc.net.au",
  avatar: "/images/avatars/4.png",
};

const roleColors = {
  admin: "error",
  editor: "info",
  author: "warning",
  maintainer: "success",
  subscriber: "primary",
};

// ** Styled <sup> component
const Sup = styled("sup")(({ theme }) => ({
  top: "0.2rem",
  left: "-0.6rem",
  position: "absolute",
  color: theme.palette.primary.main,
}));

// ** Styled <sub> component
const Sub = styled("sub")({
  fontWeight: 300,
  fontSize: "1rem",
  alignSelf: "flex-end",
});

const CustomerViewLeft = () => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true);
  const handlePlansClose = () => setOpenPlans(false);
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{
                pt: 15,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant="rounded"
                  alt={data.fullName}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  color={data.avatarColor}
                  sx={{
                    width: 120,
                    height: 120,
                    fontWeight: 600,
                    mb: 4,
                    fontSize: "3rem",
                  }}
                >
                  {getInitials(data.fullName)}
                </CustomAvatar>
              )}
              <Typography variant="h6" sx={{ mb: 4 }}>
                {data.fullName}
              </Typography>
              <CustomChip
                skin="light"
                size="small"
                label={
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{ mr: 2, fontWeight: 500, fontSize: "0.775rem" }}
                    >
                      No MR:
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.775rem" }}>
                      MR90123321123123
                    </Typography>
                  </Box>
                }
                color="info"
                sx={{ textTransform: "capitalize" }}
              />
            </CardContent>
            <CardContent>
              <Divider
                sx={{ my: (theme) => `${theme.spacing(4)} !important` }}
              />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    Nama Lengkap
                  </Typography>
                  <Typography variant="body2">: Daisy Patterson</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    Gender
                  </Typography>
                  <Typography variant="body2">: Laki-laki</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    No Telepon
                  </Typography>
                  <Typography variant="body2">: 081234567891</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    Email
                  </Typography>
                  <Typography variant="body2">: {data.email}</Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    Place and Birthday
                  </Typography>
                  <Typography variant="body2">
                    : Jakarta, 20 Juni 1970
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize" }}
                  >
                    : {data.status}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    Alamat
                  </Typography>
                  <Typography variant="body2">
                    : Jl Raya Parung Panjang
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      width: "45%",
                    }}
                  >
                    Registration Source
                  </Typography>
                  <Typography variant="body2">: Google</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={handleEditClickOpen}
              >
                Edit Data
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby="user-view-edit"
              aria-describedby="user-view-edit-description"
              sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
            >
              <DialogTitle
                id="user-view-edit"
                sx={{
                  textAlign: "center",
                  fontSize: "1.5rem !important",
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                  pt: (theme) => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`,
                  ],
                }}
              >
                Edit Customer Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: (theme) => `${theme.spacing(8)} !important`,
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                }}
              >
                <DialogContentText
                  variant="body2"
                  id="user-view-edit-description"
                  sx={{ textAlign: "center", mb: 7 }}
                >
                  Updating customer details will receive a privacy audit.
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        defaultValue={data.fullName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="user-view-status-label">
                          Gender
                        </InputLabel>
                        <Select
                          label="Gender"
                          defaultValue="male"
                          id="user-view-gender"
                          labelId="user-view-gender-label"
                        >
                          <MenuItem value="male">Laki-laki</MenuItem>
                          <MenuItem value="female">Wanita</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        defaultValue={data.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="text"
                        label="No Telepon"
                        defaultValue="0812312312312"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="user-view-status-label">
                          Status
                        </InputLabel>
                        <Select
                          label="Status"
                          defaultValue={data.status}
                          id="user-view-status"
                          labelId="user-view-status-label"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        type={"text"}
                        fullWidth
                        label="Alamat"
                        multiline
                        maxRows={4}
                        minRows={4}
                        defaultValue="Jl Raya parung Panjang"
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: "center",
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                  pb: (theme) => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`,
                  ],
                }}
              >
                <Button
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={handleEditClose}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditClose}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <UserSuspendDialog
              open={suspendDialogOpen}
              setOpen={setSuspendDialogOpen}
            />
            <UserSubscriptionDialog
              open={subscriptionDialogOpen}
              setOpen={setSubscriptionDialogOpen}
            />
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default CustomerViewLeft;
